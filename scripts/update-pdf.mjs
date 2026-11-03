import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { syncPdfs } from './pdf-sync.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
if(args.includes('--help')){
  console.log('npm run update:pdf [-- --source "/path/to/最终图片"]\nDefault: ~/Downloads/最终图片. Validates/syncs 1.pdf–6.pdf and rebuilds dist.\n--sync-only: copy and generate version hashes without building.');
  process.exit(0);
}
const at=args.indexOf('--source');
if(at!==-1 && !args[at+1]){console.error('--source requires a directory.');process.exit(1);}
const source=at!==-1?path.resolve(args[at+1]):path.join(process.env.HOME||'','Downloads','最终图片');
try {
  const manifest=await syncPdfs(source,path.join(root,'public/media/pdf'));
  await writeFile(path.join(root,'src/pdf-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  for(const [name,info] of Object.entries(manifest.files))console.log(`✓ ${name} (${Math.round(info.bytes/1024)} KiB) · ${info.hash}`);
  if(!args.includes('--sync-only')){
    const prepared=spawnSync(process.execPath,[path.join(root,'scripts/prepare-pdf-viewer.mjs')],{cwd:root,stdio:'inherit'});
    if(prepared.status!==0)throw new Error('PDF reader asset preparation failed. Run npm install and npm run build.');
    for(const [bin,cmdArgs] of [['typescript/bin/tsc',['-b']],['vite/bin/vite.js',['build']]]){
      const result=spawnSync(process.execPath,[path.join(root,'node_modules',bin),...cmdArgs],{cwd:root,stdio:'inherit'});
      if(result.status!==0)throw new Error('PDF copies were updated, but the build failed. Install dependencies and run npm run build. Existing dist was not confirmed as current.');
    }
  }
  console.log(args.includes('--sync-only')?'PDF source copies synchronized. Rebuild dist before publication.':'PDF update and production build completed.');
} catch(error){console.error(error.message);process.exit(1);}
