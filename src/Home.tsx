import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AboutObject, ContactObject, FolderObject, KeychainObject, PinnedObject, ResearchObject } from './components/BoardObjects';
import { media } from './content';
import { BoardMotion } from './components/BoardMotion';
import { readIntroSeen, saveIntroSeen, viewMemory, type Overlay } from './state';
import styles from './styles/Home.module.css';
import FoldText from './components/FoldText';
export default function Home({ open }: { open:(overlay:Overlay)=>void }) {
  const reduce=useReducedMotion();
  const [intro,setIntro]=useState(() => !readIntroSeen() && !reduce);
  const [entrance,setEntrance]=useState(false);
  function finish(skipped=false) {saveIntroSeen();setIntro(false);setEntrance(!skipped);}
  useEffect(() => {if (reduce) {saveIntroSeen();setIntro(false);setEntrance(false);}},[reduce]);
  useEffect(() => {if (!intro) return;const t=setTimeout(() => finish(),3000);return () => clearTimeout(t);},[intro]);
  useEffect(() => {document.title='FU.STUDIO — Personal Website';window.scrollTo(0,viewMemory.homeY);return () => {viewMemory.homeY=window.scrollY;};},[]);
  useEffect(() => {if (!entrance) return;const t=setTimeout(()=>setEntrance(false),2200);return()=>clearTimeout(t);},[entrance]);
  return <>
    <AnimatePresence>{intro && <motion.div className={styles.intro} initial={{opacity:1}} exit={{opacity:0}} transition={{duration:.4}}>
      <p className={styles.introKicker}><FoldText text="A PERSONAL COLLECTION" splitBy="word" duration={.45} stagger={.065}/></p><div><h1><FoldText text="FU.STUDIO" splitBy="char" foldStyle="paper" hinge="top" delay={.2} duration={1} stagger={.085} hoverRefold refoldAngle={68} refoldRadius={150} creaseShading={.5}/></h1><p><FoldText text="Personal Website" splitBy="word" delay={1.05} duration={.65} stagger={.12}/></p></div><button onClick={()=>finish(true)}><FoldText text="Skip intro" splitBy="word" delay={0} duration={.35} stagger={.04}/> <span>↗</span></button><div className={styles.introProgress}/>
    </motion.div>}</AnimatePresence>
    <main id="main" className={styles.home} inert={intro}><h1 className="sr-only">FU.STUDIO — Designer &amp; Maker</h1>
      <header className={styles.homeHeader}><a href="#main" className={styles.wordmark}>FU.STUDIO<span>DESIGNER & MAKER</span></a><span className={styles.headerNote}>A work in progress.<br/>A collection of possibilities.</span><span className={styles.edition}>PERSONAL WEBSITE<br/>2024 — 2026</span></header>
      <BoardMotion><div className={styles.scene}>
        <img className={styles.sceneImage} src={media('board.webp')} alt="" fetchPriority="high" />
        <div className={styles.board}>
          {!intro && <><PinnedObject name="about" index={0} animateEntrance={entrance}><AboutObject open={open}/></PinnedObject>
          <PinnedObject name="keychain" index={1} animateEntrance={entrance}><KeychainObject/></PinnedObject>
          <PinnedObject name="folder" index={2} animateEntrance={entrance}><FolderObject/></PinnedObject>
          <PinnedObject name="research" index={3} animateEntrance={entrance}><ResearchObject open={open}/></PinnedObject>
          <PinnedObject name="contact" index={4} animateEntrance={entrance}><ContactObject open={open}/></PinnedObject></>}
        </div>
      </div></BoardMotion>
      <footer className={styles.homeFooter}><p><FoldText text="Grounded in human needs," splitBy="char" duration={.5} stagger={.008} hoverRefold refoldAngle={58} refoldRadius={80} creaseShading={.45}/><br/><strong><FoldText text="bringing ideas to life through design." splitBy="char" duration={.5} stagger={.008} hoverRefold refoldAngle={58} refoldRadius={80} creaseShading={.45}/></strong></p><span className={styles.exploreHint}><span className={styles.dot}/> PINNED HERE. OPEN TO EXPLORE.</span><span className={styles.location}>HUNAN, CHINA ↗</span></footer>
    </main>
  </>;
}
