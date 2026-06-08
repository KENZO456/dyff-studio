// Module-level shared state for the Three.js scene.
// Avoids React re-renders for high-frequency values (mouse, scroll).
export const sceneState = {
  mouse:         { x: 0, y: 0 }, // normalised device coords −1…+1
  scroll:        0,               // 0 → 1 page scroll progress
  manifestoGlow: 0,               // 0 → 1, used by InkBlob during manifesto section
}
