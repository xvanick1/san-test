/* Súhlas s cookies: voľba sa ukladá v prehliadači (localStorage „sanvan-consent", 12 mesiacov).
   Kategórie: nevyhnutné (vždy), mapy (Google Maps). Analytika pribudne, keď ju vyberieme (D-005). */
(function(){
  const KEY = 'sanvan-consent', MAX = 365 * 864e5, bar = document.getElementById('cookies');
  const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && Date.now() - v.ts < MAX ? v : null; } catch (e) { return null; } };
  let state = read();
  const api = window.sanvanConsent = {
    get: () => state || { maps: false },
    set: v => { state = Object.assign({ maps: false }, state, v, { ts: Date.now() }); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} bar.hidden = true; document.dispatchEvent(new Event('sanvan:consent')); },
    open: () => { bar.hidden = false; sync(); bar.querySelector('[data-cc="all"]').focus(); }
  };
  const set = bar.querySelector('.cc-set'), tog = bar.querySelector('[data-cc="toggle"]'), save = bar.querySelector('[data-cc="save"]');
  function sync(){ bar.querySelectorAll('[data-k]').forEach(c => { c.checked = !!api.get()[c.dataset.k]; }); }
  bar.addEventListener('click', e => {
    const a = e.target.closest('[data-cc]'); if (!a) return;
    if (a.dataset.cc === 'all') api.set({ maps: true });
    if (a.dataset.cc === 'none') api.set({ maps: false });
    if (a.dataset.cc === 'toggle') { const o = set.hidden; set.hidden = !o; save.hidden = !o; tog.setAttribute('aria-expanded', o); }
    if (a.dataset.cc === 'save') { const v = {}; bar.querySelectorAll('[data-k]').forEach(c => v[c.dataset.k] = c.checked); api.set(v); }
  });
  document.querySelectorAll('[data-cookie-settings]').forEach(l => l.addEventListener('click', e => { e.preventDefault(); api.open(); set.hidden = false; save.hidden = false; tog.setAttribute('aria-expanded', true); }));
  if (!state) bar.hidden = false;
  if (location.hash === '#cookies') document.querySelector('[data-cookie-settings]').click();
  document.getElementById('yr').textContent = new Date().getFullYear();
})();

/* Lekcie: jeden zdroj údajov (vyššie) pre rozvrh, mobilný zoznam, legendu, karty lekcií aj cenník.
   Na webe ich bude dodávať CMS. */
/* Cenník fitclubu z dát (D-023). „Platí od" = najnovší dátum zmeny spomedzi všetkých cien cenníka
   vrátane cien lekcií; zmena jednej ceny v CMS posunie dátum sama. */
(function(){
  const P = window.SANVAN.prices && window.SANVAN.prices.fitclub; if (!P) return;
  const L = window.SANVAN.lessons;
  const eur = n => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','));
  const MES = ['januára','februára','marca','apríla','mája','júna','júla','augusta','septembra','októbra','novembra','decembra'];
  const dates = [P.club.changed, ...P.plans.flatMap(x => [x.changed, x.student && x.student.changed]), ...P.rows.flat().map(r => r.changed), ...L.map(l => l.priceChanged)].filter(Boolean).sort();
  const last = dates[dates.length - 1];
  /* vypínač „Som študent alebo dôchodca": zapnutý ukáže zľavnené ceny; zľava len pre jednu skupinu má štítok */
  let on = false;
  const WHO = { stu: 'pre študentov', sen: 'pre dôchodcov' };
  const deal = x => { if (!on || !x.for) return { v: x.price };
    const calc = f => f.price != null ? f.price : Math.round(x.price * (100 - f.pct)) / 100;
    const ks = Object.keys(x.for), v = calc(x.for[ks[0]]);
    return { v, who: ks.length === 1 || ks.some(k => calc(x.for[k]) !== v) ? WHO[ks[0]] : '' }; };
  const was = (x, d) => d.v !== x.price ? '<s>' + eur(x.price) + ' €</s> ' : '';
  const who = d => d.who ? '<em class="who">' + d.who + '</em>' : '';
  const R = {
    since: () => { const [y, m, d] = last.split('-').map(Number); return 'Platí od ' + d + '. ' + MES[m - 1] + ' ' + y; },
    plans: () => P.plans.map(x => { const d = deal(x), off = d.v !== x.price;
      /* cenu za vstup ukázať, len keď je úspora oproti jednorazovému vstupu aspoň 15 % (malá úspora ponuku skôr oslabí); inak krátky text pre koho je (hint) */
      const each = x.entries && Math.round(d.v / x.entries * 100) / 100, single = P.plans[0].price;
      const per = x.per || (x.entries ? (each <= single * 0.85 ? eur(each) + ' € za vstup' : x.hint || '') : x.student && !off ? 'študentská ' + eur(x.student.price) + ' €' : '');
      return '<div class="plan' + (x.hot ? ' hot' : '') + (off ? ' off' : '') + '">' + (x.tag ? '<span class="tag">' + x.tag + '</span>' : '') +
        '<p class="name">' + x.name + '</p><p class="price num">' + eur(d.v) + '<sup>€</sup></p><p class="per">' + was(x, d) + (off && per ? '<br>' : '') + per + who(d) + '</p><ul>' +
        x.items.map(i => '<li>' + i + '</li>').join('') + '</ul><a class="btn ' + (x.hot ? 'btn-dark' : 'btn-ghost') + '" href="#kontakt">' + x.cta + '</a></div>'; }).join(''),
    rows: col => P.rows[col].map(r => { const x = r.ref ? P[r.ref] : r, d = deal(x);
      return '<div class="row' + (d.v !== x.price ? ' off' : '') + '"><span>' + r.name + (r.note ? '<small>' + r.note + '</small>' : '') + '</span><b class="num">' + who(d) + was(x, d) + (d.v !== x.price ? '<span class="new">' + eur(d.v) + ' €</span>' : eur(d.v) + ' €') + '</b></div>'; }).join(''),
    mode: () => '<button type="button" role="switch" class="sw" aria-checked="' + on + '"><span class="trk" aria-hidden="true"></span>' + P.discount.label + '</button>'
  };
  const draw = () => {
    document.querySelectorAll('[data-prices]').forEach(el => { if (el.dataset.prices === 'mode' && el.firstChild) return; el.innerHTML = el.dataset.prices === 'rows' ? R.rows(+el.dataset.col) : R[el.dataset.prices](); });
    document.querySelectorAll('[data-prices="plans"]').forEach(el => el.classList.toggle('disc', on));
  };
  draw();
  /* vypínač sa neprekresľuje, iba prepne stav, aby bežala animácia jazdca */
  document.addEventListener('click', e => { const b = e.target.closest('[data-prices="mode"] .sw'); if (!b) return; on = !on; b.setAttribute('aria-checked', on); draw(); });
  document.querySelectorAll('[data-price]').forEach(el => { el.innerHTML = eur(P[el.dataset.price].price) + '&nbsp;€'; });
})();

