export function enterFullscreen(el: HTMLElement = document.documentElement) {
  if (el.requestFullscreen) el.requestFullscreen()
  else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen()
}

export function exitFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen()
  else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen()
}

export function isFullscreen(): boolean {
  return !!document.fullscreenElement
}
