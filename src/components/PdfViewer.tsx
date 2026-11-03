import { useEffect,useLayoutEffect,useRef,useState,type KeyboardEvent } from 'react';
import { getDocument,GlobalWorkerOptions,type PDFDocumentProxy,type PDFPageProxy,type RenderTask } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import styles from '../styles/PdfViewer.module.css';
import { fitPageScale } from '../pdfGeometry';
import { readingPage,anchoredScroll } from '../pdfScroll';
GlobalWorkerOptions.workerSrc=workerUrl;

function PageCanvas({page,scale,label}:{page:PDFPageProxy;scale:number;label:string}){
  const ref=useRef<HTMLCanvasElement>(null);const task=useRef<RenderTask|null>(null);const [error,setError]=useState(false);
  const viewport=page.getViewport({scale});
  useEffect(()=>{
    let disposed=false;const previous=task.current;previous?.cancel();setError(false);
    async function render(){
      await previous?.promise.catch(()=>{});if(disposed||!ref.current)return;
      const canvas=ref.current;const v=page.getViewport({scale});
      const pixels=Math.min(window.devicePixelRatio||1,2,8192/v.width,8192/v.height,Math.sqrt(12000000/(v.width*v.height)));
      canvas.width=Math.ceil(v.width*pixels);canvas.height=Math.ceil(v.height*pixels);
      // Cover the rounded bitmap bounds, including the last row and column.
      const current=page.render({canvas,viewport:v,transform:[canvas.width/v.width,0,0,canvas.height/v.height,0,0]});task.current=current;
      try{await current.promise;}catch(e){if(!disposed&&(e as Error).name!=='RenderingCancelledException')setError(true);}
    }
    void render();return()=>{disposed=true;task.current?.cancel();};
  },[page,scale]);
  return error?<p>Unable to render this page. Please open the PDF separately.</p>:<canvas ref={ref} className={styles.canvas} style={{width:viewport.width,height:viewport.height}} role="img" aria-label={label}/>;
}
function Thumbnail({doc,number,selected,choose}:{doc:PDFDocumentProxy;number:number;selected:boolean;choose:()=>void}){
  const ref=useRef<HTMLButtonElement>(null);const [visible,setVisible]=useState(false);const [page,setPage]=useState<PDFPageProxy|null>(null);
  useEffect(()=>{const el=ref.current;if(!el)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect();}},{rootMargin:'180px'});observer.observe(el);return()=>observer.disconnect();},[]);
  useEffect(()=>{if(!visible)return;let disposed=false;void doc.getPage(number).then(p=>{if(!disposed)setPage(p);}).catch(()=>{});return()=>{disposed=true;};},[doc,number,visible]);
  return <button ref={ref} className={styles.thumbnail} onClick={choose} aria-label={`Go to page ${number}`} aria-current={selected?'page':undefined}>
    <div>{page?<PageCanvas page={page} scale={92/page.getViewport({scale:1}).width} label={`Page ${number} thumbnail`}/>:<span className={styles.placeholder}/>}</div><span>{number}</span>
  </button>;
}
type PageInfo={width:number;height:number};
function ScrollPage({doc,number,scale,info,root,title}:{doc:PDFDocumentProxy;number:number;scale:number;info:PageInfo;root:HTMLDivElement|null;title:string}){
  const ref=useRef<HTMLElement>(null);const [near,setNear]=useState(false);const [page,setPage]=useState<PDFPageProxy|null>(null);const [failed,setFailed]=useState(false);
  useEffect(()=>{if(!root||!ref.current)return;const observer=new IntersectionObserver(entries=>setNear(entries.some(e=>e.isIntersecting)),{root,rootMargin:'900px 0px'});observer.observe(ref.current);return()=>observer.disconnect();},[root]);
  useEffect(()=>{if(!near){setPage(null);return;}let disposed=false;setFailed(false);void doc.getPage(number).then(p=>{if(!disposed)setPage(p);}).catch(()=>{if(!disposed)setFailed(true);});return()=>{disposed=true;};},[doc,number,near]);
  return <section ref={ref} data-pdf-page={number} className={styles.scrollPage} style={{width:info.width*scale,height:info.height*scale}} aria-label={`Page ${number}`}>
    {page?<PageCanvas page={page} scale={scale} label={`${title}, page ${number} of ${doc.numPages}`}/>:<p className={styles.pagePlaceholder}>{failed?'Unable to render this page. Open the PDF separately.':`Page ${number}`}</p>}
  </section>;
}
export default function PdfViewer({url,title}:{url:string;title:string}){
  const [doc,setDoc]=useState<PDFDocumentProxy|null>(null);const [error,setError]=useState('');const [number,setNumber]=useState(1);
  const [pages,setPages]=useState<PageInfo[]>([]);const [sidebar,setSidebar]=useState(true);const [zoom,setZoom]=useState(1);
  const host=useRef<HTMLDivElement>(null);const [size,setSize]=useState({width:0,height:0});
  const anchor=useRef({number:1,fraction:0});const jumping=useRef<number|null>(null);
  useEffect(()=>{
    let disposed=false;const base=import.meta.env.BASE_URL+'pdfjs/';
    const loading=getDocument({url,cMapUrl:base+'cmaps/',cMapPacked:true,standardFontDataUrl:base+'standard_fonts/',wasmUrl:base+'wasm/'});
    void loading.promise.then(async pdf=>{
      if(disposed)return;setDoc(pdf);const dimensions:PageInfo[]=[];
      // Metadata only: canvas rendering is limited to pages near the viewport.
      for(let n=1;n<=pdf.numPages;n++){const page=await pdf.getPage(n);if(disposed)return;const v=page.getViewport({scale:1});dimensions.push({width:v.width,height:v.height});}
      if(!disposed)setPages(dimensions);
    }).catch(()=>{if(!disposed)setError('The PDF could not be loaded. Please open it separately.');});
    return()=>{disposed=true;void loading.destroy();};
  },[url]);
  useEffect(()=>{const el=host.current;if(!el)return;const measure=()=>setSize({width:el.clientWidth,height:el.clientHeight});measure();const observer=new ResizeObserver(measure);observer.observe(el);return()=>observer.disconnect();},[]);
  const scales=pages.map(p=>Math.max(.001,fitPageScale(p,size))*zoom);
  const scale=scales[number-1]||1;
  function pageElements(){return Array.from(host.current?.querySelectorAll<HTMLElement>('[data-pdf-page]')||[]);}
  function updateReading(){
    const el=host.current;if(!el||!pages.length)return;const boxes=pageElements().map(p=>({top:p.offsetTop,height:p.offsetHeight}));
    const n=readingPage(boxes,el.scrollTop,el.clientHeight);setNumber(n);
    const p=boxes[n-1];if(p)anchor.current={number:n,fraction:(el.scrollTop-p.top)/p.height};
  }
  function goTo(n:number){
    const target=Math.max(1,Math.min(pages.length,n));const el=pageElements()[target-1];if(!el||!host.current)return;
    host.current.scrollTo({top:Math.max(0,el.offsetTop-12),behavior:'instant'});setNumber(target);anchor.current={number:target,fraction:0};
  }
  useLayoutEffect(()=>{
    if(!pages.length||!host.current)return;
    const n=jumping.current||anchor.current.number;const el=pageElements()[n-1];if(!el)return;
    host.current.scrollTop=Math.max(0,jumping.current?el.offsetTop-12:anchoredScroll({top:el.offsetTop,height:el.offsetHeight},anchor.current.fraction));
    jumping.current=null;
  },[size.width,size.height,zoom,pages]);
  function fitCurrent(){jumping.current=number;if(zoom===1){goTo(number);jumping.current=null;}else setZoom(1);}
  function keys(e:KeyboardEvent){if((e.target as HTMLElement).closest('input,select'))return;if(e.key==='ArrowRight'){e.preventDefault();goTo(number+1);}if(e.key==='ArrowLeft'){e.preventDefault();goTo(number-1);}}
  return <div className={styles.viewer} onKeyDown={keys}>
    <div className={styles.toolbar}>
      <button onClick={()=>setSidebar(v=>!v)} aria-label={sidebar?'Hide page previews':'Show page previews'} aria-expanded={sidebar} title="Toggle page previews">☰</button>
      <div className={styles.pager}><button onClick={()=>goTo(number-1)} disabled={!pages.length||number===1} aria-label="Previous PDF page">‹</button><label><span className="sr-only">PDF page</span><input type="number" min="1" max={doc?.numPages||1} value={number} onChange={e=>{const n=Number(e.target.value);if(Number.isInteger(n)&&n>=1&&n<=pages.length)goTo(n);}}/></label><span>/ {doc?.numPages||'—'}</span><button onClick={()=>goTo(number+1)} disabled={!pages.length||number===doc?.numPages} aria-label="Next PDF page">›</button></div>
      <div className={styles.zoom}><button onClick={()=>setZoom(v=>Math.max(.25,v/1.2))} aria-label="Zoom out PDF">−</button><span>{Math.round(scale*100)}%</span><button onClick={()=>setZoom(v=>Math.min(6,v*1.2))} aria-label="Zoom in PDF">+</button><button onClick={fitCurrent} className={styles.fit} aria-label="Fit complete PDF page">Fit page</button></div>
    </div>
    <div className={styles.body}>
      {sidebar&&<aside className={styles.sidebar} aria-label="PDF page previews">{doc&&Array.from({length:doc.numPages},(_,i)=><Thumbnail key={i} doc={doc} number={i+1} selected={number===i+1} choose={()=>goTo(i+1)}/>)}</aside>}
      <div ref={host} className={styles.pageHost} onScroll={updateReading} tabIndex={0} aria-label={`${title} PDF pages`}>
        {error?<p className={styles.message} role="alert">{error} <a href={url} target="_blank" rel="noopener noreferrer">Open PDF ↗</a></p>:doc&&pages.length&&size.width>0?<div className={styles.pageStack} style={{minWidth:Math.max(size.width,...pages.map((p,i)=>p.width*scales[i]+24)),paddingBottom:Math.max(12,size.height-pages[pages.length-1].height*scales[scales.length-1]-12)}}>{pages.map((p,i)=><ScrollPage key={i} doc={doc} number={i+1} scale={scales[i]} info={p} root={host.current} title={title}/>)}</div>:<p className={styles.message} role="status">Loading PDF…</p>}
      </div>
    </div>
  </div>;
}
