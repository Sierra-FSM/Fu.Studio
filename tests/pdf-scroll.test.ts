import {describe,it,expect} from 'vitest';
import {readingPage,anchoredScroll} from '../src/pdfScroll';
describe('continuous PDF reading',()=>{
  const pages=[{top:12,height:760},{top:792,height:500},{top:1312,height:760}];
  it('updates current page while scrolling down and back up',()=>{
    expect([0,800,1400,800,0].map(top=>readingPage(pages,top,785))).toEqual([1,2,3,2,1]);
  });
  it('keeps the first page current on a tall phone showing several small pages',()=>{
    expect(readingPage([{top:12,height:224},{top:256,height:224},{top:500,height:224}],0,737)).toBe(1);
  });
  it('handles mixed page heights and the final page',()=>{
    expect(readingPage(pages,1000,785)).toBe(2);
    expect(readingPage(pages,2100,785)).toBe(3);
  });
  it('retains the same relative reading point after resizing or zooming',()=>{
    expect(anchoredScroll({top:800,height:1500},.4)).toBe(1400);
  });
});
