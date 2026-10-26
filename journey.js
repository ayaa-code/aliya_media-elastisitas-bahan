import {mountBouncie} from './bouncie-sprite.js';
export const SECTION=1800;
export function journeyLayout(){
 const platforms=[],hazards=[],stars=[],pads=[];
 for(let level=0;level<5;level++){
  const start=level*SECTION,split=level%2?490:520;
  platforms.push({id:`${level}-a`,x:start,y:390,w:split},{id:`${level}-b`,x:start+split+60,y:level>=2?360:390,w:1120-split-60,moving:level>=3},{id:`${level}-c`,x:start+1180,y:390,w:620});
  hazards.push({id:`${level}-log`,x:start+270,y:365,w:44,h:25,type:'log'});
  if(level>=1)hazards.push({id:`${level}-rock`,x:start+850,y:level>=2?334:364,w:34,h:26,type:'rock'});
  if(level>=3)hazards.push({id:`${level}-rolling`,x:start+1610,y:360,w:34,h:30,type:'rolling'});
  if(level>=2)pads.push({x:start+1240,y:390});
  stars.push({x:start+1450,y:330});
 }
 return {platforms,hazards,stars,pads};
}
export function scene(){return `<svg id="world" viewBox="0 0 960 500" role="img" aria-label="Petualangan Bouncie bergulir dengan platform rumput, pengejar ungu dan bintang kuis"><defs><linearGradient id="earth" x2=".3" y2="1"><stop stop-color="#d6aa69"/><stop offset=".55" stop-color="#a77848"/><stop offset="1" stop-color="#685743"/></linearGradient><linearGradient id="grass" x2="0" y2="1"><stop stop-color="#c1ed48"/><stop offset=".5" stop-color="#78b82c"/><stop offset="1" stop-color="#356f25"/></linearGradient><radialGradient id="puff"><stop offset="0" stop-color="#d9b3ff"/><stop offset=".65" stop-color="#9e61dd"/><stop offset="1" stop-color="#62349c"/></radialGradient><filter id="softshadow"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-opacity=".23"/></filter><pattern id="earth-dots" width="75" height="60" patternUnits="userSpaceOnUse"><path d="M10 13l22 9-8 17-20-8Z M48 40l16-5 9 14-18 9Z" fill="#efcf9a" opacity=".32"/><circle cx="46" cy="12" r="4" fill="#6e593b" opacity=".23"/></pattern></defs><rect width="960" height="500" fill="#bce8fa"/><g id="far-scenery"><image href="./assets/journey-background.webp" width="1440" height="500" preserveAspectRatio="xMidYMid slice"/></g><g id="cloud-layer" fill="#fff" opacity=".85"></g><g id="sky-visitors"></g><g id="near-trees" opacity=".85"></g><g id="world-objects"></g><g id="chaser"><ellipse cy="-4" rx="27" ry="6" fill="#183f72" opacity=".18"/><g id="chaser-fallback"><circle cy="-33" r="30" fill="url(#puff)"/><g fill="#ad75e7">${Array.from({length:14},(_,i)=>{const a=i*Math.PI/7;return `<circle cx="${Math.cos(a)*27}" cy="${-33+Math.sin(a)*27}" r="7"/>`;}).join('')}</g><ellipse cx="-10" cy="-36" rx="7" ry="10" fill="white"/><ellipse cx="10" cy="-36" rx="7" ry="10" fill="white"/><circle cx="-8" cy="-34" r="4" fill="#183f72"/><circle cx="12" cy="-34" r="4" fill="#183f72"/><path d="M-8-19q10 12 18-2" stroke="#4c286f" stroke-width="4" fill="none"/><ellipse cx="-16" cy="-2" rx="10" ry="6" fill="#674296"/><ellipse cx="16" cy="-2" rx="10" ry="6" fill="#674296"/></g></g><g id="trail-player"></g><text id="scene-caption" x="480" y="485" text-anchor="middle" fill="#183f72" font-family="system-ui" font-size="16" font-weight="800"></text></svg>`;}
function platformArt(p){return `<g transform="translate(${p.x} ${p.y})" filter="url(#softshadow)"><path d="M0 8Q0 0 15 0H${p.w-15}Q${p.w} 0 ${p.w} 15L${p.w-10} 140Q${p.w/2} 165 10 140Z" fill="url(#earth)"/><rect y="25" width="${p.w}" height="120" fill="url(#earth-dots)" rx="15"/><rect x="-3" y="-7" width="${p.w+6}" height="27" rx="13" fill="url(#grass)"/><path d="M8 0H${p.w-8}" stroke="#d0f46a" stroke-width="4" stroke-linecap="round"/>${Array.from({length:Math.ceil(p.w/25)},(_,i)=>`<path d="M${i*25+10} 18q3 17 7 0q3 10 7-2" fill="#4f9027"/>`).join('')}</g>`;}
export function createTrail({root,progress,onStar,onCheckpoint,onLevel,onFinish,onPenalty,onReward,reduced}){
 const svg=root.querySelector('#world'),world=journeyLayout(),keys=new Set(),sprite=mountBouncie(svg.querySelector('#trail-player'));
 let viewWidth=960;const resize=()=>{viewWidth=svg.clientWidth<650?600:960;svg.setAttribute('viewBox',`0 0 ${viewWidth} 500`);};resize();window.addEventListener('resize',resize);
 let safe=progress.checkpoint||{x:progress.level*SECTION+75,y:390},player={x:safe.x,y:safe.y,vy:0,grounded:true},level=progress.level,camera=Math.max(0,safe.x-350),chaserX=safe.x-420;
 let last=0,time=0,raf=0,disposed=false,paused=false,ready=false,facing=1,landing=0,reaction=0,invulnerable=2000,celebrate=false,coyote=0,buffer=0;
 const objects=svg.querySelector('#world-objects'),caption=svg.querySelector('#scene-caption');
 sprite.loaded.then(ok=>{ready=true;if(!disposed)status(ok?'Siap! Jelajahi jalur ke kanan.':'Karakter cadangan aktif. Aset 3D dapat dicoba lagi dengan memuat ulang.');});
 function status(text){const node=root.querySelector('#game-status');if(node)node.textContent=text;}
 function checkpoint(x,y=390){if(x>safe.x){safe={x,y};progress.checkpoint=safe;onCheckpoint(safe);}}
 function reward(id,amount){if(progress.claimed.includes(id))return;progress.claimed.push(id);onReward(amount);}
 function fail(caught=false){if(invulnerable>0)return;onPenalty(caught?10:5);player={x:safe.x,y:safe.y,vy:0,grounded:true};chaserX=safe.x-420;invulnerable=2400;reaction=450;keys.clear();status(caught?'Tertangkap! −10 Adventure Points. Coba lagi dari checkpoint.':'Try again! −5 Adventure Points. Nilai kuis tetap aman.');}
 function jump(){buffer=110;}
 function draw(){
  camera=Math.max(0,Math.min(SECTION*5-viewWidth,player.x-viewWidth*.37));
  const left=camera-100,right=camera+viewWidth+100;
  const visible=world.platforms.filter(p=>p.x+p.w>left&&p.x<right);
  const hazards=world.hazards.filter(h=>h.x>left&&h.x<right);
  objects.innerHTML=visible.map(p=>platformArt({...p,y:p.y+(p.moving?Math.sin(time/1500)*9:0)})).join('')+hazards.map(h=>{const x=h.x+(h.type==='rolling'?Math.sin(time/1000)*25:0);return h.type==='log'?`<g transform="translate(${x} ${h.y})"><rect width="${h.w}" height="${h.h}" rx="10" fill="#92613a" stroke="#5c3c27" stroke-width="2"/><ellipse cx="${h.w-6}" cy="12" rx="8" ry="12" fill="#deb780"/><path d="M5 7h22m-20 9h18" stroke="#c3925b" stroke-width="3"/></g>`:`<ellipse cx="${x+17}" cy="${h.y+15}" rx="19" ry="${h.h/2}" fill="#98a5ad" stroke="#5e707a" stroke-width="3"/>`;}).join('')+
   world.stars.map((s,i)=>i>=progress.answers.length&&s.x>left&&s.x<right?`<g transform="translate(${s.x} ${s.y})"><circle r="28" fill="#fff5bf" opacity=".75"/><text text-anchor="middle" y="11" font-size="34">⭐</text><text text-anchor="middle" y="-35" fill="#183f72" font-size="23" font-weight="900">?</text></g>`:'').join('')+
   world.pads.filter(p=>p.x>left&&p.x<right).map(p=>`<g transform="translate(${p.x} ${p.y})"><path d="M-15-5l25-6-25-7 25-7-25-7" fill="none" stroke="#e1a42f" stroke-width="6"/><ellipse cy="-32" rx="26" ry="7" fill="#4caee0" stroke="#1d5b91" stroke-width="3"/></g>`).join('')+
   (safe.x>left&&safe.x<right?`<path d="M${safe.x} ${safe.y}v-46l23 8-23 10" fill="#f7c948" stroke="#183f72" stroke-width="3"/>`:'')+
   (right>SECTION*5-100?`<path d="M${SECTION*5-65} 390V280l45 16-45 16" fill="#4b8a24" stroke="#183f72" stroke-width="4"/>`:'');
  objects.setAttribute('transform',`translate(${-camera} 0)`);
  svg.querySelector('#far-scenery').setAttribute('transform',`translate(${-(reduced()?0:camera*.045)} 0)`);
  svg.querySelector('#cloud-layer').innerHTML=[120,450,790].map((x,i)=>`<g transform="translate(${reduced()?x:(x+time*.009-camera*.06+1920)%1200-120} ${70+i%2*25})"><ellipse rx="65" ry="17"/><circle cx="-20" cy="-15" r="24"/><circle cx="15" cy="-21" r="30"/></g>`).join('');
  svg.querySelector('#near-trees').innerHTML=[-150,1100].map((x,i)=>`<g transform="translate(${x-(reduced()?0:camera*.3%1200)} 270)"><path d="M0 130L10 0" stroke="#88633e" stroke-width="17"/><g fill="url(#grass)" filter="url(#softshadow)"><circle cx="0" cy="0" r="40"/><circle cx="-30" cy="-15" r="33"/><circle cx="28" cy="-25" r="38"/></g></g>`).join('');
  const sky=svg.querySelector('#sky-visitors'),birdPhase=time%22000,planePhase=time%45000;
  sky.innerHTML=reduced()?'':(birdPhase<7000?`<g transform="translate(${birdPhase*.16-100} 140)" fill="none" stroke="#345f91" stroke-width="4"><path d="M-15 0q8-14 16 0q8-14 16 0m30 18q8-14 16 0q8-14 16 0"/></g>`:'')+(planePhase>15000&&planePhase<22000?`<g transform="translate(${(planePhase-15000)*.17-100} 75)"><ellipse rx="32" ry="8" fill="#f7c948"/><path d="M-10-23l28 48m-36-31-12-10" stroke="#e4ac2f" stroke-width="9"/><path d="M35-16v32" stroke="#183f72" stroke-width="3"/></g>`:'');
  const walking=player.grounded&&(keys.has('right')||keys.has('left'));
  sprite.draw({x:player.x-camera,y:player.y,state:celebrate?'happy':reaction>0?'hurt':!player.grounded?(player.vy<0?'jump':'fall'):landing>0?'land':walking?'walk':'idle',time,facing,reduced:reduced()});
  const chasePlatform=world.platforms.find(p=>chaserX>=p.x&&chaserX<=p.x+p.w);
  svg.querySelector('#chaser').setAttribute('transform',`translate(${chaserX-camera} ${(chasePlatform?.y||390)-(reduced()?0:Math.abs(Math.sin(time/120))*5)})`);
  svg.querySelector('#chaser').setAttribute('opacity',progress.relaxed?'.45':'1');
  svg.dataset.x=player.x.toFixed(1);svg.dataset.y=player.y.toFixed(1);svg.dataset.camera=camera.toFixed(1);svg.dataset.grounded=String(player.grounded);svg.dataset.chaser=chaserX.toFixed(1);svg.dataset.time=time.toFixed(0);
 }
 function frame(now){
  if(disposed)return;const dt=Math.min((now-last||16)/1000,.025);last=now;
  const stopped=paused||document.hidden||!!document.querySelector('dialog[open]');if(stopped)keys.clear();
  if(ready&&!stopped){
   time+=dt*1000;landing-=dt*1000;reaction-=dt*1000;invulnerable-=dt*1000;buffer-=dt*1000;coyote=player.grounded?90:coyote-dt*1000;
   if(buffer>0&&coyote>0){player.vy=-560;player.grounded=false;buffer=0;coyote=0;landing=0;}
   const oldY=player.y,wasGrounded=player.grounded;if(keys.has('right'))facing=1;else if(keys.has('left'))facing=-1;
   player.x=Math.max(level*SECTION+40,Math.min((level+1)*SECTION-35+(progress.answers.length>level?50:0),player.x+((keys.has('right')?1:0)-(keys.has('left')?1:0))*230*dt));
   player.vy+=1350*dt;player.y+=player.vy*dt;player.grounded=false;
   for(const p of world.platforms){const y=p.y+(p.moving?Math.sin(time/1500)*9:0);if(player.x+16>p.x&&player.x-16<p.x+p.w&&oldY<=y+8&&player.y>=y&&player.vy>=0){player.y=y;player.vy=0;player.grounded=true;if(!wasGrounded)landing=90;if(player.x>p.x+60&&p.x>=level*SECTION)checkpoint(p.x+60,y);break;}}
   if(player.y>570)fail();
   for(const h of world.hazards){if(Math.abs(player.x-h.x)>90)continue;const hx=h.x+(h.type==='rolling'?Math.sin(time/1000)*25:0);if(invulnerable<=0&&player.x+15>hx&&player.x-15<hx+h.w&&player.y>h.y&&player.y-65<h.y+h.h){fail();break;}if(player.x>hx+h.w+20)reward(h.id,5);}
   for(const pad of world.pads)if(player.grounded&&Math.abs(player.x-pad.x)<18){player.vy=-630;player.grounded=false;coyote=0;}
   const star=world.stars[level];if(progress.answers.length===level&&Math.abs(player.x-star.x)<35&&Math.abs(player.y-42-star.y)<50){checkpoint(star.x);paused=true;celebrate=true;keys.clear();onStar();}
   if(!paused){chaserX=Math.max(player.x-470,chaserX+(progress.relaxed?85:level*6+110)*dt);if(!progress.relaxed&&invulnerable<=0&&player.x-chaserX<42)fail(true);}
   if(player.x>=(level+1)*SECTION-20&&player.grounded&&progress.answers.length>level){reward(`level-${level}`,25);if(level===4){paused=true;onFinish();}else{level++;checkpoint(level*SECTION+55);onLevel(level);status(`Level ${level+1} — ${['First Steps','Little Leap','Springy Path','Careful Bounce','Final Trail'][level]}`);}}
  }
  draw();raf=requestAnimationFrame(frame);
 }
 function down(e){if(paused||document.querySelector('dialog[open]'))return;const key=e.key.toLowerCase();if(['a','d','arrowleft','arrowright','w','arrowup',' '].includes(key)){e.preventDefault();if(['a','arrowleft'].includes(key))keys.add('left');else if(['d','arrowright'].includes(key))keys.add('right');else if(!e.repeat)jump();}}
 function up(e){if(['a','arrowleft'].includes(e.key.toLowerCase()))keys.delete('left');if(['d','arrowright'].includes(e.key.toLowerCase()))keys.delete('right');}
 const clean=[];root.querySelectorAll('[data-trail]').forEach(button=>{const action=button.dataset.trail;const press=e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);if(action==='jump')jump();else keys.add(action);};const release=()=>keys.delete(action);const click=e=>{if(e.detail===0){if(action==='jump')jump();else{keys.add(action);setTimeout(()=>keys.delete(action),150);}}};for(const [event,fn]of [['pointerdown',press],['pointerup',release],['pointercancel',release],['lostpointercapture',release],['click',click]]){button.addEventListener(event,fn);clean.push(()=>button.removeEventListener(event,fn));}});
 const blur=()=>keys.clear();window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);draw();raf=requestAnimationFrame(frame);
 return {pause(){paused=true;keys.clear();},resume(afterQuiz=false){paused=false;celebrate=false;keys.clear();if(afterQuiz){player={x:safe.x,y:safe.y,vy:0,grounded:true};chaserX=safe.x-420;invulnerable=2200;}},destroy(){disposed=true;sprite.destroy();cancelAnimationFrame(raf);clean.forEach(fn=>fn());window.removeEventListener('resize',resize);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);}};
}
