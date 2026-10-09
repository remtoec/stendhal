#!/usr/bin/env python3
# PNG masters stay untouched; only these small derivatives go to readers.
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT = Path('C:/Windows/Fonts/NotoSerifTC-VF.ttf')


def share_card():
    if not FONT.is_file():
        raise SystemExit(f'Missing title font: {FONT}')
    font = ImageFont.truetype(str(FONT), 72)
    axes = font.get_variation_axes()
    font.set_variation_by_axes([600 if a['name'] == b'Weight' else a['default'] for a in axes])
    image = Image.open(ROOT / 'assets/share-cover.png').convert('RGB')
    draw = ImageDraw.Draw(image)
    vertical = bytes(font.getmask('︐')) != bytes(font.getmask('\uffff'))
    for i, char in enumerate('愛，如何誕生'):
        top = 60 + i * (500 / 6)
        if char == '，':
            # Pin punctuation to the upper-right of its em cell, not its baseline.
            char = '︐' if vertical else '，'
            box = font.getbbox(char)
            draw.text((1085 + 36 - box[2], top + 5 - box[1]), char, font=font, fill='#2e2a25')
        else:
            box = font.getbbox(char)
            draw.text((1085 - (box[0] + box[2]) / 2, top + (500 / 6 - box[3] + box[1]) / 2 - box[1]), char, font=font, fill='#2e2a25')
    for quality in range(90, 39, -5):
        output = BytesIO()
        image.save(output, 'JPEG', quality=quality, progressive=True, optimize=True)
        if output.tell() < 300000:
            (ROOT / 'assets/share-card.jpg').write_bytes(output.getvalue())
            return
    raise SystemExit('Share card could not fit below 300 KB')


def main():
    if not FONT.is_file():
        raise SystemExit(f'Missing title font: {FONT}')
    cutouts = plates = 0
    for source in sorted((ROOT / 'assets/paper/cutouts').glob('*.png')):
        image = Image.open(source).convert('RGBA')
        image.putalpha(image.getchannel('A').point(lambda a: 0 if a < 26 else a))
        image = image.resize((512, 512), Image.Resampling.LANCZOS)
        image.save(source.with_suffix('.webp'), 'WEBP', quality=85)
        cutouts += 1
    for source in sorted((ROOT / 'assets/chapters').glob('*.png')):
        Image.open(source).convert('RGB').save(source.with_suffix('.webp'), 'WEBP', quality=80)
        plates += 1
    share_card()
    print(f'Regenerated {cutouts} cutouts, {plates} chapter plates and share-card.jpg.')


if __name__ == '__main__':
    main()
