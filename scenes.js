'use strict';
// Three transparent 3×2 atlases. Each paper cutout folds around its own base.
const PAPER_SCENES = (() => {
  const sprites = {
    mountain:['scenery',0], castle:['scenery',1], oak:['scenery',2],
    chapel:['scenery',3], window:['scenery',4], bed:['scenery',5],
    ernestine:['characters',0], philippe:['characters',1], kneeling:['characters',2],
    general:['characters',3], stendhal:['characters',4], singer:['characters',5],
    rose:['objects',0], bouquet:['objects',1], letter:['objects',2],
    prayer:['objects',3], crystal:['objects',4], jewels:['objects',5]
  };
  const landscape=[['mountain',4,28,69,3],['castle',3,21,39,4],['oak',54,10,44,5]];
  const couple=[['ernestine',13,1,38,7],['philippe',54,7,34,6]];
  const room=[['window',9,19,53,3],['bed',43,6,51,4]];
  const thinkers=[['stendhal',6,3,46,6],['singer',50,3,45,7]];
  const scenes={
    cover:{lake:true,items:[...landscape,...couple,['bouquet',40,5,17,8]]},
    lake:{lake:true,items:[...landscape,...couple]},
    window:{floor:true,items:[['mountain',47,33,42,2],['window',5,12,64,4],['ernestine',26,1,43,7],['letter',63,3,27,8]]},
    rose:{floor:true,items:[['window',5,24,47,3],['ernestine',57,12,32,4],['rose',13,1,66,7]]},
    church:{floor:true,items:[['chapel',18,14,68,3],['ernestine',9,0,38,6],['philippe',58,1,34,5],['prayer',43,0,20,8]]},
    empty:{lake:true,items:[['mountain',0,34,59,3],['oak',38,8,60,4],['ernestine',10,0,40,6]]},
    letters:{lake:true,items:[['castle',4,23,41,3],['oak',46,15,46,4],['ernestine',22,3,46,6],['bouquet',7,0,31,8],['letter',60,0,33,8]]},
    crystals:{floor:true,crystals:true,items:[['window',5,28,37,3],['philippe',41,6,50,5],['ernestine',0,4,42,6],['jewels',16,0,25,8],['crystal',33,21,25,7,'crystal-0'],['crystal',67,44,22,7,'crystal-1'],['crystal',75,0,25,7,'crystal-2']]},
    letter:{lake:true,items:[['oak',46,20,44,3],['ernestine',5,7,44,5],['letter',27,0,65,7]]},
    waiting:{lake:true,items:[['mountain',0,33,69,3],['oak',46,12,51,5],['philippe',55,5,31,6],['ernestine',1,0,33,7]]},
    hall:{floor:true,items:[['window',3,19,61,3],['ernestine',9,0,46,6],['philippe',51,2,44,5],['bouquet',43,4,16,7]]},
    withheld:{lake:true,items:[['mountain',1,33,61,3],['oak',42,9,54,4],['philippe',3,0,44,6],['bouquet',57,14,23,7,'withheld-bouquet']]},
    watching:{lake:true,items:[['castle',0,24,38,3],['oak',51,11,44,5],['philippe',58,7,33,4],['ernestine',3,1,43,7],['bouquet',25,6,24,8]]},
    proposal:{floor:true,items:[...room,['ernestine',6,0,49,7],['kneeling',42,0,45,8]]},
    doorway:{floor:true,items:[...room,['ernestine',6,0,49,7],['philippe',55,5,39,3]]},
    parting:{lake:true,items:[['mountain',8,29,72,3],['castle',2,22,33,4],['ernestine',1,1,36,6],['philippe',64,0,36,7]]},
    ending:{lake:true,items:[['castle',34,31,34,3],['ernestine',12,1,44,6],['philippe',59,1,42,7,'ending-philippe'],['general',51,1,44,7,'ending-general']]},
    discussion:{floor:true,items:[...thinkers,['rose',37,2,25,8]]},
    'discussion-crystal':{floor:true,crystals:true,items:[...thinkers,['crystal',34,21,34,8]]},
    'discussion-flower':{floor:true,items:[...thinkers,['bouquet',37,2,27,8]]},
    'discussion-home':{floor:true,items:[['castle',34,37,31,3],...thinkers,['letter',36,0,29,8]]}
  };
  function render(name){
    const recipe=scenes[name]||scenes.cover;
    let html='<div class="paper-ground"></div>';
    if(recipe.lake)html+='<div class="lake"></div>';
    if(recipe.floor)html+='<div class="paper-floor"></div>';
    for(const [key,x,y,w,z,tag] of recipe.items){
      const [atlas,cell]=sprites[key];
      html+=`<div class="sprite at-${cell}${key==='crystal'?' paper-crystal':''}" data-atlas="${atlas}" data-sprite="${tag||key}" style="--x:${x}%;--y:${y}%;--w:${w}%;--z:${z}"></div>`;
    }
    if(name==='rose')html+='<div class="sprite cloth" style="--x:13%;--y:1%;--w:66%"></div>';
    return html+'<div class="ribbon"></div>';
  }
  return {sprites,scenes,render,atlasPaths:['scenery','characters','objects'].map(n=>`assets/paper/${n}.webp`)};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=PAPER_SCENES;