/* Cenník sauny z dát (D-023): skupiny riadkov, vypínač „Som dôchodca" (−10 % na permanentku),
   cena za vstup pri permanentke (ak ušetrí aspoň 15 %) a cena na osobu pri prenájme pre skupiny. */
(function(){
  const P = window.SANVAN.prices && window.SANVAN.prices.sauna, box = document.querySelector('[data-sprices="list"]'); if (!P || !box) return;
  const eur = n => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','));
  let on = false;
  const val = r => on && r.for && r.for.sen ? Math.round(r.price * (100 - r.for.sen.pct)) / 100 : r.price;
    /* štítok = úspora permanentky oproti jednotlivým vstupom (vždy z bežnej ceny); zľavu pre dôchodcov ukazuje prečiarknutá cena */
  const row = r => { const v = val(r), off = v !== r.price, pct = r.entries ? Math.round((1 - r.price / (P.single * r.entries)) * 100) : 0;
    const badge = pct >= 15 ? '<em class="save">−' + pct + ' %</em>' : '';
    return '<div class="row' + (off ? ' off' : '') + '"><span>' + r.name + badge + (r.note ? '<small>' + r.note + '</small>' : '') + '</span><b class="num">' +
      (off ? '<s>' + eur(r.price) + ' €</s> <span class="new">' + eur(v) + ' €</span>' : eur(v) + ' €') + '</b></div>'; };
  const draw = () => {
    const cols = [P.groups.slice(0, 1), P.groups.slice(1)];
    box.innerHTML = cols.map(c => '<div>' + c.map((g, n) => '<h3 class="plh' + (n ? ' plh2' : '') + '">' + g.title + '</h3>' + g.rows.map(row).join('')).join('') + '</div>').join('');
  };
  const m = document.querySelector('[data-sprices="mode"]');
  if (m) m.innerHTML = '<button type="button" role="switch" class="sw" aria-checked="false"><span class="trk" aria-hidden="true"></span>' + P.discount.label + '</button>';
  const sp = document.querySelector('[data-sprices="senior"]'), sr = P.groups.flatMap(x => x.rows).find(r => r.for && r.for.sen);
  if (sp && sr) sp.innerHTML = sr.for.sen.pct + '&nbsp;%';
  const g = document.querySelector('[data-sprices="group"]');
  if (g) g.innerHTML = eur(P.group.price) + ' €<small>za ' + P.group.hours + '&nbsp;hodiny</small><small class="pp">pri ' + P.group.max + ' ľuďoch ' + eur(Math.round(P.group.price / P.group.max * 100) / 100) + '&nbsp;€ na osobu</small>';
  draw();
  document.addEventListener('click', e => { const b = e.target.closest('[data-sprices="mode"] .sw'); if (!b) return; on = !on; b.setAttribute('aria-checked', on); draw(); });
})();

