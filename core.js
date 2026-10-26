export const LEVELS = [
  {title:'First Steps'},
  {title:'Little Leap'},
  {title:'Springy Path'},
  {title:'Careful Bounce'},
  {title:'Final Trail'}
];
export const freshProgress=()=>({version:3,level:0,phase:'setup',answers:[],bonus:0,checkpoint:0});
export function score(answers,questions,bonus=0){return Math.max(0,answers.reduce((s,a,i)=>s+(a===questions[i]?.answer?20:0),0)+(Number.isFinite(bonus)?bonus:0));}
export function restoreProgress(raw){
  if(!raw||![2,3].includes(raw.version))return freshProgress();
  const answers=[];for(const a of (Array.isArray(raw.answers)?raw.answers:[]).slice(0,5)){if(!Number.isInteger(a)||a<0||a>4)break;answers.push(a);}
  const bonus=Math.max(-100,Math.min(200,Number.isFinite(raw.bonus)?raw.bonus:0));
  if(answers.length===5&&raw.phase==='done')return {...freshProgress(),answers,bonus,level:5,phase:'done'};
  const feedback=raw.phase==='feedback'&&answers.length>0;
  const level=raw.version===3?Math.max(0,Math.min(4,Number.isInteger(raw.level)?raw.level:0)):feedback?answers.length-1:Math.min(4,answers.length);
  const phase=feedback?'feedback':raw.phase==='quiz'?'quiz':'setup';
  return {version:3,level,phase,answers,bonus,checkpoint:raw.checkpoint===1?1:0};
}
export function answerOnce(progress,choice){
  if(progress.phase!=='quiz'||progress.answers.length!==progress.level||!Number.isInteger(choice)||choice<0||choice>4)return false;
  progress.answers.push(choice);progress.phase='feedback';return true;
}
export function advance(progress){
  if(progress.phase!=='feedback')return false;
  progress.phase='setup';return true;
}
export function addBonus(progress,amount){
 if(!Number.isFinite(amount))return progress.bonus;
 progress.bonus=Math.max(-100,Math.min(200,(progress.bonus||0)+amount));return progress.bonus;
}
