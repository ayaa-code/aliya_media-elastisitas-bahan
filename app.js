import {topics,questions,EBOOK,outcomeText} from './content.js';
import {KINDS,LEVELS,freshProgress,simulate,score,answerOnce,advance} from './core.js';
import {heroArt,lessonArt,scene,bouncie,coil} from './visuals.js';
import * as store from './store.js';

const main=document.querySelector('#main'),header=document.querySelector('#header'),modal=document.querySelector('#modal');
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let route='auth',authMode='login',game=store.progress(),gameStarted=false,busy=false,animation=0,animationGeneration=0;
let config={mass:0.3,kind:1,x:0.16},returnFocus=null,mandatoryModal=false,noticeTimer;
const pref=store.prefs();
const reduced=()=>pref.reduce||matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt=(n,d=2)=>Number(n).toLocaleString('id-ID',{maximumFractionDigits:d});
function notify(text){const node=$('#notice');node.textContent=text;node.hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>node.hidden=true,6000);}
function applyPrefs(){for(const name of ['large','contrast','reduce'])document.documentElement.classList.toggle(name,!!pref[name]);}
applyPrefs();
function logo(){return `<img src="./favicon.svg" width="36" height="36" alt=""><span>Stretch & Measure<small>EXPLORE, STRETCH, AND LEARN.</small></span>`;}
function renderHeader(){
 const u=store.user(),locked=route==='game'&&gameStarted&&game.phase!=='done';
 header.innerHTML=`<div class="topbar"><a class="brand" href="#" data-action="${locked?'brand-locked':'home'}">${logo()}</a><div class="header-actions">${u?`<span class="name tiny">Hi, ${esc(u.name.split(' ')[0])}</span><span class="avatar" aria-hidden="true">${esc(u.name[0].toUpperCase())}</span>`:''}<button class="icon-btn" data-action="settings" aria-label="Pengaturan aksesibilitas" title="Pengaturan">⚙</button>${u?'<button class="icon-btn" data-action="logout" aria-label="Keluar" title="Keluar">↪</button>':''}</div></div>`;
}
function navigate(next){
 stopSpeech();cancelAnimationFrame(animation);animationGeneration++;busy=false;
 route=store.user()?next:'auth';
 if(route==='auth')renderAuth();if(route==='dashboard')renderDashboard();if(route==='learn')renderLearn();if(route==='game')renderGame();
 renderHeader();window.scrollTo(0,0);main.focus({preventScroll:true});
}
function renderAuth(){
 const signup=authMode==='register';
 main.innerHTML=`<div class="auth-shell"><div class="auth-art"><span class="eyebrow">A little stretch. A big discovery.</span><h1>Small springs.<br>Big possibilities.</h1><p>Temukan sains di balik setiap regangan dan lompatan. Siap berpetualang bersama Bouncie?</p>${heroArt()}</div><section class="auth-card" aria-labelledby="auth-title"><h2 id="auth-title">${signup?'Create Account':'Welcome Back'}</h2><p class="muted">${signup?'Start your elasticity adventure today.':'Sign in to continue your elasticity adventure.'}</p><form id="auth-form" novalidate>${signup?'<div class="field"><label for="name">Nama siswa</label><input id="name" name="name" autocomplete="name" placeholder="Nama panggilanmu" maxlength="60" required></div>':''}<div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="nama@email.com" maxlength="160" required></div>${passwordField('password','Password',signup?'new-password':'current-password')}${signup?passwordField('confirm','Confirm password','new-password'):''}<div class="error" id="auth-error" role="alert"></div>${signup?'':`<div class="spaced"><label class="check"><input name="remember" type="checkbox" checked> Remember me</label><button type="button" class="link-button tiny" data-action="forgot">Forgot password?</button></div>`}<button class="btn" type="submit">${signup?'Create Account':'Log In'} <span aria-hidden="true">→</span></button></form><div class="auth-foot">${signup?'Already have an account?':'New here?'} <button class="link-button" data-action="auth-switch">${signup?'Log In':'Create account'}</button></div><p class="demo-note">🔒 Akun demo tersimpan hanya di browser ini. Gunakan email contoh dan kata sandi khusus demo; ini bukan akun sekolah atau layanan login daring.</p></section></div>`;
}
function passwordField(id,label,autocomplete){return `<div class="field"><label for="${id}">${label}</label><div class="password-wrap"><input id="${id}" name="${id}" type="password" autocomplete="${autocomplete}" placeholder="${id==='confirm'?'Ulangi kata sandi':'Minimal 6 karakter'}" minlength="6" maxlength="128" required><button type="button" data-action="toggle-password" data-for="${id}" aria-label="Tampilkan ${label}" aria-pressed="false">Lihat</button></div></div>`;}
document.addEventListener('submit',async e=>{
 if(e.target.id!=='auth-form')return;e.preventDefault();const form=e.target,data=new FormData(form),err=$('#auth-error'),button=$('button[type=submit]',form);
 const email=String(data.get('email')||'').trim(),password=String(data.get('password')||'');
 err.textContent='';
 if(authMode==='register'&&!String(data.get('name')||'').trim()){err.textContent='Isi nama agar Bouncie bisa menyapamu.';$('#name').focus();return;}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err.textContent='Tuliskan alamat email yang valid, misalnya siswa@example.com.';$('#email').focus();return;}
 if(password.length<6){err.textContent='Kata sandi minimal 6 karakter.';$('#password').focus();return;}
 if(authMode==='register'&&password!==data.get('confirm')){err.textContent='Konfirmasi kata sandi belum sama.';$('#confirm').focus();return;}
 button.disabled=true;button.textContent='Sebentar…';
 try{
  if(authMode==='register')await store.register(String(data.get('name')),email,password);
  await store.login(email,password,authMode==='register'||data.get('remember')==='on');
  game=store.progress();gameStarted=false;navigate('dashboard');if(store.storageFailed())notify('Penyimpanan browser tidak tersedia. Progres hanya bertahan selama aplikasi terbuka.');
 }catch(error){err.textContent=error.message;button.disabled=false;button.textContent=authMode==='register'?'Create Account':'Log In';}
});
function renderDashboard(){
 const name=esc(store.user().name.split(' ')[0]);
 main.innerHTML=`<div class="shell dashboard"><section class="panel welcome"><div><span class="eyebrow" lang="en">Spring into discovery ✨</span><h1 lang="en">Welcome, ${name}!</h1><h2 lang="en">Discover how springs stretch,<br>store energy, and bounce back.</h2><p lang="en">Every little stretch begins a new discovery. Learn at your own pace, then put your ideas into motion with Bouncie.</p></div><div class="hero-art">${heroArt()}</div></section><div class="card-grid"><button class="panel dashboard-card" data-action="learn"><span class="card-number">01 / LEARN</span><span class="card-emoji" aria-hidden="true">📚</span><h2 lang="en">Learn & Explore</h2><p lang="en">Read, listen, and watch the essentials of spring elasticity.</p><span class="card-cta" lang="en">Open Lessons <span aria-hidden="true">↗</span></span></button><button class="panel dashboard-card game-card" data-action="game"><span class="card-number">02 / PLAY</span><span class="card-emoji" aria-hidden="true">🎮</span><h2 lang="en">Spring Quest</h2><p lang="en">Launch Bouncie, answer checkpoints, and earn points.</p><span class="card-cta" lang="en">Play Now <span aria-hidden="true">↗</span></span></button></div></div>`;
}
function renderLearn(){
 main.innerHTML=`<div class="shell"><button class="quiet back" data-action="home">← Back to Dashboard</button><div class="screen-intro"><span class="eyebrow">Learning Library · Fisika SMA XI</span><h1>Elastisitas Bahan pada Pegas</h1><p class="muted">Baca pelan-pelan, dengarkan penjelasannya, dan hubungkan setiap konsep dengan percobaan pegasmu.</p></div><nav class="lesson-nav" aria-label="Daftar submateri">${topics.map((t,i)=>`<a href="#topic-${i}">${i+1}. ${esc(t.title)}</a>`).join('')}</nav><div class="lesson-list">${topics.map((t,i)=>`<article class="panel lesson" id="topic-${i}"><div class="lesson-title"><span class="topic-num">${i+1}</span><div><span class="eyebrow">${esc(t.tag)}</span><h2>${esc(t.title)}</h2></div></div><div class="lesson-grid"><div class="lesson-copy">${t.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${t.formula?`<div class="formula">${esc(t.formula)}</div><p class="example">${esc(t.example)}</p>`:''}</div><div class="lesson-visual">${lessonArt(t.visual)}</div></div><div class="takeaway">💡 ${esc(t.takeaway)}</div><div class="audio-box" data-topic="${i}"><div><div class="audio-label">🔊 Dengarkan materi</div><div class="audio-status" id="speech-${i}" aria-live="polite">Siap diputar</div></div><div class="row"><button data-action="speak" data-topic="${i}" aria-label="Putar narasi ${esc(t.title)}">▶ Putar</button><button data-action="pause-speech" data-topic="${i}" aria-label="Jeda narasi ${esc(t.title)}">⏸ Jeda</button><button data-action="stop-speech" data-topic="${i}" aria-label="Hentikan narasi ${esc(t.title)}">■ Stop</button><label class="tiny" for="rate-${i}">Kecepatan</label><select id="rate-${i}" data-rate="${i}">${[0.75,1,1.25,1.5].map(r=>`<option value="${r}" ${Number(pref.rate||1)===r?'selected':''}>${r}×</option>`).join('')}</select></div></div><div class="video"><h3>🎬 Tonton penjelasan</h3><p>Jelajahi video Bahasa Indonesia tentang ${esc(t.title.toLowerCase())}. Pemutaran tersemat belum diverifikasi, jadi tautan pencarian disediakan agar tidak menampilkan player yang rusak.</p><a class="quiet" href="https://www.youtube.com/results?search_query=${encodeURIComponent(t.query)}" target="_blank" rel="noopener noreferrer">Cari video di YouTube ↗</a></div><p class="source">Rujukan: Modul Elastisitas Bahan (2020), ${t.pages}. Ringkasan dan ilustrasi disusun ulang untuk pembelajaran ini.</p></article>`).join('')}</div><section class="panel ebook"><div><span class="eyebrow" style="color:#bce876">Read a little further</span><h2>Unduh E-Book Elastisitas Bahan</h2><p>Modul resmi Direktorat SMA, Kemendikbud (2020). Perluas pemahamanmu tentang elastisitas dan pegas.</p></div><a class="btn yellow" href="${EBOOK}" target="_blank" rel="noopener noreferrer">↓ Buka / Unduh PDF</a></section></div>`;
 if(!('speechSynthesis' in window)){for(const btn of $$('.audio-box button'))btn.disabled=true;for(const badge of $$('.audio-status'))badge.textContent='Audio tidak didukung browser ini. Teks tetap tersedia.';}
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
function gameTop(){return `<div class="game-head"><div class="spaced"><div><span class="eyebrow">Spring Quest · ${game.phase==='done'?'Complete':'Level '+(game.level+1)+' of 5'}</span><h1>${game.phase==='done'?'Well done, explorer!':LEVELS[game.level].title}</h1></div><div class="row"><div class="level-steps" aria-label="Progres lima level">${LEVELS.map((_,i)=>`<span class="level-dot ${i<game.answers.length?'complete':i===game.level?'active':''}" ${i===game.level?'aria-current="step"':''}>${i<game.answers.length?'✓':i+1}</span>`).join('')}</div><span class="points" aria-label="Skor ${score(game.answers,questions)} dari 100">⭐ ${score(game.answers,questions)} / 100</span></div></div></div>`;}
function renderGame(){
 if(game.phase==='done'){renderScore();return;}
 if(!gameStarted&&game.phase==='setup'&&game.level===0){
  main.innerHTML=`<div class="shell"><button class="quiet" data-action="home">← Back to Dashboard</button><section class="panel game-intro">${heroArt()}<span class="eyebrow">5 islands · 5 discoveries</span><h1>Spring Quest</h1><p>Bantu Bouncie melompat dengan energi pegas. Coba sebuah kombinasi, lihat hasilnya, lalu jawab satu pertanyaan.</p><ol class="instruction-list"><li>Atur massa, jenis pegas, dan besar pemampatan. Klik <strong>Launch</strong>.</li><li>Lihat hasil lompatan. Berhasil maupun belum, lanjut ke checkpoint.</li><li>Jawab A–E <strong>satu kali</strong>. Benar +20, salah +0; keduanya tetap lanjut.</li><li>Lima checkpoint, maksimal 100 poin. Tidak ada batas waktu.</li></ol><button class="btn" data-action="start-game">Mulai petualangan →</button><p class="tiny muted">Kontrol klik, sentuh, atau keyboard. Pengaturan tersimpan agar kamu bisa melanjutkan nanti.</p></section></div>`;return;
 }
 gameStarted=true;
 if(game.phase==='quiz'||game.phase==='feedback'){renderQuiz();return;}
 const level=LEVELS[game.level];
 main.innerHTML=`<div class="shell">${gameTop()}<p class="muted" style="margin-bottom:1rem">${level.goal} Target: <strong>${fmt(level.target)} m</strong>.</p><div class="game-layout"><div><div class="world-wrap">${scene()}</div><div class="readouts" aria-live="polite"><div class="readout"><span>Gaya pegas saat ditekan</span><strong id="force">—</strong></div><div class="readout"><span>Energi tersimpan</span><strong id="energy">—</strong></div><div class="readout"><span>Batas pemampatan</span><strong id="limit">—</strong></div></div><div id="launch-result" aria-live="polite"></div></div><section class="panel controls" aria-label="Pengaturan peluncuran"><h2 style="font-size:1.2rem">Prepare your bounce</h2><div class="control"><label for="mass">Massa total: <output id="mass-value">300 g</output></label><input id="mass" type="range" min="200" max="600" step="50" value="${config.mass*1000}" aria-describedby="mass-help"><p class="tiny muted" id="mass-help">Bouncie + beban yang dibawa</p></div><div class="control"><fieldset><legend>Jenis pegas</legend><div class="spring-options">${KINDS.map((s,i)=>`<label><input type="radio" name="kind" value="${i}" ${i===config.kind?'checked':''}> ${s.name}<small>${s.k} N/m</small></label>`).join('')}</div></fieldset></div><div class="control"><label for="compression">Pemampatan: <output id="compression-value">16 cm</output></label><input id="compression" type="range" min="4" max="30" step="1" value="${config.x*100}" aria-describedby="compression-help"><p class="tiny muted" id="compression-help">Tekan pegas dari panjang alaminya.</p></div><p id="spring-warning" class="warning" role="status"></p><button class="btn" data-action="launch">Launch Bouncie ↗</button></section></div><p class="model-note">Simulasi edukatif ideal · Sudut 45° · Gravitasi 10 m/s² · Platform awal dan target setinggi sama.</p><details class="model-details"><summary>Bagaimana fisika lompatan dihitung?</summary><p>Eₚ = ½kx² diubah menjadi ½mv². Jarak horizontal R = v²/g pada sudut 45° dan tinggi akhir yang sama. Gesekan udara, massa pegas, dan perubahan tinggi selama pegas mendorong diabaikan. Batas pemampatan adalah asumsi tiap pegas. Di luar batas itu, peluncuran dihentikan. Poin berasal dari kuis, bukan keberhasilan lompatan.</p></details></div>`;
 updateControls();
}
function updateControls(){
 if(!$('#mass'))return;
 $('#mass-value').textContent=`${fmt(config.mass*1000,0)} g`;$('#compression-value').textContent=`${fmt(config.x*100,0)} cm`;
 const result=simulate(config,LEVELS[game.level].target),spring=KINDS[config.kind];
 $('#force').textContent=result.outcome==='limit'?'Di luar model':`${fmt(result.force)} N`;
 $('#energy').textContent=result.outcome==='limit'?'Di luar model':`${fmt(result.energy)} J`;
 $('#limit').textContent=`${spring.limit*100} cm`;
 $('#spring-warning').textContent=result.outcome==='limit'?'⚠ Melebihi batas pemampatan. Uji akan menampilkan peringatan.':'';
 const length=52-config.x*100;$('#launch-coil').setAttribute('d',coil(116,300-length,length,18,4));$('#actor').setAttribute('transform',`translate(116 ${300-length-24}) scale(.52)`);
}
async function launch(){
 if(busy||game.phase!=='setup')return;busy=true;
 for(const node of $$('.controls input,.controls button'))node.disabled=true;
 const result=simulate(config,LEVELS[game.level].target),session=++animationGeneration;
 // Persist checkpoint before animation, so refresh cannot unlock a past answer or add points twice.
 game.launches[game.level]={...result,config:{...config}};game.phase='quiz';persist();
 const world=$('#world'),actor=$('#actor'),path=$('#flight-path'),caption=$('#scene-caption');
 if(result.outcome!=='limit'){
  const visualRange=Math.min(820,result.range/LEVELS[game.level].target*554),height=Math.min(220,visualRange/4);
  path.setAttribute('d',`M116 267 Q${116+visualRange/2} ${267-height*2} ${116+visualRange} 267`);
  caption.textContent='Bouncie melompat…';
  await new Promise(resolve=>{
   if(reduced()){actor.setAttribute('transform',`translate(${116+visualRange} 267) scale(.52)`);resolve();return;}
   const start=performance.now();function step(now){if(session!==animationGeneration){resolve();return;}const t=Math.min((now-start)/1600,1),x=116+visualRange*t,y=267-4*height*t*(1-t);actor.setAttribute('transform',`translate(${x} ${y}) scale(.52)`);if(t<1)animation=requestAnimationFrame(step);else resolve();}animation=requestAnimationFrame(step);
  });
 }
 if(session!==animationGeneration||route!=='game')return;
 const [title,text]=outcomeText[result.outcome];caption.textContent=title;
 world.setAttribute('aria-label',`${title} ${text}`);
 $('#launch-result').innerHTML=`<div class="result-banner"><h2>${result.outcome==='success'?'⭐':'💡'} ${title}</h2><p>${text}</p>${result.outcome!=='limit'?`<p class="tiny muted">Jarak model: ${fmt(result.range)} m · Target: ${fmt(LEVELS[game.level].target)} m.</p>`:''}<button class="btn secondary" data-action="checkpoint">Buka checkpoint →</button></div>`;
 busy=false;$('#launch-result button').focus({preventScroll:true});
}
function renderQuiz(){
 const q=questions[game.level],locked=game.phase==='feedback';
 main.innerHTML=`<div class="shell">${gameTop()}<section class="panel quiz" aria-labelledby="question-title"><span class="eyebrow">Checkpoint ${game.level+1} · ${q.title}</span><div class="image-placeholder"><span aria-hidden="true">▧</span>Visual soal akan ditambahkan.</div><h2 id="question-title">${q.prompt}</h2><div class="options">${q.options.map((o,i)=>`<button class="option ${locked&&game.answers[game.level]===i?'chosen':''}" data-choice="${i}" ${locked?'disabled':''}><span class="letter">${'ABCDE'[i]}</span><span>${o}</span></button>`).join('')}</div><p class="quiz-note">Satu kesempatan menjawab. Benar +20 poin; salah +0 poin dan tetap lanjut.</p></section></div>`;
 if(locked)showFeedback();
}
function showFeedback(){
 const q=questions[game.level],correct=game.answers[game.level]===q.answer;
 openModal(`<div class="modal-content"><span class="feedback-icon" aria-hidden="true">${correct?'🎉':'💡'}</span><span>${correct?'+20 poin':'+0 poin'}</span><h2 id="modal-title">${correct?'Benar, nice discovery!':'Belum tepat. Yuk, pahami bersama.'}</h2><p>${q.explanation}</p><button class="btn ${correct?'':'secondary'}" data-action="continue">Lanjutkan →</button></div>`,true);
}
function choose(choice){
 if(!answerOnce(game,choice))return;persist();for(const option of $$('.option'))option.disabled=true;renderQuiz();renderHeader();
}
function renderScore(){
 const points=score(game.answers,questions),message=points===100?'Luar biasa! Semua konsep berhasil kamu kenali.':points>=60?'Petualangan selesai! Pertahankan rasa ingin tahumu dan pelajari lagi bagian yang masih sulit.':'Terima kasih sudah mencoba! Buka materi lagi, lalu coba petualangan baru saat kamu siap.';
 main.innerHTML=`<div class="shell"><section class="panel score-panel"><div class="celebration" aria-hidden="true"><span>⭐</span><span>🏆</span><span>✨</span></div><span class="eyebrow">Five islands. So many discoveries.</span><h1 lang="en">Spring Quest Complete!</h1><div class="score-big">${points}<small> / 100</small></div><p><strong>${points/20} dari 5 jawaban benar</strong></p><p class="muted" style="margin-top:1rem">${message}</p><details class="review"><summary>Lihat pembahasan lima checkpoint</summary>${questions.map((q,i)=>`<article><h3>${i+1}. ${q.title}</h3><p>Jawabanmu: ${'ABCDE'[game.answers[i]]}. ${q.options[game.answers[i]]}</p><p><strong>Kunci: ${'ABCDE'[q.answer]}</strong> · ${q.explanation}</p></article>`).join('')}</details><div class="row"><button class="btn" data-action="replay">Play Again ↻</button><button class="quiet" data-action="home">Back to Dashboard</button></div></section></div>`;
}
function openModal(html,mandatory=false){
 returnFocus=document.activeElement;mandatoryModal=mandatory;modal.innerHTML=html;if(!modal.open)modal.showModal();
 (modal.querySelector('button,input')||modal).focus({preventScroll:true});
}
function closeModal(){mandatoryModal=false;modal.close();if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});}
modal.addEventListener('cancel',e=>{if(mandatoryModal)e.preventDefault();});
// Keep focus in the native dialog on every supported browser.
modal.addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;const nodes=$$('button:not(:disabled),a[href],input:not(:disabled),select',modal).filter(n=>n.getClientRects().length);if(!nodes.length)return;
 const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
