'use strict';
// Three transparent 3×2 atlases and standalone cutouts fold around their own bases.
// A recipe item is [sprite, x%, y%, width%, z, condition?]. Conditions tie a cutout
// to an interactive block in content/book.md that sits in the same section:
//   {when:'ending'}   shown only while «::: reveal ending» is open
//   {unless:'rose'}   hidden while «::: reveal rose» is open
//   {step:2}          shown once «::: crystals» has reached its second inference
//   {flip:1}          mirrored left↔right without changing the fold-up transform
const PAPER_SCENES = (() => {
  const sprites = {
    mountain:['scenery',0], castle:['scenery',1], oak:['scenery',2],
    chapel:['scenery',3], window:['scenery',4], bed:['scenery',5],
    ernestine:['characters',0], philippe:['characters',1], kneeling:['characters',2],
    general:['characters',3], stendhal:['characters',4], singer:['characters',5],
    rose:['objects',0], bouquet:['objects',1], letter:['objects',2],
    prayer:['objects',3], jewels:['objects',5],
    hunter:'philippe-hunter', peasant:'philippe-disguise', seated:'philippe-seated', spyglass:'philippe-spyglass',
    madame:'madame-dayssin', count:'old-count', storyteller:'storyteller',
    'black-roses':'black-spotted-roses', piano:'piano-note', boat:'rowing-boat', fireplace:'burning-letter', mirror:'dressing-mirror', twig:'bare-twig',
    'crystal-a':'crystal-a', 'crystal-b':'crystal-b', 'crystal-c':'crystal-c'
  };
  for(const key in sprites)if(typeof sprites[key]==='string')sprites[key]=`assets/paper/cutouts/${sprites[key]}.webp`;
  const landscape=[['mountain',4,28,69,3],['castle',3,21,39,4],['oak',54,10,44,5]];
  const couple=[['ernestine',13,1,38,7],['philippe',54,7,34,6]];
  const room=[['window',9,19,53,3],['bed',43,6,51,4]];
  const thinkers=[['stendhal',6,3,46,6],['singer',50,3,45,7]];
  // Stendhal's image: a bare paper twig left in the salt mine, and the crystals that grow over it.
  // Each crystal is [shape, x%, y%, width%, z, the step at which it appears].
  const twig=['twig',19,4,62,5];
  const crust=[['a',31.3,53.9,20,7,1],['b',58.6,37.7,20,7,1],['c',29.5,18.4,20,7,2],['a',42.7,60.7,17,7,2],['c',60.1,23.6,17,6,2],['b',34.8,34.2,28,9,3],['c',24.1,57.4,17,6,3],['a',44.2,22.3,24,8,3]];
  const scenes={
    cover:{lake:true,items:[...landscape,['ernestine',13,1,38,7],['hunter',54,6,36,6]]},
    rain:{floor:true,rain:true,items:[['mountain',44,34,46,2],['window',10,13,62,4],['storyteller',38,0,50,7]]},
    castle:{lake:true,items:[['mountain',2,30,74,3],['castle',16,15,58,5],['oak',62,6,36,6],['ernestine',4,0,27,7],['count',22,0,25,7]]},
    lake:{lake:true,items:[...landscape,...couple]},
    attic:{floor:true,items:[['mountain',47,33,42,2],['window',5,12,64,4],['ernestine',26,1,43,7]]},
    window:{floor:true,items:[['mountain',47,33,42,2],['window',5,12,64,4],['ernestine',26,1,43,7],['letter',63,3,27,8]]},
    hollow:{lake:true,items:[['castle',4,23,41,3],['oak',46,15,46,4],['ernestine',22,3,46,6],['bouquet',7,0,31,8],['letter',60,0,33,8]]},
    rose:{floor:true,items:[['window',5,24,47,3],['ernestine',57,12,32,4],['rose',13,1,66,7],['cloth',13,1,66,9,{unless:'rose'}]]},
    church:{floor:true,items:[['chapel',18,14,68,3],['ernestine',9,0,38,6],['philippe',58,1,34,5],['prayer',43,0,20,8]]},
    empty:{lake:true,items:[['mountain',0,34,59,3],['oak',38,8,60,4],['ernestine',10,0,40,6]]},
    crystals:{floor:true,items:[['mirror',-5,9,45,3],['philippe',41,6,50,5],['ernestine',2,4,42,6],['jewels',18,0,25,8],['crystal-a',33,21,25,7,{step:1}],['crystal-b',67,44,22,7,{step:2}],['crystal-c',75,0,25,7,{step:3}]]},
    letter:{lake:true,items:[['oak',46,20,44,3],['ernestine',5,7,44,5],['letter',27,0,65,7]]},
    waiting:{lake:true,items:[['mountain',0,33,69,3],['oak',46,12,51,5],['seated',66,11,17,6],['boat',3,3,42,7]]},
    hall:{floor:true,items:[['window',3,19,61,3],['ernestine',9,0,46,6],['philippe',51,2,44,5],['bouquet',43,4,16,7]]},
    withheld:{lake:true,items:[['mountain',1,33,61,3],['oak',42,9,54,4],['philippe',3,0,44,6],['bouquet',57,14,23,7,{unless:'withheld'}]]},
    watching:{lake:true,items:[['castle',0,24,38,3],['oak',30,12,46,4],['ernestine',6,2,36,6,{flip:1}],['bouquet',9,26,14,7],['spyglass',52,0,48,8]]},
    proposal:{floor:true,items:[...room,['ernestine',6,0,49,7],['kneeling',42,0,45,8]]},
    doorway:{floor:true,items:[...room,['ernestine',6,0,49,7],['philippe',55,5,39,3]]},
    parting:{lake:true,items:[['mountain',8,29,72,3],['castle',2,22,33,4],['ernestine',1,1,36,6],['seated',66,2,23,7]]},
    ending:{lake:true,items:[['castle',34,31,34,3],['ernestine',12,1,44,6],['philippe',59,1,42,7,{unless:'ending'}],['general',51,1,44,7,{when:'ending'}]]},
    thrown:{lake:true,items:[['mountain',0,33,69,3],['oak',46,12,51,5],['hunter',58,6,30,6],['count',20,0,29,7],['ernestine',1,0,33,8]]},
    'black-roses':{lake:true,items:[['mountain',0,34,59,3],['oak',38,8,60,4],['ernestine',10,0,40,6],['black-roses',60,0,30,8]]},
    fire:{floor:true,items:[['fireplace',36,4,60,4],['ernestine',4,0,44,7]]},
    piano:{floor:true,items:[['window',4,20,50,3],['piano',52,3,42,6],['ernestine',8,0,42,7]]},
    banquet:{floor:true,items:[['window',20,19,58,3],['peasant',33,3,38,5],['count',64,0,36,6],['ernestine',2,0,40,7]]},
    rival:{lake:true,items:[['mountain',6,30,70,3],['castle',2,22,34,4],['ernestine',4,2,28,5],['madame',50,0,46,7]]},
    twig:{items:[twig,...crust.map(([shape,x,y,w,z,step])=>['crystal-'+shape,x,y,w,z,{step}])]},
    'twig-full':{items:[twig,...crust.map(([shape,x,y,w,z])=>['crystal-'+shape,x,y,w,z,{unless:'through'}]),...crust.map(([shape,x,y,w,z])=>['crystal-'+shape,x,y,w,z,{when:'through'}])]},
    discussion:{floor:true,items:[...thinkers,['rose',37,2,25,8]]},
    'discussion-crystal':{floor:true,items:[...thinkers,['crystal-b',34,21,34,8]]},
    'discussion-flower':{floor:true,items:[...thinkers,['bouquet',37,2,27,8]]},
    'discussion-home':{floor:true,items:[['castle',34,37,31,3],...thinkers,['letter',36,0,29,8]]}
  };
  function render(name){
    const recipe=scenes[name];if(!recipe)return '';
    let html='<div class="paper-ground"></div>';
    if(recipe.lake)html+='<div class="lake"></div>';
    if(recipe.floor)html+='<div class="paper-floor"></div>';
    recipe.items.forEach(([key,x,y,w,z,condition={}],i)=>{
      const sprite=sprites[key],[atlas,cell]=Array.isArray(sprite)?sprite:[],cutout=typeof sprite==='string';
      const data=Object.entries(condition).map(([k,v])=>` data-${k}="${v}"`).join('');
      html+=`<div class="sprite ${atlas?'at-'+cell:cutout?'cutout':key}"${atlas?` data-atlas="${atlas}"`:''} data-sprite="${key}"${data} style="--x:${x}%;--y:${y}%;--w:${w}%;--z:${z};--i:${i}${cutout?`;background-image:url(${sprite})`:''}"></div>`;
    });
    if(recipe.rain)html+='<div class="rain"></div>';
    return html;
  }
  return {sprites,scenes,render,cutoutPaths:Object.values(sprites).filter(s=>typeof s==='string'),atlasPaths:['scenery','characters','objects'].map(n=>`assets/paper/${n}.webp`)};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=PAPER_SCENES;
