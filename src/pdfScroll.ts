export type PageBox={top:number;height:number};
/** Reading marker stays near the top, even on a phone showing several fitted pages. */
export function readingPage(pages:PageBox[],scrollTop:number,viewportHeight:number){
  const index=pages.findIndex(p=>p.top+p.height>scrollTop+Math.min(120,p.height*.5,viewportHeight*.25));
  return index<0?Math.max(1,pages.length):index+1;
}
export function anchoredScroll(page:PageBox,fraction:number){return page.top+Math.max(-1,Math.min(1,fraction))*page.height;}
