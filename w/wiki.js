// the wiki pages' own script: the language button, the menu's drop-downs, the search box, the English texts, and (inside
// the site's frame) handing links to the site. Loaded from w/wiki.js; the site's files are one folder up.
(function () {
  var me = document.currentScript, ROOT = new URL('../', me.src).href, W = new URL('./', me.src).href;
  window.NC_WIKI_I18N = ROOT + 'i18n.js';
  var b = document.getElementById('lang'), en = false;
  try { en = localStorage.getItem('nc_lang') === 'en'; } catch (e) {}
  // English site: the texts written with their English beside them (data-en) switch before the dictionary runs
  if (en) (function () {
    var L = document.querySelectorAll('[data-en]'); for (var i = 0; i < L.length; i++) L[i].textContent = L[i].getAttribute('data-en');
    var P = document.querySelectorAll('[data-en-ph]'); for (var j = 0; j < P.length; j++) P[j].placeholder = P[j].getAttribute('data-en-ph');
    document.documentElement.lang = 'en';
  })();
  // the site's menu (same groups and pages as the site's header) and the footer: written here once for every page
  // a mistake on this page: a new issue on the site's GitHub, the page and what to write already filled in
  window.NC_REPORT = function (title) {
    var body = 'หน้า: ' + location.href + '\n\nข้อมูลที่ผิด:\n\nในเกมเป็นแบบนี้:\n\n(แนบรูปหน้าจอได้)';
    return 'https://github.com/proworks-th/nightcamp-wiki/issues/new?title=' + encodeURIComponent('ข้อมูลผิด: ' + String(title || '').replace(/ · NightCamp Wiki$/, '')) + '&body=' + encodeURIComponent(body);
  };
  var T = function (th, e) { return en ? e : th; }, X = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var MENU = [['คู่มือ', 'Guide', [['หน้าแรก', 'Home', ''], ['คู่มือ', 'Guide', 'guide'], ['อัปเดตเกม', 'Game updates', 'patch'], ['เกี่ยวกับเว็บ', 'About', 'about']]],
    ['ข้อมูล', 'Data', [['อาชีพและสกิล', 'Jobs & skills', 'jobs'], ['อุปกรณ์', 'Equipment', 'equip'], ['มอนสเตอร์และแมพ', 'Monsters & maps', 'mon'], ['แผนที่', 'Map', 'map'], ['อาชีพเสริม', 'Life skills', 'life'], ['รูน', 'Runes', 'rune']]],
    ['เครื่องมือ', 'Tools', [['ตัวละครของฉัน', 'My character', 'me'], ['Build Sim', 'Build Sim', 'sim'], ['วางแผนฟาร์ม', 'Farm planner', 'plan'], ['ตีบวก / ขัดเกรด', 'Refine / polish', 'calc'], ['จับเวลาบอส', 'Boss timer', 'boss']]]];
  var u = function (t) { return t === '' ? W + 'index.html' : t === 'about' ? W + 'about.html' : ROOT + 'index.html#' + t; };
  var nav = document.querySelector('nav.grp[data-up]');
  if (nav) nav.innerHTML = MENU.map(function (g) {
    return '<div class="dd"><button class="ddb" type="button" aria-haspopup="true" aria-expanded="false">' + X(T(g[0], g[1])) + '<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button><div class="ddm" role="menu">'
      + g[2].map(function (v) { return '<a role="menuitem" href="' + u(v[2]) + '">' + X(T(v[0], v[1])) + '</a>'; }).join('') + '</div></div>';
  }).join('');
  var sxi = document.querySelector('form.sx input'); if (sxi && en) sxi.placeholder = 'Search the site';
  var ft = document.querySelector('footer.ft[data-build]');
  if (ft) ft.innerHTML = '<div class="fti"><div><b class="ftb">NightCamp Wiki</b><p>' + X(T('วิกิแฟนเกม NightCamp โดย KhumGameLab ข้อมูลอ่านจากไฟล์เกม', 'A NightCamp fan wiki by KhumGameLab, data read from the game files')) + '</p><p class="muted">'
    + X(T('ไฟล์เกมรุ่น ' + ft.dataset.build + ' ภาพและชื่อในเกมเป็นของทีม Night Camp ใช้โดยได้รับอนุญาต ไม่ใช่เว็บทางการของเกม', 'Game files ' + ft.dataset.build + '. In-game art and names belong to the Night Camp team, used with permission. Not an official site.')) + '</p></div><nav class="ftl">'
    + '<a class="rep" href="' + X(window.NC_REPORT(document.title)) + '" target="_blank" rel="noopener">' + X(T('แจ้งข้อมูลผิด', 'Report a mistake')) + '</a>'
    + [[W + 'index.html', 'หน้าแรก', 'Home'], [W + 'about.html', 'เกี่ยวกับเว็บ', 'About'], [ROOT + 'index.html#patch', 'อัปเดตเกม', 'Game updates'], [ROOT + 'sitemap.xml', 'แผนผังเว็บ', 'Sitemap']].map(function (l) { return '<a href="' + l[0] + '">' + X(T(l[1], l[2])) + '</a>'; }).join('') + '</nav></div>';
  if (b) { b.textContent = en ? 'ไทย' : 'EN'; b.onclick = function () { try { localStorage.setItem('nc_lang', en ? 'th' : 'en'); } catch (e) {} location.reload(); }; }
  // the menu: pointing opens a group (CSS); a click or tap opens it too and keeps it open until a click elsewhere or Esc
  function close(x) { var D = document.querySelectorAll('.dd'); for (var i = 0; i < D.length; i++) if (D[i] !== x) { D[i].classList.remove('open'); D[i].querySelector('.ddb').setAttribute('aria-expanded', 'false'); } }
  var B = document.querySelectorAll('.ddb');
  for (var i = 0; i < B.length; i++) B[i].onclick = function (e) { e.stopPropagation(); var d = this.parentElement, o = !d.classList.contains('open'); close(d); d.classList.toggle('open', o); this.setAttribute('aria-expanded', o); };
  document.addEventListener('click', function () { close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  // the phone's search button: the box opens under the row
  var top = document.querySelector('.top'), sb = null;
  if (top && top.querySelector('form.sx')) {   // (made here, not written into every page)
    sb = document.createElement('button'); sb.className = 'sbtn'; sb.type = 'button'; sb.setAttribute('aria-label', en ? 'Search' : 'ค้นหา'); sb.setAttribute('aria-expanded', 'false');
    sb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
    top.insertBefore(sb, document.getElementById('lang'));
  }
  if (sb && top) sb.onclick = function () { var on = !top.classList.contains('sopen'); top.classList.toggle('sopen', on); sb.setAttribute('aria-expanded', on); if (on) { var i = top.querySelector('form.sx input'); if (i) i.focus(); } };
  // the header's search: the site's own search, on the site's page
  var sx = document.querySelector('form.sx');
  if (sx) sx.addEventListener('submit', function (e) { e.preventDefault(); var q = sx.q.value.trim(); if (q) location.href = sx.getAttribute('data-go') + '#search/' + encodeURIComponent(q); });
})();
// inside the site's frame (the main page and the about page are tabs of the site): hide our own header and footer; a link
// to one of the site's tabs switches the tab, any other link opens on its own (not inside the frame)
(function () {
  var embed = false; try { embed = window.top !== window; } catch (e) { embed = true; }
  if (embed) document.documentElement.classList.add('embed');
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a || !embed || e.ctrlKey || e.metaKey) return;
    var m = /\/index\.html#([a-z]+)$/.exec(a.href), tab = m && !/\/w\/index\.html/.test(a.href) ? m[1] : /\/w\/about\.html$/.test(a.href) ? 'about' : /\/w\/index\.html$/.test(a.href) ? 'home' : '';
    if (tab) { e.preventDefault(); parent.postMessage({ nc: 'nav', tab: tab }, '*'); return; }
    a.target = '_top';
  });
  // the main page's search box: the site's own search (it knows every item, monster, map, skill and page)
  var f = document.getElementById('hs');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault(); var q = document.getElementById('hq').value.trim(); if (!q) return;
    if (embed) parent.postMessage({ nc: 'search', q: q }, '*');
    else location.href = new URL('../index.html', location.href).href + '#search/' + encodeURIComponent(q);
  });
})();
/* English mode: when the viewer picked EN (localStorage nc_lang), swap the Thai interface text for English as the page
   renders. Game names that have no official English (items, monsters) stay Thai. */
