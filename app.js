import {topics,questions,EBOOK} from './content.js';
import {LEVELS,freshProgress,score,answerOnce,advance,addBonus} from './core.js';
import {heroArt,lessonArt} from './visuals.js';
import * as store from './store.js';
import {mountVideos,cleanupVideos} from './videos.js';
import {createTrail,scene} from './journey.js';
import {spriteHero} from './bouncie-sprite.js';
import {greetingArt,startGreeting} from './greeting.js';
import {questionFigure,questionVisuals} from './question-visuals.js';
import {installLocale,translateText} from './locale.js';
let stopGreeting=()=>{},guideIndex=0;
let trail=null;

const main=document.querySelector('#main'),header=document.querySelector('#header'),modal=document.querySelector('#modal');
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let route='auth',authMode='login',game=store.progress(),gameStarted=false,busy=false,animation=0,animationGeneration=0;
let returnFocus=null,mandatoryModal=false,noticeTimer,playerX=480,gameItems=[],lastFrame=0,lastSpawn=0,starSpawned=false;
const pref=store.prefs();
pref.language??='en';pref.textSize??=pref.large?'large':'normal';
const t=(id,en)=>pref.language==='id'?id:en;
const localize=installLocale(()=>pref.language);
function eyeIcon(off=false){return `<svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/>${off?'<path d="M3 3l18 18" stroke="currentColor" stroke-width="2"/>':''}</svg>`;}
const reduced=()=>pref.reduce||matchMedia('(prefers-reduced-motion: reduce)').matches;
function notify(text){const node=$('#notice');node.textContent=text;node.hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>node.hidden=true,6000);}
function applyPrefs(){for(const name of ['contrast','reduce'])document.documentElement.classList.toggle(name,!!pref[name]);document.documentElement.classList.toggle('large',pref.textSize==='large');document.documentElement.classList.toggle('xlarge',pref.textSize==='xlarge');document.documentElement.classList.toggle('spacious',!!pref.spacing);document.documentElement.classList.toggle('focus-reading',!!pref.focus);localize();if(route==='learn')setupReadingGuide();}
applyPrefs();
function logo(){return `<img src="./favicon.svg" width="36" height="36" alt=""><span>Stretch & Measure<small>EXPLORE, STRETCH, AND LEARN.</small></span>`;}
function renderHeader(){
 const u=store.user(),locked=route==='game'&&gameStarted&&game.phase!=='done';
 header.innerHTML=`<div class="topbar"><a class="brand" href="#" data-action="${locked?'brand-locked':'home'}">${logo()}</a><div class="header-actions">${u?`<span class="name tiny">Hi, ${esc(u.name.split(' ')[0])}</span><span class="avatar" aria-hidden="true">${esc(u.name[0].toUpperCase())}</span>`:''}<button class="quiet accessibility-trigger" data-action="settings" aria-label="Nyaman untukmu"><span aria-hidden="true"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M3 8l9 2 9-2M12 10v5m0-3-5 9m5-9 5 9" stroke-linecap="round"/></svg></span><span class="access-label">Nyaman untukmu</span></button>${u?'<button class="icon-btn" data-action="logout" aria-label="Keluar" title="Keluar">↪</button>':''}</div></div>`;
}
function navigate(next){
 stopGreeting();trail?.destroy();trail=null;stopSpeech();cleanupVideos();cancelAnimationFrame(animation);animationGeneration++;busy=false;
 route=store.user()?next:'auth';
 if(route==='auth')renderAuth();if(route==='dashboard')renderDashboard();if(route==='learn')renderLearn();if(route==='game')renderGame();
 renderHeader();window.scrollTo(0,0);main.focus({preventScroll:true});
}
function renderAuth(){
 const signup=authMode==='register';
 main.innerHTML=`<div class="auth-shell"><div class="auth-art"><span class="eyebrow">A little stretch. A big discovery.</span><h1>Small springs.<br>Big possibilities.</h1><p>Temukan sains di balik setiap regangan dan lompatan. Siap berpetualang bersama Bouncie?</p>${greetingArt(t('teman','friend'),t('Halo','Hello'))}</div><section class="auth-card" aria-labelledby="auth-title"><h2 id="auth-title">${signup?'Create Account':'Welcome Back'}</h2><p class="muted">${signup?'Start your elasticity adventure today.':'Sign in to continue your elasticity adventure.'}</p><form id="auth-form" novalidate>${signup?'<div class="field"><label for="name">Nama siswa</label><input id="name" name="name" autocomplete="name" placeholder="Nama panggilanmu" maxlength="60" required></div>':''}<div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="nama@email.com" maxlength="160" aria-describedby="auth-error" required></div>${passwordField('password','Password',signup?'new-password':'current-password')}${signup?passwordField('confirm','Confirm password','new-password'):''}<div class="error" id="auth-error" role="alert"></div>${signup?'':`<div class="spaced"><label class="check"><input name="remember" type="checkbox" checked> Remember me</label><button type="button" class="link-button tiny" data-action="forgot">Forgot password?</button></div>`}<button class="btn" type="submit">${signup?'Create Account':'Log In'} <span aria-hidden="true">→</span></button></form><div class="auth-foot">${signup?'Already have an account?':'New here?'} <button class="link-button" data-action="auth-switch">${signup?'Log In':'Create account'}</button></div><p class="demo-note">🔒 Akun demo tersimpan hanya di browser ini. Gunakan email contoh dan kata sandi khusus demo; ini bukan akun sekolah atau layanan login daring.</p></section></div>`;
}
function passwordField(id,label,autocomplete){return `<div class="field"><label for="${id}">${label}</label><div class="password-wrap"><input id="${id}" name="${id}" type="password" autocomplete="${autocomplete}" placeholder="${id==='confirm'?'Ulangi kata sandi':'Minimal 6 karakter'}" minlength="6" maxlength="128" aria-describedby="auth-error" required><button type="button" data-action="toggle-password" data-for="${id}" aria-label="Tampilkan ${label}" aria-pressed="false">${eyeIcon()}</button></div></div>`;}
document.addEventListener('submit',async e=>{
 if(e.target.id!=='auth-form')return;e.preventDefault();const form=e.target,data=new FormData(form),err=$('#auth-error'),button=$('button[type=submit]',form);
 const email=String(data.get('email')||'').trim(),password=String(data.get('password')||'');
 err.textContent='';for(const input of $$('input',form))input.removeAttribute('aria-invalid');
 if(authMode==='register'&&!String(data.get('name')||'').trim()){err.textContent='Isi nama agar Bouncie bisa menyapamu.';$('#name').setAttribute('aria-invalid','true');$('#name').focus();return;}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err.textContent='Tuliskan alamat email yang valid, misalnya siswa@example.com.';$('#email').setAttribute('aria-invalid','true');$('#email').focus();return;}
 if(password.length<6){err.textContent='Kata sandi minimal 6 karakter.';$('#password').setAttribute('aria-invalid','true');$('#password').focus();return;}
 if(authMode==='register'&&password!==data.get('confirm')){err.textContent='Konfirmasi kata sandi belum sama.';$('#confirm').setAttribute('aria-invalid','true');$('#confirm').focus();return;}
 button.disabled=true;button.textContent='Sebentar…';
 try{
  if(authMode==='register')await store.register(String(data.get('name')),email,password);
  await store.login(email,password,authMode==='register'||data.get('remember')==='on');
  game=store.progress();gameStarted=false;navigate('dashboard');if(store.storageFailed())notify('Penyimpanan browser tidak tersedia. Progres hanya bertahan selama aplikasi terbuka.');
 }catch(error){err.textContent=error.message;button.disabled=false;button.textContent=authMode==='register'?'Create Account':'Log In';}
});
function renderDashboard(){
 const name=esc(store.user().name.split(' ')[0]);
 main.innerHTML=`<div class="shell dashboard"><section class="panel welcome"><div><span class="eyebrow">Spring into discovery ✨</span><h1 class="welcome-title">Welcome, ${name}!</h1><h2>Explore, Stretch, and Learn.</h2><p>${t('Setiap regangan membawa penemuan baru. Pelajari sains pegas dengan cara yang nyaman untukmu.','Every little stretch begins a new discovery. Explore the science of springs at your own pace.')}</p><button class="quiet greet-again" data-action="greet">Sapa Bouncie</button></div><div class="hero-art">${greetingArt(name,t('Halo','Hello'))}</div></section><div class="card-grid"><button class="panel dashboard-card" data-action="learn"><span class="card-number">01 / LEARN</span><h2>Learn & Explore</h2><p>Read, listen, and discover the science of springs.</p><img class="card-illustration" src="./assets/book-icon.webp" alt=""><span class="card-cta">Open Lessons <span aria-hidden="true">↗</span></span></button><button class="panel dashboard-card game-card" data-action="game"><span class="card-number">02 / PLAY</span><h2>Bouncie’s Spring Trail</h2><p>Jump through the trail and collect stars to unlock challenges.</p><img class="card-illustration" src="./assets/game-icon.webp" alt=""><span class="card-cta">Play Now <span aria-hidden="true">↗</span></span></button></div></div>`;
 stopGreeting();stopGreeting=startGreeting(main,reduced);
}
function renderLearn(){
 main.innerHTML=`<div class="shell"><button class="quiet back" data-action="home">← Back to Dashboard</button><div class="screen-intro"><span class="eyebrow">Learning Library · Fisika SMA XI</span><h1>Elastisitas Bahan pada Pegas</h1><p class="muted">Baca pelan-pelan, dengarkan penjelasannya, dan hubungkan setiap konsep dengan percobaan pegasmu.</p></div><p class="language-note">Materi dan soal tetap berbahasa Indonesia.</p><div id="reading-tools"></div><nav class="lesson-nav" lang="id" aria-label="Daftar submateri">${topics.map((t,i)=>`<a href="#topic-${i}">${i+1}. ${esc(t.title)}</a>`).join('')}</nav><div class="lesson-list">${topics.map((t,i)=>`<article class="panel lesson" id="topic-${i}"><div class="lesson-title" lang="id"><span class="topic-num">${i+1}</span><div><span class="eyebrow">${esc(t.tag)}</span><h2>${esc(t.title)}</h2></div></div><div class="lesson-grid"><div class="lesson-copy" lang="id">${t.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${t.formula?`<div class="formula">${esc(t.formula)}</div><p class="example">${esc(t.example)}</p>`:''}</div><div class="lesson-visual">${lessonArt(t.visual)}</div></div><div class="takeaway" lang="id">💡 ${esc(t.takeaway)}</div><div class="audio-box" data-topic="${i}"><div><div class="audio-label">🔊 Dengarkan materi</div><div class="audio-status" id="speech-${i}" aria-live="polite">Siap diputar</div></div><div class="row"><button data-action="speak" data-topic="${i}" aria-label="Putar narasi ${esc(t.title)}">▶ Putar</button><button data-action="pause-speech" data-topic="${i}" aria-label="Jeda narasi ${esc(t.title)}">⏸ Jeda</button><button data-action="stop-speech" data-topic="${i}" aria-label="Hentikan narasi ${esc(t.title)}">■ Stop</button><label class="tiny" for="rate-${i}">Kecepatan</label><select id="rate-${i}" data-rate="${i}">${[0.75,1,1.25,1.5].map(r=>`<option value="${r}" ${Number(pref.rate||1)===r?'selected':''}>${r}×</option>`).join('')}</select></div></div><div class="video"><h3>🎬 Tonton penjelasan</h3><p>Jelajahi video Bahasa Indonesia tentang ${esc(t.title.toLowerCase())}. Pemutaran tersemat belum diverifikasi, jadi tautan pencarian disediakan agar tidak menampilkan player yang rusak.</p><a class="quiet" href="https://www.youtube.com/results?search_query=${encodeURIComponent(t.query)}" target="_blank" rel="noopener noreferrer">Cari video di YouTube ↗</a></div><p class="source">Rujukan: Modul Elastisitas Bahan (2020), ${t.pages}. Ringkasan dan ilustrasi disusun ulang untuk pembelajaran ini.</p></article>`).join('')}</div><section class="panel ebook"><div><span class="eyebrow" style="color:#bce876">Read a little further</span><h2>Unduh E-Book Elastisitas Bahan</h2><p>Modul resmi Direktorat SMA, Kemendikbud (2020). Perluas pemahamanmu tentang elastisitas dan pegas.</p></div><a class="btn yellow" href="${EBOOK}" target="_blank" rel="noopener noreferrer">↓ Buka / Unduh PDF</a></section></div>`;
 mountVideos(main,stopSpeech);setupReadingGuide();
 if(typeof window.speechSynthesis?.speak!=='function'||typeof window.SpeechSynthesisUtterance!=='function'){for(const btn of $$('.audio-box button'))btn.disabled=true;for(const badge of $$('.audio-status'))badge.textContent='Audio tidak didukung browser ini. Teks tetap tersedia.';}
}
let speechIndex=null,speechToken=0,utterance=null;
function statusSpeech(index,text){const node=$(`#speech-${index}`);if(node)node.textContent=text;}
function stopSpeech(){speechToken++;if(speechIndex!==null)statusSpeech(speechIndex,'Siap diputar');window.speechSynthesis?.cancel();speechIndex=null;utterance=null;}
function speak(index){
 if(!window.speechSynthesis)return;
 if(speechIndex===index&&speechSynthesis.paused){speechSynthesis.resume();statusSpeech(index,'Sedang dibacakan');return;}
 stopSpeech();const token=++speechToken,t=topics[index];speechIndex=index;
 utterance=new SpeechSynthesisUtterance(`${t.title}. ${t.paragraphs.join(' ')} ${t.example||''} Ingat. ${t.takeaway}`);
 utterance.lang='id-ID';utterance.rate=Number($(`#rate-${index}`).value);const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('id'));if(voice)utterance.voice=voice;
 utterance.onstart=()=>{if(token===speechToken)statusSpeech(index,voice?'Sedang dibacakan':'Menggunakan suara tersedia; pelafalan dapat berbeda.');};
 utterance.onend=()=>{if(token===speechToken){statusSpeech(index,'Selesai dibacakan');speechIndex=null;}};
 utterance.onerror=e=>{if(token===speechToken&&e.error!=='interrupted'&&e.error!=='canceled'){statusSpeech(index,'Suara belum tersedia. Coba lagi atau gunakan teks.');speechIndex=null;}};
 speechSynthesis.speak(utterance);statusSpeech(index,'Menyiapkan narasi…');
}
function persist(){store.saveProgress(game);}
function points(){return game.adventure||0;}
function gameTop(){return `<div class="game-head"><div class="spaced"><div><span class="eyebrow">Bouncie’s Spring Trail · ${game.phase==='done'?'Complete':'Level '+(game.level+1)+' of 5'}</span><h1>${game.phase==='done'?'Well done, explorer!':LEVELS[game.level].title}</h1></div><div class="row"><div class="level-steps" aria-label="Progres lima level">${LEVELS.map((_,i)=>`<span class="level-dot ${i<game.answers.length?'complete':i===game.level?'active':''}" ${i===game.level?'aria-current="step"':''}>${i<game.answers.length?'✓':i+1}</span>`).join('')}</div><span class="points" id="score-chip" title="Adventure Points" aria-live="polite" aria-label="Skor ${points()}">⭐ ${points()}</span></div></div></div>`;}
function renderGame(){
 trail?.destroy();trail=null;
 if(game.phase==='done'){renderScore();return;}
 if(!gameStarted&&game.phase==='setup'&&game.level===0&&game.checkpoint.x<=75){
 main.innerHTML=`<div class="shell"><button class="quiet" data-action="home">← Back to Dashboard</button><section class="panel game-intro">${spriteHero()}<span class="eyebrow">5 trails · 5 star challenges</span><h1>Bouncie’s Spring Trail</h1><p>Jelajahi dunia yang terus bergulir, lewati rintangan, lalu tangkap lima bintang kuis.</p><ol class="instruction-list"><li>Tahan ← / → atau A / D untuk berjalan.</li><li>Tekan Space, ↑, W, atau tombol Jump untuk melompat.</li><li>⭐ hanya muncul sekali di setiap level. Jawab soal satu kali.</li><li>Level tersambung sepanjang jalur. Finish berada di akhir level kelima.</li><li>Adventure Points: rintangan +5, level +25, jatuh −5. Learning Score dari kuis tetap aman.</li></ol><button class="btn" data-action="start-game">Start Adventure →</button></section></div>`;return;
 }
 gameStarted=true;
 main.innerHTML=`<div class="shell">${gameTop()}<p class="game-goal muted"><span id="challenge-count">⭐ ${game.answers.length}/5 Challenges</span> · <button class="quiet" data-action="pause-game">⏸ Pause</button></p><section class="world-wrap trail-world">${scene()}</section><div class="move-controls"><button class="move-btn" data-trail="left" aria-label="Bergerak kiri">←</button><button class="move-btn jump-btn" data-trail="jump" aria-label="Lompat">↑ Jump</button><button class="move-btn" data-trail="right" aria-label="Bergerak kanan">→</button></div><p id="game-status" class="trail-help" role="status">Tahan kiri/kanan untuk berjalan. Tekan Jump untuk melompati celah.</p><p class="tiny muted trail-help">Keyboard: A/D atau ←/→ · Space/W/↑ untuk lompat · Tanpa batas waktu.</p></div>`;
 trail=createTrail({root:main,progress:game,reduced,
 onCheckpoint(cp){game.checkpoint=cp;persist();},
 onStar(){game.phase='quiz';persist();showQuiz();},
 onLevel(next){game.level=next;persist();$('.game-head').outerHTML=gameTop();},
 onFinish(){game.level=5;game.phase='done';persist();renderGame();renderHeader();},
 onReward(amount){addBonus(game,amount);persist();$('#score-chip').textContent='⭐ '+points();},
 onPenalty(amount){addBonus(game,-amount);persist();$('#score-chip').textContent='⭐ '+points();}
 });
 if(game.phase==='quiz'||game.phase==='feedback')trail.pause();
 if(game.phase==='quiz')showQuiz();if(game.phase==='feedback')showFeedback();
}
function showQuiz(){
 const q=questions[game.level];
 openModal(`<div class="modal-content star-quiz"><span class="feedback-icon" aria-hidden="true">⭐</span><span class="eyebrow">Star Challenge · Question ${game.level+1} of 5</span><h2 id="modal-title">${q.title}</h2><p class="muted">Answer this question to continue Bouncie’s journey.</p>${questionFigure(game.level)}<h3 class="question-prompt" lang="id">${q.prompt}</h3><div class="options" lang="id">${q.options.map((o,i)=>`<button class="option" data-choice="${i}"><span class="letter">${'ABCDE'[i]}</span><span>${o}</span></button>`).join('')}</div><p class="quiz-note">Satu kesempatan menjawab. Benar +20 poin.</p></div>`,true);
}
function showFeedback(){
 const q=questions[game.level],correct=game.answers[game.level]===q.answer;
 openModal(`<div class="modal-content"><span class="feedback-icon" aria-hidden="true">${correct?'🎉':'💡'}</span><span>${correct?'+20 poin':'Belajar lagi'}</span><h2 id="modal-title">${correct?'Correct! Great elasticity thinking!':'Not quite—let’s learn from it!'}</h2><p><strong>Jawaban benar: ${'ABCDE'[q.answer]}.</strong> ${q.explanation}</p><button class="btn ${correct?'':'secondary'}" data-action="continue">Continue Journey →</button></div>`,true);
}
function choose(choice){if(!answerOnce(game,choice))return;persist();renderHeader();$('#challenge-count').textContent='⭐ '+game.answers.length+'/5 Challenges';showFeedback();}
function renderScore(){
 const total=score(game.answers,questions),correct=game.answers.filter((a,i)=>a===questions[i].answer).length,message=correct===5?'Luar biasa! Semua konsep berhasil kamu tangkap.':correct>=3?'Petualangan selesai! Pertahankan rasa ingin tahumu.':'Terima kasih sudah mencoba! Buka materi lagi lalu pantul lebih tinggi.';
 main.innerHTML=`<div class="shell"><section class="panel score-panel"><div class="celebration" aria-hidden="true"><span>⭐</span><span>🎉</span><span>✨</span></div><span class="eyebrow">Five Star Challenges completed</span><h1 lang="en">Bouncie’s Spring Trail Complete!</h1><div class="score-big">${total}<small> / 100</small></div><p>Learning Score</p><p class="adventure-result">⭐ Adventure Points: <strong>${points()}</strong></p><p><strong>${correct} dari 5 jawaban benar · 5/5 level selesai</strong></p><div style="max-width:230px;margin:auto">${spriteHero()}</div><p class="muted" style="margin-top:1rem">${message}</p><details class="review"><summary>Lihat pembahasan lima Star Challenge</summary>${questions.map((q,i)=>`<article><h3>${i+1}. ${q.title}</h3><p>Jawabanmu: ${'ABCDE'[game.answers[i]]}. ${q.options[game.answers[i]]}</p><p><strong>Kunci: ${'ABCDE'[q.answer]}</strong> · ${q.explanation}</p></article>`).join('')}</details><div class="row"><button class="btn" data-action="replay">Play Again ↻</button><button class="quiet" data-action="home">Back to Dashboard</button></div></section></div>`;
}
function openModal(html,mandatory=false){
 if(!modal.open)returnFocus=document.activeElement;mandatoryModal=mandatory;modal.innerHTML=html;if(!modal.open)modal.showModal();
 (modal.querySelector('button,input')||modal).focus({preventScroll:true});
}
function closeModal(){mandatoryModal=false;modal.close();if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});}
modal.addEventListener('cancel',e=>{if(mandatoryModal)e.preventDefault();});
// Keep focus in the native dialog on every supported browser.
modal.addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;const nodes=$$('button:not(:disabled),a[href],input:not(:disabled),select',modal).filter(n=>n.getClientRects().length);if(!nodes.length)return;
 const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
