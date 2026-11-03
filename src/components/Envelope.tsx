import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { contact, media } from '../content';
import styles from '../styles/Envelope.module.css';
export function Envelope({ expanded = false }: { expanded?: boolean }) {
  const reduce=useReducedMotion();
  const [phase,setPhase]=useState(0);const [message,setMessage]=useState('');
  const clearMessage=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(clearMessage.current)clearTimeout(clearMessage.current);},[]);
  useEffect(()=>{
    if(!expanded){setPhase(0);return;}
    if(reduce){setPhase(3);return;}
    setPhase(0);
    const timers=[setTimeout(()=>setPhase(1),350),setTimeout(()=>setPhase(2),950),setTimeout(()=>setPhase(3),1700)];
    return()=>timers.forEach(clearTimeout);
  },[expanded,reduce]);
  async function copy(value:string){
    try{await navigator.clipboard.writeText(value);setMessage('Copied to clipboard');}
    catch{setMessage('Please select the text to copy it.');}
    if(clearMessage.current)clearTimeout(clearMessage.current);
    clearMessage.current=setTimeout(()=>setMessage(''),2500);
  }
  return <div className={`${styles.envelope} ${expanded?styles.expanded:''}`} data-phase={phase}>
    {expanded&&<h2 id="contact-title" className="sr-only">LET’S TALK</h2>}
    <img className={`${styles.layer} ${styles.back}`} src={media('envelope-back.webp')} alt="" draggable="false"/>
    {expanded&&<section className={styles.paper} inert={phase<3} aria-hidden={phase<3} aria-label="Contact card">
      <img className={styles.paperTexture} src={media('contact-card-blank.webp')} alt="" draggable="false"/>
      <div className={styles.contactText}>
        <p className={styles.eyebrow}>A CONVERSATION STARTS HERE</p><h2>LET’S TALK</h2>
        <dl>{contact.map(item=><div className={styles.row} key={item.label}><dt>{item.label}</dt><dd>{item.href?<a href={item.href} target={item.label==='YOUTUBE'?'_blank':undefined} rel={item.label==='YOUTUBE'?'noopener noreferrer':undefined}>{item.value}</a>:<span>{item.value}</span>}{<button onClick={()=>void copy(item.label==='YOUTUBE'?(item.href||item.value):item.value)} aria-label={`Copy ${item.label}`} title={`Copy ${item.label}`}>⧉</button>}</dd></div>)}</dl>
        <p role="status" className={styles.status}>{message||'Always happy to exchange ideas.'}</p>
      </div>
    </section>}
    <img className={`${styles.layer} ${styles.front}`} src={media('envelope-front.webp')} alt="" draggable="false"/>
    <div className={styles.hinge}><div className={styles.flap}>
      <div className={styles.outer}><img className={styles.layer} src={media('envelope-flap-outer.webp')} alt="" draggable="false"/></div>
      <div className={styles.inner}><img className={styles.layer} src={media('envelope-flap-inner.webp')} alt="" draggable="false"/></div>
    </div></div>
  </div>;
}
