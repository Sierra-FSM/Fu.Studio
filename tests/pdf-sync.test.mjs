import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { syncPdfs } from '../scripts/pdf-sync.mjs';

test('six-file sync creates stable hashes; changing a PDF changes its version',async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),'fu-pdf-'));const source=path.join(dir,'source');const dest=path.join(dir,'site');
  try {
    await mkdir(source);for(let i=1;i<=6;i++)await writeFile(path.join(source,`${i}.pdf`),`%PDF-1.7\nproject ${i}`);
    const first=await syncPdfs(source,dest);assert.equal(Object.keys(first.files).length,6);
    const second=await syncPdfs(source,dest);assert.deepEqual(second,first);
    await writeFile(path.join(source,'3.pdf'),'%PDF-1.7\nfull project 3');
    const third=await syncPdfs(source,dest);assert.notEqual(third.files['3.pdf'].hash,first.files['3.pdf'].hash);assert.equal(third.files['1.pdf'].hash,first.files['1.pdf'].hash);
  } finally {await rm(dir,{recursive:true,force:true});}
});
test('invalid or missing input does not overwrite existing site files',async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),'fu-pdf-'));const source=path.join(dir,'source');const dest=path.join(dir,'site');
  try {
    await mkdir(source);await mkdir(dest);await writeFile(path.join(dest,'1.pdf'),'existing');
    await writeFile(path.join(source,'1.pdf'),'%PDF-1.7\nreplacement');
    await assert.rejects(syncPdfs(source,dest),/Missing PDF/);assert.equal(await readFile(path.join(dest,'1.pdf'),'utf8'),'existing');
    for(let i=2;i<=6;i++)await writeFile(path.join(source,`${i}.pdf`),i===4?'not PDF':'%PDF-1.7\nvalid');
    await assert.rejects(syncPdfs(source,dest),/not a PDF/);assert.equal(await readFile(path.join(dest,'1.pdf'),'utf8'),'existing');
  }finally{await rm(dir,{recursive:true,force:true});}
});
