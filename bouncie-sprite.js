const ASSET_URL=new URL('./assets/bouncie-atlas.webp',import.meta.url).href;
export function spriteHero(){return `<svg viewBox="0 0 256 320" role="img" aria-label="Bouncie perempuan bergaya 3D, berkuncir dan berkaus gambar pegas"><svg width="256" height="320" viewBox="0 0 256 320" overflow="hidden"><image href="${ASSET_URL}" width="1024" height="960"/></svg></svg>`;}
// Preload during the intro. If loading fails the original vector is kept as a fallback.
const preload=new Promise(resolve=>{const image=new Image();const timer=setTimeout(()=>resolve(false),12000);image.onload=()=>{clearTimeout(timer);resolve(true);};image.onerror=()=>{clearTimeout(timer);resolve(false);};image.src=ASSET_URL;});
export function mountBouncie(group){
 let ready=false,destroyed=false,current=-1;
 const loaded=preload.then(ok=>{if(destroyed)return false;if(ok){group.innerHTML=`<ellipse id="bouncie-shadow" cx="0" cy="0" rx="22" ry="4" fill="#183f72" opacity=".18"/><g id="bouncie-facing"><svg x="-44" y="-109" width="88" height="110" viewBox="0 0 256 320" overflow="hidden"><image id="bouncie-frame" href="${ASSET_URL}" width="1024" height="960"/></svg></g>`;ready=true;}return ok;});
 return {loaded,draw({x,y,state,time,facing=1,reduced=false}){
  if(!ready){group.setAttribute('transform',`translate(${x} ${y-57}) scale(.82)`);return;}
  let frame=0;
  if(state==='walk')frame=4+Math.floor(time/100)%4;
  else if(state==='jump')frame=8;
  else if(state==='fall')frame=9;
  else if(state==='land')frame=10;
  else if(state==='hurt')frame=11;
  else if(state==='happy')frame=3;
  else if(!reduced){const phase=time%5000;frame=phase>4700?1:Math.floor(time/900)%2===0?0:2;}
  group.setAttribute('transform',`translate(${x} ${y})`);
  group.dataset.animation=state;group.dataset.frame=String(frame);group.dataset.facing=String(facing);
  group.querySelector('#bouncie-facing').setAttribute('transform',`scale(${facing} 1)`);
  group.querySelector('#bouncie-shadow').setAttribute('opacity',state==='jump'||state==='fall'?'.08':'.18');
  if(frame!==current){const image=group.querySelector('#bouncie-frame');image.setAttribute('x',String(-(frame%4)*256));image.setAttribute('y',String(-Math.floor(frame/4)*320));current=frame;}
 },destroy(){destroyed=true;}};
}
