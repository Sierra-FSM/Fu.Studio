export type Overlay = { kind: 'none' } | { kind: 'about' } | { kind: 'research'; slide: number } | { kind: 'contact' } | { kind: 'pdf'; id: string };
export type Action = { type: 'open'; overlay: Overlay } | { type: 'close' } | { type: 'nextResearch' };
export function overlayReducer(state: Overlay, action: Action): Overlay {
  if (action.type === 'close') return { kind: 'none' };
  if (action.type === 'open') return action.overlay;
  if (action.type === 'nextResearch' && state.kind === 'research') return { ...state, slide: (state.slide + 1) % 3 };
  return state;
}
export function readIntroSeen() {
  try { return sessionStorage.getItem('fu-shimin:intro:v3') === 'seen'; } catch { return false; }
}
export function saveIntroSeen() {
  try { sessionStorage.setItem('fu-shimin:intro:v3', 'seen'); } catch { /* Memory state still handles this visit. */ }
}
export const viewMemory = { homeY: 0, railX: 0, portfolioY: 0, focusId: '' };
