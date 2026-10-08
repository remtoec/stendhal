'use strict';
// Navigation and persisted data are independent of the DOM so their edge cases
// can be checked without an animation clock or a storage-enabled browser.
const READER_MODEL = (() => {
  const aliases={'stage-1':'stranger','stage-2':'bouquets','stage-3':'rose','stage-4':'church','stage-5':'letters','stage-6':'signature','stage-7':'silence'};
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
  function indexForHash(hash,pages){
    let id;try{id=decodeURIComponent(String(hash||'').replace(/^#/,''));}catch{return 0;}
    id=aliases[id]||id;
    const i=pages.findIndex(p=>p.id===id);return i<0?0:i;
  }
  function targetIndex(index,delta,length){return clamp(index+delta,0,length-1);}
  function dragProgress(startX,currentX,direction,width){return clamp((startX-currentX)*direction/Math.max(160,width*.55),0,1);}
  function shouldComplete(progress,velocity=0){return progress>=.32||(progress>.08&&velocity>.55);}
  function normalize(raw,pages){
    const defaults={version:2,page:'cover',motion:'system',type:'regular',states:{},choices:[],before:'',after:''};
    if(!raw||typeof raw!=='object'||raw.version!==2)return defaults;
    const out={...defaults};
    if(pages.some(p=>p.id===raw.page))out.page=raw.page;
    if(['system','reduce','full'].includes(raw.motion))out.motion=raw.motion;
    if(['regular','large'].includes(raw.type))out.type=raw.type;
    out.before=typeof raw.before==='string'?raw.before.slice(0,5000):'';
    out.after=typeof raw.after==='string'?raw.after.slice(0,5000):'';
    out.choices=Array.isArray(raw.choices)?[...new Set(raw.choices.filter(x=>['imagination','candor','lasting'].includes(x)))]:[];
    if(raw.states&&typeof raw.states==='object')for(const p of pages){
      const value=raw.states[p.id];if(!value||typeof value!=='object')continue;
      const state={};
      for(const key of ['note','rose','ending','withheld','perspective0','perspective1'])if(typeof value[key]==='boolean')state[key]=value[key];
      if(Number.isInteger(value.crystal))state.crystal=clamp(value.crystal,-1,2);
      out.states[p.id]=state;
    }
    return out;
  }
  function createNavigator(index,length){
    let current=clamp(index,0,length-1),pending=null;
    return {
      get index(){return current;},get busy(){return pending!==null;},
      begin(target){if(pending!==null||!Number.isInteger(target)||target<0||target>=length||target===current)return false;pending=target;return true;},
      commit(){if(pending!==null){current=pending;pending=null;}return current;},
      cancel(){pending=null;return current;},
      replace(target){pending=null;current=clamp(target,0,length-1);return current;}
    };
  }
  return {aliases,indexForHash,targetIndex,dragProgress,shouldComplete,normalize,createNavigator};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=READER_MODEL;