(function(){
  const L = window.SANVAN.lessons;
  const K = ['mo','tu','we','th','fr'], SH = ['Po','Ut','St','Št','Pi'], LO = ['Pondelok','Utorok','Streda','Štvrtok','Piatok'];
  const min = t => { const [h, m] = t.split(':'); return h * 60 + +m; };
  const fmt = x => Math.floor(x / 60) + ':' + String(x % 60).padStart(2, '0');
  const part = t => min(t) < 720 ? 'ráno' : min(t) < 1080 ? 'poobede' : 'večer';
  const tel = n => 'tel:+421' + n.replace(/\s/g, '').replace(/^0/, '');
  const dur = l => '<span class="dur">' + l.minutes + ' min</span>';
  const slots = L.flatMap(l => l.slots.map(([d, t]) => ({ l, d, t })));
  const times = [...new Set(slots.map(x => x.t))].sort((a, b) => min(a) - min(b));
  const box = L.find(l => l.phone);
  const R = {
    table: () => times.map(t => '<tr><td class="time num">' + t + '<small>' + part(t) + '</small></td>' + K.map(d => {
      const x = slots.find(y => y.d === d && y.t === t);
      return '<td>' + (x ? '<div class="cls ' + x.l.id + '"><b>' + x.l.name + '</b><span>' + x.l.trainer + '</span><i class="num">' + x.l.price + dur(x.l) + '</i></div>' : '') + '</td>';
    }).join('') + '</tr>').join(''),
    list: () => K.map((d, i) => {
      const day = slots.filter(x => x.d === d).sort((a, b) => min(a.t) - min(b.t));
      return day.length ? '<div class="day" data-d="' + (i + 1) + '"><h3>' + LO[i] + '</h3>' + day.map(x => '<p><span class="' + x.l.id + '">' + x.t + '</span><span class="nm"><b>' + x.l.name + '</b><small>' + x.l.trainer + '</small></span><em>' + x.l.price + dur(x.l) + '</em></p>').join('') + '</div>' : '';
    }).join(''),
    legend: () => L.filter(l => l.slots.length).map(l => '<span class="k"><i class="sw ' + l.id + '"></i>' + (l.legend || l.name) + '</span>').join('') +
      '<span>' + (box ? box.name + ': individuálne, termín po dohode s trénerom.' : '') + '</span>',
    cards: () => { const pal = ['c-r', 'c-o', 'c-y']; let n = 0; return L.map(l => {
      const days = l.slots.map(([d]) => SH[K.indexOf(d)]).join(', '), t = l.slots[0] && l.slots[0][1];
      const inner = l.slots.length ? '<small>' + days + '</small>' + t : '<small>termín</small><span class="long">individuálne</span>';
      /* bez fotky: pevné poradie farieb značky (prvá je červená); 2 lekcie = 2 rôzne, 3 = všetky tri, štvrtá zopakuje prvú */
      /* dve rovnako dlhé polovice obrysu z ľavého dolného rohu, stretnú sa v pravom hornom (pathLength 100, animácia v CSS) */
      const line = '<svg class="hxline" viewBox="0 0 200 174" preserveAspectRatio="none" aria-hidden="true">' +
        '<path pathLength="100" d="M55 166L10 87L55 8H145"/><path pathLength="100" d="M55 166H145L190 87L145 8"/></svg>';
      const hx = l.card.photo ? '<div class="hx photo"><img src="' + l.card.photo + '" alt="' + l.card.alt + '"><span class="tagx">' + inner + '</span>' + line + '</div>'
        : '<div class="hx ' + pal[n++ % 3] + '"><span class="ini">' + inner + '</span>' + line + '</div>';
      const price = l.phone ? '<a class="price alt num" href="' + tel(l.phone) + '">' + l.phone + '</a>' : '<span class="price num">' + l.price + dur(l) + '</span>';
      return '<div class="lesson">' + hx + '<h3>' + l.name + '</h3><p class="who">' + l.with + '</p><p class="desc">' + l.desc + '</p>' + price + '</div>';
    }).join(''); },
    prices: () => L.filter(l => l.price).map(l => '<div class="row"><span>' + l.name + ', ' + (l.unit || '1 vstup') + '<small>lekcia ' + l.minutes + ' minút</small></span><b class="num">' + l.price + '</b></div>').join('')
  };
  document.querySelectorAll('[data-lessons]').forEach(el => { el.outerHTML = el.tagName === 'TBODY' || el.classList.contains('tt-list') || el.classList.contains('tt-note') || el.classList.contains('comb')
    ? el.outerHTML.replace(/><\/(\w+)>$/, '>' + R[el.dataset.lessons]() + '</$1>') : R[el.dataset.lessons](); });
})();

/* Otváracie hodiny: jeden zdroj údajov (vyššie) pre úvod, karty prevádzok aj rozvrh.
   Na webe ich bude dodávať CMS, z ktorého sa synchronizuje aj Google profil (D-010). */
