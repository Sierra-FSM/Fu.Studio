import {describe,it,expect} from 'vitest';
import {fitPageScale} from '../src/pdfGeometry';
describe('PDF complete-page fitting',()=>{
  it.each([
    [{width:1039,height:842},{width:1282,height:785}],
    [{width:1039,height:842},{width:300,height:737}],
    [{width:595,height:842},{width:1100,height:600}],
    [{width:1600,height:800},{width:550,height:280}],
  ])('fits all four edges and uses the largest available scale', (page,host)=>{
    const s=fitPageScale(page,host);
    expect(page.width*s).toBeLessThanOrEqual(host.width-24+.001);
    expect(page.height*s).toBeLessThanOrEqual(host.height-24+.001);
    expect(Math.min(host.width-24-page.width*s,host.height-24-page.height*s)).toBeCloseTo(0);
  });
  it('grows when the phone thumbnail sidebar closes',()=>{
    const page={width:1039,height:842};
    expect(fitPageScale(page,{width:380,height:737})).toBeGreaterThan(fitPageScale(page,{width:300,height:737}));
  });
});
