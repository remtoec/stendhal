'use strict';
// Link resolution and persisted data are independent of the DOM so their edge
// cases can be checked without a browser.
const READER_MODEL = (() => {
  // Where a link such as #rose points. Unknown or malformed links open the cover.
  function locate(hash,places){
    let id;try{id=decodeURIComponent(String(hash||'').replace(/^#/,''));}catch{id='';}
    return places.find(p=>p.id===id)||places[0];
  }
  function normalize(raw,places){
    const out={version:3,at:places[0].id,motion:'system',type:'regular'};
    if(!raw||typeof raw!=='object'||raw.version!==3)return out;
    if(places.some(p=>p.id===raw.at))out.at=raw.at;
    if(['system','reduce','full'].includes(raw.motion))out.motion=raw.motion;
    if(['regular','large'].includes(raw.type))out.type=raw.type;
    return out;
  }
  return {locate,normalize};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=READER_MODEL;