(function(){
  const H = window.SANVAN.hours;
  const K = ['mo','tu','we','th','fr','sa','su'];
  const SH = ['Po','Ut','St','Št','Pi','So','Ne'];
  const LO = ['Pondelok','Utorok','Streda','Štvrtok','Piatok','Sobota','Nedeľa'];
  const t = (x, compact) => compact ? x.replace(/:00$/, '') : x;
  const span = (iv, c) => iv.map(([a, b]) => t(a, c) + '–' + t(b, c)).join(', ');
  const groups = days => {
    const g = [];
    K.forEach((k, i) => {
      const v = days[k], key = JSON.stringify(v), last = g[g.length - 1];
      if (last && last.key === key && last.b === i - 1) last.b = i; else g.push({ a: i, b: i, v, key });
    });
    return g;
  };
  const lab = (g, mode) => g.a === g.b ? (mode === 'short' ? SH[g.a] : LO[g.a])
    : mode === 'long' ? LO[g.a] + ' – ' + LO[g.b] : SH[g.a] + '–' + SH[g.b];
  const merged = days => {
    const m = [];
    groups(days).forEach(g => { const f = m.find(x => x.key === g.key); f ? f.labels.push(lab(g, 'short')) : m.push({ key: g.key, v: g.v, labels: [lab(g, 'short')] }); });
    return m;
  };
  const md = x => { const [mm, dd] = x.split('-'); return +dd + '. ' + +mm + '.'; };
  const period = (s, tight) => md(s.from) + (tight ? '–' : ' – ') + md(s.to);
  const inSeason = (s, d) => { const k = (d.getMonth() + 1) * 100 + d.getDate(), f = +s.from.replace('-', ''), e = +s.to.replace('-', ''); return f <= e ? k >= f && k <= e : k >= f || k <= e; };
  const now = new Date();
  const cur = v => H[v].seasons ? (H[v].seasons.find(s => inSeason(s, now)) || H[v].seasons[0]) : H[v];
  /* pre koho je sauna otvorená: jedno pomenovanie pre celý web (dlhé do kalendára, krátke do štítkov) */
  const WHO = { mix: ['Pre všetkých', 'všetci'], 'ženy': ['Pre ženy', 'ženy'] };
  const short = x => (WHO[x] || [x, x])[1];
  const tag = iv => iv[0] && iv[0][2] ? (iv[0][2] === 'ženy' ? '<span class="hl z"><span>ženy</span></span>' : '<span class="hl">' + short(iv[0][2]) + '</span>') : '';
  const cell = (v, short) => v === 'res' ? '<td class="off">rezervácie</td>'
    : !v.length ? '<td class="off">zatvorené</td>' : null;

  const NA = { mo: 'v pondelok', tu: 'v utorok', we: 'v stredu', th: 'vo štvrtok', fr: 'v piatok', sa: 'v sobotu', su: 'v nedeľu' };
  const when = ks => { const w = ks.includes('sa') && ks.includes('su') ? ks.filter(k => k !== 'sa' && k !== 'su').map(k => NA[k]).concat('cez víkend') : ks.map(k => NA[k]);
    return w.length > 1 ? w.slice(0, -1).join(', ') + ' a ' + w[w.length - 1] : w[0]; };
  const view = {
    /* veta do popisu sauny: ktoré dni je otvorená pre všetkých a kedy pre ženy (aktuálny režim) */
    band(v) {
      const c = cur(v);
      return '<h3>Otváracie hodiny <span class="per">' + c.name.toLowerCase() + ', ' + period(c) + '</span></h3><p class="h">' + view.hero(v) + '</p><p class="note">' + H[v].notes.join('<br>') + '</p>';
    },
    /* týždenný kalendár sauny v rovnakej podobe ako rozvrh lekcií: kedy je otvorené a pre koho (aktuálny režim) */
    week(v) {
      const c = cur(v), today = (new Date().getDay() + 6) % 7;
      const kind = d => d === 'res' ? ['res', 'Rezervácie', 'pre skupiny'] : !d.length ? ['off', 'Zatvorené', ''] : d[0][2] === 'ženy' ? ['zeny', WHO['ženy'][0], span(d)] : ['mix', WHO.mix[0], span(d)];
      const cells = K.map((k, i) => { const [cl, t, s] = kind(c.days[k]); return { i, cl, t, s }; });
      const head = '<h3 class="wk-h">' + c.name + ' <span class="per">' + period(c) + '</span></h3>';
      const grid = '<div class="wk">' + cells.map(x => '<div class="wk-d' + (x.i === today ? ' today' : '') + '"><p class="wk-n">' + LO[x.i] + (x.i === today ? '<small>dnes</small>' : '') + '</p>' +
        '<div class="wk-c ' + x.cl + '"><b>' + (x.cl === 'mix' || x.cl === 'zeny' ? x.t.replace(' ', '<br>') : x.t) + '</b>' + (x.s ? '<span>' + x.s + '</span>' : '') + '</div></div>').join('') + '</div>';
      const used = new Set(cells.map(x => x.cl));
      const key = '<div class="tt-note">' + [['mix', 'smix', WHO.mix[0]], ['zeny', 'szeny', WHO['ženy'][0]], ['res', 'sres', 'Rezervácie pre skupiny']]
        .filter(([k]) => used.has(k)).map(([, sw, t]) => '<span class="k"><i class="sw ' + sw + '"></i>' + t + '</span>').join('') + '</div>';
      return head + grid + key;
    },
    sentence(v) {
      const d = cur(v).days, by = lab => K.filter(k => Array.isArray(d[k]) && d[k].length && d[k][0][2] === lab);
      const parts = [];
      if (by('mix').length) parts.push(when(by('mix')) + ' otvorená pre všetkých');
      if (by('ženy').length) parts.push(when(by('ženy')) + ' pre ženy');
      const t = parts.join(', ') + '.';
      return t.charAt(0).toUpperCase() + t.slice(1);
    },
    hero(v) {
      return merged(cur(v).days).map(g => '<b>' + g.labels.join(', ') + '</b><span>' +
        (g.v === 'res' ? 'rezervácie' : g.v.length ? span(g.v) : 'zatvorené') + '</span>' + ((Array.isArray(g.v) && g.v.length && tag(g.v)) || '<i></i>')).join('');
    },
    card(v) {
      const d = H[v], s = cur(v);
      const rows = groups(s.days).map(g => '<tr><td>' + lab(g, g.a === g.b ? 'long1' : 'short') + '</td>' +
        (cell(g.v) || '<td>' + span(g.v) + tag(g.v) + '</td>') + '</tr>').join('');
      const hol = d.holiday ? '<tr><td>Sviatky</td><td>' + span(d.holiday) + '</td></tr>' : '';
      const sub = d.seasons ? '<p class="mode">' + s.name + ' <span class="per">' + period(s) + '</span></p>' : '<p class="mode none" aria-hidden="true">&nbsp;</p>';
      return '<h4 class="has-sub">Otváracie hodiny</h4>' + sub + '<table>' + rows + hol + '</table><p class="note">' + d.notes.join('<br>') + '</p>';
    },
    aside(v) {
      const d = H[v];
      if (!d.seasons) {
        const rows = groups(d.days).map(g => '<tr><td>' + lab(g, g.a === g.b ? 'long1' : 'long') + '</td>' +
          (cell(g.v) || '<td class="num">' + span(g.v) + '</td>') + '</tr>').join('');
        return '<table>' + rows + (d.holiday ? '<tr><td>Sviatky</td><td class="num">' + span(d.holiday) + '</td></tr>' : '') + '</table><p class="foot">' + d.notes.join('<br>') + '</p>';
      }
      const chip = iv => iv[0][2] ? '<span class="m' + (iv[0][2] === 'ženy' ? ' z' : '') + '">' + short(iv[0][2]) + '</span>' : '';
      return '<div class="season">' + d.seasons.map(s => '<div><h4>' + s.short + ' <span class="per">' + period(s, true) + '</span></h4><table>' +
        groups(s.days).map(g => '<tr><td>' + lab(g, 'short') + '</td>' + (cell(g.v, true) || '<td class="num">' + span(g.v, true) + chip(g.v) + '</td>') + '</tr>').join('') +
        '</table></div>').join('') + '</div><p class="foot">' + d.notes.join(' ') + '</p>';
    }
  };
  document.querySelectorAll('[data-hours]').forEach(el => { el.innerHTML = view[el.dataset.view](el.dataset.hours); });
  /* počet lekcií v texte (napr. „z piatich skupinových lekcií") podľa dát, nie natvrdo */
  const NUM = ['', 'jednej', 'dvoch', 'troch', 'štyroch', 'piatich', 'šiestich', 'siedmich', 'ôsmich', 'deviatich', 'desiatich'];
  document.querySelectorAll('[data-lessons-count]').forEach(el => { const n = window.SANVAN.lessons.length; el.textContent = NUM[n] || n; });
})();

