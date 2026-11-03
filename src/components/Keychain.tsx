import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { media, skills } from '../content';
import styles from '../styles/Objects.module.css';

// Hole centers are measured in the alpha-cropped artwork, rather than its source canvas.
const charms = [
  { hole: [.799,.157], ratio:1004/1256, width:142 },
  { hole: [.618,.110], ratio:1091/999, width:119 },
  { hole: [.483,.095], ratio:1105/939, width:111 },
  { hole: [.252,.114], ratio:940/1078, width:138 },
  { hole: [.179,.112], ratio:1076/1062, width:127 },
];
function Ring({front=false}:{front?:boolean}) {
  return <svg className={`${styles.mainRing} ${front?styles.ringFront:''}`} viewBox="0 0 400 320" aria-hidden="true">
    <defs><linearGradient id={front?'ring-front':'ring-back'}><stop stopColor="#555b5e"/><stop offset=".25" stopColor="#fffdf3"/><stop offset=".5" stopColor="#999d9e"/><stop offset=".72" stopColor="#ecece8"/><stop offset="1" stopColor="#494e51"/></linearGradient></defs>
    <path d={front?'M156 42 A44 45 0 0 0 244 42':'M156 42 A44 45 0 0 1 244 42'} fill="none" stroke="#454a4c" strokeWidth="12"/>
    <path d={front?'M156 42 A44 45 0 0 0 244 42':'M156 42 A44 45 0 0 1 244 42'} fill="none" stroke={`url(#${front?'ring-front':'ring-back'})`} strokeWidth="8"/>
  </svg>;
}
export function KeychainObject(){
  const [active,setActive]=useState<number|null>(null);const [scale,setScale]=useState(1);const root=useRef<HTMLDivElement>(null);const reduce=useReducedMotion();
  useLayoutEffect(()=>{const el=root.current;if(!el)return;setScale(el.clientWidth/400);const observer=new ResizeObserver(([entry])=>setScale(entry.contentRect.width/400));observer.observe(el);return()=>observer.disconnect();},[]);
  useEffect(()=>{const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setActive(null);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[]);
  return <div ref={root} className={styles.keychainStage} onMouseLeave={()=>{if(!root.current?.contains(document.activeElement))setActive(null);}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setActive(null);}}>
    <div className={styles.keychainCanvas} style={{zoom:scale}}>
      <Ring/>
      {charms.map((charm,i)=>{
        const chosen=active===i;const side=active===null?0:i<active?-1:1;
        const rank=active===null?0:Math.abs(i-active);
        const angle=active===null?[-10,-5,0,5,10][i]:chosen?0:side===-1?48+rank*9:-48-rank*9;
        const anchorX=active===null?184+i*8:chosen?200:side===-1?167+(4-rank)*2:233-(4-rank)*2;
        const anchorY=42+45*Math.sqrt(1-((anchorX-200)/44)**2);
        const length=active===null?35+i*9:chosen?57:37+rank*7;
        const h=charm.width*charm.ratio;
        return <motion.div initial={false} key={skills[i]} className={styles.charmAssembly} style={{zIndex:chosen?12:7-i}} animate={{x:anchorX,y:anchorY,rotate:angle}} transition={reduce?{duration:0}:{type:'spring',stiffness:145,damping:22}}>
          <motion.svg initial={false} className={styles.shortChain} viewBox="-10 0 20 100" animate={{height:length+3}} transition={reduce?{duration:0}:{type:'spring',stiffness:145,damping:22}} aria-hidden="true" preserveAspectRatio="none">
            {Array.from({length:5},(_,j)=><g key={j}><ellipse cx="0" cy={8+j*18} rx={j%2?3:6} ry="10" fill="none" stroke="#4e5252" strokeWidth="3.5"/><ellipse cx="0" cy={8+j*18} rx={j%2?3:6} ry="10" fill="none" stroke={j%2?'#babdbc':'#eeeae0'} strokeWidth="1.8"/></g>)}
          </motion.svg>
          <motion.button initial={false} type="button" className={styles.newCharm} aria-label={skills[i]} aria-describedby="skill-tooltip" onPointerMove={event=>{if(event.pointerType==='mouse'&&(event.movementX!==0||event.movementY!==0))setActive(i);}} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} style={{width:charm.width,left:-charm.hole[0]*charm.width,top:length-charm.hole[1]*h,'--charm-mask':`url("${media(`skill-${i}.webp`)}")`} as CSSProperties} animate={{top:length-charm.hole[1]*h}} transition={reduce?{duration:0}:{type:'spring',stiffness:145,damping:22}}>
            <img src={media(`skill-${i}.webp`)} alt="" draggable="false"/>
          </motion.button>
          <motion.svg initial={false} className={styles.holeLink} viewBox="0 0 18 22" animate={{y:length-8}} transition={reduce?{duration:0}:{type:'spring',stiffness:145,damping:22}} aria-hidden="true"><ellipse cx="9" cy="11" rx="5" ry="8" fill="none" stroke="#4d5253" strokeWidth="3.5"/><path d="M9 3C2 3 2 18 9 19" fill="none" stroke="#eeeae0" strokeWidth="2"/></motion.svg>
        </motion.div>;
      })}
      <Ring front/>
    </div>
    <div className={styles.skillLabel} id="skill-tooltip" role="status">{active===null?'A FEW THINGS I DO':skills[active]}<span>{active===null?'EXPLORE THE CHARMS ↗':'RESEARCH → MAKE → TEST'}</span></div>
  </div>;
}
