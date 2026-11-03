import { useEffect, useRef, useState, lazy, Suspense, type MouseEvent, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { contact, links, media, projects, research } from '../content';
import { Envelope } from './Envelope';
import type { Overlay } from '../state';
import styles from '../styles/Overlays.module.css';
const PdfViewer=lazy(()=>import('./PdfViewer'));

function ResearchContent({slide,next}:{slide:number;next:()=>void}) {
  const start=useRef({x:0,y:0,scroll:0});const scroll=useRef<HTMLDivElement>(null);
  const click=(e:MouseEvent)=>{
    if((e.target as HTMLElement).closest('a,button') || window.getSelection()?.toString())return;
    if(Math.hypot(e.clientX-start.current.x,e.clientY-start.current.y)>8 || Math.abs((scroll.current?.scrollTop||0)-start.current.scroll)>2)return;
    next();
  };
  const item=research[slide];
  return <section className={styles.researchPaper} aria-labelledby="research-title">
    <span className={styles.paperclip} aria-hidden="true"/>
    <header className={styles.researchHeader}><span>RESEARCH MUSINGS</span><span aria-live="polite">{String(slide+1).padStart(2,'0')} / 03</span></header>
    <div ref={scroll} className={styles.researchScroll} onPointerDown={e=>{start.current={x:e.clientX,y:e.clientY,scroll:scroll.current?.scrollTop||0};}} onClick={click}>
      <AnimatePresence mode="wait"><motion.div key={slide} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.12}}>
        <p className={styles.researchCategory}>{item?.category || 'A COLLECTION OF EARLIER WORK'}</p>
        <h2 id="research-title">{item?.title || 'Undergraduate Work'}</h2>
        {item ? <><p>{item.body}</p><h3>Research Question</h3><p className={styles.question}>{item.question}</p><h3>Methods</h3><p className={styles.methods}>{item.methods}</p><p className={styles.status}><span/>Exploring...</p></> : <><p>Scan to explore selected coursework and projects from my undergraduate studies.</p><img className={styles.qr} src={media('undergraduate-qr.png')} alt="Undergraduate portfolio QR code"/><a className={styles.undergraduateLink} href={links.undergraduate} target="_blank" rel="noopener noreferrer">Visit my undergraduate portfolio ↗</a></>}
      </motion.div></AnimatePresence>
    </div>
    <footer className={styles.researchFooter}><span>CLICK THE PAPER TO TURN THE PAGE</span><button onClick={next}>Next musing →</button></footer>
  </section>;
}
export default function OverlayManager({overlay,close,next}:{overlay:Overlay;close:()=>void;next:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);const trigger=useRef<HTMLElement|null>(null);
  const [zoom,setZoom]=useState(false);const [shown,setShown]=useState(false);const reduce=useReducedMotion();
  const closeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  function dismiss(){if(closeTimer.current)return;setShown(false);closeTimer.current=setTimeout(close,reduce?0:220);}
  const kind=overlay.kind;const active=kind!=='none';
  const pointer=useRef({x:0,y:0,scroll:0});
  function trapTab(e:KeyboardEvent<HTMLDialogElement>){
    if(e.key!=='Tab')return;
    const targets=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])')).filter(el=>el.getClientRects().length>0&&!el.closest('[inert]'));
    const first=targets[0];const last=targets[targets.length-1];
    if(!first)return;
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
  useEffect(()=>{
    if(!active)return;
    trigger.current=document.activeElement as HTMLElement;setZoom(false);setShown(false);closeTimer.current=null;
    const d=dialog.current;const scrollY=window.scrollY;const original=document.body.style.cssText;
    const gutter=window.innerWidth-document.documentElement.clientWidth;
    document.body.style.overflow='hidden';if(gutter)document.body.style.paddingRight=`${gutter}px`;
    d?.showModal();const frame=requestAnimationFrame(()=>{setShown(true);d?.querySelector<HTMLButtonElement>('[data-close]')?.focus({preventScroll:true});});
    return()=>{cancelAnimationFrame(frame);if(closeTimer.current)clearTimeout(closeTimer.current);closeTimer.current=null;d?.close();document.body.style.cssText=original;window.scrollTo(0,scrollY);if(trigger.current?.isConnected)trigger.current.focus({preventScroll:true});};
  },[active]);
  if(!active)return null;
  const p=kind==='pdf'?projects.find(p=>p.id===overlay.id):undefined;
  const label=kind==='about'?'about-title':kind==='contact'?'contact-title':kind==='research'?'research-title':'pdf-title';
  return <dialog ref={dialog} className={styles.dialog} aria-labelledby={label} onKeyDown={trapTab} onCancel={e=>{e.preventDefault();dismiss();}}>
    <div className={`${styles.scrim} ${kind==='pdf'?styles.pdfScrim:''}`} onPointerDown={e=>{if(e.target===e.currentTarget)pointer.current={x:e.clientX,y:e.clientY,scroll:0};}} onClick={e=>{if(kind!=='pdf' && e.target===e.currentTarget && Math.hypot(e.clientX-pointer.current.x,e.clientY-pointer.current.y)<8)dismiss();}}>
      <motion.div className={`${styles.dialogBody} ${styles[kind]}`} initial={{opacity:0,scale:reduce?1:.96,y:reduce?0:12}} animate={{opacity:shown?1:0,scale:1,y:0}} transition={{duration:reduce?0:.3}}>
        {kind!=='pdf'&&<div className={styles.dialogTools}>{kind==='about'&&<button onClick={()=>setZoom(!zoom)}>{zoom?'Fit to screen':'Zoom to read'} <span>⤢</span></button>}<button data-close onClick={dismiss} className={styles.close} aria-label="Close dialog">Close <span>×</span></button></div>}
        {kind==='about'&&<><h2 id="about-title" className="sr-only">About Fu Shimin</h2><div className={`${styles.aboutScroll} ${zoom?styles.zoomed:''}`} onPointerDown={e=>{pointer.current={x:e.clientX,y:e.clientY,scroll:e.currentTarget.scrollTop};}} onClick={e=>{if(Math.hypot(e.clientX-pointer.current.x,e.clientY-pointer.current.y)<8 && Math.abs(e.currentTarget.scrollTop-pointer.current.scroll)<2 && !window.getSelection()?.toString())dismiss();}}><img src={media('about-page.webp')} alt="Fu Shimin — education, internship, main projects, skills, honors and interests. Hunan University, Industrial Design. OPPO and HNU, User Research Assistant." /></div><p className={styles.aboutHint}>CLICK TO RETURN · ZOOM TO READ</p></>}
        {kind==='research'&&<ResearchContent slide={overlay.slide} next={next}/>}
        {kind==='contact'&&<div className={styles.contactStage}><Envelope expanded/><p className={styles.contactHint}>HAVE AN IDEA? I’D LOVE TO HEAR IT.</p></div>}
        {kind==='pdf'&&p&&<section className={styles.pdfPanel}><header className={styles.pdfHeader}><h2 id="pdf-title">{p.title}<small>PROJECT PDF</small></h2><nav aria-label="PDF actions"><a href={p.pdf} target="_blank" rel="noopener noreferrer">Open separately ↗</a><a href={p.pdf} download={`${p.title}.pdf`}>Download ↓</a><button data-close onClick={dismiss} className={styles.pdfClose} aria-label="Close dialog">Close <span>×</span></button></nav></header><Suspense fallback={<p className={styles.pdfLoading}>Loading PDF reader…</p>}><PdfViewer key={p.id} url={p.pdf} title={p.title}/></Suspense></section>}
      </motion.div>
    </div>
  </dialog>;
}
