// Talks to Supabase — or to a fake local database in DEMO MODE.
window.API = (() => {
  'use strict';
  const C = window.BIRTHDAY_CONFIG || {};
  const isPlaceholder = (v) => !v || /YOUR-/.test(v);
  const configured = !isPlaceholder(C.SUPABASE_URL) && !isPlaceholder(C.SUPABASE_ANON_KEY);
  const demo = !configured || !window.supabase;

  if (configured && !window.supabase) {
    console.warn('[API] supabase-js failed to load — falling back to DEMO MODE.');
  }

  const client = demo ? null : window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);

  // ── Storage helpers (private mode can throw) ──────────────
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  };

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    const b = new Uint8Array(16);
    (window.crypto || {}).getRandomValues ? crypto.getRandomValues(b) : b.forEach((_, i) => (b[i] = Math.random() * 256));
    b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
    const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }

  function guestId() {
    let id = store.get('bp_guest_id');
    if (!id) { id = uuid(); store.set('bp_guest_id', id); }
    return id;
  }

  // ── Demo database ─────────────────────────────────────────
  const DEMO_KEY = 'bp_demo_db_v5';
  function demoRows() {
    try {
      const rows = JSON.parse(store.get(DEMO_KEY));
      if (Array.isArray(rows)) return rows;
    } catch { /* reseed */ }
    const now = Date.now();
    const seed = [
      ['Agent Demo 1', true, 'saturday', 'pizza', 'pirate', 'D'], ['Agent Demo 2', true, 'sunday', 'grill', 'captain', 'B'], ['Agent Demo 3', true, 'saturday', 'grill', 'pirate', 'D'],
      ['Agent Demo 4', true, 'saturday', 'pizza', 'pirate', 'C'], ['Agent Demo 5', false, 'sunday', 'grill', null, 'A'], ['Agent Demo 6', true, 'sunday', 'pizza', 'captain', 'D'],
    ].map(([name, attending, date_vote, food_vote, drink_choice, final_answer], i) => ({
      guest_id: uuid(), name, avatar: ['penguin', 'cat', 'monkey', 'owl', 'bug', 'llama'][i], attending, date_vote, food_vote, drink_choice, final_answer,
      created_at: new Date(now - (i + 1) * 3600e3).toISOString(),
      updated_at: new Date(now - (i + 1) * 3600e3).toISOString(),
    }));
    store.set(DEMO_KEY, JSON.stringify(seed));
    return seed;
  }

  function demoSubmit(row) {
    const rows = demoRows();
    const i = rows.findIndex((r) => r.guest_id === row.guest_id);
    const now = new Date().toISOString();
    if (i >= 0) {
      const old = rows[i];
      rows[i] = { ...old, ...row, avatar: row.avatar ?? old.avatar, date_vote: row.date_vote ?? old.date_vote, food_vote: row.food_vote ?? old.food_vote, drink_choice: row.drink_choice ?? old.drink_choice, final_answer: row.final_answer ?? old.final_answer, updated_at: now };
    } else {
      rows.push({ ...row, created_at: now, updated_at: now });
    }
    store.set(DEMO_KEY, JSON.stringify(rows));
  }

  // ── Public API ────────────────────────────────────────────
  async function submit(state) {
    const row = {
      guest_id: guestId(),
      name: String(state.name || '').trim().slice(0, 40),
      avatar: state.avatar || null,
      attending: !!state.attending,
      date_vote: state.date_vote || null,
      food_vote: state.food_vote || null,
      drink_choice: state.drink_choice || null,
      final_answer: state.final_answer || null,
    };
    if (demo) { await new Promise((r) => setTimeout(r, 250)); demoSubmit(row); return; }
    const { error } = await client.rpc('submit_response', {
      p_guest_id: row.guest_id,
      p_name: row.name,
      p_attending: row.attending,
      p_avatar: row.avatar,
      p_date_vote: row.date_vote,
      p_food_vote: row.food_vote,
      p_drink_choice: row.drink_choice,
      p_final_answer: row.final_answer,
    });
    if (error) throw error;
  }

  async function status() {
    if (demo) {
      const rows = demoRows();
      const me = rows.find((r) => r.guest_id === guestId());
      if (!me || !me.food_vote) return { locked: true };
      return {
        locked: false,
        pizza: rows.filter((r) => r.food_vote === 'pizza').length,
        grill: rows.filter((r) => r.food_vote === 'grill').length,
        operatives: rows.length,
      };
    }
    const { data, error } = await client.rpc('get_food_war_status', { p_guest_id: guestId() });
    if (error) throw error;
    return data;
  }

  return { demo, client, guestId, submit, status, demoRows };
})();
