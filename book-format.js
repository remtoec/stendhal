'use strict';
// content/book.md → book object → HTML. Shared by the reader (browser) and
// scripts/build.js (Node), so the text lives in one Markdown file and nowhere else.
// The format is described in content/README.md.
const BOOK_FORMAT = (() => {
  const CONTAINERS=['note','reveal','crystals','voices'];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inline=s=>esc(s)
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(_,text,url)=>`<a href="${url}"${/^https?:/.test(url)?' target="_blank" rel="noopener noreferrer"':''}>${text}</a>`);
  const split=s=>s.split('｜').map(x=>x.trim());

  function parse(md){
    const book={chapters:[],about:null};
    let chapter=null,heading=null,blocks=null,parent=null,open=null;
    const close=()=>{open=null;};
    const add=block=>{blocks.push(block);return block;};
    for(const raw of String(md).replace(/\r/g,'').split('\n')){
      const line=raw.trim();let m;
      if(!line){close();continue;}
      if((m=/^<!--(.*)-->$/.exec(line))){
        // Settings for the heading just above: id, scene, caption, stage, en, kind.
        if(heading)for(const pair of m[1].split('|')){const i=pair.indexOf(':');if(i>0)heading[pair.slice(0,i).trim()]=pair.slice(i+1).trim();}
        continue;
      }
      if((m=/^# (.+)$/.exec(line))){
        const parts=split(m[1]);
        chapter=heading={kind:'story',label:parts.length>1?parts[0]:'',title:parts[parts.length-1],lead:[],beats:[]};
        blocks=chapter.lead;parent=null;close();book.chapters.push(chapter);continue;
      }
      if(!chapter)continue;
      if((m=/^## (.+)$/.exec(line))){
        heading={title:m[1],blocks:[]};chapter.beats.push(heading);blocks=heading.blocks;parent=null;close();continue;
      }
      if((m=/^:::\s*(\S+)?\s*(.*)$/.exec(line))){
        close();
        if(m[1]){const box=add({type:m[1],args:split(m[2]),blocks:[]});parent=blocks;blocks=box.blocks;}
        else if(parent){blocks=parent;parent=null;}
        continue;
      }
      if((m=/^!\[(.*)\]\((\S+)\)$/.exec(line))){close();add({type:'image',alt:m[1],src:m[2]});continue;}
      if((m=/^>\s?(.*)$/.exec(line))){
        if(open?.type!=='slip')open=add({type:'slip',lines:[],by:''});
        if(/^[—–-]\s*/.test(m[1]))open.by=m[1].replace(/^[—–-]\s*/,'');else if(m[1])open.lines.push(m[1]);
        continue;
      }
      if((m=/^- (.+)$/.exec(line))){
        if(open?.type!=='list')open=add({type:'list',items:[]});
        const parts=split(m[1]);
        open.items.push(parts.length>1?{label:parts[0],text:parts.slice(1).join('｜')}:{text:parts[0]});
        continue;
      }
      if(open?.type==='p')open.text+=line;else open=add({type:'p',text:line});
    }
    const aboutAt=book.chapters.findIndex(c=>c.kind==='about');
    if(aboutAt>=0)book.about=book.chapters.splice(aboutAt,1)[0];
    for(const c of book.chapters)c.stage=c.stage?Number(c.stage):0;
    return book;
  }

  // Every chapter and beat, in reading order, as {id, chapter (index), beat?}.
  const places=book=>book.chapters.flatMap((c,i)=>[{id:c.id,chapter:i},...c.beats.map(b=>({id:b.id,chapter:i,beat:b}))]);
  const everyBlock=book=>[...book.chapters,...(book.about?[book.about]:[])].flatMap(c=>[c.lead,...c.beats.map(b=>b.blocks)]).flat().flatMap(b=>[b,...(b.blocks||[])]);

  // Plain-language problems for whoever edited the text. Empty array = good to publish.
  function problems(book,sceneNames){
    const out=[],seen=new Set();
    if(!book.chapters.length)out.push('找不到任何章節（以「# 」開頭的標題）。');
    for(const c of book.chapters)for(const item of [c,...c.beats]){
      const where=`「${item.title}」`;
      if(!item.id)out.push(`${where}缺少 id（標題下一行的 <!-- id: … -->）。`);
      else if(!/^[a-z0-9-]+$/.test(item.id))out.push(`${where}的 id「${item.id}」只能用小寫英文字母、數字和連字號。`);
      else if(seen.has(item.id))out.push(`id「${item.id}」重複了。`);
      seen.add(item.id);
      if(item.scene&&sceneNames&&!sceneNames.includes(item.scene))out.push(`${where}的場景「${item.scene}」不存在。可用的場景：${sceneNames.join('、')}。`);
    }
    for(const b of everyBlock(book)){
      if(b.args&&!CONTAINERS.includes(b.type))out.push(`不認得的方塊「::: ${b.type}」。可用的方塊：${CONTAINERS.join('、')}。`);
      if((b.type==='reveal'||b.type==='crystals')&&!b.args[0])out.push(`「::: ${b.type}」後面要有一個名稱。`);
    }
    const stages=book.chapters.map(c=>c.stage).filter(Boolean);
    if(new Set(stages).size!==stages.length)out.push('有兩個章節用了同一個 stage 編號。');
    return out;
  }

  // options.static: the no-JavaScript edition (everything unfolded, no scenes or buttons).
  // options.scene(name): returns the inner HTML of a paper scene.
  function blocksHTML(blocks,options={}){
    const items=b=>(b.blocks.find(x=>x.type==='list')||{items:[]}).items;
    return blocks.map(b=>{
      switch(b.type){
        case 'p':return `<p>${inline(b.text)}</p>`;
        case 'image':return `<figure class="plate"><img src="${esc(b.src)}" alt="${esc(b.alt)}" width="1200" height="1200" loading="lazy" decoding="async"></figure>`;
        case 'slip':return `<figure class="slip"><blockquote>${b.lines.map(l=>`<p>${inline(l)}</p>`).join('')}</blockquote>${b.by?`<figcaption>${inline(b.by)}</figcaption>`:''}</figure>`;
        case 'list':return `<ul class="plain-list">${b.items.map(i=>`<li>${i.label?`<strong>${inline(i.label)}</strong>：`:''}${inline(i.text)}</li>`).join('')}</ul>`;
        case 'note':return `<details class="note"${options.static?' open':''}><summary><span class="note-label">${inline(b.args[0])}</span>${b.args[1]?`<span class="note-title">${inline(b.args[1])}</span>`:''}</summary><div class="note-body">${blocksHTML(b.blocks,options)}</div></details>`;
        case 'reveal':return `<details class="reveal" data-reveal="${esc(b.args[0])}"${options.static?' open':''}><summary><span class="when-closed">${inline(b.args[1]||'')}</span><span class="when-open">${inline(b.args[2]||b.args[1]||'')}</span></summary><div class="reveal-body">${blocksHTML(b.blocks,options)}</div></details>`;
        case 'crystals':return `<div class="crystals" data-crystals="${esc(b.args[0])}"><ol>${items(b).map(i=>`<li><strong>${inline(i.label||'')}</strong><span>${inline(i.text)}</span></li>`).join('')}</ol>${options.static?'':`<button type="button" class="paper-button" data-more>${inline(b.args[1]||'')}</button>`}</div>`;
        case 'voices':return `<div class="voices">${items(b).map(i=>`<div class="voice"><h3>${inline(i.label||'')}</h3><p>${inline(i.text)}</p></div>`).join('')}</div>`;
        default:return '';
      }
    }).join('');
  }
  function sceneHTML(item,options){
    if(!item.scene||!options.scene)return '';
    return `<figure class="stage"><div class="scene" data-scene="${esc(item.scene)}" role="img" aria-label="${esc((options.sceneLabel||'')+'：'+(item.caption||item.title))}">${options.scene(item.scene)}</div>${item.caption?`<figcaption>${inline(item.caption)}</figcaption>`:''}</figure>`;
  }
  function chapterHTML(chapter,options={}){
    const h=options.static?'h2':'h1',sub=options.static?'h3':'h2';
    const [first,...rest]=chapter.lead;
    const epigraph=first?.type==='p'?`<p class="epigraph">${inline(first.text)}</p>`:'';
    const lead=blocksHTML(first?.type==='p'?rest:chapter.lead,options);
    return `<header class="hero" data-kind="${esc(chapter.kind)}">`
      +(chapter.label?`<p class="seal" aria-hidden="true">${esc(chapter.label)}</p>`:'')
      +(chapter.en?`<p class="hero-en" lang="fr">${esc(chapter.en)}</p>`:'')
      +`<${h} class="hero-title"${options.static?'':' id="chapter-title" tabindex="-1"'}>${chapter.label?`<span class="sr-only">${esc(chapter.label)}　</span>`:''}${inline(chapter.title)}</${h}>`
      +epigraph+sceneHTML(chapter,options)+lead+'</header>'
      +chapter.beats.map(b=>{
        // A scene sits under the title, unless the beat has something to unfold: then it sits right above that.
        const at=Math.max(0,b.blocks.findIndex(x=>x.type==='reveal'||x.type==='crystals'));
        return `<section class="beat" id="${esc(b.id)}"><${sub}>${inline(b.title)}</${sub}>${blocksHTML(b.blocks.slice(0,at),options)}${sceneHTML(b,options)}${blocksHTML(b.blocks.slice(at),options)}</section>`;
      }).join('');
  }
  return {parse,places,everyBlock,problems,blocksHTML,chapterHTML,esc,inline};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=BOOK_FORMAT;
