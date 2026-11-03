import { describe,it,expect } from 'vitest';
import { overlayReducer } from '../src/state';
describe('overlay interactions',()=>{
  it('research cycles 01 → 02 → 03 → 01',()=>{
    let state=overlayReducer({kind:'none'},{type:'open',overlay:{kind:'research',slide:0}});
    for(const expected of [1,2,0]){state=overlayReducer(state,{type:'nextResearch'});expect(state).toEqual({kind:'research',slide:expected});}
  });
  it('nextResearch cannot affect a contact or PDF dialog',()=>{
    expect(overlayReducer({kind:'contact'},{type:'nextResearch'})).toEqual({kind:'contact'});
    expect(overlayReducer({kind:'pdf',id:'g-spine'},{type:'nextResearch'})).toEqual({kind:'pdf',id:'g-spine'});
  });
  it('closing removes the active dialog; opening research resets to 01',()=>{
    const closed=overlayReducer({kind:'research',slide:2},{type:'close'});
    expect(closed).toEqual({kind:'none'});
    expect(overlayReducer(closed,{type:'open',overlay:{kind:'research',slide:0}})).toEqual({kind:'research',slide:0});
  });
});
