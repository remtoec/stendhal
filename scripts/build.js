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
const COPY=['content','assets','favicon.svg','.nojekyll','style.css','book-format.js','scenes.js','reader-model.js','reader.js','preview.html','analytics.html','analytics.css','analytics.js'];

function webAnalytics(){
  const token=(process.env.CF_WEB_ANALYTICS_TOKEN||'').trim();
  if(!token)return null;
  if(!/^[A-Za-z0-9_-]+$/.test(token))throw new Error('CF_WEB_ANALYTICS_TOKEN contains unexpected characters.');
  return {
    tag:`<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${JSON.stringify({token})}'></script>`,
    privacy:'<p>網站使用不設 Cookie 的匿名流量統計，只記錄整體瀏覽量、來源和效能資料，不會識別個別讀者。</p>'
  };
}

function addAnalytics(html,analytics,{privacy=false}={}){
  if(!analytics)return html;
  let result=html;
  if(privacy){
    const marker='<div class="privacy-note"><p>閱讀位置與設定只儲存在這個瀏覽器，不會傳送給網站作者。</p></div>';
    const replacement='<div class="privacy-note"><p>閱讀位置與設定只儲存在這個瀏覽器，不會傳送給網站作者。</p>'+analytics.privacy+'</div>';
    if(!result.includes(marker))throw new Error('Analytics privacy marker not found in index.html.');
    result=result.replace(marker,replacement);
  }
  if(!result.includes('</body>'))throw new Error('Cannot add Web Analytics: </body> not found.');
  return result.replace('</body>',`${analytics.tag}\n</body>`);
}

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
${chapters.map(c=>`<section id="${c.id}">${F.chapterHTML(c,{static:true,book})}<p class="edition-return"><a href="index.html#${c.id}">${esc(ui.editionReturn)} ↗</a></p></section>`).join('\n')}
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
  const analytics=webAnalytics();
  fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out);
  for(const item of COPY)fs.cpSync(path.join(root,item),path.join(out,item),{recursive:true,filter:source=>path.extname(source).toLowerCase()!=='.png'});
  // Pin the stylesheet and scripts to their content hash, so a deploy never mixes old and new files.
  const version=file=>createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);
  const pin=html=>html.replace(/(href|src)="([\w-]+\.(?:css|js))"/g,(_,attribute,file)=>`${attribute}="${file}?v=${version(file)}"`);
  fs.writeFileSync(path.join(out,'index.html'),pin(addAnalytics(read('index.html'),analytics,{privacy:true})));
  fs.writeFileSync(path.join(out,'read.html'),pin(addAnalytics(readingEdition(book,ui),analytics)));
  fs.writeFileSync(path.join(out,'analytics.html'),pin(read('analytics.html')));
  if(analytics){
    const preview=path.join(out,'preview.html');
    fs.writeFileSync(preview,addAnalytics(fs.readFileSync(preview,'utf8'),analytics));
  }
  console.log(`_site/ ready: ${book.chapters.length} chapters, ${F.places(book).length-book.chapters.length} sections.${analytics?' Web Analytics enabled.':''}`);
}
if(require.main===module)build();
module.exports={build,readingEdition};
