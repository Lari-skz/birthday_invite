// ════════════════════════════════════════════════════════════
//  BIRTHDAY PROTOCOL — configuration
//  Edit these values, commit, push. That's it.
// ════════════════════════════════════════════════════════════
//
//  The Supabase URL and anon/publishable key are SAFE to commit:
//  they are designed for browsers, and the database rules in
//  supabase/schema.sql decide what they can do.
//  NEVER put the service_role / secret key here.
//
//  Leave the placeholders as they are to run in DEMO MODE
//  (answers are saved only in your own browser — good for testing).

window.BIRTHDAY_CONFIG = {
  SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-ANON-OR-PUBLISHABLE-KEY",

  // Who is having the birthday (shown in jokes & on the debrief)
  BIRTHDAY_PERSON: "Lari",

  // The two possible days for the date poll (format YYYY-MM-DD)
  DATE_OPTIONS: {
    saturday: "2026-11-14",
    sunday: "2026-11-15",
  },
  // Used for the countdown (HH:MM). Update once the time is final.
  PARTY_TIME: "16:00",
  // What guests read about the time. Set to null once the time is final
  // (then they just see PARTY_TIME).
  PARTY_TIME_NOTE: "cândva între 16:00 și 18:00 — ora exactă vine în curând",
  // Set to the address/place once you want to reveal it.
  PARTY_LOCATION: null,
  PARTY_LOCATION_NOTE: "Secretă, deocamdată 🤫",

  // When you've picked the day, set to "saturday" or "sunday".
  // The poll then disappears and guests see the final date + countdown.
  FINAL_DATE: null,

  // Show the live vote bars to a guest right after they vote
  SHOW_RESULTS_AFTER_VOTE: true,

  // When voting is over, set to "pizza" or "grill".
  // Guests then see the cinematic ending instead of the vote buttons.
  FINAL_VERDICT: null,
};
