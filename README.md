# San-Van: testovací web (návrh na pripomienkovanie)

Klikateľný návrh nového webu San-Van (Fitclub a Sauna, Košice). Slúži na pripomienkovanie a schválenie vzhľadu, rozloženia a textov **pred plnou implementáciou**. Nie je to ostrý web.

## Čo je v návrhu
- `index.html`: Úvod (rozcestník, hodiny oboch prevádzok, Naše prevádzky, Kde nás nájdete)
- `fitclub.html`: Fitclub (otváracie hodiny a rozvrh, lekcie, cenník s vypínačom pre študentov a dôchodcov, galéria, kontakt)
- `sauna.html`: Sauna (otváracie hodiny, návšteva sauny, cenník s vypínačom pre dôchodcov, prenájom pre skupiny, galéria, kontakt)
- `ochrana-osobnych-udajov.html`: **iba šablóna** so žltými miestami na doplnenie

Hodiny, lekcie a ceny sa vypisujú zo súboru `data.js` (jeden zdroj údajov). Stačí ho zmeniť a zmena sa prejaví na všetkých stránkach.

## Čo ešte nie je finálne
- Fotky sú zo súčasných webov a majú nízke rozlíšenie. Na ostrom webe budú nové alebo ostrejšie.
- Logo je dočasné, upravený pôvodný obrázok. Nahradí ho vektorové logo.
- Ochrana osobných údajov čaká na údaje prevádzkovateľa a na právnu kontrolu.
- Mapa Google sa načíta až po súhlase s cookies „Mapy Google“. Bez súhlasu je tam fotka miesta.
- Formuláre, rezervácie, prepojenie s Google profilom ani administrácia (CMS) tu nie sú. Prídu pri plnej implementácii.
- Web je zámerne skrytý pred vyhľadávačmi (`noindex`, `robots.txt`), aby nesúťažil so súčasným webom.

## Nasadenie

Je to čisto statická stránka, netreba nič inštalovať ani kompilovať.

### Vercel
1. Nahrajte priečinok do repozitára na GitHube (pozri nižšie), alebo v termináli v tomto priečinku spustite `npx vercel` a odpovedajte na otázky.
2. Ak idete cez GitHub: na vercel.com zvoľte **Add New → Project**, vyberte repozitár.
3. Framework Preset: **Other**. Build Command a Install Command nechajte prázdne. Output Directory: `.` (koreň).
4. Deploy. Vercel vytvorí adresu typu `nazov-projektu.vercel.app`.

**Pripomienky priamo na stránke:** na náhľadoch vo Verceli (Preview deployments) sa dajú zapnúť komentáre (Vercel Toolbar → Comments). Zákazník si ich prezrie a pripíše komentár priamo k miestu na stránke, potrebuje však bezplatný účet na Verceli. Ak to nechce, stačia pripomienky e-mailom so snímkou obrazovky.

### GitHub
```bash
git init
git add .
git commit -m "San-Van testovací web"
git branch -M main
git remote add origin https://github.com/<vas-ucet>/<repozitar>.git
git push -u origin main
```

**GitHub Pages** (alternatíva k Vercelu): v repozitári **Settings → Pages → Source: Deploy from a branch → main / (root)**. Adresa bude `https://<vas-ucet>.github.io/<repozitar>/`.

## Úpravy
- Texty a rozloženie sekcií sú v priečinku `src/` (jeden súbor = jedna sekcia, napríklad `src/sauna-cennik.html`).
- Hodiny, lekcie a ceny sú v `data.js`.
- Vzhľad je v `site.css`, správanie (vypínače, galéria, mapa, menu) v `site.js`.
- Po úprave súborov v `src/` spustite `python3 build.py`, ktorý z nich poskladá `index.html`, `fitclub.html` a `sauna.html`.

Lokálny náhľad: `python3 -m http.server 8000` a otvorte `http://localhost:8000`.

## Zdroje fotiek
Fotografie okolia (radnica, ulica Československej armády) sú z Wikimedia Commons pod licenciou CC BY-SA, uvedené sú v pätičke a v `assets/credits.json`. Ostatné fotografie sú zo súčasných webov San-Van.
