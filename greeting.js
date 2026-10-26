export function greetingArt(name,hello='Hello'){return `<div class="greeting-stage"><div class="greeting-bubble" aria-hidden="true">${hello}, ${name}! 👋</div><svg class="greeting-sprite" viewBox="0 0 384 512" role="img" aria-label="Bouncie 3D menyapa dengan melambaikan tangan"><svg width="384" height="512" viewBox="0 0 384 512" overflow="hidden"><image class="wave-frame" href="./assets/bouncie-wave.webp" width="768" height="1024"/></svg></svg><div class="greeting-ground" aria-hidden="true"></div></div>`;}
export function startGreeting(container,reduced){
 const stage=container?.querySelector('.greeting-stage');if(!stage)return ()=>{};const image=stage.querySelector('.wave-frame'),bubble=stage.querySelector('.greeting-bubble');let raf=0,time=0,last=0,ready=false,ended=false;
 function pose(frame){image.setAttribute('x',String(-(frame%2)*384));image.setAttribute('y',String(-Math.floor(frame/2)*512));stage.dataset.frame=String(frame);}
 const asset=new Image();asset.onload=()=>{ready=true;};asset.onerror=()=>{image.setAttribute('href','./assets/bouncie-atlas.webp');image.setAttribute('width','1536');image.setAttribute('height','1536');ended=true;bubble.hidden=false;};asset.src='./assets/bouncie-wave.webp';
 function step(now){if(ended)return;const dt=Math.min(now-(last||now),40);last=now;if(ready&&!document.hidden){if(reduced()){pose(1);bubble.hidden=false;ended=true;return;}time+=dt;if(time<250)pose(0);else if(time<3200)pose([1,2,1,2,1,2,1,2][Math.floor((time-250)/360)%8]);else if(time<3550)pose(3);else{pose(0);bubble.hidden=true;ended=true;return;}bubble.hidden=time<250;}
 raf=requestAnimationFrame(step);}
 pose(0);bubble.hidden=true;raf=requestAnimationFrame(step);return ()=>{ended=true;cancelAnimationFrame(raf);};
}
