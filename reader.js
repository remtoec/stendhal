'use strict';
// The reader: one chapter per screen, scrolled vertically; chapters turn sideways.
// All wording comes from content/book.md and content/ui.json.
(async () => {
  const $=id=>document.getElementById(id);
  const F=BOOK_FORMAT,M=READER_MODEL,S=PAPER_SCENES,main=$('chapter'),storageKey='stendhal-book-v3';
  let book,ui;
  try{
    const get=path=>fetch(path,{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(path+' '+r.status);return r;});
    const [md,strings]=await Promise.all([get('content/book.md').then(r=>r.text()),get('content/ui.json').then(r=>r.json())]);
    book=F.parse(md);ui=strings;
    if(!book.chapters.length)throw new Error('content/book.md has no chapters');
  }catch(error){console.error(error);return;} // the page keeps its built-in link to the full text edition
  const chapters=book.chapters,places=F.places(book);
  const name=c=>c.label?`${c.label}｜${c.title}`:c.title;
  // Shown only while the text file has mistakes, so whoever is editing it sees them at once.
  const issues=F.problems(book,Object.keys(S.scenes));
  const problemsHTML=issues.length?`<aside class="content-problems"><strong>${F.esc(ui.contentProblems)}</strong><ul>${issues.map(i=>`<li>${F.esc(i)}</li>`).join('')}</ul></aside>`:'';

  let raw=null,storageOK=true;
  try{raw=JSON.parse(localStorage.getItem(storageKey));}catch{storageOK=false;}
  const saved=M.normalize(raw,places),resumeAt=saved.at;
  const systemMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion=()=>saved.motion==='reduce'||(saved.motion==='system'&&systemMotion.matches);
  let current=-1,routing=0;

  function save(){
    try{localStorage.setItem(storageKey,JSON.stringify(saved));storageOK=true;}catch{storageOK=false;}
    document.querySelectorAll('[data-save-status]').forEach(el=>{el.textContent=storageOK?ui.saved:ui.notSaved;});
  }
  function applySettings(){
    document.body.classList.toggle('reduced-motion',reduceMotion());
    document.body.classList.toggle('large-type',saved.type==='large');
    $('motion-setting').value=saved.motion;$('type-setting').value=saved.type;
  }

  // Paper scenes stand up when they scroll into view; a few cutouts answer to the blocks beside them.
  const sceneFor=el=>el.closest('.beat,.hero')?.querySelector('.scene');
  function applyScene(scene){
    const on=(scene.dataset.on||'').split(' '),step=Number(scene.dataset.step||0);
    scene.querySelectorAll('[data-when],[data-unless],[data-step]').forEach(el=>{
      const d=el.dataset;
      el.classList.toggle('gone',d.when?!on.includes(d.when):d.unless?on.includes(d.unless):Number(d.step)>step);
    });
  }
  const sceneWatcher=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('up');sceneWatcher.unobserve(entry.target);}
  },{threshold:.3});
  const beatWatcher=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){saved.at=entry.target.id;save();}
  },{rootMargin:'-15% 0px -70% 0px'});

  function endHTML(index){
    const prev=chapters[index-1],next=chapters[index+1];
    const card=(target,word)=>`<a class="next-card" href="#${target.id}"><span><small>${F.esc(word)}</small><strong>${F.esc(target===chapters[0]?'':name(target))}</strong></span><span class="arrow" aria-hidden="true">→</span></a>`;
    const resume=index===0&&resumeAt!==places[0].id&&places.find(p=>p.id===resumeAt);
    return `<nav class="chapter-end" aria-label="${F.esc(ui.next)}">`
      +(resume?`<a class="resume" href="#${resume.id}"><small>${F.esc(ui.resume)}</small><strong>${F.esc(name(chapters[resume.chapter])+(resume.beat?' · '+resume.beat.title:''))}</strong><span>${F.esc(ui.resumeGo)} →</span></a>`:'')
      +(next?card(next,index===0?ui.begin:ui.next):card(chapters[0],ui.finished))
      +(prev?`<a class="prev-link" href="#${prev.id}">← ${F.esc(ui.prev)}　${F.esc(name(prev))}</a>`:'')+'</nav>';
  }
  function render(index){
    current=index;
    const chapter=chapters[index];
    main.dataset.kind=chapter.kind;
    main.innerHTML=problemsHTML+F.chapterHTML(chapter,{scene:S.render,sceneLabel:ui.sceneLabel})+endHTML(index);
    sceneWatcher.disconnect();beatWatcher.disconnect();
    main.querySelectorAll('.scene').forEach(scene=>{applyScene(scene);sceneWatcher.observe(scene);});
    main.querySelectorAll('.beat').forEach(beat=>beatWatcher.observe(beat));
    main.querySelectorAll('.crystals').forEach(box=>box.querySelectorAll('li').forEach((li,i)=>{li.hidden=i>0;}));
    main.querySelectorAll('.journal').forEach(box=>{
      const slot=box.dataset.journal;box.querySelector('textarea').value=saved[slot];
      if(slot==='after')box.insertAdjacentHTML('afterbegin',`<p class="journal-heading">${F.esc(ui.beforeHeading)}</p><p class="before-thought">${F.esc(saved.before||ui.beforeEmpty)}</p>`);
      if(slot==='after')box.insertAdjacentHTML('beforeend',`<button type="button" class="paper-button" data-export>${F.esc(ui.export)}</button>`);
    });
    // Bottom bar, title and contents follow the chapter.
    const reached=Math.max(0,...chapters.slice(0,index+1).map(c=>c.stage));
    $('crystal-row').innerHTML=Array.from({length:Math.max(...chapters.map(c=>c.stage))},(_,i)=>`<i class="${i<reached?'on':''}${i+1===chapter.stage?' now':''}"></i>`).join('');
    $('where').textContent=chapter.label?`${chapter.label} · ${chapter.title}`:chapter.title;
    $('menu').setAttribute('aria-label',`${ui.contentsHere}：${name(chapter)}`);
    for(const [id,target] of [['prev',chapters[index-1]],['next',chapters[index+1]]]){
      if(target)$(id).href='#'+target.id;else $(id).removeAttribute('href');
    }
    document.querySelectorAll('#toc [aria-current]').forEach(a=>a.removeAttribute('aria-current'));
    document.querySelector(`#toc a[href="#${chapter.id}"]`)?.setAttribute('aria-current','page');
    document.title=(index?name(chapter)+'｜':'')+chapters[0].title;
    // Fetch the next chapter's opening plate while this one is being read.
    const plate=chapters[index+1]?.lead.find(b=>b.type==='image');
    if(plate)new Image().src=plate.src;
    save();
  }
  // Every move is a link to #id: buttons, contents, swipes, the back button.
  async function route(initial){
    const place=M.locate(location.hash,places),turn=++routing;
    if(place.chapter!==current){
      main.style.setProperty('--dir',place.chapter>current?1:-1);
      if(!initial&&!reduceMotion()){
        main.classList.add('leaving');
        await new Promise(resolve=>setTimeout(resolve,180));
        if(turn!==routing)return;
      }
      render(place.chapter);
      main.classList.remove('leaving');
      if(!initial){main.classList.add('entering');$('chapter-title').focus({preventScroll:true});}
    }
    const target=place.beat&&$(place.id);
    if(target)target.scrollIntoView({block:'start',behavior:'instant'});else scrollTo({top:0,behavior:'instant'});
    saved.at=place.id;save();
  }
  const turn=by=>{const target=chapters[current+by];if(target)location.hash=target.id;};

  main.addEventListener('animationend',event=>{if(event.target===main)main.classList.remove('entering');});
  main.addEventListener('toggle',event=>{
    const reveal=event.target;if(!reveal.matches?.('.reveal'))return;
    const scene=sceneFor(reveal);if(!scene)return;
    const on=new Set((scene.dataset.on||'').split(' ').filter(Boolean));
    if(reveal.open)on.add(reveal.dataset.reveal);else on.delete(reveal.dataset.reveal);
    scene.dataset.on=[...on].join(' ');applyScene(scene);
  },true);
  main.addEventListener('click',event=>{
    const more=event.target.closest('[data-more]');
    if(more){
      const box=more.closest('.crystals'),items=[...box.querySelectorAll('li')],next=items.find(li=>li.hidden);
      if(next){next.hidden=false;$('announcement').textContent=next.textContent;}
      more.hidden=!items.some(li=>li.hidden);
      const scene=sceneFor(box);
      if(scene){scene.dataset.step=items.filter(li=>!li.hidden).length-1;applyScene(scene);}
    }
    if(event.target.closest('[data-export]')){
      const text=`${chapters[0].title}\n\n${ui.exportBefore}\n${saved.before||ui.exportEmpty}\n\n${ui.exportAfter}\n${saved.after||ui.exportEmpty}\n\n${location.origin+location.pathname}\n`;
      const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
      const a=document.createElement('a');a.href=url;a.download='reading-notes.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
  });
  main.addEventListener('input',event=>{
    const slot=event.target.closest('.journal')?.dataset.journal;
    if(slot&&event.target.matches('textarea')){saved[slot]=event.target.value.slice(0,5000);save();}
  });

  // A quick sideways flick turns the chapter. Edge swipes are left to the browser's own back gesture.
  let touch=null;
  main.addEventListener('touchstart',event=>{
    const t=event.touches[0];
    touch=event.touches.length===1&&t.clientX>24&&t.clientX<innerWidth-24&&!event.target.closest('textarea,select,input')?{x:t.clientX,y:t.clientY,time:event.timeStamp}:null;
  },{passive:true});
  main.addEventListener('touchend',event=>{
    if(!touch)return;
    const t=event.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y,quick=event.timeStamp-touch.time<600;
    touch=null;
    if(quick&&Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*2.5&&!String(getSelection()))turn(dx<0?1:-1);
  },{passive:true});
  document.addEventListener('keydown',event=>{
    if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||document.querySelector('dialog[open]')||event.target.closest('input,textarea,select,summary'))return;
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();turn(event.key==='ArrowRight'?1:-1);}
  });

  // Dialogs: contents, settings, about.
  $('toc').innerHTML='<ol class="toc">'+chapters.map(c=>`<li><a class="toc-chapter" href="#${c.id}">${c.label?`<span class="seal small" aria-hidden="true">${F.esc(c.label)}</span>`:''}<span>${c.label?`<span class="sr-only">${F.esc(c.label)}　</span>`:''}${F.esc(c.title)}</span></a>${c.beats.length?`<ol>${c.beats.map(b=>`<li><a href="#${b.id}">${F.esc(b.title)}</a></li>`).join('')}</ol>`:''}</li>`).join('')+'</ol>';
  if(book.about)$('about').innerHTML=`<h2>${F.esc(book.about.title)}</h2>`+F.blocksHTML(book.about.lead);
  document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelector('dialog[open]')?.close();$(button.dataset.dialog).showModal();
  }));
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{
    if(event.target===dialog||event.target.closest('.close-dialog,a[href^="#"]'))dialog.close();
  }));
  $('motion-setting').addEventListener('change',event=>{saved.motion=event.target.value;applySettings();save();});
  $('type-setting').addEventListener('change',event=>{saved.type=event.target.value;applySettings();save();});
  systemMotion.addEventListener('change',applySettings);
  $('clear-notes').addEventListener('click',()=>{saved.before='';saved.after='';save();render(current);$('settings-status').textContent=ui.cleared;});

  addEventListener('hashchange',()=>route(false));
  addEventListener('pagehide',save);
  applySettings();
  await route(true);
  document.body.classList.add('ready');
})();
