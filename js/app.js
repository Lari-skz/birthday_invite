// ════════════════════════════════════════════════════════════
//  BIRTHDAY PROTOCOL — game flow
// ════════════════════════════════════════════════════════════
(() => {
  'use strict';
  const C = window.BIRTHDAY_CONFIG || {};
  const FX = window.FX;
  const API = window.API;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const sleep = FX.sleep;
  const PERSON = C.BIRTHDAY_PERSON || 'Sărbătoritul';
  const VERDICT = C.FINAL_VERDICT === 'pizza' || C.FINAL_VERDICT === 'grill' ? C.FINAL_VERDICT : null;
  const DAYS = C.DATE_OPTIONS || {};
  const FINAL_DAY = C.FINAL_DATE === 'saturday' || C.FINAL_DATE === 'sunday' ? C.FINAL_DATE : null;

  // ── Achievements ──────────────────────────────────────────
  // Trophies that exclude each other: never show the other one as "locked"
  const ALT = { pizza: 'grill', grill: 'pizza', pirate: 'captain', captain: 'pirate' };
  const HINT = {
    loyal: 'Indiciu: confirmă că vii.',
    calendar: 'Indiciu: alege o zi.',
    pizza: 'Indiciu: Războiul Mâncării.',
    grill: 'Indiciu: Războiul Mâncării.',
    pirate: 'Indiciu: Operațiunea Rom.',
    captain: 'Indiciu: Operațiunea Rom.',
    goblin: 'Indiciu: la testul final există un singur răspuns corect.',
    veteran: 'Indiciu: termină tot jocul.',
  };
  const ACH = {
    classified: { icon: '🕵️', name: 'Invitat Clasificat', desc: 'Ai trecut de punctul de control.' },
    loyal:      { icon: '🫡', name: 'Agent Loial', desc: 'Ai confirmat că vii.' },
    calendar:   { icon: '🗓️', name: 'Stăpânul Calendarului', desc: 'Ai votat ziua.' },
    pizza:      { icon: '🍕', name: 'Soldatul Generalului', desc: 'Ai votat pizza.' },
    grill:      { icon: '🔥', name: 'Campion BBQ', desc: 'Ai votat grătarul.' },
    pirate:     { icon: '🏴‍☠️', name: 'Pirat Certificat', desc: 'Ai ales romul. Arrr!' },
    captain:    { icon: '⚓', name: 'Căpitanul Treaz', desc: 'Îi duci pe toți acasă. Legendă.' },
    goblin:     { icon: '🍽️', name: 'Goblin de Petrecere', desc: 'Ai ales „TE ARUNCI PE MÂNCARE”.' },
    veteran:    { icon: '⚔️', name: 'Veteran al Războiului Mâncării', desc: 'Ai terminat toată invitația.' },
    egg:        { icon: '🥚', name: 'Vânător de Easter Egg-uri', desc: 'Ai găsit tortul secret. Ochi de hacker.', secret: true },
  };

  // ── Avatars ───────────────────────────────────────────────
  const AVATARS = window.AVATARS || [];
  const avatarById = (id) => AVATARS.find((a) => a.id === id) || null;

  // ── State (saved in the browser) ──────────────────────────
  const STORE = 'bp_state_v1';
  const blank = () => ({ name: '', avatar: null, attending: null, date_vote: null, food_vote: null, drink_choice: null, final_answer: null, achievements: [], completed: false });
  let S = load();

  function load() {
    try { return Object.assign(blank(), JSON.parse(localStorage.getItem(STORE)) || {}); }
    catch { return blank(); }
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch { /* ignore */ } }

  function unlock(id) {
    if (!ACH[id] || S.achievements.includes(id)) return;
    S.achievements.push(id);
    save();
    FX.toast(ACH[id]);
    updateAchCount();
  }
  function lock(id) {
    S.achievements = S.achievements.filter((a) => a !== id);
    save();
    updateAchCount();
  }
  function updateAchCount() { $('#achCount').textContent = `🏆 ${S.achievements.length}`; }

  // ── Sync to backend (queued so calls stay in order) ───────
  let queue = Promise.resolve();
  function sync() {
    if (!S.name || S.attending === null) return queue;
    queue = queue
      .then(() => API.submit(S))
      .then(() => setLed('ok'))
      .catch((err) => {
        console.error('[sync]', err);
        setLed('bad');
        FX.toast({ icon: '📡', name: 'TRANSMISIE EȘUATĂ', desc: 'Verifică semnalul. Răspunsurile se retrimit la pasul următor.' }, 'warn');
      });
    return queue;
  }
  function setLed(kind) {
    const led = $('#statusLed');
    if (API.demo) { led.textContent = '● MOD DEMO'; led.className = 'led warn'; return; }
    led.textContent = kind === 'bad' ? '● SEMNAL PIERDUT' : '● ONLINE';
    led.className = 'led' + (kind === 'bad' ? ' bad' : '');
  }

  // ── Helpers ───────────────────────────────────────────────
  function el(tag, text, cls) {
    const n = document.createElement(tag);
    if (text != null) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  }
  const cleanName = (v) => String(v || '').replace(/\s+/g, ' ').trim().slice(0, 40);
  const firstWord = (t) => (t.toLowerCase().match(/[\p{L}\p{N}]+/u) || [''])[0];
  const isPerson = (n) => firstWord(n) !== '' && firstWord(n) === firstWord(PERSON);

  function dayDate(key) {
    if (!DAYS[key]) return null;
    const d = new Date(`${DAYS[key]}T${C.PARTY_TIME || '18:00'}`);
    return isNaN(d) ? null : d;
  }
  const fmtDay = (d) => d.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });
  function partyDate() { return FINAL_DAY ? dayDate(FINAL_DAY) : null; }
  function partyDayText() {
    if (FINAL_DAY) { const d = partyDate(); return d ? fmtDay(d) : ''; }
    const sat = dayDate('saturday');
    const sun = dayDate('sunday');
    if (!sat || !sun) return '';
    return `${fmtDay(sat)} sau ${fmtDay(sun)} (votezi tu)`;
  }
  const partyTimeText = () => (C.PARTY_TIME_NOTE ? C.PARTY_TIME_NOTE : C.PARTY_TIME || 'TBA');
  const partyPlaceText = () => C.PARTY_LOCATION || C.PARTY_LOCATION_NOTE || 'Clasificată';

  // ── Screen router ─────────────────────────────────────────
  const enter = {};
  function show(name) {
    $$('.screen').forEach((s) => s.classList.toggle('active', s.dataset.screen === name));
    window.scrollTo(0, 0);
    if (enter[name]) enter[name]();
  }

  // ═════════ BOOT ═════════
  enter.boot = async () => {
    const ul = $('#bootLines');
    ul.textContent = '';
    $('#btnEnter').classList.add('hidden');
    const lines = [
      ['ok', '✓ Baza de date cu invitați încărcată'],
      ['ok', `✓ Sărbătorit detectat: ${PERSON.toUpperCase()}`],
      ['ok', '✓ Integritate tort: 100%'],
      ['crit', '✓ Nivel de foame: CRITIC'],
      ...(FINAL_DAY ? [] : [['warn', '⚠ ZIUA PETRECERII: ÎN NEGOCIERE']]),
      ...(C.PARTY_LOCATION ? [] : [['warn', '⚠ LOCAȚIE: CLASIFICATĂ']]),
      ['warn', '⚠ MENIU: NEDECIS'],
    ];
    if (S.completed && S.name) lines.splice(1, 0, ['ok', `✓ Agent revenit: ${S.name.toUpperCase()}`]);
    for (const [cls, text] of lines) {
      ul.appendChild(el('li', text, cls));
      await sleep(FX.reduced ? 50 : 480);
    }
    await sleep(250);
    $('#btnEnter').textContent = S.completed && S.avatar ? '[ DESCHIDE-MI DOSARUL ]' : '[ INTRĂ LA PETRECERE ]';
    $('#btnEnter').classList.remove('hidden');
  };
  $('#btnEnter').addEventListener('click', () => show(S.completed && S.avatar ? 'debrief' : 'identify'));

  // ═════════ IDENTIFY ═════════
  enter.identify = () => {
    const params = new URLSearchParams(location.search);
    const fromLink = cleanName(params.get('name') || params.get('guest'));
    $('#inpName').value = S.name || fromLink;
    $('#scanLog').textContent = '';
    $('#personalNote').hidden = !fromLink;
    if (fromLink) $('#personalNote').textContent = `📨 INVITAȚIE PERSONALĂ DETECTATĂ — DESTINATAR: ${fromLink.toUpperCase()}. Confirmă că ești tu.`;
    $('#nameError').hidden = true;
    $('#btnName').disabled = false;
    pendingAvatar = S.avatar;
    renderAvatars();
  };

  let pendingAvatar = null;
  function renderAvatars() {
    const grid = $('#avatarGrid');
    grid.textContent = '';
    for (const a of AVATARS) {
      const b = el('button', null, 'avatar');
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(a.id === pendingAvatar));
      b.setAttribute('aria-label', a.name);
      b.innerHTML = a.svg; // trusted, static markup from avatars.js
      b.appendChild(el('span', a.name, 'a-name'));
      b.addEventListener('click', () => {
        pendingAvatar = a.id;
        FX.vibrate(20);
        renderAvatars();
        $('#nameError').hidden = true;
      });
      grid.appendChild(b);
    }
    const pick = $('#avatarPick');
    pick.textContent = '';
    const a = avatarById(pendingAvatar);
    if (a) pick.append(el('b', a.name.toUpperCase()), el('span', a.tag));
    else pick.textContent = 'Încă n-ai ales un avatar. 👀';
  }
  $('#formName').addEventListener('submit', async (e) => {
    e.preventDefault();
    const n = cleanName($('#inpName').value);
    const err = $('#nameError');
    if (!n) {
      err.hidden = false;
      err.textContent = 'EROARE: Fără nume nu intri. 😄';
      FX.shake($('#formName'));
      FX.vibrate(80);
      return;
    }
    if (!pendingAvatar) {
      err.hidden = false;
      err.textContent = 'EROARE: Alege un avatar. Până și Bug-ul are unul.';
      FX.shake($('#avatarGrid'));
      FX.vibrate(80);
      return;
    }
    err.hidden = true;
    $('#inpName').blur();
    $('#btnName').disabled = true;
    S.name = n;
    S.avatar = pendingAvatar;
    save();
    const log = $('#scanLog');
    log.textContent = '';
    await FX.typeLines(log, [
      'SCANARE AMPRENTĂ...',
      'VERIFICARE ISTORIC GUSTĂRI...',
      isPerson(n)
        ? { t: `STAI… E CHIAR ${n.toUpperCase()}! 👑 SĂRBĂTORITA ARE ACCES TOTAL.`, cls: 'big good' }
        : { t: `✓ ACCES PERMIS. BINE AI VENIT, AGENT ${n.toUpperCase()} — CLASA: ${(avatarById(S.avatar) || { name: 'NECUNOSCUTĂ' }).name.toUpperCase()}.`, cls: 'big good' },
    ]);
    unlock('classified');
    await sleep(1000);
    show('rsvp');
  });

  // ═════════ MISSION 01: RSVP ═════════
  let noArmed = false;
  enter.rsvp = () => {
    noArmed = false;
    const no = $('#btnNo');
    no.classList.remove('dodge');
    no.textContent = '[ ÎN NICIUN CAZ ]';
    $('#rsvpButtons').hidden = false;
    $('#rsvpVerdict').hidden = true;
    $('#rsvpVerdict').textContent = '';
    $('#btnToBattle').classList.add('hidden');
    $('#btnChangeMind').classList.add('hidden');
    $('#sadCat').hidden = true;
    const pw = $('#partyWhen');
    pw.textContent = '';
    const day = partyDayText();
    if (day) pw.appendChild(el('span', `📅 ${day}`, 'info-line'));
    pw.appendChild(el('span', `🕓 ${partyTimeText()}`, 'info-line'));
    pw.appendChild(el('span', `📍 ${partyPlaceText()}`, 'info-line'));
  };
  $('#btnYes').addEventListener('click', () => answerRsvp(true));
  $('#btnNo').addEventListener('click', () => {
    if (!noArmed) {
      noArmed = true;
      const b = $('#btnNo');
      b.style.setProperty('--dodge', `${Math.random() > 0.5 ? 34 : -34}px`);
      b.classList.add('dodge');
      b.textContent = '[ EȘTI SIGUR(Ă)? 🤨 ]';
      FX.vibrate(40);
      return;
    }
    answerRsvp(false);
  });

  async function answerRsvp(yes) {
    S.attending = yes;
    save();
    sync();
    $('#rsvpButtons').hidden = true;
    $('#btnChangeMind').classList.add('hidden');
    const v = $('#rsvpVerdict');
    v.hidden = false;
    v.textContent = '';
    v.className = 'verdict' + (yes ? ' win' : '');
    if (yes) {
      $('#sadCat').hidden = true;
      unlock('loyal');
      await FX.typeLines(v, [
        { t: 'SUPER! 🎉', cls: 'big good' },
        'Te-am trecut pe listă.',
        'Acum urmează partea importantă: mâncarea.',
      ]);
      $('#btnToBattle').textContent = '[ CONTINUĂ ]';
      $('#btnToBattle').classList.remove('hidden');
      return;
    }
    // Not coming: take it for real. Just a crying kitten, for fun.
    lock('loyal');
    $('#sadCat').hidden = false;
    FX.vibrate([30, 60, 30]);
    await FX.typeLines(v, [
      { t: 'Ooo… păcat că nu poți veni. 😿', cls: 'big' },
      'Pisica a luat-o personal.',
      { t: 'Am salvat răspunsul. Te pupăm și ne vedem altă dată!', cls: 'small' },
    ]);
    $('#btnChangeMind').classList.remove('hidden');
  }
  $('#btnChangeMind').addEventListener('click', () => answerRsvp(true));
  $('#btnToBattle').addEventListener('click', () => show(FINAL_DAY ? 'battle' : 'date'));

  // ═════════ MISSION 02: DATE POLL ═════════
  enter.date = () => {
    $('#dateButtons').hidden = false;
    $('#dateVerdict').hidden = true;
    $('#dateVerdict').textContent = '';
    $('#btnDateNext').classList.add('hidden');
    const sat = dayDate('saturday');
    const sun = dayDate('sunday');
    $('#lblSat').textContent = sat ? fmtDay(sat) : '';
    $('#lblSun').textContent = sun ? fmtDay(sun) : '';
  };
  $$('[data-day]').forEach((b) => b.addEventListener('click', () => voteDay(b.dataset.day)));

  async function voteDay(day) {
    S.date_vote = day;
    save();
    sync();
    unlock('calendar');
    $('#dateButtons').hidden = true;
    const v = $('#dateVerdict');
    v.hidden = false;
    v.textContent = '';
    v.className = 'verdict win';
    await FX.typeLines(v, day === 'saturday'
      ? [{ t: 'SÂMBĂTĂ. Un clasic.', cls: 'big good' }, 'Alegere bună: duminica rămâne pentru dormit.']
      : [{ t: 'DUMINICĂ? Riscant.', cls: 'big good' }, 'Luni dimineață o să fie greu. Dar merită.']);
    await FX.typeLines(v, [
      { t: 'Am trimis votul tău Organizatorului. Îl ia în considerare, promit.', cls: 'small' },
      { t: '(Dar Organizatorul are ultimul cuvânt. Și mereu dreptate.)', cls: 'small' },
    ]);
    $('#btnDateNext').classList.remove('hidden');
  }
  $('#btnDateNext').addEventListener('click', () => show('battle'));

  // ═════════ MISSION 02: FOOD WAR ═════════
  let battleToken = 0;
  let skipBattle = null;

  enter.battle = () => {
    $('#choice').hidden = true;
    $('#voteResult').hidden = true;
    $('#verdictBox').hidden = true;
    $('#voteStatus').hidden = true;
    $('#btnToFinal').classList.add('hidden');
    $('#btnSkip').hidden = false;
    runBattle();
  };

  const say = (t) => { $('#commentary').textContent = t; };

  function boom(text) {
    const arena = $('#arena');
    const imp = $('#impact');
    imp.querySelector('span').textContent = text;
    imp.classList.remove('show');
    void imp.offsetWidth;
    imp.classList.add('show');
    arena.classList.remove('flash');
    void arena.offsetWidth;
    arena.classList.add('flash');
    FX.shake($('#battlePanel'));
    FX.vibrate([70, 40, 110]);
  }

  function fire(side) {
    const arena = $('#arena');
    const from = side === 'pizza' ? $('#pizzaSoldier') : $('#grillSoldier');
    const to = side === 'pizza' ? $('#grillSoldier') : $('#pizzaSoldier');
    const a = arena.getBoundingClientRect();
    const f = from.getBoundingClientRect();
    const t = to.getBoundingClientRect();
    const p = el('div', side === 'grill' ? '🔥' : null, 'proj ' + (side === 'pizza' ? 'pep' : 'flame'));
    const startX = (side === 'pizza' ? f.right - 20 : f.left) - a.left;
    const startY = f.top - a.top + f.height * 0.35;
    const endX = t.left + t.width / 2 - a.left;
    p.style.left = `${startX}px`;
    p.style.top = `${startY}px`;
    p.style.setProperty('--dx', `${endX - startX}px`);
    p.style.setProperty('--dy', `${(Math.random() - 0.3) * 40}px`);
    p.addEventListener('animationend', () => {
      p.remove();
      to.classList.remove('hit');
      void to.offsetWidth;
      to.classList.add('hit');
    });
    arena.appendChild(p);
  }

  async function runBattle() {
    const token = ++battleToken;
    let skipped = false;
    const skipP = new Promise((r) => { skipBattle = () => { skipped = true; r(); }; });
    const step = (ms) => Promise.race([sleep(ms), skipP]).then(() => {
      if (skipped || token !== battleToken) throw new Error('stop');
    });

    const P = $('#pizzaSoldier');
    const G = $('#grillSoldier');
    P.className = 'soldier pizza';
    G.className = 'soldier grill';
    $('#vsBadge').classList.remove('show');
    $('#impact').className = 'impact';
    $$('#arena .proj').forEach((n) => n.remove());

    try {
      say('▶ ÎNCEPE LUPTA...');
      await step(900);
      P.classList.add('enter');
      say('🍕 GENERALUL PIZZA INTRĂ PE CÂMPUL DE LUPTĂ.');
      await step(1300);
      G.classList.add('enter');
      say('🥩 CAMPIONUL BBQ INTRĂ ÎN RING. 🇺🇸');
      await step(1300);
      P.classList.add('ready');
      G.classList.add('ready');
      $('#vsBadge').classList.add('show');
      say('📢 GENERALUL INTERZICE ANANASUL PE PIZZA.');
      await step(1500);
      say('🥊 CAMPIONUL BBQ FACE 50 DE FLOTĂRI. DOAR AȘA.');
      await step(1800);
      say('Ambele tabere s-au antrenat toată viața pentru asta. (De marți.)');
      await step(1700);
      say('🍕 PLOAIE DE PEPPERONI!');
      for (let i = 0; i < 4; i++) { fire('pizza'); await step(170); }
      await step(800);
      say('🔥 RĂSPUNS: SPATULA DE FOC!');
      for (let i = 0; i < 4; i++) { fire('grill'); await step(170); }
      await step(800);
      $('#vsBadge').classList.remove('show');
      say('🔔 DING DING! RUNDA 1!');
      P.classList.add('charge');
      G.classList.add('charge');
      await step(380);
      P.classList.add('swing');
      G.classList.add('swing');
      boom('CLANG!');
      say('⚔️ SCUT DE USTUROI VS MĂNUȘĂ DE BOX ⚔️');
      await step(1100);
      boom('KA-BOOM!');
      say('Situația scapă de sub control.');
      await step(1300);
      P.classList.remove('charge', 'swing');
      G.classList.remove('charge', 'swing');
      say('Egalitate. Toată lumea e doar mai flămândă.');
      await step(1700);
    } catch {
      if (token !== battleToken) return;
    }
    finishBattle();
  }

  function finishBattle() {
    skipBattle = null;
    $('#pizzaSoldier').className = 'soldier pizza enter ready';
    $('#grillSoldier').className = 'soldier grill enter ready';
    $('#impact').className = 'impact';
    $('#vsBadge').classList.add('show');
    $('#btnSkip').hidden = true;
    if (VERDICT) { showVerdict($('#verdictBox'), true); return; }
    say('⏸ PAUZĂ. TU DECIZI CINE CÂȘTIGĂ.');
    const prev = $('#prevVote');
    prev.hidden = !S.food_vote;
    prev.textContent = S.food_vote ? `(Data trecută ai votat: ${S.food_vote === 'pizza' ? '🍕 PIZZA' : '🔥 GRĂTAR 🇺🇸'})` : '';
    $('#choice').hidden = false;
  }
  $('#btnSkip').addEventListener('click', () => { if (skipBattle) skipBattle(); });

  $$('[data-vote]').forEach((b) => b.addEventListener('click', () => castVote(b.dataset.vote)));

  async function castVote(f) {
    S.food_vote = f;
    save();
    lock(f === 'pizza' ? 'grill' : 'pizza');
    unlock(f);
    const win = f === 'pizza' ? $('#pizzaSoldier') : $('#grillSoldier');
    const lose = f === 'pizza' ? $('#grillSoldier') : $('#pizzaSoldier');
    win.classList.add('cheer');
    lose.classList.add('sulk');
    $('#vsBadge').classList.remove('show');
    say(f === 'pizza' ? '🍕 GENERALUL PIZZA PRIMEȘTE ÎNTĂRIRI!' : '🇺🇸 CAMPIONUL BBQ PRIMEȘTE ÎNTĂRIRI!');
    FX.confetti({ count: 90, colors: f === 'pizza' ? ['#ffc83d', '#d6332a', '#d98b3a', '#fff'] : ['#ff5a36', '#ffb000', '#a8432c', '#ffd34d'] });
    $('#choice').hidden = true;
    $('#voteResult').hidden = false;
    $('#voteStatus').hidden = true;
    $('#btnToFinal').classList.add('hidden');
    const log = $('#voteLog');
    log.textContent = '';
    log.className = 'verdict win';
    await FX.typeLines(log, f === 'pizza'
      ? [{ t: 'AI VOTAT: 🍕 PIZZA', cls: 'big good' }, 'Votul tău a ajuns la Generalul Pizza. E mulțumit.', 'Rar îl vezi zâmbind. Bucură-te.']
      : [{ t: 'AI VOTAT: 🔥 GRĂTAR 🇺🇸', cls: 'big good' }, 'Mare, afumat și cu sos. Exact ca în America.', 'Generalul e supărat. Îi trece. Poate.']);
    await sync();
    if (C.SHOW_RESULTS_AFTER_VOTE !== false) {
      const st = await API.status().catch(() => null);
      renderStatus($('#voteStatus'), st);
    }
    $('#btnToFinal').classList.remove('hidden');
  }
  $('#btnToFinal').addEventListener('click', () => show('drink'));

  // ═════════ MISSION 04: OPERATION RUM ═════════
  let hicTimer = null;
  function stopPirateParty() {
    clearInterval(hicTimer);
    hicTimer = null;
    const sea = $('.sea');
    sea.classList.remove('party');
    $('.p3').classList.remove('overboard');
    $('#splash').classList.remove('show');
    sea.querySelectorAll('.hic').forEach((n) => n.remove());
  }
  function startPirateParty() {
    const sea = $('.sea');
    const words = ['hic!', 'HIC!', 'io-ho-ho!', '♪ rom! ♪', 'hic…', 'ARRR!', 'mai una!', '♪♫'];
    sea.classList.add('party');
    let n = 0;
    hicTimer = setInterval(() => {
      if (++n > 22) { clearInterval(hicTimer); return; }
      const b = el('span', words[Math.floor(Math.random() * words.length)], 'hic');
      b.style.left = `${15 + Math.random() * 62}%`;
      b.style.top = `${18 + Math.random() * 30}%`;
      b.style.setProperty('--r', `${(Math.random() - 0.5) * 30}deg`);
      b.addEventListener('animationend', () => b.remove());
      sea.appendChild(b);
    }, 420);
    setTimeout(() => {
      if (!sea.classList.contains('party')) return;
      $('.p3').classList.add('overboard');
      setTimeout(() => {
        const sp = $('#splash');
        sp.classList.remove('show');
        void sp.offsetWidth;
        sp.classList.add('show');
        FX.vibrate([40, 30, 80]);
      }, 900);
    }, 2600);
  }

  enter.drink = () => {
    stopPirateParty();
    $('#drinkButtons').hidden = false;
    $('#drinkVerdict').hidden = true;
    $('#drinkVerdict').textContent = '';
    $('#btnDrinkNext').classList.add('hidden');
  };
  $$('[data-drink]').forEach((b) => b.addEventListener('click', () => chooseDrink(b.dataset.drink)));

  async function chooseDrink(choice) {
    S.drink_choice = choice;
    save();
    sync();
    lock(choice === 'pirate' ? 'captain' : 'pirate');
    unlock(choice);
    $('#drinkButtons').hidden = true;
    const v = $('#drinkVerdict');
    v.hidden = false;
    v.textContent = '';
    v.className = 'verdict win';
    if (choice === 'pirate') { FX.shake($('#drinkPanel')); startPirateParty(); }
    else FX.confetti({ count: 80, colors: ['#1f6fb3', '#ffcf33', '#fff', '#39ff88'] });
    await FX.typeLines(v, choice === 'pirate'
      ? [
          { t: 'ARRR! 🏴‍☠️', cls: 'big good' },
          'Ești un pirat adevărat. Rația de rom a fost mărită.',
          'Regula de pe corabie: bei și apă între pahare, marinare.',
          { t: '(Și piratul nu conduce corabia niciodată. Ăsta e jobul Căpitanului.)', cls: 'small' },
          { t: 'Raport de bord: Piratul nr. 3 a căzut peste bord. E bine. Cântă.', cls: 'small' },
        ]
      : [
          { t: 'AȘA SĂ FIE, CĂPITANE! ⚓', cls: 'big good' },
          'Ești eroul serii. Pe bune.',
          'Primești suc nelimitat și respect pe viață.',
          { t: '(Pirații îți rămân datori. Notează-ți, că ei sigur n-o să țină minte.)', cls: 'small' },
        ]);
    $('#btnDrinkNext').classList.remove('hidden');
  }
  $('#btnDrinkNext').addEventListener('click', () => { stopPirateParty(); show('final'); });

  function renderStatus(box, st) {
    box.hidden = false;
    box.textContent = '';
    box.appendChild(el('h3', '══ SCORUL ══'));
    if (!st || st.locked) {
      box.appendChild(el('p', '🔒 Vezi scorul după ce votezi.', 'muted center'));
      return;
    }
    const pizza = Number(st.pizza) || 0;
    const grill = Number(st.grill) || 0;
    const total = pizza + grill || 1;
    const rows = [['pizza', '🍕 PIZZA', pizza], ['grill', '🔥 GRĂTAR 🇺🇸', grill]];
    const bars = [];
    for (const [key, label, n] of rows) {
      const row = el('div', null, 'bar-row');
      const lab = el('div', null, 'bar-label');
      lab.append(el('span', label), el('span', `${n} ${n === 1 ? 'vot' : 'voturi'}`));
      const bar = el('div', null, 'bar ' + key);
      const fill = el('i');
      bar.appendChild(fill);
      row.append(lab, bar);
      box.appendChild(row);
      bars.push([fill, (n / total) * 100]);
    }
    const leader = pizza > grill ? '🍕 PIZZA' : grill > pizza ? '🔥 GRĂTAR' : '⚖️ EGALITATE';
    box.appendChild(el('p', `CONDUCE: ${leader}`, 'leader'));
    box.appendChild(el('p', `Au răspuns până acum: ${Number(st.operatives) || 0}`, 'muted center'));
    requestAnimationFrame(() => requestAnimationFrame(() => bars.forEach(([f, w]) => { f.style.width = `${w}%`; })));
  }

  async function showVerdict(box, withButton) {
    const win = VERDICT === 'pizza' ? $('#pizzaSoldier') : $('#grillSoldier');
    const lose = VERDICT === 'pizza' ? $('#grillSoldier') : $('#pizzaSoldier');
    if (box.id === 'verdictBox') {
      win.classList.add('cheer');
      lose.classList.add('sulk');
      $('#vsBadge').classList.remove('show');
      say('🏁 RĂZBOIUL S-A TERMINAT.');
    }
    box.hidden = false;
    box.textContent = '';
    await FX.typeLines(box, [
      { t: 'POPORUL A VORBIT.', pause: 700 },
      { t: 'Meniul petrecerii a fost decis:', pause: 500 },
      { t: VERDICT === 'pizza' ? '🍕 PIZZA 🍕' : '🔥 GRĂTAR 🔥', cls: 'huge', pause: 600 },
      { t: 'Democrația câștigă.', pause: 400 },
      { t: 'Foamea pierde.' },
    ]);
    FX.confetti({ count: 160 });
    if (withButton) {
      const b = el('button', '[ SPRE MISIUNEA 04 ]', 'btn btn-primary');
      b.type = 'button';
      b.addEventListener('click', () => show('drink'));
      box.appendChild(b);
    }
  }

  // ═════════ MISSION 03: FINAL TEST ═════════
  const REACT = {
    A: { label: 'PREA POLITICOS', lines: [{ t: 'Comportament suspect detectat.', cls: 'big' }, 'Nu cunoaștem persoana asta.', 'Am chemat paza. Și paza e flămândă.'] },
    B: { label: 'NERĂBDĂTOR, DAR SINCER', lines: [{ t: 'De înțeles.', cls: 'big' }, 'Din păcate, mâncarea nu e gata încă.', { t: 'Mai rabdă puțin. 😌', cls: 'big' }] },
    C: { label: 'ÎN NEGARE', lines: [{ t: '„Doar puțin” nu există ca unitate de măsură.', cls: 'big' }, 'Îți punem noi „puțin”. Mult puțin.'] },
    D: { label: 'GOBLIN DE PETRECERE CERTIFICAT', lines: [{ t: 'CORECT.', cls: 'big good', pause: 500 }, { t: 'TE ARUNCI PE MÂNCARE.', cls: 'big good', pause: 600 }, 'Exact atitudinea de care avem nevoie.'] },
  };

  let storyToken = 0;
  enter.final = async () => {
    const token = ++storyToken;
    $('#answers').hidden = true;
    $('#finalReaction').hidden = true;
    $('#finalNext').hidden = true;
    const story = $('#story');
    story.textContent = '';
    await FX.typeLines(story, [
      'Ajungi la petrecere.',
      'Vezi mâncarea.',
      'Miroși mâncarea.',
      'Instinctul de supraviețuire pornește.',
      { t: 'Ce faci?', cls: 'big' },
    ], { pause: 500 });
    if (token === storyToken) $('#answers').hidden = false;
  };

  $$('[data-answer]').forEach((b) => b.addEventListener('click', () => answerFinal(b.dataset.answer)));

  async function answerFinal(k) {
    S.final_answer = k;
    save();
    sync();
    $('#answers').hidden = true;
    const box = $('#finalReaction');
    box.hidden = false;
    box.textContent = '';
    box.className = 'verdict' + (k === 'D' ? ' win' : '');
    if (k === 'D') { FX.shake($('#finalPanel')); FX.vibrate([50, 30, 50, 30, 120]); }
    await FX.typeLines(box, REACT[k].lines);
    if (k === 'D') { unlock('goblin'); FX.confetti({ count: 180 }); } else { lock('goblin'); }
    $('#btnRetake').hidden = k === 'D';
    $('#finalNext').hidden = false;
  }
  $('#btnRetake').addEventListener('click', () => {
    $('#finalReaction').hidden = true;
    $('#finalNext').hidden = true;
    $('#answers').hidden = false;
    FX.toast({ icon: '👀', name: 'TE-AM VĂZUT', desc: 'Mai încerci, da?' }, 'warn');
  });
  $('#btnToDebrief').addEventListener('click', () => show('debrief'));

  // ═════════ DEBRIEF ═════════
  let countdownTimer = null;
  enter.debrief = async () => {
    const first = !S.completed;
    S.completed = true;
    save();
    unlock('veteran');
    sync();
    renderDossier();
    renderParty();
    renderAch();
    $('#verdictEnd').hidden = true;
    if (VERDICT) showVerdict($('#verdictEnd'), false);
    if (first) FX.confetti({ count: 240 });
    const st = await API.status().catch(() => null);
    renderStatus($('#debriefStatus'), st);
  };

  function renderDossier() {
    const d = $('#dossier');
    d.textContent = '';
    d.appendChild(el('span', 'CLASIFICAT', 'stamp'));
    const av = avatarById(S.avatar);
    if (av) {
      const pic = el('div', null, 'dossier-avatar');
      pic.innerHTML = av.svg; // trusted, static markup
      d.appendChild(pic);
    }
    const faction = S.food_vote === 'pizza' ? '🍕 PIZZA' : S.food_vote === 'grill' ? '🔥 GRĂTAR 🇺🇸' : '—';
    const rows = [
      ['NUME DE COD', S.name || 'NECUNOSCUT'],
      ['CLASA', avatarById(S.avatar) ? avatarById(S.avatar).name : 'Necunoscută'],
      ['PREZENȚĂ', S.attending ? 'CONFIRMATĂ 🫡' : 'NU VINE 😿'],
      ...(FINAL_DAY ? [] : [['VOT ZI', S.date_vote === 'saturday' ? '🪩 SÂMBĂTĂ' : S.date_vote === 'sunday' ? '🛋️ DUMINICĂ' : '—']]),
      ['MÂNCARE', faction],
      ['ROL ÎN ECHIPAJ', S.drink_choice === 'pirate' ? '🏴‍☠️ PIRAT' : S.drink_choice === 'captain' ? '⚓ CĂPITAN (ȘOFER)' : '—'],
      ['EVALUARE', S.final_answer ? REACT[S.final_answer].label : 'ÎN AȘTEPTARE'],
      ['NIVEL DE ACCES', S.final_answer === 'D' ? 'NIVEL GOBLIN ✦' : 'STANDARD'],
    ];
    for (const [k, v] of rows) {
      const r = el('div', null, 'row');
      r.append(el('span', k, 'k'), el('span', v, 'v'));
      d.appendChild(r);
    }
  }

  function renderParty() {
    const day = partyDayText();
    $('#infoWhen').textContent = `📅 ${day || 'Data: clasificată'}\n🕓 ${partyTimeText()}`;
    $('#infoWhere').textContent = `📍 ${partyPlaceText()}`;
    clearInterval(countdownTimer);
    const d = partyDate();
    const cd = $('#countdown');
    if (!d) { cd.textContent = FINAL_DAY ? '' : '⏳ NUMĂRĂTOARE BLOCATĂ — așteptăm decizia Organizatorului.'; return; }
    const tick = () => {
      const ms = d - Date.now();
      if (ms <= 0) { cd.textContent = 'PETRECEREA A ÎNCEPUT. DE CE MAI CITEȘTI ASTA?'; clearInterval(countdownTimer); return; }
      const days = Math.floor(ms / 864e5);
      const h = Math.floor((ms % 864e5) / 36e5);
      const m = Math.floor((ms % 36e5) / 6e4);
      const s = Math.floor((ms % 6e4) / 1e3);
      cd.textContent = `T-MINUS ${days}z ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    };
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  function renderAch() {
    const ul = $('#achList');
    ul.textContent = '';
    for (const [id, a] of Object.entries(ACH)) {
      const has = S.achievements.includes(id);
      if (a.secret && !has) continue;
      if (!has && ALT[id] && S.achievements.includes(ALT[id])) continue; // picked the other option
      const li = el('li', null, has ? '' : 'locked');
      const body = el('div');
      body.append(el('strong', has ? a.name : '???'), el('small', has ? a.desc : HINT[id] || 'Blocat.'));
      li.append(el('span', has ? a.icon : '❓', 'i'), body);
      ul.appendChild(li);
    }
    const hidden = Object.entries(ACH).filter(([id, a]) => a.secret && !S.achievements.includes(id)).length;
    if (hidden) ul.appendChild(el('li', hidden > 1 ? `+ ${hidden} trofee secrete ascunse pe undeva…` : '+ 1 trofeu secret ascuns pe undeva…', 'locked'));
  }

  // Full reset: wipe this browser's answers + trophies and start from zero.
  // (Keeps the same guest id, so the database updates the same row — no duplicate votes.)
  function resetAll() {
    S = blank();
    save();
    stopPirateParty();
    updateAchCount();
    show('boot');
  }
  let restartArmed = false;
  $('#btnRestart').addEventListener('click', () => {
    const b = $('#btnRestart');
    if (!restartArmed) {
      restartArmed = true;
      b.textContent = 'SIGUR? APASĂ ÎNCĂ O DATĂ';
      setTimeout(() => { restartArmed = false; b.textContent = 'IA-O DE LA ZERO (ȘTERGE TOT)'; }, 3000);
      return;
    }
    restartArmed = false;
    b.textContent = 'IA-O DE LA ZERO (ȘTERGE TOT)';
    resetAll();
  });

  // ═════════ Easter egg: tap the cake 7 times ═════════
  let taps = 0;
  let tapTimer = null;
  $('#logo').addEventListener('click', () => {
    const cake = $('#cake');
    cake.classList.remove('tap');
    void cake.offsetWidth;
    cake.classList.add('tap');
    taps++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { taps = 0; }, 1500);
    if (taps >= 7) {
      taps = 0;
      const first = !S.achievements.includes('egg');
      unlock('egg');
      FX.confetti({ count: 70 });
      if (first && $('[data-screen="debrief"]').classList.contains('active')) renderAch();
    }
  });

  // ═════════ Start ═════════
  if (location.hash === '#reset') {
    S = blank();
    save();
    try { history.replaceState(null, '', location.pathname + location.search); } catch { /* ignore */ }
  }
  updateAchCount();
  setLed('ok');
  show('boot');
})();
