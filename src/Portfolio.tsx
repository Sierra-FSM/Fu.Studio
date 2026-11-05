import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { Link } from 'react-router';
import { motion, useMotionValue, useMotionTemplate, useSpring, useReducedMotion } from 'motion/react';
import { projects, media, type Project } from './content';
import { viewMemory } from './state';
import styles from './styles/Portfolio.module.css';
import FoldText from './components/FoldText';

function Text({text,delay=0,splitBy='word'}:{text:string;delay?:number;splitBy?:'char'|'word'|'line'}){
  return <FoldText text={text} splitBy={splitBy} trigger="scroll" delay={delay} duration={.5} stagger={splitBy==='char'?.03:.045} foldAngle={75} creaseShading={.22}/>;
}

function Cover({ project, activate, isDragging }: { project:Project; activate:(id:string|null,mode:'hover'|'focus')=>void; isDragging:()=>boolean }) {
  const reduce=useReducedMotion(); const x=useMotionValue(0);const y=useMotionValue(0);
  const rx=useSpring(x,{stiffness:190,damping:23});const ry=useSpring(y,{stiffness:190,damping:23});
  const gx=useMotionValue(50);const gy=useMotionValue(50);
  const highlight=useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,.7), rgba(202,226,255,.3) 36%, transparent 74%)`;
  useEffect(()=>{if(reduce){x.set(0);y.set(0);}},[reduce,x,y]);
  const [hover,setHover]=useState(false);
  const move=(e:PointerEvent<HTMLAnchorElement>)=>{
    if(reduce || e.pointerType!=='mouse')return;
    const box=e.currentTarget.getBoundingClientRect();
    const px=Math.max(0,Math.min(1,(e.clientX-box.left)/box.width));const py=Math.max(0,Math.min(1,(e.clientY-box.top)/box.height));
    x.set(-(py-.5)*12);y.set((px-.5)*12);gx.set(px*100);gy.set(py*100);
  };
  const click=(e:MouseEvent<HTMLAnchorElement>)=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    if(e.detail>0 && isDragging())e.preventDefault();
  };
  return <article className={styles.project}>
    <a id={`project-${project.id}`} className={styles.coverLink} href={project.pdf} target="_blank" rel="noopener noreferrer" aria-label={`Read ${project.title} PDF`} aria-describedby={`desc-${project.id}`} onClick={click} onPointerMove={move} onMouseEnter={()=>{setHover(true);activate(project.id,'hover');}} onMouseLeave={()=>{setHover(false);activate(null,'hover');x.set(0);y.set(0);gx.set(50);gy.set(50);}} onFocus={()=>{setHover(true);activate(project.id,'focus');if(!reduce){x.set(-2);y.set(2);}}} onBlur={()=>{setHover(false);activate(null,'focus');x.set(0);y.set(0);}}>
      <motion.div className={styles.coverMotion} style={{rotateX:rx,rotateY:ry}} animate={{y:hover&&!reduce?-6:0,scale:hover&&!reduce?1.0275:1,boxShadow:hover&&!reduce?'0 13.5px 22.5px rgba(20,40,75,.215)':'0 7px 15px rgba(20,36,58,.11)'}} transition={{type:'spring',stiffness:190,damping:23}}>
        <img src={project.cover} srcSet={`${media(`project-${project.order}-480.webp`)} 480w, ${project.cover} 960w, ${media(`project-${project.order}-1440.webp`)} 1440w`} sizes="(max-width:767px) 78vw, 240px" width="2078" height="1684" alt={`${project.title} project cover`} loading={project.order<4?'eager':'lazy'} />
        <motion.span className={styles.reflection} style={{background:highlight}} animate={{opacity:hover&&!reduce?.35:0}} transition={{duration:.18}} aria-hidden="true"/>
      </motion.div>
    </a>
    <div className={styles.projectMeta}><span><Text text={String(project.order).padStart(2,'0')}/></span><h2><Text text={project.title} delay={.06}/></h2><span><Text text="↗"/></span></div>
    <p id={`desc-${project.id}`} className={styles.mobileDescription}><Text text={project.description}/></p>
  </article>;
}
export default function Portfolio() {
  const reduce=useReducedMotion();
  const rail=useRef<HTMLDivElement>(null);const gesture=useRef({x:0,y:0,drag:false});
  const [hoverId,setHoverId]=useState<string|null>(null);const [focusId,setFocusId]=useState<string|null>(null);const active=focusId||hoverId;const [position,setPosition]=useState({left:true,right:false});
  const project=projects.find(p=>p.id===active);
  function syncPosition(){const el=rail.current;if(el){viewMemory.railX=el.scrollLeft;setPosition({left:el.scrollLeft<2,right:el.scrollLeft+el.clientWidth>=el.scrollWidth-2});}}
  useEffect(()=>{
    document.title='Selected Works — FU.STUDIO';window.scrollTo(0,viewMemory.portfolioY);
    if(rail.current){rail.current.scrollLeft=viewMemory.railX;syncPosition();}
    const obs=new ResizeObserver(syncPosition);if(rail.current)obs.observe(rail.current);
    return()=>{viewMemory.portfolioY=window.scrollY;obs.disconnect();};
  },[]);
  return <main id="main" className={styles.portfolio}>
    <header className={styles.topbar}><Link to="/" className={styles.back}><Text text="← Back to Board"/></Link><span className={styles.designTag}><Text text="DESIGN" delay={.08}/></span><span className={styles.topEdition}><Text text="SELECTED WORKS · VOL. 01" delay={.14}/></span></header>
    <div className={styles.titleBlock}><h1><FoldText text="PORTFOLIO" splitBy="char" foldStyle="paper" trigger="mount" delay={.1} duration={.85} stagger={.055} hoverRefold refoldRadius={160} refoldAngle={45} creaseShading={.5}/></h1><div><span><Text text="Fu Shimin" delay={.25}/></span><span><Text text="2024—2026" delay={.35}/></span></div></div>
    <div className={styles.statement}><span><Text text="IDEAS, MADE REAL." delay={.25}/></span><p><FoldText text={"Grounded in human needs,\nbringing ideas to life through design."} splitBy="char" delay={.35} duration={.7} stagger={.012} hoverRefold refoldRadius={100} refoldAngle={58} creaseShading={.45}/></p><span className={styles.index}><Text text={"01 — 06\nSELECTED PROJECTS"} splitBy="line" delay={.4}/></span></div>
    <section aria-label="Selected projects" className={styles.projectSection}>
      <div className={styles.railHeader}><span><Text text="SIX PROJECTS. DIFFERENT POSSIBILITIES." delay={.35}/></span><div><span><Text text="SCROLL TO EXPLORE" delay={.4}/></span><button onClick={()=>rail.current?.scrollBy({left:-300,behavior:reduce?'auto':'smooth'})} disabled={position.left} aria-label="Previous projects"><Text text="←"/></button><button onClick={()=>rail.current?.scrollBy({left:300,behavior:reduce?'auto':'smooth'})} disabled={position.right} aria-label="Next projects"><Text text="→"/></button></div></div>
      <div ref={rail} className={styles.rail} onScroll={syncPosition} onPointerDown={e=>{gesture.current={x:e.clientX,y:e.clientY,drag:false};}} onPointerMove={e=>{if(e.buttons && Math.hypot(e.clientX-gesture.current.x,e.clientY-gesture.current.y)>8)gesture.current.drag=true;}} onPointerCancel={()=>{gesture.current.drag=true;}}>
        {projects.map(p=><Cover key={p.id} project={p} activate={(id,mode)=>{if(mode==='focus')setFocusId(id);else setHoverId(id);}} isDragging={()=>gesture.current.drag}/>)}
      </div>
      <div className={styles.descriptionRegion} aria-hidden="true"><span><Text text={project?String(project.order).padStart(2,'0'):'↗'}/></span><div><h3><Text text={project?.title || 'A closer look starts here.'}/></h3><p><Text text={project?.description || 'Hover or focus a cover to explore the project. Open a cover to read the PDF.'}/></p></div><span className={styles.descriptionLabel}><Text text={project?'PROJECT NOTE':'EXPLORE'}/></span></div>
    </section>
    <footer className={styles.footer}><Link to="/"><Text text="← Back to the board"/></Link><span><Text text="RESEARCH · DESIGN · PROTOTYPE · MAKE"/></span><span><Text text="© FU.STUDIO"/></span></footer>
  </main>;
}
