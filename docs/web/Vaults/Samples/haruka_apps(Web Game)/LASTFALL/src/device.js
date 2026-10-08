export function prefersTouch() {
  return typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0 &&
    typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
}

export function useTouchControls(preference = 'auto') {
  return preference === 'touch' || (preference === 'auto' && prefersTouch());
}
