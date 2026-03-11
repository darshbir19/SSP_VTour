export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export async function isWebXRSupported(): Promise<boolean> {
  if (!('xr' in navigator)) return false
  try {
    return await (navigator as any).xr.isSessionSupported('immersive-vr')
  } catch {
    return false
  }
}
