export const KINDS = [{name:'Lunak',k:80,limit:0.24},{name:'Sedang',k:140,limit:0.22},{name:'Kaku',k:220,limit:0.20}];
export const LEVELS = [
  {title:'First bounce',goal:'Kenali pegas dan antar Bouncie ke pulau pertama.',target:0.9,concept:'Benda elastis'},
  {title:'A little heavier',goal:'Ubah massa dan lihat bagaimana hasil lompatan berubah.',target:1.4,concept:'Pengaruh beban'},
  {title:'Find your spring',goal:'Bandingkan pegas lunak, sedang, dan kaku.',target:1.8,concept:'Konstanta pegas'},
  {title:'Know the limit',goal:'Perhatikan batas aman pemampatan pegas.',target:1.1,concept:'Batas elastis'},
  {title:'One last leap',goal:'Gunakan energi pegas untuk menuntaskan petualangan.',target:2.2,concept:'Energi potensial'}
];
// Ideal spring launcher at 45°, same takeoff/landing height, g=10 m/s².
// All spring energy becomes kinetic energy; spring mass and launch-rail height change are neglected.
export function simulate({mass=0.3,kind=1,x=0.16},target){
  if(!Number.isFinite(mass)||mass<=0||!Number.isFinite(x)||x<0||!KINDS[kind]||!Number.isFinite(target)||target<=0)throw new RangeError('Parameter tidak valid');
  const spring=KINDS[kind],energy=0.5*spring.k*x*x,force=spring.k*x;
  if(x>spring.limit+1e-9)return {outcome:'limit',energy:null,force:null,range:0,speed:0,time:0};
  const speed=Math.sqrt(2*energy/mass),range=speed*speed/10,time=2*speed*Math.SQRT1_2/10;
  const outcome=Math.abs(range-target)<=target*0.13?'success':range<target?'short':'over';
  return {outcome,energy,force,range,speed,time};
}
export const freshProgress=()=>({version:1,level:0,phase:'setup',answers:[],launches:[]});
export function score(answers,questions){return answers.reduce((s,a,i)=>s+(a===questions[i]?.answer?20:0),0);}
export function restoreProgress(raw){
  if(!raw||raw.version!==1)return freshProgress();
  const answers=[];for(const a of (Array.isArray(raw.answers)?raw.answers:[]).slice(0,5)){if(!Number.isInteger(a)||a<0||a>4)break;answers.push(a);}
  if(answers.length===5&&raw.phase==='done')return {...freshProgress(),answers,level:5,phase:'done',launches:Array.isArray(raw.launches)?raw.launches.slice(0,5):[]};
  const feedback=raw.phase==='feedback'&&answers.length>0;
  const level=feedback?answers.length-1:answers.length;
  const launches=Array.isArray(raw.launches)?raw.launches.slice(0,level+1):[];
  const phase=feedback?'feedback':raw.phase==='quiz'&&launches[level]?'quiz':'setup';
  return {version:1,level,phase,answers,launches};
}
export function answerOnce(progress,choice){
  if(progress.phase!=='quiz'||progress.answers.length!==progress.level||!Number.isInteger(choice)||choice<0||choice>4)return false;
  progress.answers.push(choice);progress.phase='feedback';return true;
}
export function advance(progress){
  if(progress.phase!=='feedback')return false;
  progress.level=progress.answers.length;progress.phase=progress.level===5?'done':'setup';return true;
}
