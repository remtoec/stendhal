'use strict';
// Assembles the publishable site in _site/: the reader, the content, and read.html
// (the whole text for browsers without JavaScript). Nothing generated is kept in git.
//   node scripts/build.js
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const F=require('../book-format.js');
const SCENES=require('../scenes.js');
const root=path.join(__dirname,'..'),out=path.join(root,'_site');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const COPY=['content','assets','favicon.svg','.nojekyll','style.css','book-format.js','scenes.js','reader-model.js','reader.js','preview.html'];

function readingEdition(book,ui){
  const [cover,...chapters]=book.chapters,esc=F.esc;
  const name=c=>esc(c.label?`${c.label}｜${c.title}`:c.title);
  const fonts=(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/.exec(read('index.html'))||[''])[0];
  return `<!doctype html>
<html lang="zh-Hant">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(cover.title)}｜${esc(ui.editionTitle)}</title><link rel="icon" href="favicon.svg" type="image/svg+xml">${fonts}<link rel="stylesheet" href="style.css"></head>
<body class="reading-edition">
<header class="edition-head"><a href="index.html">← ${esc(ui.editionBack)}</a><h1>${esc(cover.title)}</h1><p>${esc(ui.editionLead)}</p>${F.blocksHTML(cover.lead,{static:true})}
<nav aria-label="${esc(ui.editionContents)}"><details><summary>${esc(ui.editionContents)}</summary><ol>${chapters.map(c=>`<li><a href="#${c.id}">${name(c)}</a></li>`).join('')}</ol></details></nav></header>
<main>
${chapters.map(c=>`<section id="${c.id}">${F.chapterHTML(c,{static:true})}<p class="edition-return"><a href="index.html#${c.id}">${esc(ui.editionReturn)} ↗</a></p></section>`).join('\n')}
</main>
${book.about?`<footer id="about"><h2>${esc(book.about.title)}</h2>${F.blocksHTML(book.about.lead,{static:true})}</footer>`:''}
</body>
</html>
`;
}

function build(){
  const book=F.parse(read('content/book.md')),ui=JSON.parse(read('content/ui.json'));
  const problems=F.problems(book,Object.keys(SCENES.scenes));
  if(problems.length){console.error('content/book.md：\n- '+problems.join('\n- '));process.exit(1);}
  fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out);
  for(const item of COPY)fs.cpSync(path.join(root,item),path.join(out,item),{recursive:true});
  // Pin the stylesheet and scripts to their content hash, so a deploy never mixes old and new files.
  const version=file=>createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);
  const pin=html=>html.replace(/(href|src)="(style\.css|[\w-]+\.js)"/g,(_,attribute,file)=>`${attribute}="${file}?v=${version(file)}"`);
  fs.writeFileSync(path.join(out,'index.html'),pin(read('index.html')));
  fs.writeFileSync(path.join(out,'read.html'),pin(readingEdition(book,ui)));
  console.log(`_site/ ready: ${book.chapters.length} chapters, ${F.places(book).length-book.chapters.length} sections.`);
}
if(require.main===module)build();
module.exports={build,readingEdition};
