import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
from pathlib import Path

text = Path('src/data/stores.ts').read_text(encoding='utf-8')
print(f"File length: {len(text)}")
print(f"First 200 chars: {repr(text[:200])}")

depth = 0; start = None; count = 0
for i, ch in enumerate(text):
    if ch == '{':
        if depth == 0:
            start = i
        depth += 1
    elif ch == '}':
        depth -= 1
        if depth == 0 and start is not None:
            block = text[start:i+1]
            has_cat = 'categoryId:' in block
            has_hotel = 'hotelIds:' in block
            count += 1
            if count <= 3:
                print(f"\nBlock {count}: len={len(block)} categoryId={has_cat} hotelIds={has_hotel}")
                print(block[:150])
            start = None
print(f"\nTotal blocks found: {count}")
