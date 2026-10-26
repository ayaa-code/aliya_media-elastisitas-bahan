export const LEVELS=[{title:'First Steps'},{title:'Little Leap'},{title:'Springy Path'},{title:'Careful Bounce'},{title:'Final Trail'}];
export const freshProgress=()=>({version:4,level:0,phase:'setup',answers:[],adventure:0,checkpoint:{x:75,y:390},claimed:[]});
export function score(answers,questions){return answers.reduce((s,a,i)=>s+(a===questions[i]?.answer?20:0),0);}
export function restoreProgress(raw){
 if(!raw||![2,3,4].includes(raw.version))return freshProgress();
 const answers=[];for(const a of (Array.isArray(raw.answers)?raw.answers:[]).slice(0,5)){if(!Number.isInteger(a)||a<0||a>4)break;answers.push(a);}
 const done=raw.phase==='done'&&answers.length===5;
 const level=done?5:Math.max(0,Math.min(4,Number.isInteger(raw.level)?raw.level:answers.length));
 const feedback=raw.phase==='feedback'&&answers.length===level+1;
 const phase=done?'done':feedback?'feedback':raw.phase==='quiz'&&answers.length===level?'quiz':'setup';
 const start=Math.min(level,4)*1800,cp=raw.version===4&&raw.checkpoint&&Number.isFinite(raw.checkpoint.x)&&Number.isFinite(raw.checkpoint.y)?{x:Math.max(start+40,Math.min(start+1750,raw.checkpoint.x)),y:Math.max(340,Math.min(400,raw.checkpoint.y))}:{x:start+(answers.length>level?1450:75),y:390};
 return {version:4,level,phase,answers,checkpoint:cp,adventure:raw.version===4?Math.max(0,Math.min(10000,Number.isFinite(raw.adventure)?raw.adventure:0)):0,claimed:Array.isArray(raw.claimed)?[...new Set(raw.claimed.filter(v=>typeof v==='string'))].slice(0,100):[]};
}
export function answerOnce(p,choice){if(p.phase!=='quiz'||p.answers.length!==p.level||!Number.isInteger(choice)||choice<0||choice>4)return false;p.answers.push(choice);p.phase='feedback';return true;}
export function advance(p){if(p.phase!=='feedback')return false;p.phase='setup';return true;}
export function addBonus(p,amount){p.adventure=Math.max(0,(p.adventure||0)+(Number.isFinite(amount)?amount:0));return p.adventure;}