/* Len prototyp: aktuálna sekcia v menu a dnešný deň v rozvrhu (D-022), nezalomiteľné medzery. */
(function(){
  const links = [...document.querySelectorAll('.nav ul a, .mmenu nav a')];
  const nav = document.querySelector('.nav');
  nav.dataset.ctx = document.body.dataset.page === 'home' ? '' : document.body.dataset.page;
  /* Menu: klik na odkaz sekcie plynule posunie stránku pod hlavičku a označí položku.
     Pri posúvaní sa označí sekcia, ktorá práve zaberá horný úsek obrazovky (čiara asi v tretine výšky);
     nad prvou sekciou nie je označené nič. Počas posunu po kliknutí sa označenie neprepína. */
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const samePage = a => a.hash && new URL(a.href, location.href).pathname === location.pathname;
  const mark = hash => links.forEach(a => a.classList.toggle('cur', samePage(a) && a.hash === hash));
  const navH = () => document.querySelector('.nav').offsetHeight;
  const setNavH = () => document.documentElement.style.setProperty('--navh', navH() + 'px');
  setNavH(); addEventListener('resize', setNavH);
  const secs = [...new Set(links.filter(samePage).map(a => a.hash))].map(h => document.getElementById(decodeURIComponent(h.slice(1)))).filter(Boolean)
    .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  let lock = 0;
  function spy(){
    if (Date.now() < lock) return;
    const line = navH() + innerHeight * 0.3;
    let cur = '';
    for (const el of secs) if (el.getBoundingClientRect().top <= line) cur = '#' + el.id;
    if (secs.length && innerHeight + scrollY >= document.documentElement.scrollHeight - 2) cur = '#' + secs[secs.length - 1].id;
    mark(cur);
  }
  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; spy(); }); }, { passive: true });
  addEventListener('scrollend', () => { lock = 0; spy(); });
  /* odkaz na inú stránku webu: cieľová sekcia sa zapamätá, keby prostredie pri prechode stratilo #kotvu
     (napr. náhľad artifactu); odkaz na tú istú stránku bez kotvy (päta: „Fitclub" na stránke Fitclub) = plynulo hore */
  const sameDoc = a => new URL(a.href, location.href).pathname === location.pathname;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a || a.target === '_blank') return;
    const u = new URL(a.href, location.href); if (!/^https?:$/.test(u.protocol) || u.origin !== location.origin) return;
    if (!sameDoc(a)) { try { if (a.hash) sessionStorage.setItem('sanvan-goto', a.hash); else sessionStorage.removeItem('sanvan-goto'); } catch (x) {} return; }
    if (!a.hash) { e.preventDefault(); scrollTo({ top: 0, behavior: calm.matches ? 'auto' : 'smooth' }); history.replaceState(null, '', location.pathname); mark(''); }
  });
  /* príchod na stránku: sekcia z #kotvy (alebo zapamätaná) sa posunie presne pod hlavičku, inak začiatok stránky */
  try { history.scrollRestoration = 'manual'; } catch (x) {}
  const arrive = () => {
    let h = location.hash; try { h = h || sessionStorage.getItem('sanvan-goto') || ''; sessionStorage.removeItem('sanvan-goto'); } catch (x) {}
    const el = h && h !== '#cookies' && document.getElementById(decodeURIComponent(h.slice(1)));
    if (el) { scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + scrollY - (navH() + 8)), behavior: 'instant' }); mark(h); lock = Date.now() + 300; }
    else if (!h) scrollTo({ top: 0, behavior: 'instant' });
  };
  if (document.readyState === 'complete') arrive(); else addEventListener('load', arrive, { once: true });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="#"]'); if (!a || !samePage(a)) return;
    const el = document.getElementById(decodeURIComponent(a.hash.slice(1))); if (!el) return;
    e.preventDefault();
    const y = el.getBoundingClientRect().top + scrollY - (navH() + 8);
    lock = Date.now() + 1200;
    scrollTo({ top: Math.max(0, y), behavior: calm.matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.hash);
    mark(a.hash);
  });
  spy();

  /* jednopísmenové predložky a spojky nenechávať na konci riadka */
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentNode.closest('script,style') ? 2 : 1 });
  const nb = n => { n.nodeValue = n.nodeValue.replace(/(?<=^|[\s(])([AaIiKkOoSsUuVvZz]) /g, '$1\u00a0'); };
  for (let n; (n = tw.nextNode());) nb(n);

  const d = new Date().getDay();
  const th = d >= 1 && d <= 5 && document.querySelectorAll('.tt thead th')[d];
  if (th) { th.classList.add('today'); th.insertAdjacentHTML('beforeend', '<small>dnes</small>'); }
  const li = document.querySelector('.tt-list .day[data-d="' + d + '"]');
  if (li) { li.classList.add('today'); li.querySelector('h3').insertAdjacentHTML('beforeend', '<small>dnes</small>'); }
})();

