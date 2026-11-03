import { useId } from 'react';
export function Pin({ className = '' }: { className?: string }) {
  const id = useId();
  return <svg className={`pin ${className}`} viewBox="0 0 40 40" aria-hidden="true"><defs><radialGradient id={id} cx="30%" cy="25%"><stop stopColor="#fff"/><stop offset=".45" stopColor="#d8dadd"/><stop offset=".72" stopColor="#858b91"/><stop offset="1" stopColor="#444b53"/></radialGradient></defs><ellipse cx="23" cy="27" rx="12" ry="8" fill="#2c231d" opacity=".24"/><circle cx="19" cy="17" r="12" fill={`url(#${id})`} stroke="#62666a"/><circle cx="19" cy="17" r="8" fill="none" stroke="#fff" opacity=".65"/><ellipse cx="16" cy="13" rx="4" ry="2" fill="white" opacity=".8"/></svg>;
}
export function MetalClip() {
  const id = useId();
  return <svg className="metal-clip" viewBox="0 0 100 134" aria-hidden="true"><defs><linearGradient id={id} x1="0" y1="0" x2="1" y2=".3"><stop stopColor="#555a5c"/><stop offset=".18" stopColor="#faf6e9"/><stop offset=".42" stopColor="#b2b0a7"/><stop offset=".62" stopColor="#f7f6ed"/><stop offset="1" stopColor="#676d70"/></linearGradient></defs><path d="M32 84V31a18 18 0 0136 0v53l22 10v31H10V94z" fill={`url(#${id})`} stroke="#747570" strokeWidth="2"/><circle cx="50" cy="34" r="11" fill="#a6a39b" stroke="#f5f3e9" strokeWidth="4"/><path d="M11 102q39 17 78 0M13 121h74" fill="none" stroke="#515557" strokeWidth="4"/><path d="M19 95h62" stroke="white" strokeWidth="3"/></svg>;
}
export function KeyRing() {
  const id = useId();
  return <svg className="key-ring" viewBox="0 0 160 150" aria-hidden="true"><defs><linearGradient id={id}><stop stopColor="#464c50"/><stop offset=".22" stopColor="#f5f1e8"/><stop offset=".48" stopColor="#81878a"/><stop offset=".68" stopColor="#fff"/><stop offset="1" stopColor="#575a5a"/></linearGradient></defs><path d="M70 56C52 50 54 27 66 13c12-14 34-3 28 14L81 57" fill="none" stroke="#4b4b49" strokeWidth="12"/><path d="M70 56C52 50 54 27 66 13c12-14 34-3 28 14L81 57" fill="none" stroke={`url(#${id})`} strokeWidth="8"/><ellipse cx="80" cy="92" rx="43" ry="44" fill="none" stroke="#444747" strokeWidth="12"/><ellipse cx="80" cy="92" rx="43" ry="44" fill="none" stroke={`url(#${id})`} strokeWidth="8"/></svg>;
}
