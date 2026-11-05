import { lazy, Suspense, useEffect, useReducer } from 'react';
import { Link, useLocation } from 'react-router';
import { overlayReducer, type Overlay } from './state';
import Home from './Home';
import OverlayManager from './components/OverlayManager';
const Portfolio=lazy(()=>import('./Portfolio'));
export default function App(){
  const [overlay,dispatch]=useReducer(overlayReducer,{kind:'none'});
  const location=useLocation();
  useEffect(()=>{dispatch({type:'close'});},[location.pathname]);
  const open=(overlay:Overlay)=>dispatch({type:'open',overlay});
  return <><a href="#main" className="skip-link">Skip to content</a><div className={overlay.kind==='none'?'app-shell':'app-shell modal-open'}>
    {location.pathname==='/'?<Home open={open}/>:location.pathname==='/portfolio'?<Suspense fallback={<main className="loading-page">Opening selected works…</main>}><Portfolio/></Suspense>:<main id="main" className="not-found"><p>404 / A LOOSE NOTE</p><h1>This page isn’t pinned here.</h1><Link to="/">← Back to the board</Link></main>}
  </div><OverlayManager overlay={overlay} close={()=>dispatch({type:'close'})} next={()=>dispatch({type:'nextResearch'})}/></>;
}
