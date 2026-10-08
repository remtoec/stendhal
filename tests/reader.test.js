'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const BOOK=require('../content.js'),M=require('../reader-model.js'),SCENES=require('../scenes.js');
const build=require('../scripts/build-reading.js');
const root=path.join(__dirname,'..');
test('shared and legacy fragment links resolve to the intended event',()=>{
  for(const [hash,id] of Object.entries(M.aliases))assert.equal(BOOK.pages[M.indexForHash('#'+hash,BOOK.pages)].id,id);
  for(const page of BOOK.pages)assert.equal(BOOK.pages[M.indexForHash('#'+page.id,BOOK.pages)].id,page.id);
  assert.equal(M.indexForHash('#%E0%A4%A',BOOK.pages),0);assert.equal(M.indexForHash('#unknown',BOOK.pages),0);
});
test('a turn locks navigation; cancel and commit never skip or duplicate a page',()=>{
  const nav=M.createNavigator(0,25);assert.equal(nav.begin(-1),false);assert.equal(nav.begin(25),false);
  assert.equal(nav.begin(1),true);assert.equal(nav.index,0);assert.equal(nav.begin(2),false);
  assert.equal(nav.cancel(),0);assert.equal(nav.busy,false);
  assert.equal(nav.begin(24),true);assert.equal(nav.commit(),24);assert.equal(nav.commit(),24);
  assert.equal(nav.begin(24),false);assert.equal(nav.begin(23),true);assert.equal(nav.commit(),23);
  assert.equal(nav.begin(22),true);assert.equal(nav.replace(4),4);assert.equal(nav.busy,false);
});
test('dragging in either direction can commit, return or cancel at the page boundary',()=>{
  assert.equal(M.dragProgress(400,100,1,600),M.dragProgress(100,400,-1,600));
  assert.equal(M.dragProgress(400,450,1,600),0);assert.equal(M.dragProgress(400,-400,1,600),1);
  assert.equal(M.shouldComplete(.15,0),false);assert.equal(M.shouldComplete(.33,0),true);
  assert.equal(M.shouldComplete(.12,.7),true);assert.equal(M.shouldComplete(.02,2),false);
  assert.equal(M.targetIndex(0,-1,25),0);assert.equal(M.targetIndex(24,1,25),24);
});
test('stored preferences and notes survive; corrupted data is bounded and harmless',()=>{
  assert.equal(M.normalize(null,BOOK.pages).page,'cover');assert.equal(M.normalize({version:1},BOOK.pages).motion,'system');
  const data=M.normalize({version:2,page:'rose',motion:'reduce',type:'large',before:'<script>plain text</script>',after:'x'.repeat(6000),choices:['candor','candor','bad'],states:{rose:{rose:true,note:true},jewels:{crystal:80},ending:{ending:'wrong'},unknown:{note:true}}},BOOK.pages);
  assert.equal(data.page,'rose');assert.equal(data.motion,'reduce');assert.equal(data.type,'large');
  assert.equal(data.before,'<script>plain text</script>');assert.equal(data.after.length,5000);
  assert.deepEqual(data.choices,['candor']);assert.equal(data.states.rose.rose,true);assert.equal(data.states.jewels.crystal,2);
  assert.equal(data.states.ending.ending,undefined);assert.equal(data.states.unknown,undefined);
});
test('every bookmark, scene, source link and image has a valid target',()=>{
  assert.equal(new Set(BOOK.pages.map(p=>p.id)).size,BOOK.pages.length);
  for(const p of BOOK.pages){assert.ok(SCENES.scenes[p.scene],p.id);assert.ok(fs.existsSync(path.join(root,'assets',p.art+'.webp')),p.id);assert.ok(p.paragraphs.length);if(p.note?.source)assert.ok(BOOK.sources[p.note.source]);}
  for(const s of BOOK.stages)assert.ok(BOOK.pages.some(p=>p.id===s.page));
  for(const s of Object.values(SCENES.scenes))for(const item of s.items)assert.ok(SCENES.sprites[item[0]]);
  for(const asset of SCENES.atlasPaths)assert.ok(fs.statSync(path.join(root,asset)).size<350000);
});
test('no-script edition contains every paragraph, reveal, perspective and crystal explanation',()=>{
  const html=build();assert.equal(fs.readFileSync(path.join(root,'read.html'),'utf8'),html,'Run node scripts/build-reading.js after editing content');
  for(const p of BOOK.pages){assert.ok(html.includes(`id="${p.id}"`));for(const text of [...p.paragraphs,...(p.reveal||[]),...(p.perspectives||[]).map(q=>q.text),...(p.crystals||[]).map(q=>q.detail)])assert.ok(html.includes(text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')),p.id);}
  assert.ok(!html.includes('<script'));
});
test('the entry page pins CSS and scripts to their content digest to avoid mixed deploys',()=>{
  const {createHash}=require('node:crypto');const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
  for(const file of ['style.css','content.js','scenes.js','reader-model.js','story.js']){
    const digest=createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);
    assert.ok(index.includes(file+'?v='+digest),'Run node scripts/build-site.js after editing '+file);
  }
});
