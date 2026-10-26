export const LEVELS = [
  {title:'First Bounce',goal:'Tangkap bintang pertama untuk membuka Star Challenge.',concept:'Benda elastis',speed:0.18},
  {title:'Keep Moving',goal:'Geser Bouncie ke kiri atau kanan untuk menangkap koleksi.',concept:'Pertambahan panjang pegas',speed:0.20},
  {title:'Spring Smart',goal:'Tangkap bintang untuk melanjutkan tantangan berikutnya.',concept:'Konstanta pegas',speed:0.22},
  {title:'Bounce with Care',goal:'Jangan biarkan terlalu banyak koleksi terlewat.',concept:'Batas elastis',speed:0.24},
  {title:'Final Bounce',goal:'Satu bintang terakhir akan menuntaskan petualangan.',concept:'Energi potensial pegas',speed:0.26}
];
export const freshProgress=()=>({version:2,level:0,phase:'setup',answers:[],bonus:0});
export function score(answers,questions,bonus=0){return Math.max(0,answers.reduce((s,a,i)=>s+(a===questions[i]?.answer?20:0),0)+(Number.isFinite(bonus)?bonus:0));}
export function restoreProgress(raw){
  if(!raw||raw.version!==2)return freshProgress();
  const answers=[];for(const a of (Array.isArray(raw.answers)?raw.answers:[]).slice(0,5)){if(!Number.isInteger(a)||a<0||a>4)break;answers.push(a);}
  const bonus=Math.max(-100,Math.min(200,Number.isFinite(raw.bonus)?raw.bonus:0));
  if(answers.length===5&&raw.phase==='done')return {...freshProgress(),answers,bonus,level:5,phase:'done'};
  const feedback=raw.phase==='feedback'&&answers.length>0;
  const level=feedback?answers.length-1:answers.length;
  const phase=feedback?'feedback':raw.phase==='quiz'?'quiz':'setup';
  return {version:2,level,phase,answers,bonus};
}
export function answerOnce(progress,choice){
  if(progress.phase!=='quiz'||progress.answers.length!==progress.level||!Number.isInteger(choice)||choice<0||choice>4)return false;
  progress.answers.push(choice);progress.phase='feedback';return true;
}
export function advance(progress){
  if(progress.phase!=='feedback')return false;
  progress.level=progress.answers.length;progress.phase=progress.level===5?'done':'setup';return true;
}
export function addBonus(progress,amount){
 if(!Number.isFinite(amount))return progress.bonus;
 progress.bonus=Math.max(-100,Math.min(200,(progress.bonus||0)+amount));return progress.bonus;
}