/* Mapa v kontakte: so súhlasom „Mapy Google" (cookie lišta) živá mapa Google, bez súhlasu alebo pri zablokovaní fotka okolia
   prevádzky a odkaz do Máp Google. Prepínač Fitclub / Sauna: obe mapy aj obe fotky sú načítané vopred a prepínač ich iba
   ukáže alebo skryje, preto je zmena okamžitá. */
(function(){
  const box = document.querySelector('.contact .mapbox'); if (!box) return;
  const fr0 = box.querySelector('iframe'), ph0 = box.querySelector('.fallback'), open = box.querySelector('.mapopen');
  const btns = [...document.querySelectorAll('.mapsw button')];
  const venues = btns.length ? btns.map(b => ({ src: b.dataset.src, href: b.dataset.href, photo: b.dataset.photo, alt: b.dataset.alt }))
    : [{ src: fr0.dataset.src, href: open.href }];
  /* pre každú prevádzku vlastný iframe a vlastná fotka */
  const frs = venues.map((v, i) => { if (!i) return fr0; const f = fr0.cloneNode(); f.removeAttribute('src'); f.dataset.src = v.src; f.hidden = true; box.insertBefore(f, open); return f; });
  /* mapa sa ukáže až po načítaní (dovtedy tmavá plocha, nie fotka), takže pri súhlase nebliká fotka */
  frs.forEach(f => f.addEventListener('load', () => f.classList.toggle('ready', !!f.getAttribute('src'))));
  const phs = venues.map((v, i) => { if (!i) { ph0.loading = 'eager'; return ph0; } const p = ph0.cloneNode(); p.src = v.photo; p.alt = v.alt; p.loading = 'eager'; p.hidden = true; box.insertBefore(p, ph0.nextSibling); return p; });
  let cur = 0, blocked = false;
  const show = () => {
    const on = !blocked && window.sanvanConsent && window.sanvanConsent.get().maps;
    box.classList.toggle('nomap', !on);
    /* so súhlasom sa mapy načítajú, po odvolaní súhlasu (len nevyhnutné) sa zrušia a ostane fotka */
    frs.forEach(f => {
      /* so súhlasom sa mapa načíta hneď pri otvorení stránky (nie až pri doskrolovaní), takže je pripravená, kým k nej návštevník príde */
      if (on && !f.getAttribute('src')) { f.loading = 'eager'; f.src = f.dataset.src; }
      if (!on && f.getAttribute('src')) { f.src = 'about:blank'; f.removeAttribute('src'); f.classList.remove('ready'); }
    });
  };
  const pick = i => {
    cur = i; open.href = venues[i].href;
    frs.forEach((f, k) => f.hidden = k !== i); phs.forEach((p, k) => p.hidden = k !== i);
    btns.forEach((b, k) => b.setAttribute('aria-pressed', k === i));
  };
  document.addEventListener('securitypolicyviolation', e => { if (/frame/.test(e.violatedDirective) && /google/.test(e.blockedURI)) { blocked = true; show(); } });
  document.addEventListener('sanvan:consent', show);
  btns.forEach((b, i) => b.addEventListener('click', () => pick(i)));
  show();
})();

