"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Liquid-chrome hero scene (plain three.js — no R3F, no postprocessing).
 *
 * - Icosahedron-ish sphere, displaced in the vertex shader with simplex noise,
 *   normals recomputed by finite differences, shaded with a procedural studio
 *   environment (chrome) + lime fresnel.
 * - Orbiting hairlines with an accent bead, drifting dust, fake bloom sprites.
 * - Pointer parallax + scroll-linked camera, throttled DPR, pauses offscreen,
 *   renders a single frame when prefers-reduced-motion is set.
 * - Everything created by hand is disposed on unmount; the canvas dies with it.
 */

const ACCENT = new THREE.Color("#d4ff5c");

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vPos;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float disp(vec3 p) {
    float t = uTime;
    return snoise(p * 1.35 + vec3(0.0, t * 0.2, 0.0)) * 0.04 * uAmp;
  }

  vec3 displaced(vec3 p) {
    vec3 n = normalize(p);
    return p + n * disp(p);
  }

  void main() {
    vec3 p = displaced(position);
    vec3 n = normalize(position);

    vec3 tangent = normalize(cross(n, vec3(0.0, 1.0, 0.0)) + vec3(0.0001));
    vec3 bitangent = normalize(cross(n, tangent));

    float eps = 0.04;
    vec3 p0 = displaced(position);
    vec3 p1 = displaced(position + tangent * eps);
    vec3 p2 = displaced(position + bitangent * eps);
    vec3 nn = normalize(cross(p1 - p0, p2 - p0));
    if (dot(nn, n) < 0.0) nn = -nn;

    vNormal = normalize(normalMatrix * nn);
    vec4 pView = modelViewMatrix * vec4(p, 1.0);
    vViewDir = normalize(-pView.xyz);
    vPos = pView.xyz;

    gl_Position = projectionMatrix * pView;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform vec3 uAccent;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vPos;

  // Procedural photo studio with hard-edged light bands: chrome is defined by
  // contrast, so the environment is bands + one softbox rectangle, not a gradient.
  vec3 env(vec3 r) {
    float y = r.y;
    vec3 col = vec3(0.018, 0.02, 0.026);
    col = mix(col, vec3(0.07, 0.075, 0.085), smoothstep(-0.95, -0.25, y));
    col = mix(col, vec3(0.78, 0.81, 0.85), smoothstep(-0.24, -0.17, y) * (1.0 - smoothstep(0.2, 0.27, y)));
    col = mix(col, vec3(0.05, 0.055, 0.065), smoothstep(0.22, 0.3, y) * (1.0 - smoothstep(0.48, 0.54, y)));
    col = mix(col, vec3(0.55, 0.58, 0.62), smoothstep(0.52, 0.58, y));

    // softbox rectangle reflected in the upper metal
    float winX = smoothstep(-0.72, -0.58, r.x) * (1.0 - smoothstep(0.1, 0.24, r.x));
    float winY = smoothstep(0.3, 0.36, y) * (1.0 - smoothstep(0.58, 0.66, y));
    col += vec3(0.55, 0.58, 0.62) * winX * winY;

    // hard angled strip light
    float strip = smoothstep(0.045, 0.0, abs(r.x * 0.8 + r.z * 0.5 - 0.55));
    col += vec3(0.8) * strip * smoothstep(-0.2, 0.2, y) * (1.0 - smoothstep(0.4, 0.6, y));

    // warm kicker, right
    float warm = pow(max(dot(normalize(r), normalize(vec3(0.9, 0.2, 0.3))), 0.0), 18.0);
    col += vec3(0.5, 0.4, 0.3) * warm * 0.4;

    return col;
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    vec3 R = reflect(-V, N);

    vec3 col = env(R);

    // tight specular sheen
    float spec = pow(max(dot(R, normalize(vec3(-0.4, 0.8, 0.6))), 0.0), 90.0);
    col += vec3(1.0) * spec * 1.0;

    // fresnel: chrome edges catch the horizon; a whisper of lime on the rim
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    col += uAccent * fres * 0.07;
    col += vec3(0.4, 0.43, 0.46) * pow(fres, 1.1) * 0.55;

    // darken the core slightly so the rim reads
    col *= mix(0.88, 1.04, smoothstep(0.0, 0.9, fres));

    gl_FragColor = vec4(col, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const DUST_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform vec2 uPointer;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.22 + aSeed * 6.2831) * 0.16;
    p.x += cos(uTime * 0.18 + aSeed * 6.2831) * 0.12;
    p.xy += uPointer * (0.06 + aSeed * 0.12);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (44.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vAlpha = smoothstep(0.0, 0.7, 1.0 - (-mv.z - 1.2) / 7.0);
  }
`;

const DUST_FRAG = /* glsl */ `
  varying float vAlpha;
  uniform vec3 uColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.34;
    gl_FragColor = vec4(uColor, a);
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

function glowTexture(hex: string, inner: number) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, hex);
  g.addColorStop(inner, hex.replace(/[\d.]+\)$/, "0.35)"));
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
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
    renderer.toneMappingExposure = 1.05;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    const rig = new THREE.Group();
    scene.add(rig);

    /* ---- chrome blob ---- */
    const isMobile = width < 768;
    const segments = isMobile ? 96 : 160;
    const geometry = new THREE.SphereGeometry(1.32, segments, Math.round(segments * 0.72));
    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 1 },
      uAccent: { value: ACCENT },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
    });
    const blob = new THREE.Mesh(geometry, material);
    rig.add(blob);

    /* ---- orbit hairlines ---- */
    const ringGeoA = new THREE.TorusGeometry(1.92, 0.0045, 6, 220);
    const ringMatA = new THREE.MeshBasicMaterial({
      color: 0xdfe5e2,
      transparent: true,
      opacity: 0.22,
    });
    const ringA = new THREE.Mesh(ringGeoA, ringMatA);
    ringA.rotation.set(1.22, -0.32, 0.18);
    rig.add(ringA);

    const ringGeoB = new THREE.TorusGeometry(2.3, 0.003, 6, 220);
    const ringMatB = new THREE.MeshBasicMaterial({
      color: 0xdfe5e2,
      transparent: true,
      opacity: 0.12,
    });
    const ringB = new THREE.Mesh(ringGeoB, ringMatB);
    ringB.rotation.set(1.05, 0.42, -0.22);
    rig.add(ringB);

    /* ---- accent bead on the inner ring ---- */
    const beadGeo = new THREE.SphereGeometry(0.038, 16, 16);
    const beadMat = new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false });
    const bead = new THREE.Mesh(beadGeo, beadMat);
    rig.add(bead);
    const beadOrbit = new THREE.Group();
    beadOrbit.rotation.copy(ringA.rotation);
    rig.add(beadOrbit);
    beadOrbit.add(bead);

    const beadGlowTex = glowTexture("rgba(212,255,92,0.55)", 0.28);
    const beadGlowMat = new THREE.SpriteMaterial({
      map: beadGlowTex ?? undefined,
      color: ACCENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.75,
    });
    const beadGlow = new THREE.Sprite(beadGlowMat);
    beadGlow.scale.setScalar(0.62);
    bead.add(beadGlow);

    /* ---- backdrop halo ---- */
    const haloRed = glowTexture("rgba(120,140,160,0.35)", 0.4);
    const haloRedMat = new THREE.SpriteMaterial({
      map: haloRed ?? undefined,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.5,
    });
    const halo = new THREE.Sprite(haloRedMat);
    halo.scale.set(6, 6, 1);
    halo.position.set(0.15, 0.05, -1.6);
    rig.add(halo);

    const haloAccent = glowTexture("rgba(212,255,92,0.5)", 0.22);
    const haloAccentMat = new THREE.SpriteMaterial({
      map: haloAccent ?? undefined,
      color: ACCENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.18,
    });
    const haloA = new THREE.Sprite(haloAccentMat);
    haloA.scale.set(3.4, 3.4, 1);
    haloA.position.set(-0.9, -1.1, -1.2);
    rig.add(haloA);

    /* ---- dust ---- */
    const dustCount = isMobile ? 340 : 720;
    const positions = new Float32Array(dustCount * 3);
    const sizes = new Float32Array(dustCount);
    const seeds = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 0.6;
      sizes[i] = 0.18 + Math.random() * 0.62;
      seeds[i] = Math.random();
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dustGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    const dustUniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color("#cfd6d2") },
    };
    const dustMat = new THREE.ShaderMaterial({
      uniforms: dustUniforms,
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    /* ---- layout / responsive framing ---- */
    const layout = () => {
      const aspect = width / height;
      const portrait = aspect < 0.95;
      if (portrait) {
        rig.position.set(0.22, 1.42, 0);
        rig.scale.setScalar(0.36);
        camera.position.z = 5.9;
      } else {
        // Frame the sculpture in the right third of the canvas at any width:
        // centre 82% across, radius 17% of the viewport width.
        const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        const halfW = halfH * aspect;
        rig.position.set(0.68 * halfW, 0.18, 0);
        rig.scale.setScalar((0.25 * halfW) / 1.32);
        camera.position.z = 5.4;
      }
    };
    layout();

    /* ---- pointer + scroll ---- */
    const pointer = new THREE.Vector2();
    const pointerSmooth = new THREE.Vector2();
    let scroll = 0;

    const onPointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const rect = host.getBoundingClientRect();
      const total = Math.max(1, rect.height);
      scroll = THREE.MathUtils.clamp(-rect.top / total, 0, 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---- visibility ---- */
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

    /* ---- loop ---- */
    let raf = 0;
    let running = false;
    let last = performance.now();
    let elapsed = 0;

    const renderFrame = (dt: number) => {
      elapsed += dt;
      uniforms.uTime.value = elapsed;
      dustUniforms.uTime.value = elapsed;

      pointerSmooth.lerp(pointer, 0.045);
      dustUniforms.uPointer.value.copy(pointerSmooth);

      const targetRotY = pointerSmooth.x * 0.34 + elapsed * 0.075;
      const targetRotX = pointerSmooth.y * 0.2 + Math.sin(elapsed * 0.18) * 0.05;
      rig.rotation.y += (targetRotY - rig.rotation.y) * 0.05;
      rig.rotation.x += (targetRotX - rig.rotation.x) * 0.05;

      ringA.rotation.z += dt * 0.06;
      ringB.rotation.z -= dt * 0.045;
      bead.rotation.set(0, 0, 0);
      const angle = elapsed * 0.55;
      bead.position.set(Math.cos(angle) * 1.92, Math.sin(angle) * 1.92, 0);

      dust.rotation.y += dt * 0.012;
      dust.rotation.x = Math.sin(elapsed * 0.08) * 0.04;

      camera.position.y = scroll * 0.35;
      camera.position.z = (width / height < 0.95 ? 5.9 : 5.4) - scroll * 0.5;
      camera.lookAt(0, scroll * 0.1, 0);

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
      // One static, well-composed frame; no loop, no listeners doing work.
      elapsed = 2.2;
      renderFrame(0);
    } else {
      start();
    }

    /* ---- resize ---- */
    const ro = new ResizeObserver(() => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      if (w === width && h === height) return;
      width = w;
      height = h;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
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
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);

      geometry.dispose();
      material.dispose();
      ringGeoA.dispose();
      ringMatA.dispose();
      ringGeoB.dispose();
      ringMatB.dispose();
      beadGeo.dispose();
      beadMat.dispose();
      beadGlowMat.dispose();
      haloRedMat.dispose();
      haloAccentMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      beadGlowTex?.dispose();
      haloRed?.dispose();
      haloAccent?.dispose();

      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [reduced]);

  return <div ref={hostRef} aria-hidden className="absolute inset-0" />;
}
