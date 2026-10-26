import http from 'node:http';
import {readFile,realpath} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=await realpath(fileURLToPath(new URL('../',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};
const server=http.createServer(async(req,res)=>{try{
 const rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';
 if(rel.split(/[\\/]/).some(p=>p.startsWith('.'))){res.writeHead(403).end();return;}
 const file=await realpath(path.resolve(root,rel));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(await readFile(file));
}catch{res.writeHead(404).end('Not found');}});
server.listen(Number(process.env.PORT)||5180,'127.0.0.1',()=>console.log(`Stretch & Measure: http://127.0.0.1:${server.address().port}`));
