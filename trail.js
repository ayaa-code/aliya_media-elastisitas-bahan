// Small deterministic platformer. Coordinates are world pixels; player.y is feet position.
export function layout(level){
 const raised=level>=2;
 return {platforms:[{x:0,y:390,w:285},{x:350,y:raised?355:390,w:280},{x:665,y:390,w:295}],hazards:level?[{x:455,y:(raised?355:390)-25,w:30,h:25},...(level>2?[{x:790,y:365,w:32,h:25}]:[])]:[],star:{x:710,y:330},finish:910};
}
export function createTrail({root,level,checkpoint=0,answered,onStar,onCheckpoint,onFinish,onFall,reduced}){
 const svg=root.querySelector('svg'),world=layout(level),keys=new Set();let raf=0,last=0,time=0,paused=false,disposed=false,starTaken=answered;
 let player={x:checkpoint?700:75,y:390,vy:0,grounded:true},safe=checkpoint?700:75,invulnerable=0;
 const platforms=world.platforms;
 function draw(){
  const moving=level>=3&&!reduced()?Math.sin(time/1800)*15:0;platforms[1].y=(level>=2?355:390)+moving;
  svg.querySelector('#platforms').innerHTML=platforms.map(p=>`<g><rect x="${p.x}" y="${p.y}" width="${p.w}" height="110" rx="12" fill="#bc9465"/><rect x="${p.x}" y="${p.y}" width="${p.w}" height="15" rx="7" fill="#4b8a24"/><path d="M${p.x+8} ${p.y+3}h${p.w-16}" stroke="#9acb00" stroke-width="6"/></g>`).join('');
  svg.querySelector('#hazards').innerHTML=world.hazards.map(h=>`<rect x="${h.x}" y="${h.y}" width="${h.w}" height="${h.h}" rx="10" fill="#e88a62" stroke="#183f72" stroke-width="3"/>`).join('');
  svg.querySelector('#trail-star').style.display=starTaken?'none':'';
  svg.querySelector('#trail-player').setAttribute('transform',`translate(${player.x} ${player.y-57}) scale(.82)`);
  svg.dataset.x=player.x.toFixed(1);svg.dataset.y=player.y.toFixed(1);svg.dataset.grounded=String(player.grounded);
 }
 function jump(){if(!paused&&player.grounded){player.vy=-560;player.grounded=false;}}
 function respawn(){player={x:safe,y:390,vy:0,grounded:true};invulnerable=1200;onFall();}
 function frame(now){
  if(disposed)return;const dt=Math.min((now-last||16)/1000,.025);last=now;
  if(document.querySelector('dialog[open]')||document.hidden)keys.clear();
  if(!paused&&!document.hidden&&!document.querySelector('dialog[open]')){
   time+=dt*1000;invulnerable-=dt*1000;const oldY=player.y;
   player.x=Math.max(25,Math.min(935,player.x+((keys.has('right')?1:0)-(keys.has('left')?1:0))*230*dt));
   player.vy+=1350*dt;player.y+=player.vy*dt;player.grounded=false;
   for(const p of platforms)if(player.x+18>p.x&&player.x-18<p.x+p.w&&oldY<=p.y+7&&player.y>=p.y&&player.vy>=0){player.y=p.y;player.vy=0;player.grounded=true;break;}
   if(player.x>=685&&player.grounded&&safe!==700){safe=700;onCheckpoint();}
   if(player.y>550)respawn();
   if(invulnerable<=0&&world.hazards.some(h=>player.x+16>h.x&&player.x-16<h.x+h.w&&player.y>h.y&&player.y-65<h.y+h.h))respawn();
   if(!starTaken&&Math.abs(player.x-world.star.x)<35&&Math.abs(player.y-42-world.star.y)<48){starTaken=true;safe=700;paused=true;keys.clear();onCheckpoint();onStar();}
   if(player.x>=world.finish&&player.grounded){if(starTaken&&answered){paused=true;onFinish();}else root.querySelector('#scene-caption').textContent='Ambil ⭐ dan jawab Star Challenge terlebih dahulu.';}
  }
  draw();raf=requestAnimationFrame(frame);
 }
 function keydown(e){if(paused||document.querySelector('dialog[open]'))return;const key=e.key.toLowerCase();if(['arrowleft','a','arrowright','d',' ','arrowup','w'].includes(key)){e.preventDefault();if(['arrowleft','a'].includes(key))keys.add('left');if(['arrowright','d'].includes(key))keys.add('right');if([' ','arrowup','w'].includes(key)&&!e.repeat)jump();}}
 function keyup(e){if(['arrowleft','a'].includes(e.key.toLowerCase()))keys.delete('left');if(['arrowright','d'].includes(e.key.toLowerCase()))keys.delete('right');}
 const cleanups=[];
 root.querySelectorAll('[data-trail]').forEach(button=>{const direction=button.dataset.trail;const down=e=>{e.preventDefault();button.setPointerCapture?.(e.pointerId);if(direction==='jump')jump();else keys.add(direction);};const up=()=>keys.delete(direction);const click=e=>{if(e.detail===0){if(direction==='jump')jump();else{player.x+=direction==='left'?-35:35;draw();}}};button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('lostpointercapture',up);button.addEventListener('click',click);cleanups.push(()=>{button.removeEventListener('pointerdown',down);button.removeEventListener('pointerup',up);button.removeEventListener('click',click);});});
 const blur=()=>keys.clear();window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',blur);draw();raf=requestAnimationFrame(frame);
 return {pause(){paused=true;keys.clear();},resume(done=false){answered=done||answered;paused=false;keys.clear();player={x:safe,y:390,vy:0,grounded:true};},destroy(){disposed=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);cleanups.forEach(fn=>fn());}};
}
