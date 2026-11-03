import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const required=['board.webp','about-entry.webp','about-page.webp','research.webp','folder-front.webp','folder-back.webp','folder-clip.webp','undergraduate-qr.png','envelope-back.webp','envelope-front.webp','envelope-flap-outer.webp','envelope-flap-inner.webp','contact-card-blank.webp'];
for(let i=0;i<5;i++)required.push(`skill-${i}.webp`);
for(let i=1;i<=6;i++){required.push(`pdf/${i}.pdf`);for(const size of [480,960,1440])required.push(`project-${i}-${size}.webp`);}
let errors=0;
for(const file of required){try{await access(path.join(root,'public/media',file));}catch{console.error('Missing:',file);errors++;}}
try{const manifest=JSON.parse(await readFile(path.join(root,'public/media/pdf/manifest.json'),'utf8'));if(Object.keys(manifest.files).length!==6)throw new Error('Expected 6 PDFs');}catch(e){console.error('Invalid PDF manifest:',e.message);errors++;}
if(errors)process.exit(1);
console.log(`All ${required.length} required assets and six PDF version mappings are present.`);