/* Mobil: fotky v pruhu sa pri posúvaní stránky jemne posúvajú nahor (paralaxa), v pokoji stoja. */
(function(){
  /* všetky vrstvy pásu (orezané fotky aj červený hexagón, ktorý presahuje pod pás) sa posúvajú spolu */
  const gs = [...document.querySelectorAll('.cluster .mob .drift')], svg = gs[0] && gs[0].ownerSVGElement;
  const mq = matchMedia('(max-width:1000px)'), calm = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  function upd(){
    raf = 0;
    if (!mq.matches || calm.matches) { gs.forEach(g => g.removeAttribute('transform')); return; }
    const k = 0.5 * svg.viewBox.baseVal.width / svg.clientWidth;
    const tr = 'translate(0 ' + (-Math.min(scrollY, 300) * k).toFixed(1) + ')';
    gs.forEach(g => g.setAttribute('transform', tr));
  }
  if (gs.length) { addEventListener('scroll', () => raf || (raf = requestAnimationFrame(upd)), { passive: true }); upd(); }
})();

/* Štruktúrované údaje pre Google (LocalBusiness) na stránke prevádzky: adresa, telefón a otváracie hodiny
   z rovnakého zdroja ako texty na stránke (D-023). Na webe ich vygeneruje server. */
(function(){
  const page = document.body.dataset.page; if (page !== 'fit' && page !== 'sauna') return;
  const H = window.SANVAN.hours, K = ['mo','tu','we','th','fr','sa','su'];
  const DN = { mo: 'Monday', tu: 'Tuesday', we: 'Wednesday', th: 'Thursday', fr: 'Friday', sa: 'Saturday', su: 'Sunday' };
  const pad = t => t.padStart(5, '0');
  const now = new Date(), md = d => (d.getMonth() + 1) * 100 + d.getDate();
  const season = H.sauna.seasons.find(x => { const f = +x.from.replace('-', ''), e = +x.to.replace('-', ''), k = md(now); return f <= e ? k >= f && k <= e : k >= f || k <= e; });
  const days = page === 'fit' ? H.fitclub.days : season.days;
  const spec = K.flatMap(k => Array.isArray(days[k]) ? days[k].map(([a, b]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DN[k], opens: pad(a), closes: pad(b) })) : []);
  const base = page === 'fit'
    ? { '@type': 'ExerciseGym', name: 'Fitclub San-Van', telephone: '+421556255645', address: { '@type': 'PostalAddress', streetAddress: 'Československej armády 1168/11', postalCode: '040 01', addressLocality: 'Košice-Staré Mesto', addressCountry: 'SK' } }
    : { '@type': 'HealthAndBeautyBusiness', name: 'Sauna San-Van', telephone: '+421948340100', address: { '@type': 'PostalAddress', streetAddress: 'Strojárenská 1377/4', postalCode: '040 01', addressLocality: 'Košice', addressCountry: 'SK' } };
  const ld = Object.assign({ '@context': 'https://schema.org', email: 'info@sanvan.sk', url: location.href.split('#')[0], openingHoursSpecification: spec }, base);
  const el = document.createElement('script'); el.type = 'application/ld+json'; el.textContent = JSON.stringify(ld); document.head.appendChild(el);
})();

