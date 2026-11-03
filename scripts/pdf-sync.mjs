import { readFile, mkdir, copyFile, writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

export async function syncPdfs(source, destination) {
  // Validate every source first: a missing/invalid file must not partially update the site.
  const files = await Promise.all(Array.from({ length:6 },async(_,i)=>{
    const name=`${i+1}.pdf`;
    let bytes;
    try { bytes=await readFile(path.join(source,name)); }
    catch { throw new Error(`Missing PDF: ${path.join(source,name)}. Keep the names 1.pdf through 6.pdf.`); }
    if(!bytes.subarray(0,1024).includes(Buffer.from('%PDF-')))throw new Error(`${name} is not a PDF file. No files were updated.`);
    return {name,hash:createHash('sha256').update(bytes).digest('hex').slice(0,16),bytes:bytes.length};
  }));
  await mkdir(destination,{recursive:true});
  const staging=path.join(destination,`.staging-${process.pid}`);await mkdir(staging,{recursive:true});
  try {
    for(const f of files)await copyFile(path.join(source,f.name),path.join(staging,f.name));
    for(const f of files)await rename(path.join(staging,f.name),path.join(destination,f.name));
    const manifest={files:Object.fromEntries(files.map(f=>[f.name,{hash:f.hash,bytes:f.bytes}]))};
    await writeFile(path.join(destination,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
    return manifest;
  } finally {await rm(staging,{recursive:true,force:true});}
}