function settings(){
 openModal(`<div class="modal-content"><div class="spaced"><h2 id="modal-title">Nyaman untukmu</h2><button class="icon-btn" data-action="close-modal" aria-label="Tutup pengaturan">×</button></div><p class="muted tiny">Sesuaikan cara kamu belajar.</p>${[['large','Teks lebih besar'],['contrast','Kontras tinggi'],['reduce','Kurangi animasi']].map(([key,label])=>`<label class="settings-row" for="pref-${key}">${label}<input type="checkbox" id="pref-${key}" data-pref="${key}" ${pref[key]?'checked':''}></label>`).join('')}${store.user()?`<button class="link-button" data-action="reset">Reset progres game</button><p class="tiny muted">Hanya progres akunmu yang direset setelah konfirmasi.</p>`:''}<button class="btn" data-action="close-modal">Selesai</button></div>`);
}
function confirmReset(){openModal(`<div class="modal-content"><h2 id="modal-title">Mulai petualangan baru?</h2><p>Lima jawaban dan skor akun ini akan dihapus. Materi serta akunmu tetap tersedia.</p><div class="row"><button class="quiet" data-action="close-modal">Batal</button><button class="btn" data-action="confirm-reset">Ya, mulai lagi</button></div></div>`);}
document.addEventListener('click',e=>{
 const choice=e.target.closest('[data-choice]');if(choice){choose(Number(choice.dataset.choice));return;}
 const target=e.target.closest('[data-action]');if(!target||target.disabled)return;const action=target.dataset.action;e.preventDefault();
 switch(action){
  case 'home':navigate(store.user()?'dashboard':'auth');break;
  case 'brand-locked':notify('Selesaikan checkpoint yang sedang dimainkan untuk melanjutkan.');break;
  case 'settings':settings();break;
  case 'auth-switch':authMode=authMode==='login'?'register':'login';renderAuth();break;
  case 'toggle-password':{const input=$('#'+target.dataset.for),show=input.type==='password';input.type=show?'text':'password';target.textContent=show?'Sembunyi':'Lihat';target.setAttribute('aria-pressed',String(show));target.setAttribute('aria-label',`${show?'Sembunyikan':'Tampilkan'} kata sandi`);break;}
  case 'forgot':openModal('<div class="modal-content"><h2 id="modal-title">Tentang akun demo</h2><p>Akun ini hanya tersimpan di browser perangkatmu. Pengiriman email dan reset kata sandi daring belum terhubung.</p><p>Jika lupa kata sandi, buat akun demo baru dengan email contoh lain. Akun baru memiliki progres terpisah.</p><button class="btn" data-action="close-modal">Mengerti</button></div>');break;
  case 'logout':if(modal.open)closeModal();store.logout();game=freshProgress();gameStarted=false;navigate('auth');break;
  case 'learn':navigate('learn');break;
  case 'game':game=store.progress();gameStarted=game.level>0||game.phase!=='setup';navigate('game');break;
  case 'start-game':gameStarted=true;renderGame();renderHeader();$('#mass')?.focus({preventScroll:true});break;
  case 'launch':launch();break;
  case 'checkpoint':renderQuiz();main.focus({preventScroll:true});break;
  case 'continue':if(advance(game)){persist();closeModal();config={mass:0.3,kind:1,x:0.16};renderGame();renderHeader();window.scrollTo(0,0);main.focus({preventScroll:true});}break;
  case 'replay':case 'reset':confirmReset();break;
  case 'confirm-reset':store.resetProgress();game=freshProgress();gameStarted=false;closeModal();navigate('game');break;
  case 'close-modal':closeModal();break;
  case 'speak':speak(Number(target.dataset.topic));break;
  case 'pause-speech':{const i=Number(target.dataset.topic);if(speechIndex===i&&window.speechSynthesis){speechSynthesis.pause();statusSpeech(i,'Narasi dijeda. Tekan Putar untuk melanjutkan.');}break;}
  case 'stop-speech':if(speechIndex===Number(target.dataset.topic))stopSpeech();break;
 }
});
document.addEventListener('input',e=>{
 if(busy||game.phase!=='setup')return;
 if(e.target.id==='mass'){config.mass=Number(e.target.value)/1000;updateControls();}
 if(e.target.id==='compression'){config.x=Number(e.target.value)/100;updateControls();}
});
document.addEventListener('change',e=>{
 const node=e.target;
 if(node.name==='kind'&&!busy&&game.phase==='setup'){config.kind=Number(node.value);updateControls();}
 if(node.dataset.pref){pref[node.dataset.pref]=node.checked;store.savePrefs(pref);applyPrefs();}
 if(node.dataset.rate!==undefined){pref.rate=Number(node.value);store.savePrefs(pref);if(speechIndex===Number(node.dataset.rate))speak(speechIndex);}
});
window.addEventListener('pagehide',()=>{stopSpeech();cancelAnimationFrame(animation);});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&speechIndex!==null){speechSynthesis.pause();statusSpeech(speechIndex,'Narasi dijeda. Tekan Putar untuk melanjutkan.');}});
// Browser back/forward cannot reopen a past checkpoint: the persisted state is authoritative.
window.addEventListener('popstate',()=>{if(route==='game'){game=store.progress();renderGame();renderHeader();}});
navigate(store.user()?'dashboard':'auth');
