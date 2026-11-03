import { cp,mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const name of ['cmaps','standard_fonts','wasm']){
  const dest=path.join(root,'public/pdfjs',name);await mkdir(dest,{recursive:true});
  await cp(path.join(root,'node_modules/pdfjs-dist',name),dest,{recursive:true});
}
