"""Create optimized website copies; source files are never modified. Requires Pillow."""
from pathlib import Path
from PIL import Image
import json, shutil, sys
source=Path(sys.argv[1] if len(sys.argv)>1 else '/Users/minnn/Downloads/最终图片')
root=Path(__file__).resolve().parents[1]; dest=root/'public/media';dest.mkdir(parents=True,exist_ok=True)
items={'board':'白墙与软木板背景.png','about-entry':'个人卡片.png','about-page':'about-card.png','folder-front':'folder-front.png','folder-back':'folder-back.png','folder-clip':'夹子.png','research':'便利贴.png','skill-0':'Prototyping.png','skill-1':'UI Design.png','skill-2':'Modeling.png','skill-3':'Coding.png','skill-4':'Hands-on Execution.png'}
metadata={}
for name,filename in items.items():
 im=Image.open(source/filename).convert('RGBA');original=im.size; box=(0,0,*original)
 if name.startswith('skill') or name in ('about-entry','folder-clip'):
  box=im.getchannel('A').point(lambda a:255 if a>90 else 0).getbbox();im=im.crop(box)
 maxwidth=1536 if name=='board' else 2380 if name=='about-page' else 1100 if name.startswith('folder') else 800
 if im.width>maxwidth: im.resize((maxwidth,round(im.height*maxwidth/im.width)),Image.Resampling.LANCZOS).save(dest/f'{name}.webp','WEBP',quality=90,method=6)
 else: im.save(dest/f'{name}.webp','WEBP',quality=90,method=6)
 metadata[name]={'source':filename,'original':original,'crop':box}
for i in range(1,7):
 im=Image.open(source/f'封面{i}.png').convert('RGBA')
 base=Image.new('RGBA',im.size,(248,248,245,255));base.alpha_composite(im)
 for width in [480,960,1440]:
  base.convert('RGB').resize((width,round(im.height*width/im.width)),Image.Resampling.LANCZOS).save(dest/f'project-{i}-{width}.webp','WEBP',quality=91,method=6)
 pdf=dest/'pdf';pdf.mkdir(exist_ok=True);shutil.copy2(source/f'{i}.pdf',pdf/f'{i}.pdf')
shutil.copy2(source/'二维码.png',dest/'undergraduate-qr.png')
(root/'scripts/asset-metadata.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2))
print('Website copies prepared; originals unchanged.')
