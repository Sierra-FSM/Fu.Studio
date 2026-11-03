/** Largest uniform scale fitting both dimensions, including the reader's safe margin. */
export function fitPageScale(page:{width:number;height:number},host:{width:number;height:number},padding=12){
  if(page.width<=0||page.height<=0||host.width<=padding*2||host.height<=padding*2)return 0;
  return Math.min((host.width-padding*2)/page.width,(host.height-padding*2)/page.height);
}
