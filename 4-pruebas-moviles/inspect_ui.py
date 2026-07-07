import xml.etree.ElementTree as ET
from pathlib import Path
p = Path('window_dump.xml')
root = ET.parse(p).getroot()
for elem in root.iter():
    text = elem.attrib.get('text','')
    content = elem.attrib.get('content-desc','')
    hint = elem.attrib.get('hint-text','')
    cls = elem.attrib.get('class','')
    if text or content or hint:
        print(f'{cls}: text={text!r} content={content!r} hint={hint!r}')
