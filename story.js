'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paragraphs = lines => lines.map(s=>`<p>${escape(s)}</p>`).join('');
  const pages=BOOK.pages, M=READER_MODEL, storageKey='stendhal-paper-book-v2';
  let raw=null, storageOK=true;
  try {raw=JSON.parse(localStorage.getItem(storageKey));}catch {storageOK=false;}
  const saved=M.normalize(raw,pages), resumePage=saved.page;
  const nav=M.createNavigator(M.indexForHash(location.hash,pages),pages.length);
  const book=$('book'), scene=$('scene'), leaf=$('turn-leaf'), front=$('leaf-front');
  const systemMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let currentRendered=nav.index, transaction=null, raf=0, assetsReady=false, atlasFailed=false;
  let dragging=null, ignoreClickUntil=0, dialogOpener=null;
  const reduceMotion=()=>saved.motion==='reduce'||(saved.motion==='system'&&systemMotion.matches);
  const pageState=id=>saved.states[id]||(saved.states[id]={});
  function save(){
    try{localStorage.setItem(storageKey,JSON.stringify(saved));storageOK=true;}catch{storageOK=false;}
    document.querySelectorAll('[data-save-status]').forEach(el=>{el.textContent=storageOK?'已儲存在這個瀏覽器，只有你看得到。':'這個瀏覽器未能儲存筆記；請在離開前自行複製。';});
  }
  function applySettings(){
    document.body.classList.toggle('reduced-motion',reduceMotion());
    document.body.classList.toggle('force-motion',saved.motion==='full');
    document.body.classList.toggle('large-type',saved.type==='large');
    $('motion-setting').value=saved.motion;$('type-setting').value=saved.type;
    if(reduceMotion()&&transaction)finishTurn(true);
  }
  function noteMarkup(page,state){
    if(!page.note)return '';
    const n=page.note;
    const source=n.source?`<p><a href="${BOOK.sources[n.source]}" target="_blank" rel="noopener noreferrer">對照法文原文 ↗</a></p>`:'';
    const locator=n.locator?`<p class="source-reference">辛格《The Nature of Love》第二卷，${escape(n.locator)}</p>`:'';
    return `<details class="paper-note" data-state="note"${state.note?' open':''}><summary>${escape(n.label)}</summary><p class="note-type">${escape(n.type)}</p><p>${escape(n.text)}</p>${source}${locator}</details>`;
  }
  function interactionMarkup(page,state){
    const wrap=html=>`<div class="interactive-panel">${html}</div>`;
    switch(page.interaction){
      case 'rose':return wrap(`<button type="button" class="paper-action" data-action="rose" aria-expanded="${!!state.rose}" aria-controls="rose-thought">${state.rose?'把手帕合上':'揭開手帕'}</button><div class="reveal-text" id="rose-thought"${state.rose?'':' hidden'}><p>「被人愛着，原來這麼甜美。」</p><p>她自己還不明白。敘述者卻認出：希望已經出現。</p><p class="source-reference">敘述者的解釋 · 原文節述</p></div>`);
      case 'crystal':return wrap(`<p>從眼前所見，到心裡所想。</p><div class="crystal-steps">${page.crystals.map((c,i)=>`<button type="button" class="crystal-step" data-crystal="${i}" aria-pressed="${state.crystal===i}"><span class="diamond" aria-hidden="true"></span>${escape(c.label)}<span aria-hidden="true">${i===0?' · 所見':' · 推想'}</span></button>`).join('')}</div><ol class="crystal-explanations">${page.crystals.map(c=>`<li>${escape(c.detail)}</li>`).join('')}</ol><p class="save-note">紙晶只表示推想，不是對他的品格認證。</p>`);
      case 'withheld':return wrap(`<button type="button" class="paper-action" data-action="withheld" aria-pressed="${!!state.withheld}">${state.withheld?'放回花束，回看前一刻':'他搶先拿走了花束'}</button><p class="reveal-text" id="withheld-thought">${state.withheld?'她只看見空的樹洞，並不知道他剛才做了甚麼。':'花束原先在這裡。讀者現在才知道，後來的空缺是他的安排。'}</p>`);
      case 'perspectives':return wrap(`<div class="perspectives">${page.perspectives.map((p,i)=>`<details class="perspective" data-state="perspective${i}"${state['perspective'+i]?' open':''}><summary>${escape(p.name)}</summary><p>${escape(p.text)}</p></details>`).join('')}</div>`);
      case 'ending':return wrap(`<button type="button" class="paper-action" data-action="ending" aria-expanded="${!!state.ending}" aria-controls="ending-reveal">${state.ending?'合上最後一片紙瓣':'再翻開最後一片紙瓣'}</button><div id="ending-reveal" class="reveal-text"${state.ending?'':' hidden'}>${paragraphs(page.reveal)}</div>`);
      case 'initial':return wrap(`<fieldset class="question-fieldset"><legend class="sr-only">最想先談的問題，可以複選</legend>${BOOK.questions.map(q=>`<label class="question-choice"><input type="checkbox" name="question" value="${q.id}"${saved.choices.includes(q.id)?' checked':''}><span>${escape(q.label)}</span></label>`).join('')}</fieldset><label class="writing-label" for="before-note">讀辛格之前，我覺得……</label><textarea class="reflection-input" id="before-note" data-writing="before" maxlength="5000" placeholder="留下一句話，或先在心裡想想。">${escape(saved.before)}</textarea><p class="save-note" data-save-status>筆記只留在這個瀏覽器。</p>`);
      case 'questions':return wrap(`<p class="writing-label">你讀之前的想法</p><div class="before-thought">${escape(saved.before||'你還沒有留下筆記。可以從現在開始寫。')}</div>${saved.choices.length?`<p class="save-note">你想先談：${saved.choices.map(id=>escape(BOOK.questions.find(q=>q.id===id).label)).join('／')}</p>`:''}<label class="writing-label" for="after-note">現在，我想補充……</label><textarea class="reflection-input" id="after-note" data-writing="after" maxlength="5000" placeholder="哪個地方改變了你的想法？哪個問題仍然留着？">${escape(saved.after)}</textarea><p class="save-note" data-save-status>筆記只留在這個瀏覽器。</p><ol class="question-list">${BOOK.questions.map(q=>`<li>${escape(q.prompt)}</li>`).join('')}</ol><button type="button" class="paper-action" data-action="export">下載我的讀後筆記</button>`);
      default:return '';
    }
  }
  function sceneState(page,state){
    scene.classList.toggle('rose-open',!!state.rose);
    scene.querySelectorAll('[data-sprite^="crystal-"]').forEach((el,i)=>{el.hidden=page.interaction==='crystal'&&i>=(state.crystal??-1);});
    const bouquet=scene.querySelector('[data-sprite="withheld-bouquet"]');if(bouquet)bouquet.hidden=!!state.withheld;
    const general=scene.querySelector('[data-sprite="ending-general"]');if(general)general.hidden=!state.ending;
    const philippe=scene.querySelector('[data-sprite="ending-philippe"]');if(philippe)philippe.hidden=!!state.ending;
    $('original-art').hidden=page.interaction==='ending'&&!state.ending;
    if(page.interaction==='withheld')scene.setAttribute('aria-label',state.withheld?'紙藝場景：菲利普站在空了的樹洞旁。':'紙藝場景：花束還留在橡樹洞裡，菲利普在旁。');
    if(page.interaction==='ending')scene.setAttribute('aria-label',state.ending?'紙藝場景：埃內斯蒂娜與一位年老、佩着勳章的將軍。':'紙藝場景：埃內斯蒂娜與菲利普分站兩端，未能相守。');
  }
  function renderScene(page,state){
    const recipe=PAPER_SCENES.scenes[page.scene];
    scene.className='scene'+(recipe?.crystals?' has-crystals':'');
    scene.setAttribute('aria-label',`紙藝場景：${page.caption||page.title}`);
    scene.innerHTML=PAPER_SCENES.render(page.scene);
    if(atlasFailed){
      const canShow=page.interaction!=='ending'||state.ending;
      if(canShow){scene.innerHTML=`<img class="scene-fallback" src="assets/${page.art}.webp" alt="${escape(page.caption||page.title)}">`;scene.querySelector('img').addEventListener('error',e=>{e.target.hidden=true;});}
    }
    sceneState(page,state);
  }
  function renderPage(index){
    currentRendered=index;
    const page=pages[index], state=pageState(page.id);
    book.dataset.kind=page.kind;book.dataset.page=page.id;
    const eyebrow=page.kind==='cover'?'司湯達的故事 · 辛格的閱讀':page.kind==='reflection'?'故事以外 · 和辛格一起想':`埃內斯蒂娜 · ${String(index).padStart(2,'0')}`;
    $('page-heading').innerHTML=`<p class="eyebrow">${eyebrow}</p><h1 id="page-title" tabindex="-1">${escape(page.title)}</h1>${page.subtitle?`<p class="subtitle">${escape(page.subtitle)}</p>`:''}`;
    $('text-section').innerHTML=`<div class="prose">${paragraphs(page.paragraphs)}</div>${page.quote?`<blockquote>${escape(page.quote.text)}<cite>${escape(page.quote.by)}</cite></blockquote>`:''}${interactionMarkup(page,state)}${page.kind==='cover'?'<div class="cover-open"><button type="button" class="paper-action" data-action="begin">翻開故事 →</button></div>':''}${noteMarkup(page,state)}`;
    $('scene-caption').textContent=page.caption||'';
    renderScene(page,state);
  }
  function updateControls(){
    $('prev-page').disabled=nav.index===0;
    $('next-page').disabled=nav.index===pages.length-1;
    $('prev-corner').disabled=nav.index===0;
    $('next-corner').disabled=nav.index===pages.length-1;
    $('prev-page').setAttribute('aria-disabled',String(nav.busy||nav.index===0));
    $('next-page').setAttribute('aria-disabled',String(nav.busy||nav.index===pages.length-1));
    $('next-label').textContent=nav.index===0?'翻開書頁':nav.index===18?'讀故事以外':nav.index===pages.length-1?'全書讀畢':'下一頁';
    $('progress').value=nav.index;
    $('progress-label').textContent=nav.index===0?'翻開故事':`${String(nav.index).padStart(2,'0')} / ${pages.length-1}`;
    $('page-counter').textContent=nav.index===0?'封面':`${String(nav.index).padStart(2,'0')} / ${pages.length-1}`;
    $('section-label').textContent=pages[nav.index].kind==='reflection'?'故事以外 · 辛格的閱讀':'司湯達 · 埃內斯蒂娜，或愛的誕生';
    document.querySelectorAll('[data-page]').forEach(el=>{if(el.tagName==='BUTTON'){if(el.dataset.page===pages[nav.index].id)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');}});
    document.title=`${nav.index?pages[nav.index].title+'｜':''}${BOOK.title}｜司湯達與辛格`;
  }
  function recordPosition(mode='push'){
    const id=pages[nav.index].id;
    saved.page=id;save();
    if(mode!=='none'&&location.hash!=='#'+id)history[mode==='replace'?'replaceState':'pushState'](null,'','#'+id);
    updateControls();
  }
  function focusPage(){
    $('page-title').focus({preventScroll:true});
    const top=book.getBoundingClientRect().top+window.scrollY-24;
    if(window.scrollY>top+50)window.scrollTo({top:Math.max(0,top),behavior:'instant'});
    $('announcement').textContent=`第 ${nav.index} 頁，${pages[nav.index].title}`;
  }
  function cloneDecoration(node){
    const clone=node.cloneNode(true);
    [clone,...clone.querySelectorAll('*')].forEach(el=>{el.removeAttribute('id');el.removeAttribute('for');el.removeAttribute('aria-controls');el.removeAttribute('data-state');el.removeAttribute('data-action');if(el.matches('input,button,select,textarea,a,summary'))el.setAttribute('tabindex','-1');});
    return clone;
  }
  function prepareTurn(target,{historyMode='push',focus=true}={}){
    if(!nav.begin(target))return false;
    $('resume-banner').hidden=true;
    transaction={from:nav.index,to:target,direction:target>nav.index?1:-1,progress:0,painted:false,historyMode,focus};
    book.classList.add('is-turning');book.setAttribute('aria-busy','true');
    front.replaceChildren();
    const mobile=matchMedia('(max-width:720px)').matches;
    if(transaction.direction<0&&!mobile){front.append(cloneDecoration(scene));}
    else{front.append(cloneDecoration($('page-heading')));if(mobile)front.append(cloneDecoration(scene));front.append(cloneDecoration($('text-section')));}
    leaf.classList.toggle('reverse',transaction.direction<0);leaf.hidden=false;
    updateTurn(0);updateControls();return true;
  }
  function updateTurn(progress){
    if(!transaction)return;
    const t=transaction;t.progress=progress;
    const targetVisible=progress>=.5;
    if(targetVisible!==t.painted){renderPage(targetVisible?t.to:t.from);t.painted=targetVisible;}
    leaf.style.transform=`rotateY(${t.direction*-180*progress}deg)`;
    leaf.style.opacity=progress>.94?String((1-progress)/.06):'1';
    const phase=targetVisible?(progress-.5)*2:progress*2;
    scene.querySelectorAll('.sprite:not(.cloth)').forEach((el,i)=>{
      const stagger=Math.min(i*.026,.18);
      const fold=targetVisible?78*(1-Math.min(1,Math.max(0,(phase-stagger)/(1-stagger)))):78*Math.min(1,phase*1.2);
      el.style.setProperty('--fold',fold+'deg');
    });
  }
  function finishTurn(commit){
    if(!transaction)return;
    cancelAnimationFrame(raf);
    const t=transaction;transaction=null;dragging=null;
    if(commit)nav.commit();else nav.cancel();
    renderPage(nav.index);
    leaf.hidden=true;front.replaceChildren();leaf.style.transform='';leaf.style.opacity='';
    book.classList.remove('is-turning');book.removeAttribute('aria-busy');
    if(commit){recordPosition(t.historyMode);if(t.focus)focusPage();}else updateControls();
  }
  function animateTo(end){
    if(!transaction)return;
    cancelAnimationFrame(raf);
    if(reduceMotion()||!assetsReady){finishTurn(end===1);return;}
    const start=transaction.progress,started=performance.now(),duration=Math.max(180,900*Math.abs(end-start));
    const tick=now=>{
      if(!transaction)return;
      const fraction=Math.min(1,(now-started)/duration);
      const eased=fraction<.5?4*fraction*fraction*fraction:1-Math.pow(-2*fraction+2,3)/2;
      updateTurn(start+(end-start)*eased);
      if(fraction<1)raf=requestAnimationFrame(tick);else finishTurn(end===1);
    };
    raf=requestAnimationFrame(tick);
  }
  function goTo(target,options={}){
    if(!prepareTurn(target,options))return;
    if(!options.drag){const top=book.getBoundingClientRect().top+window.scrollY-24;if(window.scrollY>top+50)window.scrollTo({top:Math.max(0,top),behavior:'instant'});}
    animateTo(1);
  }
  function goBy(direction){goTo(M.targetIndex(nav.index,direction,pages.length));}
  function cancelForLocation(){
    if(transaction)finishTurn(false);
    const target=M.indexForHash(location.hash,pages);nav.replace(target);renderPage(target);recordPosition('replace');focusPage();
  }
  function openDialog(id,opener){
    if(nav.busy)return;
    dialogOpener=opener||document.activeElement;$(id).showModal();
  }
  document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>openDialog(button.dataset.dialog,button)));
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>{if(dialogOpener?.isConnected)dialogOpener.focus({preventScroll:true});});
  });
  function buildContents(){
    $('event-contents').innerHTML=[['故事','story'],['故事以外','reflection']].map(([label,kind])=>`<h3 class="contents-heading">${label}</h3><ol class="contents-list">${pages.filter(p=>p.kind===kind||kind==='story'&&p.kind==='cover').map(p=>`<li><button type="button" data-page="${p.id}"><span>${String(pages.indexOf(p)).padStart(2,'0')}</span>${escape(p.title)}</button></li>`).join('')}</ol>`).join('');
    $('stage-contents').innerHTML='<p>七階段是文學與心理分析的索引，不是人人必經的流程。一個場景，也可能交織幾種心情。</p><ol class="stage-list">'+BOOK.stages.map(s=>`<li><button type="button" data-page="${s.page}">${escape(s.name)}</button><p>${escape(s.description)}</p></li>`).join('')+'</ol>';
    $('contents-dialog').addEventListener('click',event=>{
      const button=event.target.closest('[data-page]');if(!button)return;
      const target=pages.findIndex(p=>p.id===button.dataset.page);$('contents-dialog').close();goTo(target);
    });
    function showStages(show){$('event-contents').hidden=show;$('stage-contents').hidden=!show;$('event-tab').setAttribute('aria-pressed',String(!show));$('stage-tab').setAttribute('aria-pressed',String(show));}
    $('event-tab').addEventListener('click',()=>showStages(false));$('stage-tab').addEventListener('click',()=>showStages(true));
  }
  $('text-section').addEventListener('click',event=>{
    const action=event.target.closest('[data-action]')?.dataset.action;
    if(nav.busy)return;
    const page=pages[nav.index],state=pageState(page.id);
    if(action==='begin'){goBy(1);return;}
    if(['rose','withheld','ending'].includes(action)){
      state[action]=!state[action];
      const button=event.target.closest('button');
      if(action==='rose'){button.textContent=state.rose?'把手帕合上':'揭開手帕';button.setAttribute('aria-expanded',String(state.rose));$('rose-thought').hidden=!state.rose;}
      if(action==='withheld'){button.textContent=state.withheld?'放回花束，回看前一刻':'他搶先拿走了花束';button.setAttribute('aria-pressed',String(state.withheld));$('withheld-thought').textContent=state.withheld?'她只看見空的樹洞，並不知道他剛才做了甚麼。':'花束原先在這裡。讀者現在才知道，後來的空缺是他的安排。';}
      if(action==='ending'){button.textContent=state.ending?'合上最後一片紙瓣':'再翻開最後一片紙瓣';button.setAttribute('aria-expanded',String(state.ending));$('ending-reveal').hidden=!state.ending;}
      sceneState(page,state);save();
    }
    const crystal=event.target.closest('[data-crystal]');
    if(crystal){state.crystal=Number(crystal.dataset.crystal);document.querySelectorAll('[data-crystal]').forEach(b=>b.setAttribute('aria-pressed',String(b===crystal)));sceneState(page,state);$('announcement').textContent=page.crystals[state.crystal].detail;save();}
    if(action==='export'){
      const text=`愛，如何誕生｜我的讀後筆記\n\n讀辛格之前\n${saved.before||'（未填寫）'}\n\n讀過之後\n${saved.after||'（未填寫）'}\n\n想繼續談的問題\n${saved.choices.map(id=>BOOK.questions.find(q=>q.id===id).label).join('\n')||'（未選擇）'}\n\nhttps://remtoec.github.io/stendhal/\n`;
      const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='stendhal-reading-notes.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
  });
  $('text-section').addEventListener('toggle',event=>{const d=event.target;if(!d.dataset.state||!d.isConnected||nav.busy)return;pageState(pages[currentRendered].id)[d.dataset.state]=d.open;save();},true);
  $('text-section').addEventListener('input',event=>{if(event.target.dataset.writing){saved[event.target.dataset.writing]=event.target.value.slice(0,5000);save();}});
  $('text-section').addEventListener('change',event=>{if(event.target.name==='question'){saved.choices=[...document.querySelectorAll('input[name="question"]:checked')].map(el=>el.value);save();}});
  for(const [id,direction] of [['prev-page',-1],['next-page',1],['prev-corner',-1],['next-corner',1]]){
    const button=$(id);
    button.addEventListener('click',()=>{if(performance.now()<ignoreClickUntil)return;goBy(direction);});
    button.addEventListener('pointerdown',event=>{
      if(event.button!==0||nav.busy||button.disabled||reduceMotion())return;
      dragging={pointer:event.pointerId,startX:event.clientX,startY:event.clientY,lastX:event.clientX,lastTime:performance.now(),velocity:0,direction,active:false,button};
      button.setPointerCapture(event.pointerId);
    });
    button.addEventListener('pointermove',event=>{
      const d=dragging;if(!d||d.pointer!==event.pointerId)return;
      const dx=d.startX-event.clientX,dy=d.startY-event.clientY;
      if(!d.active&&Math.abs(dx)>9&&Math.abs(dx)>Math.abs(dy)*1.2){
        if(dx*direction<0)return;
        if(!prepareTurn(M.targetIndex(nav.index,direction,pages.length),{focus:true}))return;
        d.active=true;
      }
      if(!d.active)return;
      const now=performance.now();d.velocity=(d.lastX-event.clientX)*direction/Math.max(1,now-d.lastTime);d.lastX=event.clientX;d.lastTime=now;
      updateTurn(M.dragProgress(d.startX,event.clientX,direction,book.clientWidth));
    });
    const release=(event,cancel)=>{
      const d=dragging;if(!d||d.pointer!==event.pointerId)return;
      if(button.hasPointerCapture(event.pointerId))button.releasePointerCapture(event.pointerId);
      if(d.active){ignoreClickUntil=performance.now()+500;const velocity=performance.now()-d.lastTime<100?d.velocity:0;animateTo(!cancel&&M.shouldComplete(transaction.progress,velocity)?1:0);}
      dragging=null;
    };
    button.addEventListener('pointerup',e=>release(e,false));button.addEventListener('pointercancel',e=>release(e,true));
    button.addEventListener('lostpointercapture',event=>{if(dragging?.active&&dragging.pointer===event.pointerId){animateTo(0);dragging=null;}});
  }
  document.addEventListener('keydown',event=>{
    if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||document.querySelector('dialog[open]')||event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();goBy(event.key==='ArrowRight'?1:-1);}
    if(event.key==='Escape'&&transaction){event.preventDefault();finishTurn(false);}
  });
  addEventListener('hashchange',cancelForLocation);
  addEventListener('pagehide',()=>{if(transaction)finishTurn(false);save();});
  $('motion-setting').addEventListener('change',event=>{saved.motion=event.target.value;applySettings();save();});
  $('type-setting').addEventListener('change',event=>{saved.type=event.target.value;applySettings();save();});
  systemMotion.addEventListener('change',applySettings);
  $('clear-notes').addEventListener('click',()=>{saved.before='';saved.after='';saved.choices=[];save();renderPage(nav.index);$('settings-status').textContent=storageOK?'筆記已清除。':'筆記已從目前頁面清除；瀏覽器儲存不可用。';});
  $('original-art').addEventListener('click',()=>{
    const page=pages[nav.index],img=$('art-image');$('art-status').textContent='';img.hidden=false;img.alt=`${page.title}：${page.caption}`;
    img.onerror=()=>{img.hidden=true;$('art-status').textContent='暫時未能載入插畫，故事文字仍可正常閱讀。';};
    img.src=`assets/${page.art}.webp`;openDialog('art-dialog',$('original-art'));
  });
  function preloadImage(path){return new Promise((resolve,reject)=>{const img=new Image();const timer=setTimeout(()=>reject(new Error('Image timeout')),12000);img.onload=async()=>{try{if(img.decode)await img.decode();clearTimeout(timer);resolve(img);}catch(error){clearTimeout(timer);reject(error);}};img.onerror=()=>{clearTimeout(timer);reject(new Error('Image unavailable'));};img.src=path;});}
  applySettings();buildContents();renderPage(nav.index);updateControls();
  if(location.hash)recordPosition('replace');
  if(!location.hash&&resumePage!=='cover'){
    const index=pages.findIndex(p=>p.id===resumePage);
    if(index>0){const banner=$('resume-banner');banner.hidden=false;banner.innerHTML=`<span>上次讀到「${escape(pages[index].title)}」</span><button type="button" class="resume">接着讀 →</button><button type="button" class="dismiss" aria-label="關閉繼續閱讀提示">×</button>`;banner.querySelector('.resume').addEventListener('click',()=>goTo(index));banner.querySelector('.dismiss').addEventListener('click',()=>{banner.hidden=true;});}
  }
  Promise.allSettled(PAPER_SCENES.atlasPaths.map(preloadImage)).then(results=>{assetsReady=true;atlasFailed=results.some(r=>r.status==='rejected');if(atlasFailed&&!nav.busy)renderScene(pages[nav.index],pageState(pages[nav.index].id));});
})();
