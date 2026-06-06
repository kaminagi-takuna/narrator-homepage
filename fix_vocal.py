with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old1 = '歌ってみたを作成する方の、ボーカルセレクトを行います。'
new1 = '歌ってみたを作成する方の、<br className="sp-only" />ボーカルセレクトを行います。'

old2 = 'フル歌唱のボーカル音源を３本お送りいただき、ベストテイクを組み合わせます。'
new2 = 'フル歌唱のボーカル音源を<br className="sp-only" />３本お送りいただき、<br className="sp-only" />ベストテイクを組み合わせます。'

old3 = '※ボーカル音源１本追加につき ＋4,000円とさせていただきます。'
new3 = '※ボーカル音源１本追加につき <br className="sp-only" />＋4,000円とさせていただきます。'

replacements = [(old1, new1), (old2, new2), (old3, new3)]
for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        print(f'Replaced: {old[:20]}...')
    else:
        print(f'NOT FOUND: {old[:30]}')

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done.')
