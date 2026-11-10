# 🎂 Protocolul Aniversar — invitația-joc pentru o zi de nastere

O invitație de ziua de naștere deghizată într-un mini joc de browser.
Invitații se înregistrează (nume + avatar), confirmă dacă vin, votează ziua,
votează mâncarea (Generalul Pizza vs. Campionul BBQ 🇺🇸), aleg dacă sunt pirați sau șoferi
și dau un test psihologic absolut necesar.

- **Frontend:** HTML / CSS / JS simplu → GitHub Pages (fără build)
- **Bază de date:** Supabase (PostgreSQL + Row Level Security)
- **Un singur link pentru toți invitații.**

```
index.html            jocul
admin.html            panoul organizatorului (cu login) + export CSV/Excel
css/style.css         stiluri și animații
js/config.js          ← singurul fișier pe care trebuie să-l editezi
js/api.js             legătura cu Supabase (+ mod demo)
js/avatars.js         cele 12 avatare desenate (SVG)
js/effects.js         text tastat, confetti, notificări
js/app.js             logica jocului
js/admin.js           panoul organizatorului
supabase/schema.sql   baza de date + reguli de securitate
```

---

## 1. Mod demo (fără bază de date)

Cât timp `js/config.js` are valorile `YOUR-...`, site-ul merge în **MOD DEMO**:
răspunsurile rămân doar în browserul tău. Bun pentru testat.

```bash
python3 -m http.server 8000
# http://localhost:8000          → jocul
# http://localhost:8000/admin.html → panoul organizatorului
# http://localhost:8000/#reset    → o iei de la zero
```

## 2. Baza de date (Supabase, gratuit)

1. Fă cont pe [supabase.com](https://supabase.com) (merge login cu GitHub) → **New project**.
2. **SQL Editor → New query** → lipește tot `supabase/schema.sql` → **Run**.
3. **Authentication → Users → Add user** → contul tău de organizator (email + parolă, bifează „auto confirm”).
4. În SQL Editor:
   ```sql
   insert into public.admins (email) values ('emailul-tau@exemplu.com');
   ```
5. **Authentication → Sign In / Providers → Email:** dezactivează „Allow new users to sign up”.
6. **Project Settings → API keys:** copiază **Project URL** și cheia **anon / publishable**.

## 3. Configurare

În `js/config.js` pui URL-ul și cheia de mai sus. Cheia anon/publishable e făcută să fie publică
(regulile din `schema.sql` decid ce poate face). **Nu pune niciodată cheia `service_role` / secret.**

Bara de sus arată **● ONLINE** când e conectat și **● MOD DEMO** când nu e.

## 4. GitHub Pages

Pe planul gratuit GitHub, Pages merge doar pe repo-uri **publice**.
După ce verifici repo-ul: **Settings → General → Change visibility → Public**,
apoi **Settings → Pages → Deploy from a branch → main / (root) → Save**.

Linkul pentru invitați: `https://<user>.github.io/birthday_invite/`

## 5. Răspunsurile (Excel)

- `admin.html` → login → vezi tot live → **EXPORT CSV** (se deschide direct în Excel).
- Sau în Supabase: **Table Editor → responses → Export → CSV**.

## 6. Când decizi

În `js/config.js`:

```js
FINAL_DATE: "saturday",     // sau "sunday" → dispare sondajul, apare data + numărătoarea
FINAL_VERDICT: "pizza",     // sau "grill"  → apare finalul „POPORUL A VORBIT”
PARTY_TIME: "17:00",  PARTY_TIME_NOTE: null,
PARTY_LOCATION: "Strada ...",
```

## 🛡️ Securitate

| Cine | Ce poate |
|---|---|
| Invitat (cheia anon) | doar să-și trimită / actualizeze propriul răspuns și să vadă scorul la mâncare după ce votează |
| Invitat | ❌ nu vede răspunsurile altora, ❌ nu modifică, ❌ nu șterge nimic |
| Organizator (logat + în tabelul `admins`) | vede toate răspunsurile în `admin.html` |

- Fiecare invitat e identificat printr-un ID aleator salvat în browserul lui.
- Numele sunt afișate mereu ca text simplu (fără risc de HTML injectat); exportul CSV e protejat de formule Excel.
- Limită de 300 de răspunsuri, împotriva spamului.
- Limitare cunoscută: cine își șterge datele din browser poate vota din nou. Pentru o petrecere, e ok.
