"""Optimize aligned envelope layers without changing source artwork."""
from pathlib import Path
from PIL import Image
import sys
source=Path(sys.argv[1] if len(sys.argv)>1 else '/Users/minnn/Downloads/最终图片/envelope-layer-assets-v2')
dest=Path(__file__).resolve().parents[1]/'public/media';dest.mkdir(exist_ok=True)
for name in ['envelope-back','envelope-front','envelope-flap-outer','envelope-flap-inner','contact-card-blank']:
 im=Image.open(source/(name+'.png')).convert('RGBA')
 # Envelope layers share one crop; the separate card is positioned from its original bounds.
 im=im.crop((351,777,1697,1383) if name=='contact-card-blank' else (208,664,1840,1496))
 im.save(dest/(name+'.webp'),'WEBP',quality=93,method=6)
print('Five aligned envelope layers prepared; sources unchanged.')
