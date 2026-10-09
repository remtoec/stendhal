'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const F=require('../book-format.js'),M=require('../reader-model.js'),SCENES=require('../scenes.js');
const {readingEdition}=require('../scripts/build.js');
const root=path.join(__dirname,'..');
const book=F.parse(fs.readFileSync(path.join(root,'content/book.md'),'utf8'));
const ui=JSON.parse(fs.readFileSync(path.join(root,'content/ui.json'),'utf8'));
const sceneNames=Object.keys(SCENES.scenes);

const sample=`# 一｜欣賞
<!-- id: one | stage: 1 | en: Admiration -->
題詞。

![圖](assets/x.webp)

## 第一節
<!-- id: first | scene: rose | caption: 說明：帶冒號 -->
第一行
接着同一段。

> 紙條內容
> — 署名

::: reveal rose｜打開｜合上
藏着的 **粗體** 與[連結](https://example.org/a_b)。
:::

::: crystals jewels｜再一步
- 所見｜甲
- 推想｜乙
:::

::: note 旁注｜題目
<b>不是標籤</b>
:::

# 關於
<!-- id: about | kind: about -->
- **來源**：說明
`;

test('the Markdown format: chapters, sections, settings and every kind of block',()=>{
  const b=F.parse(sample),[c]=b.chapters,[beat]=c.beats;
  assert.equal(b.chapters.length,1);assert.equal(b.about.title,'關於');
  assert.deepEqual([c.id,c.label,c.title,c.stage,c.en,c.kind],['one','一','欣賞',1,'Admiration','story']);
  assert.deepEqual(c.lead.map(x=>x.type),['p','image']);
  assert.deepEqual([beat.id,beat.scene,beat.caption],['first','rose','說明：帶冒號']);
  assert.deepEqual(beat.blocks.map(x=>x.type),['p','slip','reveal','crystals','note']);
  assert.equal(beat.blocks[0].text,'第一行接着同一段。');
  assert.deepEqual([beat.blocks[1].lines,beat.blocks[1].by],[['紙條內容'],'署名']);
  assert.deepEqual(beat.blocks[2].args,['rose','打開','合上']);
  assert.deepEqual(beat.blocks[3].blocks[0].items,[{label:'所見',text:'甲'},{label:'推想',text:'乙'}]);
  assert.deepEqual(F.problems(b,sceneNames),[]);
});
test('text is escaped; only bold and links are turned into HTML; the scene sits beside what it answers to',()=>{
  const html=F.chapterHTML(F.parse(sample).chapters[0],{scene:()=>'<i>scene</i>'});
  assert.ok(html.includes('&lt;b&gt;不是標籤&lt;/b&gt;'));
  assert.ok(html.includes('<strong>粗體</strong>'));
  assert.ok(html.includes('<a href="https://example.org/a_b" target="_blank" rel="noopener noreferrer">連結</a>'));
  assert.ok(html.indexOf('class="slip"')<html.indexOf('class="scene"')&&html.indexOf('class="scene"')<html.indexOf('data-reveal="rose"'));
});
test('mistakes in the text file are reported in plain words',()=>{
  const bad=F.parse('# 甲\n<!-- id: a | stage: 1 -->\n## 乙\n<!-- id: a | scene: nowhere -->\n::: box x\n:::\n::: reveal\n:::\n## 丙\n# 丁\n<!-- id: Bad Id | stage: 1 -->\n');
  const problems=F.problems(bad,sceneNames).join('\n');
  for(const expected of ['id「a」重複','場景「nowhere」不存在','「::: box」','「::: reveal」後面要有一個名稱','「丙」缺少 id','「Bad Id」','同一個 stage'])assert.ok(problems.includes(expected),expected);
  assert.ok(F.problems(F.parse(''),sceneNames).length);
});
// These checks follow whatever the text file says; they do not pin its wording or its shape.
test('content/book.md is ready to publish: no problems, every picture on disk',()=>{
  assert.deepEqual(F.problems(book,sceneNames),[]);
  for(const b of F.everyBlock(book))if(b.type==='image')assert.ok(fs.existsSync(path.join(root,b.src)),b.src);
});
test('every scene uses known cutouts and atlases stay small',()=>{
  for(const [name,scene] of Object.entries(SCENES.scenes))for(const [key] of scene.items)assert.ok(SCENES.sprites[key]||['cloth','twig'].includes(key),`${name}: ${key}`);
  for(const asset of SCENES.atlasPaths)assert.ok(fs.statSync(path.join(root,asset)).size<350000);
  for(const name of sceneNames)assert.ok(SCENES.render(name).includes('class="sprite'));
});
test('links to any chapter or section resolve; unknown and malformed links open the cover',()=>{
  const places=F.places(book);
  for(const place of places)assert.equal(M.locate('#'+place.id,places),place);
  for(const hash of ['','#','#unknown','#%E0%A4%A'])assert.equal(M.locate(hash,places),places[0]);
});
test('stored position and preferences survive; corrupted data is harmless',()=>{
  const places=F.places(book);
  const first=places[0].id,last=places.at(-1).id;
  assert.equal(M.normalize(null,places).at,first);assert.equal(M.normalize({version:2,at:last},places).at,first);
  assert.deepEqual(M.normalize({version:3,at:last,motion:'reduce',type:'large',extra:'<script>'},places),{version:3,at:last,motion:'reduce',type:'large'});
  assert.deepEqual(M.normalize({version:3,at:'gone',motion:'fast',type:7},places),M.normalize(null,places));
});
test('the no-script edition holds every sentence, unfolded, and runs no script',()=>{
  const html=readingEdition(book,ui);
  for(const b of F.everyBlock(book)){
    for(const text of [b.text,...(b.lines||[]),...(b.items||[]).map(i=>i.text)].filter(Boolean))assert.ok(html.includes(F.inline(text)),text);
  }
  for(const c of book.chapters.slice(1))assert.ok(html.includes(`<section id="${c.id}">`));
  assert.ok(!html.includes('<script')&&!html.includes('<textarea')&&!html.includes('<button'));
  assert.ok(!/<details class="(note|reveal)"(?! open)/.test(html.replace(/ data-reveal="[^"]*"/g,'')));
});
test('interface wording is complete',()=>{
  const used=new Set();
  for(const file of ['reader.js','scripts/build.js'])for(const [,key] of fs.readFileSync(path.join(root,file),'utf8').matchAll(/(?<![\/\w])ui\.(\w+)/g))used.add(key);
  assert.deepEqual([...used].sort(),Object.keys(ui).sort());
});
