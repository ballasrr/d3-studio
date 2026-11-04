/**
 * Film-grain layer: one fixed tile of inline SVG turbulence over the document
 * (the `grain` utility in globals.css — no image request, basePath-safe).
 * Purely decorative, never interactive. `mix-blend-overlay` keeps the grain
 * readable on near-black without washing the type out.
 */
export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="grain pointer-events-none fixed inset-0 z-[65] select-none opacity-[0.05] mix-blend-overlay"
    />
  );
}
