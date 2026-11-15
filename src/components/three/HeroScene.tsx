"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Black-hole hero — a single full-screen shader.
 *
 * - event horizon, photon ring and a turbulent accretion disk;
 * - cheap gravitational lensing of a procedural star field around the hole;
 * - lime-white inner disk → amber outer edge to stay on brand;
 * - pointer parallax, DPR cap, pauses off-screen, one static frame for
 *   prefers-reduced-motion.
 */

const ACCENT = new THREE.Color("#d4ff5c");

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uPointer;
  uniform vec2 uCenter;
  uniform float uSize;
  uniform vec3 uAccent;

  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.02 + 17.3;
      a *= 0.5;
    }
    return v;
  }

  vec2 rot(vec2 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) - uCenter;
    p -= uPointer * 0.012;

    float r = length(p);
    float horizon = 0.19 * uSize;

    // ---- gravitational lensing of the background star field ----
    vec2 warped = p * (1.0 + 0.55 * horizon * horizon / (r * r + 0.012));
    vec2 cell = warped * 26.0;
    vec2 id = floor(cell);
    vec2 f = fract(cell) - 0.5;
    float h = hash21(id);
    vec2 offset = vec2(hash21(id + 1.7), hash21(id + 4.3)) - 0.5;
    float star = smoothstep(0.035, 0.0, length(f - offset * 0.7)) * step(0.9, h);
    star *= 0.55 + 0.45 * sin(uTime * 1.6 + h * 21.0);
    float starFade = smoothstep(0.85, 0.35, r) * smoothstep(0.02, 0.11, r);
    vec3 col = vec3(0.62, 0.76, 0.86) * star * starFade * 0.8;

    // ---- accretion disk: flattened, rotating, doppler-brightened ----
    vec2 q = rot(p, 0.24 + uTime * 0.015);
    q.y /= 0.26;
    float rd = length(q);
    float ang = atan(q.y, q.x);

    float diskMask = smoothstep(horizon * 1.55, horizon * 1.9, rd)
      * (1.0 - smoothstep(horizon * 3.0, horizon * 3.7, rd));

    float turbulence = fbm(vec2(ang * 3.2 + rd * 6.0 - uTime * 0.55, rd * 8.0 + uTime * 0.08));
    float fine = fbm(vec2(ang * 7.0 - rd * 13.0 + uTime * 0.35, rd * 19.0));
    float bands = 0.45 + 0.55 * turbulence + 0.18 * fine;

    float doppler = 0.6 + 0.75 * max(0.0, cos(ang - 0.45));
    float intensity = diskMask * bands * doppler;

    float rn = rd / (horizon * 3.7);
    vec3 inner = vec3(1.0, 1.0, 0.93);
    vec3 mid = mix(vec3(1.0, 0.98, 0.9), uAccent, 0.5);
    vec3 outer = vec3(0.85, 0.4, 0.08);
    vec3 diskColor = mix(inner, mid, smoothstep(0.18, 0.55, rn));
    diskColor = mix(diskColor, outer, smoothstep(0.6, 0.98, rn));
    col += diskColor * intensity * 0.85;

    // ---- photon ring + lime halo ----
    float ring = smoothstep(0.009, 0.0, abs(r - horizon * 1.08));
    col += vec3(1.0, 1.0, 0.86) * ring * 1.2;
    col += uAccent * exp(-r * 8.0) * 0.22;

    // ---- event horizon: pure black, hides the stars behind it ----
    float hole = smoothstep(horizon + 0.005, horizon - 0.005, r);
    col *= 1.0 - hole;

    float alpha = clamp(max(max(col.r, col.g), col.b) * 1.7 + hole, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function dprFor(w: number, h: number) {
  return Math.min(2, Math.max(1, Math.sqrt(2_500_000 / Math.max(1, w * h))));
}

export default function HeroScene({ reduced = false }: { reduced?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !supportsWebGL()) return;

    const reduceMotion = reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = host.clientWidth || window.innerWidth;
    let height = host.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: dprFor(width, height) < 1.6,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(dprFor(width, height));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uPointer: { value: new THREE.Vector2() },
      uCenter: { value: new THREE.Vector2() },
      uSize: { value: 1 },
      uAccent: { value: ACCENT },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const layout = () => {
      uniforms.uAspect.value = width / height;
      if (width / height < 0.95) {
        uniforms.uCenter.value.set(0.0, 0.36);
        uniforms.uSize.value = 0.47;
      } else {
        uniforms.uCenter.value.set(0.44, 0.02);
        uniforms.uSize.value = 0.58;
      }
    };
    layout();

    const pointer = new THREE.Vector2();
    const pointerSmooth = new THREE.Vector2();
    const onPointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
      },
      { threshold: 0 },
    );
    io.observe(host);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let raf = 0;
    let running = false;
    let last = performance.now();
    let elapsed = 0;

    const renderFrame = (dt: number) => {
      elapsed += dt;
      uniforms.uTime.value = elapsed;
      pointerSmooth.lerp(pointer, 0.05);
      uniforms.uPointer.value.copy(pointerSmooth);
      renderer.render(scene, camera);
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      renderFrame(dt);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduceMotion || running || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduceMotion) {
      elapsed = 2.4;
      renderFrame(0);
    } else {
      start();
    }

    const ro = new ResizeObserver(() => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      if (w === width && h === height) return;
      width = w;
      height = h;
      renderer.setPixelRatio(dprFor(width, height));
      renderer.setSize(width, height);
      layout();
      if (reduceMotion) renderFrame(0);
    });
    ro.observe(host);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [reduced]);

  return <div ref={hostRef} aria-hidden className="absolute inset-0" />;
}