function setupReadingGuide(){
 const host=$('#reading-tools');if(!host)return;
 for(const paragraph of $$('.reading-target'))paragraph.classList.remove('reading-target');
 if(!pref.focus){host.innerHTML='';return;}
 const paragraphs=$$('.lesson-copy p');guideIndex=Math.max(0,Math.min(guideIndex,paragraphs.length-1));const current=paragraphs[guideIndex];current?.classList.add('reading-target');
 host.innerHTML=`<aside class="reading-toolbar" aria-label="Panduan fokus baca"><strong>◎ ${t('Fokus baca','Reading focus')} · ${guideIndex+1}/${paragraphs.length}</strong><div class="row"><button class="quiet" data-action="guide-prev">Sebelumnya</button><button class="quiet" data-action="guide-next">Berikutnya</button><button class="quiet" data-action="guide-close">Tutup panduan</button></div></aside>`;
}
function moveGuide(delta){guideIndex+=delta;setupReadingGuide();$('.reading-target')?.scrollIntoView({block:'center',behavior:'instant'});}
function settings(){
 const option=(value,label,selected)=>`<option value="${value}" ${selected?'selected':''}>${label}</option>`;
 openModal(`<div class="modal-content"><div class="spaced"><h2 id="modal-title">Nyaman untukmu</h2><button class="icon-btn" data-action="close-modal" aria-label="${t('Tutup pengaturan','Close settings')}">×</button></div><p class="tiny muted">${t('Sesuaikan cara kamu belajar.','Choose a comfortable way to learn.')}</p>
 <label class="settings-row">${t('Ukuran teks','Text size')}<select data-pref="textSize">${[['normal',t('Normal','Normal')],['large',t('Besar','Large')],['xlarge',t('Sangat besar','Extra large')]].map(([v,l])=>option(v,l,pref.textSize===v)).join('')}</select></label>
 ${[['spacing',t('Spasi baca renggang','Comfortable reading spacing')],['contrast',t('Kontras tinggi','High contrast')],['reduce',t('Kurangi gerak','Reduce motion')],['focus',t('Panduan fokus baca','Reading focus guide')]].map(([key,label])=>`<label class="settings-row" for="pref-${key}">${label}<input type="checkbox" id="pref-${key}" data-pref="${key}" ${pref[key]?'checked':''}></label>`).join('')}
 <label class="settings-row">${t('Bahasa antarmuka','Interface language')}<select data-pref="language">${option('id','Bahasa Indonesia',pref.language==='id')}${option('en','English',pref.language==='en')}</select></label>
 <p class="tiny muted">Materi dan soal tetap berbahasa Indonesia.</p><details class="keyboard-help"><summary>${t('Panduan keyboard','Keyboard guide')}</summary><p>${t('Tab/Shift+Tab untuk berpindah, Enter untuk memilih, Escape untuk menutup pengaturan. Game: A/D atau ←/→ untuk bergerak; Space/W/↑ untuk melompat.','Tab/Shift+Tab to navigate, Enter to select, Escape to close settings. Game: A/D or ←/→ to move; Space/W/↑ to jump.')}</p></details>
 <button class="quiet" data-action="reset-prefs">${t('Reset preferensi','Reset preferences')}</button>
 ${store.user()?'<button class="link-button" data-action="reset">Reset progres game</button><p class="tiny muted">Hanya progres akunmu yang direset setelah konfirmasi.</p>':''}<button class="btn" data-action="close-modal">Selesai</button></div>`);
}
function zoomQuestion(index,button){
 const v=questionVisuals[index];let dialog=$('#image-modal');if(!dialog){dialog=document.createElement('dialog');dialog.id='image-modal';dialog.className='image-dialog';dialog.setAttribute('aria-label',t('Gambar soal diperbesar','Enlarged question diagram'));document.body.append(dialog);}
 dialog.innerHTML=`<div class="modal-content"><button class="quiet" data-action="close-image">× Tutup gambar</button><img src="${v.src}" alt="${v.alt}"><p class="tiny">${v.source}</p></div>`;dialog.onclose=()=>button?.focus();dialog.showModal();dialog.querySelector('button').focus();
}
function confirmReset(){openModal(`<div class="modal-content"><h2 id="modal-title">Mulai petualangan baru?</h2><p>Lima jawaban dan skor akun ini akan dihapus. Materi serta akunmu tetap tersedia.</p><div class="row"><button class="quiet" data-action="close-modal">Batal</button><button class="btn" data-action="confirm-reset">Ya, mulai lagi</button></div></div>`);}
document.addEventListener('click',e=>{
 const choice=e.target.closest('[data-choice]');if(choice){choose(Number(choice.dataset.choice));return;}
 const target=e.target.closest('[data-action]');if(!target||target.disabled)return;const action=target.dataset.action;e.preventDefault();
 switch(action){
  case 'home':navigate(store.user()?'dashboard':'auth');break;
  case 'brand-locked':notify('Selesaikan Star Challenge yang sedang dimainkan untuk melanjutkan.');break;
  case 'settings':settings();break;
  case 'greet':stopGreeting();stopGreeting=startGreeting(main,reduced);break;
  case 'zoom-question':zoomQuestion(Number(target.dataset.index),target);break;
  case 'close-image':$('#image-modal')?.close();break;
  case 'guide-prev':moveGuide(-1);break;
  case 'guide-next':moveGuide(1);break;
  case 'guide-close':pref.focus=false;store.savePrefs(pref);applyPrefs();break;
  case 'reset-prefs':for(const key of Object.keys(pref))delete pref[key];Object.assign(pref,{language:'en',textSize:'normal',rate:1});store.savePrefs(pref);applyPrefs();settings();break;
  case 'auth-switch':authMode=authMode==='login'?'register':'login';renderAuth();break;
  case 'toggle-password':{const input=$('#'+target.dataset.for),show=input.type==='password';input.type=show?'text':'password';target.innerHTML=eyeIcon(show);target.setAttribute('aria-pressed',String(show));target.setAttribute('aria-label',`${show?'Sembunyikan':'Tampilkan'} kata sandi`);break;}
  case 'forgot':openModal('<div class="modal-content"><h2 id="modal-title">Tentang akun demo</h2><p>Akun ini hanya tersimpan di browser perangkatmu. Pengiriman email dan reset kata sandi daring belum terhubung.</p><p>Jika lupa kata sandi, buat akun demo baru dengan email contoh lain. Akun baru memiliki progres terpisah.</p><button class="btn" data-action="close-modal">Mengerti</button></div>');break;
  case 'logout':if(modal.open)closeModal();store.logout();game=freshProgress();gameStarted=false;navigate('auth');break;
  case 'learn':navigate('learn');break;
  case 'game':game=store.progress();gameStarted=game.level>0||game.phase!=='setup';navigate('game');break;
  case 'start-game':gameStarted=true;renderGame();renderHeader();$('#world')?.focus?.({preventScroll:true});break;
  case 'continue':if(advance(game)){persist();closeModal();trail?.resume(true);renderHeader();$('#score-chip').textContent='⭐ '+points();main.focus({preventScroll:true});}break;
  case 'pause-game':trail?.pause();openModal(`<div class="modal-content"><h2 id="modal-title">Petualangan dijeda</h2><p>Tahan A/D atau ←/→ untuk bergerak. Space/W/↑ untuk lompat. Bintang membuka kuis.</p><button class="btn" data-action="resume-game">Lanjut bermain →</button><button class="link-button" data-action="exit-game">Back to Dashboard</button></div>`,true);break;
  case 'resume-game':closeModal();trail?.resume();break;
  case 'exit-game':closeModal();navigate('dashboard');break;
  case 'replay':case 'reset':confirmReset();break;
  case 'confirm-reset':store.resetProgress();game=freshProgress();gameStarted=false;closeModal();navigate('game');break;
  case 'close-modal':closeModal();break;
  case 'speak':speak(Number(target.dataset.topic));break;
  case 'pause-speech':{const i=Number(target.dataset.topic);if(speechIndex===i&&window.speechSynthesis){speechSynthesis.pause();statusSpeech(i,'Narasi dijeda. Tekan Putar untuk melanjutkan.');}break;}
  case 'stop-speech':if(speechIndex===Number(target.dataset.topic))stopSpeech();break;
 }
});
document.addEventListener('change',e=>{
 const node=e.target;
 if(node.dataset.pref){pref[node.dataset.pref]=node.type==='checkbox'?node.checked:node.value;store.savePrefs(pref);applyPrefs();if(node.dataset.pref==='language'){settings();modal.querySelector('[data-pref="language"]')?.focus();}if(route==='dashboard'){stopGreeting();stopGreeting=startGreeting(main,reduced);}}
 if(node.dataset.rate!==undefined){pref.rate=Number(node.value);store.savePrefs(pref);if(speechIndex===Number(node.dataset.rate))speak(speechIndex);}
});
window.addEventListener('pagehide',()=>{stopGreeting();stopSpeech();cleanupVideos();cancelAnimationFrame(animation);});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&speechIndex!==null){speechSynthesis.pause();statusSpeech(speechIndex,'Narasi dijeda. Tekan Putar untuk melanjutkan.');}});
// Browser back/forward cannot reopen a past checkpoint: the persisted state is authoritative.
window.addEventListener('popstate',()=>{if(route==='game'){game=store.progress();renderGame();renderHeader();}});
navigate(store.user()?'dashboard':'auth');