/* Hlavička na mobile: naraz je otvorené len jedno rozbaľovacie menu (Zavolať / Menu).
   Menu sa zavrie aj po výbere odkazu, kliknutím mimo neho a klávesom Escape. */
(function(){
  const dd = [...document.querySelectorAll('.nav details')];
  dd.forEach(d => d.addEventListener('toggle', () => { if (d.open) dd.forEach(o => { if (o !== d) o.open = false; }); }));
  document.querySelectorAll('.nav details a').forEach(a => a.addEventListener('click', () => dd.forEach(d => { d.open = false; })));
  document.addEventListener('click', e => { if (!e.target.closest('.nav details')) dd.forEach(d => { d.open = false; }); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') dd.forEach(d => { d.open = false; }); });
})();

/* Galéria: klik na fotku ju otvorí cez celú obrazovku (lightbox). Šípky na obrazovke alebo klávesy ← → listujú,
   Esc alebo klik mimo fotky zatvorí, na mobile sa listuje potiahnutím prstom. */
(function(){
  const figs = [...document.querySelectorAll('.gallery figure')]; if (!figs.length) return;
  const icon = d => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>';
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Galéria');
  lb.innerHTML = '<figure><img alt=""></figure><p class="cap"><b></b><span></span></p>' +
    '<button type="button" class="prev" aria-label="Predošlá fotka">' + icon('M15 5l-7 7 7 7') + '</button>' +
    '<button type="button" class="next" aria-label="Ďalšia fotka">' + icon('M9 5l7 7-7 7') + '</button>' +
    '<button type="button" class="close" aria-label="Zavrieť">' + icon('M6 6l12 12M18 6L6 18') + '</button>';
  document.body.appendChild(lb);
  const img = lb.querySelector('img'), cap = lb.querySelector('.cap b'), cnt = lb.querySelector('.cap span');
  let i = 0, back = null;
  const show = n => {
    i = (n + figs.length) % figs.length;
    const f = figs[i], src = f.querySelector('img');
    img.src = src.currentSrc || src.src; img.alt = src.alt;
    cap.textContent = (f.querySelector('figcaption') || {}).textContent || '';
    cnt.textContent = (i + 1) + ' / ' + figs.length;
    new Image().src = figs[(i + 1) % figs.length].querySelector('img').src;
  };
  const open = n => { back = document.activeElement; show(n); lb.classList.add('open'); document.documentElement.style.overflow = 'hidden'; lb.querySelector('.close').focus(); };
  const close = () => { lb.classList.remove('open'); document.documentElement.style.overflow = ''; if (back) back.focus(); };
  figs.forEach((f, n) => {
    f.insertAdjacentHTML('beforeend', '<span class="gx" aria-hidden="true">' + icon('M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7') + '</span>');
    f.tabIndex = 0; f.setAttribute('role', 'button'); f.setAttribute('aria-label', 'Otvoriť fotku: ' + (f.querySelector('figcaption') || f.querySelector('img')).textContent);
    f.addEventListener('click', () => open(n));
    f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n); } });
  });
  lb.querySelector('.prev').addEventListener('click', () => show(i - 1));
  lb.querySelector('.next').addEventListener('click', () => show(i + 1));
  lb.querySelector('.close').addEventListener('click', close);
  /* klik kamkoľvek mimo samotnej fotky zavrie; obrázok vypĺňa plochu s object-fit:contain, preto sa počíta skutočne vykreslená fotka */
  const onPhoto = e => { if (e.target !== img || !img.naturalWidth) return false;
    const r = img.getBoundingClientRect(), k = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const w = img.naturalWidth * k, h = img.naturalHeight * k;
    const x = e.clientX - (r.left + (r.width - w) / 2), y = e.clientY - (r.top + (r.height - h) / 2);
    return x >= 0 && y >= 0 && x <= w && y <= h; };
  lb.addEventListener('click', e => { if (e.target.closest('button') || onPhoto(e)) return; close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(i + 1); else if (e.key === 'ArrowLeft') show(i - 1);
    else if (e.key === 'Tab') { const b = [...lb.querySelectorAll('button')], k = b.indexOf(document.activeElement); e.preventDefault(); b[(k + (e.shiftKey ? b.length - 1 : 1)) % b.length].focus(); }
  });
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1)); x0 = null; });
})();
