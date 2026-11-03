import { createContext, useCallback, useContext, useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
type Entry = { element:HTMLElement; rect:DOMRect; set:(angle:number)=>void };
type Register = (element:HTMLElement,set:(angle:number)=>void)=>()=>void;
const Context=createContext<Register|null>(null);
export const useBoardMotion=()=>useContext(Context);

export function BoardMotion({children}:{children:ReactNode}){
  const entries=useRef(new Map<HTMLElement,Entry>());const frame=useRef(0);
  const idle=useRef<ReturnType<typeof setTimeout>|null>(null);const reduced=useReducedMotion();
  const point=useRef({x:0,y:0});
  const reset=useCallback(()=>{entries.current.forEach(e=>e.set(0));},[]);
  const register=useCallback<Register>((element,set)=>{
    entries.current.set(element,{element,set,rect:element.getBoundingClientRect()});
    return()=>{entries.current.delete(element);};
  },[]);
  useEffect(()=>{
    const measure=()=>entries.current.forEach(e=>{e.rect=e.element.getBoundingClientRect();});
    const hide=()=>{if(document.hidden)reset();};
    window.addEventListener('resize',measure);window.addEventListener('scroll',measure,true);document.addEventListener('visibilitychange',hide);
    return()=>{window.removeEventListener('resize',measure);window.removeEventListener('scroll',measure,true);document.removeEventListener('visibilitychange',hide);cancelAnimationFrame(frame.current);if(idle.current)clearTimeout(idle.current);};
  },[reset]);
  useEffect(()=>{if(reduced)reset();},[reduced,reset]);
  function move(e:PointerEvent){
    if(reduced||e.pointerType!=='mouse')return;point.current={x:e.clientX,y:e.clientY};
    if(frame.current)return;
    frame.current=requestAnimationFrame(()=>{
      frame.current=0;const {x,y}=point.current;const radius=Math.min(window.innerWidth*.27,420);
      entries.current.forEach(({rect,set})=>{
        const dx=x-(rect.left+rect.width/2);const dy=y-(rect.top+rect.height/2);
        const proximity=Math.max(0,1-Math.hypot(dx,dy)/radius);
        set(Math.max(-2,Math.min(2,dx/Math.max(rect.width,1)*3*proximity)));
      });
      if(idle.current)clearTimeout(idle.current);idle.current=setTimeout(reset,140);
    });
  }
  return <Context.Provider value={register}><div style={{display:'contents'}} onPointerMove={move} onPointerLeave={reset}>{children}</div></Context.Provider>;
}