(function () {
  var lang = 'th';
  try { lang = localStorage.getItem('nc_lang') || 'th'; } catch (e) {}
  if (lang !== 'en') return;
  // the dictionary is its own file (i18n.js sets window.NC_I18N), fetched only for English viewers
  if (window.NC_I18N) return start(window.NC_I18N);
  var sc = document.createElement('script');
  sc.src = window.NC_WIKI_I18N; sc.onload = function () { if (window.NC_I18N) start(window.NC_I18N); };
  document.head.appendChild(sc);
  function start(I) {
  document.documentElement.lang = 'en';
  // the English name beside a Thai name would say the same thing twice; and the "more/less" labels drawn by CSS
  var st = document.createElement('style');
  st.textContent = '.en2{display:none!important}' + (document.querySelector('nav.ch') ? ' details>summary::after{content:"More \\25BE"!important} details[open]>summary::after{content:"Hide \\25B4"!important}' : '');
  document.head.appendChild(st);
  var TH = /[฀-๿]/, NUM = /\d[\d,]*(?:\.\d+)?/g;
  var R = I.r.map(function (x) { return [new RegExp(x[0]), x[1], !!x[2]]; });
  var WK = Object.keys(I.w).sort(function (a, b) { return b.length - a.length; });
  var memo = new Map();
  function core(c) {
    if (!TH.test(c)) return c;
    if (I.x[c] != null) return I.x[c];
    var nums = c.match(NUM) || [], n = c.replace(NUM, '{n}');
    if (I.x[n] != null) { var i = 0; return I.x[n].replace(/\{n\}/g, function () { return nums[i++] != null ? nums[i - 1] : ''; }); }
    // lists first: "a · b" and "a, b" are translated part by part (a repeated name like "Shinobi · Shinobi" collapses)
    var sep = c.indexOf(' · ') >= 0 ? ' · ' : c.indexOf(', ') >= 0 && !/[()]/.test(c) ? ', ' : null;
    if (sep) {
      var parts = c.split(sep).map(function (p) { var t = core(p.trim()); return t == null ? p : t; });
      if (sep === ' · ' && parts.length === 2 && parts[0] === parts[1]) return parts[0];
      if (parts.some(function (p, i) { return p !== c.split(sep)[i]; })) return parts.join(sep);
    }
    for (var k = 0; k < R.length; k++) {
      var g = c.match(R[k][0]);
      if (!g) continue;
      var ok = true, raw = R[k][2];
      var res = R[k][1].replace(/\{(\d)\}/g, function (_, d) { var v = g[+d] || ''; var t = core(v); if (t == null) { if (!raw) ok = false; return v; } return t; });
      if (ok) return res;
    }
    var w = c;
    for (var j = 0; j < WK.length; j++) if (w.indexOf(WK[j]) >= 0) w = w.split(WK[j]).join(I.w[WK[j]]);
    if (!TH.test(w)) return w;
    return null;
  }
  function tr(s) {
    if (!s || !TH.test(s)) return s;
    if (memo.has(s)) return memo.get(s);
    var m = s.match(/^(\s*)([\s\S]*?)(\s*)$/), out = core(m[2]);
    var r = out == null ? s : m[1] + out + m[3];
    memo.set(s, r);
    return r;
  }
  var ATTR = ['placeholder', 'title', 'aria-label'];
  function el(e) {
    for (var a = 0; a < ATTR.length; a++) { var v = e.getAttribute && e.getAttribute(ATTR[a]); if (v && TH.test(v)) { var t = tr(v); if (t !== v) e.setAttribute(ATTR[a], t); } }
  }
  function walk(root) {
    if (root.nodeType === 3) { text(root); return; }
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA)$/.test(root.tagName)) return;
    el(root);
    var it = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT), n;
    while ((n = it.nextNode())) {
      if (n.nodeType === 3) text(n);
      else if (!/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.tagName)) el(n);
    }
  }
  function text(n) {
    var p = n.parentNode;
    if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return;
    var v = n.nodeValue, t = tr(v);
    if (t !== v) n.nodeValue = t;
  }
  if (TH.test(document.title)) document.title = tr(document.title);
  walk(document.body);
  new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) {
      var m = ms[i];
      if (m.type === 'characterData') text(m.target);
      else if (m.type === 'attributes') el(m.target);
      else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  window.NC_TR = tr;
  }
})();
// Words players trip over, explained where they appear: a table header, a label or a tag whose whole text is one of these
// gets a dotted underline; hover (or tap on a phone) shows what it means. site.py puts this in every page.
(function () {
  const EN = (() => { try { return localStorage.getItem('nc_lang') === 'en'; } catch (e) { return false; } })();
  // [Thai explanation, English explanation]; keys are the words as pages show them (Thai or English)
  const G = {
    ATK: ['พลังโจมตีกายภาพ: STR (อาวุธระยะไกลใช้ DEX) + ATK ของอาวุธ · สกิลส่วนใหญ่แรงเป็น % ของค่านี้', 'Physical attack: STR (DEX for ranged weapons) + weapon ATK · most skills hit for a % of it'],
    MATK: ['พลังเวท มาจาก INT · สกิลเวทแรงเป็น % ของค่านี้', 'Magic attack, from INT · spells hit for a % of it'],
    DEF: ['ป้องกันกายภาพ ลดดาเมจที่รับจากการตีธรรมดาและสกิลกายภาพ', 'Physical defence: lowers physical damage taken'],
    MDEF: ['ป้องกันเวท ลดดาเมจเวทที่รับ', 'Magic defence: lowers magic damage taken'],
    HIT: ['ความแม่น = เลเวล + DEX (+ อุปกรณ์) ยิ่งสูงยิ่งตีโดน', 'Accuracy = level + DEX (+ gear): higher hits more often'],
    FLEE: ['การหลบ = เลเวล + AGI (+ อุปกรณ์) ยิ่งสูงมอนยิ่งตีพลาด', 'Evasion = level + AGI (+ gear): monsters miss more'],
    SP: ['พลังที่ใช้ร่ายสกิล ฟื้นด้วยยาฟ้าหรือรอเวลา', 'What skills cost; restored by blue potions or over time'],
    HP: ['พลังชีวิต หมดแล้วตาย', 'Health; at zero you fall'],
    EXP: ['ค่าประสบการณ์ เต็มแล้วเลเวลขึ้น', 'Experience; fill it to level up'],
    Job: ['Job EXP ค่าประสบการณ์อาชีพ ใช้ขึ้น Job Lv ได้แต้มสกิล', 'Job EXP: raises Job Lv, which gives skill points'],
    'Job Lv': ['เลเวลอาชีพ ขึ้นแล้วได้แต้มสกิล 1 แต้ม', 'Job level: each one gives a skill point'],
    คริ: ['โอกาสคริติคอล (ตีแรงพิเศษ) มาจาก LUK และอุปกรณ์', 'Critical chance (an extra-hard hit), from LUK and gear'],
    คริติคอล: ['โอกาสตีแรงพิเศษ มาจาก LUK และอุปกรณ์', 'Chance of an extra-hard hit, from LUK and gear'],
    ตีเร็ว: ['ความเร็วตีปกติ มาจาก AGI และ DEX เล็กน้อย', 'Basic attack speed, from AGI (and a little DEX)'],
    คูลดาวน์: ['เวลารอก่อนใช้สกิลเดิมซ้ำได้', 'Wait before the same skill can be used again'],
    ดีเลย์: ['เวลาหยุดหลังกดสกิล ก่อนกดสกิลถัดไปได้', 'The pause after a skill before the next one'],
    เกรด: ['ระดับของไอเทม 1–4 (ตามเลเวลไอเทม) ใช้คิดราคาและโอกาสตีบวก', 'Item grade 1–4 (by item level); sets refine prices and odds'],
    'เลเวลฉัน': ['เลเวลตัวละครของคุณ ใช้คิดช่องว่างเลเวลกับมอน: ห่างไม่เกิน 3 ได้ EXP และของเต็ม', 'Your level, for the level gap: within 3 levels of a monster you get full EXP and drops'],
    'ช่องว่างเลเวล': ['ต่างจากมอน ≤3 เลเวล = 100% · 4–8 = 70% · 9–14 = 40% · 15–20 = 20% · มากกว่า = 5% (ทั้ง EXP และดรอป)', 'Level gap to a monster: ≤3 = 100% · 4–8 = 70% · 9–14 = 40% · 15–20 = 20% · more = 5% (EXP and drops)'],
    'ร่างพิเศษ': ['มอนร่างสีพิเศษ เกิดน้อยกว่า แข็งกว่า และดรอปดีกว่าร่างปกติ', 'A rare colour form: tougher, with better drops'],
    ธาตุ: ['ธาตุที่ตีใส่ธาตุของมอน แรงขึ้นหรือเบาลงตามตารางธาตุ (เช่น ไฟตีดิน ×1.5)', 'Your element against the monster\'s: stronger or weaker by the element table (e.g. fire on earth ×1.5)'],
  };
  const KEY = {}; for (const k of Object.keys(G)) KEY[k.toLowerCase()] = k;
  // the English pages show English words for some Thai keys
  const ALIAS = { crit: 'คริ', 'attack speed': 'ตีเร็ว', cooldown: 'คูลดาวน์', delay: 'ดีเลย์', grade: 'เกรด', 'my level': 'เลเวลฉัน', 'special form': 'ร่างพิเศษ', element: 'ธาตุ', 'level gap': 'ช่องว่างเลเวล' };
  const one = (s) => KEY[s.toLowerCase()] || ALIAS[s.toLowerCase()] || null;
  // the whole text, or a short label that starts with a term ("ATK สเตตัส", "HIT / FLEE")
  const find = (t) => { const s = t.trim().replace(/[:：]$/, '').trim(); return one(s) || (s.length <= 16 ? one(s.split(/[\s/]+/)[0]) : null); };
  const st = document.createElement('style');
  st.textContent = '.gl{text-decoration:underline dotted;text-underline-offset:3px;cursor:help}.glpop{position:fixed;z-index:99;max-width:min(320px,90vw);background:var(--fg,#18203a);color:var(--bg,#fff);font:13px/1.45 var(--body,system-ui);padding:8px 10px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.25)}';
  document.head.appendChild(st);
  function mark(root) {
    for (const el of (root || document).querySelectorAll('th, label, .lab, .tag, .chip, .sxc, small, .muted, h3, span')) {
      if (el.dataset.gl || el.children.length > 1) continue;
      const k = find(el.textContent || ''); if (!k) continue;
      el.dataset.gl = k; el.classList.add('gl'); el.title = G[k][EN ? 1 : 0];
    }
  }
  let pop = null;
  document.addEventListener('click', (e) => {
    const g = e.target.closest && e.target.closest('[data-gl]');
    if (pop) { pop.remove(); pop = null; }
    if (!g || g.closest('button, a, select')) return;
    pop = document.createElement('div'); pop.className = 'glpop'; pop.textContent = G[g.dataset.gl][EN ? 1 : 0]; document.body.appendChild(pop);
    const r = g.getBoundingClientRect(); pop.style.left = Math.max(8, Math.min(innerWidth - pop.offsetWidth - 8, r.left)) + 'px'; pop.style.top = (r.bottom + 6 + pop.offsetHeight > innerHeight ? r.top - pop.offsetHeight - 6 : r.bottom + 6) + 'px';
  });
  let t = 0; new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => mark(), 120); }).observe(document.body, { childList: true, subtree: true });
  mark();
  window.NC_GLOSS = G;
  // the guide's word list (game systems)
  const L = document.getElementById('glossList');
  if (L) L.innerHTML = '<dl style="margin:0;display:grid;grid-template-columns:max-content 1fr;gap:6px 14px;font-size:14px">' + Object.entries(G).map(([k, v]) => `<dt style="font-weight:600">${k}</dt><dd style="margin:0">${v[EN ? 1 : 0].replace(/[<>&]/g, '')}</dd>`).join('') + '</dl>';
})();
