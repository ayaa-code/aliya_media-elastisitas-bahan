import {freshProgress,restoreProgress} from './core.js';
const KEY='stretch-measure-v1';
let db,failed=false;
try{db=JSON.parse(localStorage.getItem(KEY)||'null');}catch{failed=true;}
if(!db||typeof db!=='object'||!Array.isArray(db.accounts))db={accounts:[],progress:{},prefs:{}};
db.progress??={};db.prefs??={};
export const storageFailed=()=>failed;
function save(){try{localStorage.setItem(KEY,JSON.stringify(db));}catch{failed=true;}}
const encode=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
async function derive(password,salt){
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
 return encode(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},material,256)));
}
export async function register(name,email,password){
 email=email.trim().toLowerCase();
 if(db.accounts.some(a=>a.email===email))throw new Error('Email sudah terdaftar di perangkat ini. Silakan masuk.');
 if(!crypto.subtle)throw new Error('Buka aplikasi melalui localhost atau HTTPS untuk membuat akun.');
 const salt=encode(crypto.getRandomValues(new Uint8Array(16))),digest=await derive(password,salt);
 const account={id:crypto.randomUUID(),name:name.trim(),email,salt,digest};db.accounts.push(account);save();return account;
}
export async function login(email,password,remember){
 const account=db.accounts.find(a=>a.email===email.trim().toLowerCase());
 if(!account||await derive(password,account.salt)!==account.digest)throw new Error('Email atau kata sandi belum sesuai. Gunakan akun demo yang dibuat di perangkat ini.');
 try{localStorage.removeItem('stretch-session');sessionStorage.removeItem('stretch-session');(remember?localStorage:sessionStorage).setItem('stretch-session',account.id);}catch{failed=true;}
 current=account;return account;
}
let current=null;
try{const id=sessionStorage.getItem('stretch-session')||localStorage.getItem('stretch-session');current=db.accounts.find(a=>a.id===id)||null;}catch{failed=true;}
export const user=()=>current;
export function logout(){current=null;try{localStorage.removeItem('stretch-session');sessionStorage.removeItem('stretch-session');}catch{failed=true;}}
export function progress(){return restoreProgress(db.progress[current?.id]);}
export function saveProgress(p){if(current){db.progress[current.id]=structuredClone(p);save();}}
export function resetProgress(){saveProgress(freshProgress());}
export const prefs=()=>db.prefs;
export function savePrefs(p){db.prefs={...db.prefs,...p};save();}
