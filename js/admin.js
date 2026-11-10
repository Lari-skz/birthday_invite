// PARTY COMMAND — host dashboard
(() => {
  'use strict';
  const API = window.API;
  const sb = API.client;
  const $ = (s) => document.querySelector(s);
  let rows = [];
  const AV = Object.fromEntries((window.AVATARS || []).map((a) => [a.id, a]));
  let timer = null;

  const led = (text, cls = '') => { const l = $('#statusLed'); l.textContent = text; l.className = 'led ' + cls; };

  function showLogin(msg) {
    $('#dash').hidden = true;
    $('#loginBox').hidden = false;
    const e = $('#loginError');
    e.hidden = !msg;
    e.textContent = msg || '';
    led('● BLOCAT', 'warn');
  }

  function showDash() {
    $('#loginBox').hidden = true;
    $('#dash').hidden = false;
  }

  async function enterDash() {
    const { data: ok, error } = await sb.rpc('is_admin');
    if (error || !ok) {
      await sb.auth.signOut();
      showLogin('ACCES INTERZIS. Contul ăsta nu face parte din Comitetul Aniversar.');
      return;
    }
    showDash();
    await load();
    clearInterval(timer);
    timer = setInterval(load, 30000);
  }

  async function load() {
    try {
      if (API.demo) {
        rows = API.demoRows().slice().sort((x, y) => String(y.updated_at).localeCompare(String(x.updated_at)));
      } else {
        const { data, error } = await sb
          .from('responses')
          .select('name, avatar, attending, date_vote, food_vote, drink_choice, final_answer, created_at, updated_at')
          .order('updated_at', { ascending: false });
        if (error) throw error;
        rows = data || [];
      }
      render();
      led(API.demo ? '● MOD DEMO' : '● ONLINE', API.demo ? 'warn' : '');
      $('#lastSync').textContent = `Ultima sincronizare: ${new Date().toLocaleTimeString('ro-RO')} · se actualizează singur la 30 de secunde`;
    } catch (err) {
      console.error(err);
      led('● SEMNAL PIERDUT', 'bad');
    }
  }

  function render() {
    const count = (fn) => rows.filter(fn).length;
    const pizza = count((r) => r.food_vote === 'pizza');
    const grill = count((r) => r.food_vote === 'grill');
    $('#cAttend').textContent = count((r) => r.attending);
    $('#cNot').textContent = count((r) => !r.attending);
    $('#cSat').textContent = count((r) => r.date_vote === 'saturday');
    $('#cSun').textContent = count((r) => r.date_vote === 'sunday');
    $('#cPizza').textContent = pizza;
    $('#cGrill').textContent = grill;
    $('#cPirate').textContent = count((r) => r.attending && r.drink_choice === 'pirate');
    $('#cCaptain').textContent = count((r) => r.attending && r.drink_choice === 'captain');
    $('#cD').textContent = count((r) => r.final_answer === 'D');
    $('#cTotal').textContent = rows.length;
    const ap = count((r) => r.attending && r.food_vote === 'pizza');
    const ag = count((r) => r.attending && r.food_vote === 'grill');
    const as = count((r) => r.attending && r.date_vote === 'saturday');
    const au = count((r) => r.attending && r.date_vote === 'sunday');
    $('#cAttendVotes').textContent = `Doar cei care vin: 🪩 Sâm ${as} · 🛋️ Dum ${au} · 🍕 ${ap} · 🔥 ${ag}`;
    $('#cLeader').textContent = `CÂȘTIGĂTOR ACTUAL: ${pizza > grill ? '🍕 PIZZA' : grill > pizza ? '🔥 GRĂTAR 🇺🇸' : '⚖️ EGALITATE'}`;

    const tbody = $('#rows');
    tbody.textContent = '';
    for (const r of rows) {
      const tr = document.createElement('tr');
      const cells = [
        r.name,
        r.attending ? '✅ da' : '❌ nu',
        r.date_vote === 'saturday' ? 'Sâm' : r.date_vote === 'sunday' ? 'Dum' : '—',
        r.food_vote === 'pizza' ? '🍕' : r.food_vote === 'grill' ? '🔥' : '—',
        r.drink_choice === 'pirate' ? '🏴‍☠️' : r.drink_choice === 'captain' ? '⚓' : '—',
        r.final_answer || '—',
        new Date(r.updated_at || r.created_at).toLocaleString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      ];
      cells.forEach((c, i) => {
        const td = document.createElement('td');
        if (i === 0 && AV[r.avatar]) {
          const pic = document.createElement('span');
          pic.className = 'mini-av';
          pic.innerHTML = AV[r.avatar].svg; // trusted, static markup
          pic.title = AV[r.avatar].name;
          td.appendChild(pic);
        }
        td.appendChild(document.createTextNode(c)); // guest names are always plain text
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
  }

  function exportCsv() {
    const esc = (v) => {
      let s = String(v ?? '');
      if (/^[=+\-@]/.test(s)) s = "'" + s; // stop spreadsheet formula injection
      return `"${s.replace(/"/g, '""')}"`;
    };
    const head = ['name', 'avatar', 'attending', 'date_vote', 'food_vote', 'drink_choice', 'final_answer', 'created_at', 'updated_at'];
    const lines = [head.join(',')].concat(rows.map((r) => head.map((k) => esc(r[k])).join(',')));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'raspunsuri-petrecere.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  $('#btnRefresh').addEventListener('click', load);
  $('#btnCsv').addEventListener('click', exportCsv);
  $('#btnLogout').addEventListener('click', async () => {
    clearInterval(timer);
    if (sb) await sb.auth.signOut();
    showLogin();
  });

  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    led('● AUTENTIFICARE…', 'warn');
    const { error } = await sb.auth.signInWithPassword({
      email: $('#email').value.trim(),
      password: $('#password').value,
    });
    $('#password').value = '';
    if (error) { showLogin('ACCES INTERZIS: ' + error.message); return; }
    enterDash();
  });

  // ── Start ──
  if (API.demo) {
    $('#demoNote').hidden = false;
    $('#btnLogout').hidden = true;
    showDash();
    load();
  } else {
    sb.auth.getSession().then(({ data }) => (data.session ? enterDash() : showLogin()));
  }
})();
