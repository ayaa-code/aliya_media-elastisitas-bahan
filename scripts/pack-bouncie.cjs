// Mechanical sprite extraction/packing, preserving the generated RGBA artwork.
const sharp=require(process.env.SHARP_MODULE||'sharp');const fs=require('node:fs');
(async()=>{const input=process.argv[2];if(!input)throw Error('Pass source sheet path');const meta=await sharp(input).metadata();if(!meta.hasAlpha)throw Error('Sprite sheet must have transparency');const cw=Math.floor(meta.width/4),ch=Math.floor(meta.height/3),frames=[];let scale;
for(let i=0;i<12;i++){
 const row=Math.floor(i/4),edges=[0,360,687,1024].map(v=>Math.round(v*meta.height/1024)),rowHeight=edges[row+1]-edges[row];
 const raw=await sharp(input).extract({left:i%4*cw,top:edges[row],width:cw,height:rowHeight}).ensureAlpha().raw().toBuffer();let left=cw,top=rowHeight,right=-1,bottom=-1;
 for(let y=0;y<rowHeight;y++)for(let x=0;x<cw;x++)if(raw[(y*cw+x)*4+3]>20){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 if(right<left)throw Error(`Empty frame ${i}`);if(i===0)scale=292/(bottom-top+1);
 const width=Math.min(248,Math.round((right-left+1)*scale)),height=Math.min(306,Math.round((bottom-top+1)*scale));
 const data=await sharp(raw,{raw:{width:cw,height:rowHeight,channels:4}}).extract({left,top,width:right-left+1,height:bottom-top+1}).resize(width,height,{fit:'inside'}).png().toBuffer();
 const actual=await sharp(data).metadata();frames.push({input:data,left:i%4*256+Math.round((256-actual.width)/2),top:Math.floor(i/4)*320+316-actual.height});
}
fs.mkdirSync('assets',{recursive:true});await sharp({create:{width:1024,height:960,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(frames).webp({quality:92,alphaQuality:100}).toFile('assets/bouncie-atlas.webp');console.log('Packed 12 transparent frames into assets/bouncie-atlas.webp');
})().catch(e=>{console.error(e);process.exitCode=1;});
