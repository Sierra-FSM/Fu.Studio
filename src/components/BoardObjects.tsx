import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { media, projects } from '../content';
import { Pin } from './Metal';
import { Envelope } from './Envelope';
import { useBoardMotion } from './BoardMotion';
import type { Overlay } from '../state';
import styles from '../styles/Objects.module.css';

export function PinnedObject({ name, index, children, animateEntrance }: { name: string; index: number; children: ReactNode; animateEntrance: boolean }) {
  const reduce = useReducedMotion();
  const rotate = useMotionValue(0); const r = useSpring(rotate, { stiffness: 160, damping: 24 });
  const anchor=useRef<HTMLDivElement>(null);const register=useBoardMotion();
  useEffect(()=>{
    if(!anchor.current||!register)return;
    return register(anchor.current,angle=>rotate.set(reduce||animateEntrance?0:angle));
  },[register,rotate,reduce,animateEntrance]);
  return <div ref={anchor} className={`${styles.pinned} ${styles[name]}`}>
    <motion.div className={styles.entrance} initial={animateEntrance && !reduce ? { opacity: 0, y: -28, rotate: -5 } : false} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: animateEntrance ? index*.3 : 0, duration: .5 }}>
      <motion.div className={styles.swing} style={{ rotateZ: r }}>{children}</motion.div>
    </motion.div><Pin />
  </div>;
}

export function AboutObject({ open }: { open: (overlay: Overlay) => void }) {
  return <button className={styles.objectButton} id="about-trigger" onClick={() => open({ kind: 'about' })} aria-label="About me — open personal profile">
    <img className={styles.aboutImage} src={media('about-entry.webp')} alt="About Me — Fu Shimin. Interaction, Intelligent Products, AI-assisted Design." draggable="false" />
    <span className={styles.objectCaption}>A LITTLE ABOUT ME <span>↗</span></span>
  </button>;
}
export function FolderObject() {
  return <Link className={`${styles.objectButton} ${styles.folderLink}`} to="/portfolio" id="portfolio-trigger" aria-label="Open selected works">
    <div className={styles.folderStage}>
      <img className={styles.folderBack} src={media('folder-back.webp')} alt="" draggable="false" />
      {projects.slice(0,3).map((p,i) => <img key={p.id} className={`${styles.previewPaper} ${styles[`paper${i}`]}`} src={p.cover} alt="" draggable="false" />)}
      <img className={styles.folderFront} src={media('folder-front.webp')} alt="Portfolio — a curated selection of projects" draggable="false" />
      <img className={styles.folderClip} src={media('folder-clip.webp')} alt="" draggable="false" />
    </div><span className={styles.objectCaption}>OPEN SELECTED WORKS <span>↗</span></span>
  </Link>;
}
export function ResearchObject({ open }: { open: (overlay: Overlay) => void }) {
  return <button id="research-trigger" className={`${styles.objectButton} ${styles.researchButton}`} onClick={() => open({ kind:'research', slide:0 })} aria-label="Open IDEAs">
    <img src={media('research.webp')} alt="" draggable="false" />
    <span className={styles.researchLabel}>IDEAs<span>01 — 03</span></span>
    <span className={styles.objectCaption}>IDEAS IN PROGRESS <span>↗</span></span>
  </button>;
}
export function ContactObject({ open }: { open: (overlay: Overlay) => void }) {
  return <button id="contact-trigger" className={`${styles.objectButton} ${styles.contactButton}`} onClick={() => open({ kind:'contact' })} aria-label="Open contact envelope"><Envelope /><span className={styles.objectCaption}>LET’S MAKE SOMETHING <span>↗</span></span></button>;
}

export { KeychainObject } from './Keychain';
