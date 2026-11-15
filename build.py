"""Poskladá stránky prototypu (index.html, fitclub.html, sauna.html) zo spoločných častí v src/.

Spustenie: python3 build.py
Menu, hlavička a pätička sú rovnaké pre všetky stránky; obsah stránok je v src/*.html.
Štýly sú v site.css, skripty v site.js a údaje (hodiny, lekcie) v data.js.
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / 'src'

PAGES = {
    'index.html': {
        'page': 'home',
        'title': 'San-Van Košice: fitclub a sauna od roku 1994',
        'desc': 'Posilňovňa so skupinovými lekciami na Československej armády a sauna s tepidáriom na Strojárenskej. Obe prevádzky nájdete v Starom Meste Košíc, neďaleko radnice.',
        'parts': ['home-hero', 'home-prevadzky', 'home-kontakt'],
    },
    'fitclub.html': {
        'page': 'fit',
        'title': 'Fitclub San-Van Košice: posilňovňa a skupinové lekcie',
        'desc': 'Posilňovňa a telocvičňa na Československej armády v Košiciach. Cvičiť môžete sami alebo prísť na pilates, kalanetiku či indoor cycling. Platí u nás aj karta MultiSport.',
        'parts': ['fit-band', 'fit-rozvrh', 'fit-lekcie', 'fit-cennik', 'fit-galeria', 'fit-kontakt'],
    },
    'sauna.html': {
        'page': 'sauna',
        'title': 'Sauna San-Van Košice: sauna, tepidárium a masáže',
        'desc': 'Suchá sauna pre 20 ľudí na Strojárenskej v Košiciach, s ochladzovacím bazénom a tepidáriom. Robíme aj masáže a saunu si môžete prenajať len pre svoju partiu.',
        'parts': ['sauna-band', 'sauna-hodiny', 'sauna-navsteva', 'sauna-cennik', 'sauna-galeria', 'sauna-kontakt'],
    },
}

# odkazy vpravo v menu podľa stránky
LINKS = {
    'home': [('#prevadzky', 'Prevádzky'), ('#kontakt', 'Kontakt')],
    # rovnaká kostra pre obe prevádzky: Hodiny, (sekcia navyše), Cenník, Galéria, Kontakt
    'fit': [('#rozvrh', 'Hodiny'), ('#lekcie', 'Lekcie'), ('#cennik', 'Cenník'), ('#galeria', 'Galéria'), ('#kontakt', 'Kontakt')],
    'sauna': [('#sauna-hodiny', 'Hodiny'), ('#sauna-navsteva', 'Návšteva'), ('#sauna-cennik', 'Cenník'), ('#galeria', 'Galéria'), ('#kontakt', 'Kontakt')],
}

MOBILE = '''<a href="index.html">Úvod</a><span class="mh f">Fitclub</span><a href="fitclub.html">O fitclube</a><a href="fitclub.html#rozvrh">Otváracie hodiny a lekcie</a><a href="fitclub.html#lekcie">Lekcie a lektori</a><a href="fitclub.html#cennik">Cenník</a><a href="fitclub.html#galeria">Galéria</a><span class="mh s">Sauna</span><a href="sauna.html">O saune</a><a href="sauna.html#sauna-hodiny">Otváracie hodiny</a><a href="sauna.html#sauna-navsteva">Návšteva sauny</a><a href="sauna.html#sauna-cennik">Cenník</a><a href="sauna.html#galeria">Galéria</a><span class="mh">Kontakt</span><a href="index.html#kontakt">Kde nás nájdete</a>'''


def nav(page):
    cur = lambda p: ' aria-current="page"' if p == page else ''
    links = '\n'.join(f'    <li class="shared"><a href="{h}">{t}</a></li>' for h, t in LINKS[page])
    ctx = '' if page == 'home' else page
    return f'''<header class="nav" data-ctx="{ctx}"><div class="wrap">
  <a class="logo" href="index.html" aria-label="San-Van, úvod"><img src="assets/logo.png" alt="San-Van" width="133" height="114"></a>
  <div class="ctx" role="group" aria-label="Prevádzka"><a href="fitclub.html" data-ctx="fit"{cur("fit")}>Fitclub</a><a href="sauna.html" data-ctx="sauna"{cur("sauna")}>Sauna</a></div>
  <ul>
{links}
  </ul>
  <div class="calls"><a class="callb f" href="tel:+421556255645"><small>Fitclub</small>055 625 56 45</a><a class="callb s" href="tel:+421948340100"><small>Sauna</small>0948 340 100</a></div>
  <details class="mcall"><summary>Zavolať</summary><div class="pop"><a class="callb f" href="tel:+421556255645"><small>Fitclub, Čsl. armády</small>055 625 56 45</a><a class="callb s" href="tel:+421948340100"><small>Sauna, Strojárenská</small>0948 340 100</a></div></details>
  <details class="mmenu"><summary aria-label="Menu">Menu</summary><nav>{MOBILE}</nav></details>
</div></header>'''


def page(name, cfg):
    parts = '\n\n'.join((SRC / f'{p}.html').read_text(encoding='utf-8').strip() for p in cfg['parts'])
    footer = (SRC / 'footer.html').read_text(encoding='utf-8').strip()
    cookies = (SRC / 'cookies.html').read_text(encoding='utf-8').strip()
    return f'''<!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{cfg["title"]}</title>
<meta name="description" content="{cfg["desc"]}">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="assets/logo.png">
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="site.css">
</head>
<body data-page="{cfg["page"]}">

{nav(cfg["page"])}

<main id="top">
{parts}
</main>

{footer}
{cookies}
<script src="data.js"></script>
<script src="site.js"></script>
</body>
</html>
'''


if __name__ == '__main__':
    for name, cfg in PAGES.items():
        (ROOT / name).write_text(page(name, cfg), encoding='utf-8')
        print('ok', name)
