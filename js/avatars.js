// Original hand-drawn SVG avatars: animals × cyber.
// (Static, trusted markup — never built from user input.)
window.AVATARS = (() => {
  const O = '#0d0f14';
  const svg = (inner) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  return [
    {
      id: 'penguin', name: 'Pinguinul Root', tag: 'Are sudo. Îl folosește iresponsabil.',
      svg: svg(`
        <ellipse cx="37" cy="91" rx="9" ry="4" fill="#ff9f1a" stroke="${O}" stroke-width="3"/>
        <ellipse cx="58" cy="91" rx="9" ry="4" fill="#ff9f1a" stroke="${O}" stroke-width="3"/>
        <ellipse cx="47" cy="58" rx="27" ry="32" fill="#2a2e3a" stroke="${O}" stroke-width="3"/>
        <ellipse cx="47" cy="65" rx="18" ry="22" fill="#eef2f5"/>
        <path d="M20 60 Q 10 70 18 80" fill="none" stroke="#2a2e3a" stroke-width="7" stroke-linecap="round"/>
        <rect x="25" y="32" width="44" height="14" rx="7" fill="#39ff88" stroke="${O}" stroke-width="3"/>
        <path d="M29 37 H65 M29 41 H65" stroke="${O}" stroke-opacity=".25" stroke-width="1.5"/>
        <circle cx="39" cy="39" r="2.8" fill="${O}"/><circle cx="55" cy="39" r="2.8" fill="${O}"/>
        <path d="M43 49 L51 49 L47 56 Z" fill="#ff9f1a" stroke="${O}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M54 72 L90 64 L93 84 L57 92 Z" fill="#3a4150" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M58 74 L87 67.5 L89 81 L60 87.5 Z" fill="${O}"/>
        <text x="61" y="82.5" font-family="monospace" font-size="7.5" font-weight="bold" fill="#39ff88" transform="rotate(-12 61 82.5)">#sudo_</text>
        <path d="M68 58 Q 80 64 72 74" fill="none" stroke="#2a2e3a" stroke-width="7" stroke-linecap="round"/>`),
    },
    {
      id: 'cat', name: 'Pisica Hacker', tag: '„Am intrat.”',
      svg: svg(`
        <path d="M12 98 C 12 62, 88 62, 88 98 Z" fill="#1f6b45" stroke="${O}" stroke-width="3"/>
        <path d="M22 72 C 8 28, 92 28, 78 72" fill="#1f6b45" stroke="${O}" stroke-width="3"/>
        <path d="M30 38 L28 14 L45 29 Z" fill="#1b1b22" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M70 38 L72 14 L55 29 Z" fill="#1b1b22" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M31 30 L30 20 L39 28 Z" fill="#ff4fd8"/><path d="M69 30 L70 20 L61 28 Z" fill="#ff4fd8"/>
        <circle cx="50" cy="50" r="23" fill="#1b1b22" stroke="${O}" stroke-width="3"/>
        <path d="M26 41 H74 V46 H67 V53 H54 V46 H46 V53 H33 V46 H26 Z" fill="${O}" stroke="#39ff88" stroke-width="1.5"/>
        <rect x="36" y="46" width="3" height="3" fill="#39ff88"/><rect x="57" y="46" width="3" height="3" fill="#39ff88"/>
        <path d="M47 57 L53 57 L50 60 Z" fill="#ff4fd8"/>
        <path d="M44 61 Q 47 64 50 61 Q 53 64 56 61" fill="none" stroke="#ff4fd8" stroke-width="2" stroke-linecap="round"/>
        <path d="M30 57 L16 55 M30 61 L16 64 M70 57 L84 55 M70 61 L84 64" stroke="#c8c8d0" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M41 76 L39 88 M59 76 L61 88" stroke="#e8e8e8" stroke-width="2" stroke-linecap="round"/>
        <text x="50" y="94" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#39ff88">1337</text>`),
    },
    {
      id: 'fox', name: 'Vulpea Firewall', tag: 'Blochează tot. Inclusiv distracția.',
      svg: svg(`
        <path d="M50 80 L20 52 L18 14 L37 30 L50 26 L63 30 L82 14 L80 52 Z" fill="#ff7a1a" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M22 21 L24 37 L33 31 Z M78 21 L76 37 L67 31 Z" fill="#3a1d0c"/>
        <path d="M50 78 L25 54 L40 55 L50 64 L60 55 L75 54 Z" fill="#fff3e6"/>
        <circle cx="38" cy="47" r="4.5" fill="${O}"/><circle cx="62" cy="47" r="4.5" fill="${O}"/>
        <circle cx="39.5" cy="45.5" r="1.4" fill="#fff"/><circle cx="63.5" cy="45.5" r="1.4" fill="#fff"/>
        <path d="M31 41 L45 44 M69 41 L55 44" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse cx="50" cy="68" rx="4" ry="3" fill="${O}"/>
        <path d="M12 86 C 14 74, 20 72, 21 80 C 24 68, 31 67, 31 79 C 35 70, 41 69, 42 79 C 45 68, 54 67, 54 79 C 57 70, 64 69, 64 79 C 67 68, 76 69, 76 80 C 80 73, 87 74, 88 86 Z" fill="#ff4a1a" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M20 86 C 22 80, 26 78, 27 83 C 30 77, 35 77, 36 83 C 40 76, 46 76, 47 83 C 50 77, 56 77, 57 83 C 60 76, 66 76, 67 83 C 70 78, 76 78, 78 86 Z" fill="#ffd34d"/>
        <rect x="10" y="84" width="80" height="14" fill="#8f3524" stroke="${O}" stroke-width="3"/>
        <path d="M10 91 H90 M22 84 V91 M42 84 V91 M62 84 V91 M82 84 V91 M32 91 V98 M52 91 V98 M72 91 V98" stroke="${O}" stroke-width="2"/>`),
    },
    {
      id: 'snake', name: 'Îmblânzitorul de Python', tag: 'Indentează cu sentimente.',
      svg: svg(`
        <path d="M18 90 C 8 72, 40 64, 60 72 C 86 82, 92 60, 72 52 C 56 46, 42 54, 47 40" fill="none" stroke="${O}" stroke-width="20" stroke-linecap="round"/>
        <path d="M18 90 C 8 72, 40 64, 60 72 C 86 82, 92 60, 72 52 C 56 46, 42 54, 47 40" fill="none" stroke="#3fbf5a" stroke-width="14" stroke-linecap="round"/>
        <path d="M18 90 C 8 72, 40 64, 60 72 C 86 82, 92 60, 72 52 C 56 46, 42 54, 47 40" fill="none" stroke="#b4f58a" stroke-width="5" stroke-dasharray="3 9" stroke-linecap="round"/>
        <path d="M50 42 L50 50 L46 55 M50 50 L54 55" fill="none" stroke="#ff3355" stroke-width="2.2" stroke-linecap="round"/>
        <ellipse cx="50" cy="30" rx="17" ry="13" fill="#3fbf5a" stroke="${O}" stroke-width="3"/>
        <circle cx="43" cy="27" r="4.5" fill="#fff" stroke="${O}" stroke-width="1.5"/><circle cx="57" cy="27" r="4.5" fill="#fff" stroke="${O}" stroke-width="1.5"/>
        <rect x="42" y="24" width="2" height="6" rx="1" fill="${O}"/><rect x="56" y="24" width="2" height="6" rx="1" fill="${O}"/>
        <path d="M44 36 Q 50 39 56 36" fill="none" stroke="${O}" stroke-width="2" stroke-linecap="round"/>
        <path d="M32 30 C 32 8, 68 8, 68 30" fill="none" stroke="${O}" stroke-width="4"/>
        <rect x="28" y="25" width="7" height="12" rx="3" fill="#ff4fd8" stroke="${O}" stroke-width="2"/>
        <rect x="65" y="25" width="7" height="12" rx="3" fill="#ff4fd8" stroke="${O}" stroke-width="2"/>
        <path d="M69 37 Q 69 46 60 45" fill="none" stroke="${O}" stroke-width="2.5"/>
        <circle cx="59" cy="45" r="2.8" fill="#39ff88" stroke="${O}" stroke-width="1.5"/>
        <text x="84" y="22" text-anchor="middle" font-family="monospace" font-size="15" font-weight="bold" fill="#4fc3ff">{}</text>
        <text x="14" y="50" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#4fc3ff">:</text>`),
    },
    {
      id: 'owl', name: 'Bufnița de Gardă', tag: 'Trează de la ultimul deploy.',
      svg: svg(`
        <path d="M20 94 C 12 52, 24 22, 50 22 C 76 22, 88 52, 80 94 Z" fill="#8a5a3c" stroke="${O}" stroke-width="3"/>
        <path d="M27 30 L20 12 L39 24 Z M73 30 L80 12 L61 24 Z" fill="#8a5a3c" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
        <ellipse cx="50" cy="44" rx="27" ry="19" fill="#d9b48f"/>
        <ellipse cx="50" cy="76" rx="17" ry="15" fill="#e8cfa8"/>
        <path d="M40 70 l4 4 l4 -4 M52 70 l4 4 l4 -4 M46 80 l4 4 l4 -4" fill="none" stroke="#b08a63" stroke-width="2"/>
        <circle cx="38" cy="44" r="11" fill="#fff" stroke="${O}" stroke-width="3"/>
        <circle cx="62" cy="44" r="11" fill="#fff" stroke="${O}" stroke-width="3"/>
        <path d="M29 42 l4 1 M30 48 l4 -1 M47 41 l-4 2 M53 41 l4 2 M71 42 l-4 1 M70 48 l-4 -1" stroke="#ff3355" stroke-width="1.3"/>
        <circle cx="38" cy="44" r="2.2" fill="${O}"/><circle cx="62" cy="44" r="2.2" fill="${O}"/>
        <path d="M28 57 Q 38 62 48 57 M52 57 Q 62 62 72 57" fill="none" stroke="#5a3a6a" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M47 53 L53 53 L50 59 Z" fill="#ffb000" stroke="${O}" stroke-width="1.5" stroke-linejoin="round"/>
        <rect x="58" y="66" width="22" height="22" rx="2" fill="#f4f4f4" stroke="${O}" stroke-width="3"/>
        <path d="M80 71 C 88 71, 88 83, 80 83" fill="none" stroke="${O}" stroke-width="3"/>
        <text x="69" y="81" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#1f9e5a">200</text>
        <path d="M63 62 q 2 -4 0 -8 M69 62 q 2 -4 0 -8 M75 62 q 2 -4 0 -8" fill="none" stroke="#9aa4b2" stroke-width="1.8" stroke-linecap="round"/>
        <text x="14" y="20" font-family="monospace" font-size="12" font-weight="bold" fill="#ff3355">!</text>`),
    },
    {
      id: 'octopus', name: 'Caracatița Merge-Conflict', tag: 'Opt brațe. Zero merge-uri curate.',
      svg: svg(`
        <g fill="none" stroke-linecap="round">
          <path d="M30 52 C 24 70, 48 74, 38 94 M40 54 C 52 70, 24 80, 18 90 M50 55 C 50 74, 68 76, 58 95 M60 54 C 50 72, 78 80, 82 92 M70 52 C 82 66, 62 82, 90 82" stroke="${O}" stroke-width="12"/>
          <path d="M30 52 C 24 70, 48 74, 38 94 M40 54 C 52 70, 24 80, 18 90 M50 55 C 50 74, 68 76, 58 95 M60 54 C 50 72, 78 80, 82 92 M70 52 C 82 66, 62 82, 90 82" stroke="#ff5fa2" stroke-width="7"/>
        </g>
        <path d="M22 54 C 16 16, 84 16, 78 54 Z" fill="#ff5fa2" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="34" cy="28" r="2.5" fill="#d93f80"/><circle cx="64" cy="24" r="3" fill="#d93f80"/>
        <ellipse cx="40" cy="40" rx="6" ry="7" fill="#fff" stroke="${O}" stroke-width="2"/>
        <ellipse cx="60" cy="40" rx="6" ry="7" fill="#fff" stroke="${O}" stroke-width="2"/>
        <circle cx="41" cy="42" r="2.6" fill="${O}"/><circle cx="59" cy="42" r="2.6" fill="${O}"/>
        <path d="M32 30 L46 35 M68 30 L54 35" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
        <path d="M42 50 q 4 -3 8 0 q 4 3 8 0" fill="none" stroke="${O}" stroke-width="2" stroke-linecap="round"/>
        <path d="M76 40 L80 22" stroke="${O}" stroke-width="3"/>
        <rect x="58" y="6" width="38" height="16" rx="2" fill="#ff3355" stroke="${O}" stroke-width="2.5"/>
        <text x="77" y="17.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#fff">&lt;&lt;&lt;&lt;</text>`),
    },
    {
      id: 'bug', name: 'Bug-ul', tag: 'Nu e bug. E feature.',
      svg: svg(`
        <ellipse cx="47" cy="60" rx="22" ry="28" fill="none" stroke="#00e5ff" stroke-width="3" opacity=".8"/>
        <ellipse cx="53" cy="60" rx="22" ry="28" fill="none" stroke="#ff00aa" stroke-width="3" opacity=".8"/>
        <path d="M28 48 L14 42 M27 62 L12 62 M29 76 L15 84 M72 48 L86 42 M73 62 L88 62 M71 76 L85 84" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="50" cy="60" rx="22" ry="28" fill="#5ad15a" stroke="${O}" stroke-width="3"/>
        <path d="M50 36 V88" stroke="${O}" stroke-width="3"/>
        <circle cx="40" cy="56" r="4" fill="#2c8a3a"/><circle cx="61" cy="66" r="5" fill="#2c8a3a"/><circle cx="42" cy="76" r="3" fill="#2c8a3a"/><circle cx="60" cy="48" r="3" fill="#2c8a3a"/>
        <path d="M44 20 Q 38 6 28 8 M56 20 Q 62 6 72 8" fill="none" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="28" cy="8" r="3.5" fill="#39ff88" stroke="${O}" stroke-width="1.5"/><circle cx="72" cy="8" r="3.5" fill="#39ff88" stroke="${O}" stroke-width="1.5"/>
        <circle cx="50" cy="29" r="12" fill="#2c8a3a" stroke="${O}" stroke-width="3"/>
        <circle cx="45" cy="28" r="4" fill="#fff"/><circle cx="56" cy="28" r="4" fill="#fff"/>
        <circle cx="43.5" cy="26.5" r="1.8" fill="${O}"/><circle cx="57.5" cy="30" r="1.8" fill="${O}"/>
        <path d="M46 35 Q 50 38 54 34" fill="none" stroke="${O}" stroke-width="1.8" stroke-linecap="round"/>
        <rect x="6" y="50" width="20" height="3" fill="#00e5ff"/><rect x="72" y="70" width="22" height="3" fill="#ff00aa"/><rect x="66" y="36" width="12" height="2.5" fill="#39ff88"/>
        <path d="M84 20 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z M14 88 l1.5 3.5 l3.5 1.5 l-3.5 1.5 l-1.5 3.5 l-1.5 -3.5 l-3.5 -1.5 l3.5 -1.5 Z" fill="#ffd34d"/>`),
    },
    {
      id: 'crab', name: 'Crabul Memory-Safe', tag: 'Zero memory leaks. Doar bârfe.',
      svg: svg(`
        <g fill="none" stroke-linecap="round">
          <path d="M30 66 L14 76 L10 90 M34 72 L22 86 M66 66 L84 76 L88 90 M62 72 L76 86" stroke="${O}" stroke-width="8"/>
          <path d="M30 66 L14 76 L10 90 M34 72 L22 86 M66 66 L84 76 L88 90 M62 72 L76 86" stroke="#ff6a3d" stroke-width="4"/>
          <path d="M28 56 L18 46 M72 56 L80 50" stroke="${O}" stroke-width="8"/>
          <path d="M28 56 L18 46 M72 56 L80 50" stroke="#ff6a3d" stroke-width="4"/>
        </g>
        <path d="M6 42 C 2 26, 22 18, 28 32 L 18 36 L 29 41 C 25 52, 9 52, 6 42 Z" fill="#ff6a3d" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
        <ellipse cx="50" cy="64" rx="28" ry="18" fill="#ff6a3d" stroke="${O}" stroke-width="3"/>
        <path d="M42 70 Q 50 76 58 70" fill="none" stroke="${O}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M42 48 L40 36 M58 48 L60 36" stroke="${O}" stroke-width="3"/>
        <circle cx="40" cy="35" r="5.5" fill="#fff" stroke="${O}" stroke-width="2.5"/><circle cx="60" cy="35" r="5.5" fill="#fff" stroke="${O}" stroke-width="2.5"/>
        <circle cx="41" cy="36" r="2.4" fill="${O}"/><circle cx="59" cy="36" r="2.4" fill="${O}"/>
        <path d="M32 28 C 32 12, 68 12, 68 28 Z" fill="#ffcf33" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
        <rect x="27" y="26" width="46" height="5" rx="2" fill="#ffcf33" stroke="${O}" stroke-width="2.5"/>
        <path d="M50 14 V26" stroke="${O}" stroke-width="2"/>
        <path d="M78 46 V39 a7 7 0 0 1 14 0 V46" fill="none" stroke="${O}" stroke-width="3.5"/>
        <rect x="74" y="45" width="22" height="18" rx="3" fill="#ffcf33" stroke="${O}" stroke-width="3"/>
        <circle cx="85" cy="52" r="2.6" fill="${O}"/><path d="M85 53 V58" stroke="${O}" stroke-width="2.4"/>`),
    },
    {
      id: 'hamster', name: 'Hamsterul de Server', tag: 'Alimentează personal tot cloud-ul.',
      svg: svg(`
        <circle cx="50" cy="52" r="44" fill="none" stroke="#4fc3ff" stroke-width="4"/>
        <path d="M50 8 V96 M6 52 H94 M19 21 L81 83 M81 21 L19 83" stroke="#4fc3ff" stroke-width="1.5" opacity=".35"/>
        <circle cx="50" cy="8" r="2.5" fill="#39ff88"/><circle cx="94" cy="52" r="2.5" fill="#39ff88"/><circle cx="6" cy="52" r="2.5" fill="#ff3355"/>
        <ellipse cx="50" cy="70" rx="24" ry="19" fill="#f0b27a" stroke="${O}" stroke-width="3"/>
        <ellipse cx="50" cy="75" rx="14" ry="11" fill="#fff3e0"/>
        <path d="M30 86 l-6 6 M70 86 l6 6" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="35" cy="30" r="7" fill="#f0b27a" stroke="${O}" stroke-width="3"/><circle cx="65" cy="30" r="7" fill="#f0b27a" stroke="${O}" stroke-width="3"/>
        <circle cx="35" cy="30" r="3.5" fill="#ff9bb5"/><circle cx="65" cy="30" r="3.5" fill="#ff9bb5"/>
        <circle cx="50" cy="46" r="19" fill="#f0b27a" stroke="${O}" stroke-width="3"/>
        <rect x="31" y="34" width="38" height="6" fill="#ff3355" stroke="${O}" stroke-width="2"/>
        <path d="M60 34 l3 -6 l-1 5 l4 -1 l-3 7 Z" fill="#ffd34d"/>
        <ellipse cx="36" cy="53" rx="8" ry="6.5" fill="#f7c99c" stroke="${O}" stroke-width="2"/><ellipse cx="64" cy="53" rx="8" ry="6.5" fill="#f7c99c" stroke="${O}" stroke-width="2"/>
        <path d="M40 46 l6 -2 M60 46 l-6 -2" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="43" cy="47" r="2.4" fill="${O}"/><circle cx="57" cy="47" r="2.4" fill="${O}"/>
        <ellipse cx="50" cy="53" rx="2.5" ry="2" fill="#ff7a9a"/>
        <rect x="47" y="56" width="3" height="4" fill="#fff" stroke="${O}" stroke-width="1"/><rect x="50" y="56" width="3" height="4" fill="#fff" stroke="${O}" stroke-width="1"/>
        <path d="M73 38 q 3 4 0 6 q -3 -2 0 -6 Z M26 42 q 3 4 0 6 q -3 -2 0 -6 Z" fill="#4fc3ff"/>`),
    },
    {
      id: 'whale', name: 'Balena din Cloud', tag: 'Stă în cloud. Face bule de 0 și 1.',
      svg: svg(`
        <path d="M12 92 C 4 80, 18 70, 28 76 C 30 62, 52 60, 56 72 C 64 62, 84 66, 82 78 C 94 78, 96 92, 84 92 Z" fill="#dde6f5" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M14 66 C 12 40, 66 32, 80 50 C 86 44, 92 40, 92 32 C 96 46, 92 56, 84 60 C 78 76, 28 82, 14 66 Z" fill="#3b7dd8" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M20 66 C 34 76, 64 74, 76 64" fill="none" stroke="#a9d2ff" stroke-width="4" stroke-linecap="round"/>
        <path d="M30 70 l2 -6 M40 72 l1 -6 M50 72 l0 -6 M60 70 l-1 -6" stroke="#a9d2ff" stroke-width="1.5"/>
        <circle cx="30" cy="54" r="3.8" fill="${O}"/><circle cx="31.3" cy="52.7" r="1.3" fill="#fff"/>
        <path d="M22 62 Q 27 65 32 62" fill="none" stroke="${O}" stroke-width="2" stroke-linecap="round"/>
        <ellipse cx="36" cy="60" rx="3" ry="1.8" fill="#ff8fb3" opacity=".8"/>
        <path d="M44 42 C 42 34, 36 30, 32 30 M44 42 C 46 34, 52 30, 56 30" fill="none" stroke="#4fc3ff" stroke-width="2.5" stroke-linecap="round"/>
        <text x="44" y="24" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#39ff88">1 0 1</text>
        <text x="44" y="12" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#39ff88" opacity=".7">0 1</text>`),
    },
    {
      id: 'monkey', name: 'Maimuța Haosului', tag: 'Scoate cabluri din priză. În producție.',
      svg: svg(`
        <ellipse cx="44" cy="94" rx="24" ry="12" fill="#8a5a3c" stroke="${O}" stroke-width="3"/>
        <circle cx="20" cy="44" r="10" fill="#8a5a3c" stroke="${O}" stroke-width="3"/><circle cx="72" cy="44" r="10" fill="#8a5a3c" stroke="${O}" stroke-width="3"/>
        <circle cx="20" cy="44" r="5" fill="#e6b98a"/><circle cx="72" cy="44" r="5" fill="#e6b98a"/>
        <circle cx="46" cy="46" r="25" fill="#8a5a3c" stroke="${O}" stroke-width="3"/>
        <path d="M24 50 C 24 32, 44 32, 46 42 C 48 32, 68 32, 68 50 C 68 68, 24 68, 24 50 Z" fill="#e6b98a"/>
        <circle cx="37" cy="44" r="7.5" fill="#fff" stroke="${O}" stroke-width="2"/><circle cx="56" cy="45" r="4.5" fill="#fff" stroke="${O}" stroke-width="2"/>
        <circle cx="38" cy="45" r="3.4" fill="${O}"/><circle cx="56" cy="46" r="1.8" fill="${O}"/>
        <path d="M29 33 Q 36 28 43 33 M52 39 L60 37" fill="none" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M32 56 Q 46 70 60 56 Z" fill="#fff" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M39 58 V63 M46 59 V65 M53 58 V63" stroke="${O}" stroke-width="1.5"/>
        <path d="M4 98 C 18 80, 40 98, 62 84 L 72 79" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"/>
        <rect x="70" y="70" width="12" height="12" rx="2" fill="#c8ccd2" stroke="${O}" stroke-width="2.5" transform="rotate(-25 76 76)"/>
        <path d="M80 68 l5 -3 M84 74 l5 -3" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M90 56 l3 6 l6 -1 l-4 5 l4 5 l-6 -1 l-3 6 l-2 -6 l-6 1 l4 -5 l-4 -5 l6 1 Z" fill="#ffd34d" stroke="${O}" stroke-width="1.5" stroke-linejoin="round"/>`),
    },
    {
      id: 'llama', name: 'Llama Prompt', tag: 'Ignoră toate instrucțiunile anterioare. Adu tort.',
      svg: svg(`
        <path d="M36 100 L36 58 C 36 48, 62 48, 62 58 L62 100 Z" fill="#f4efe6" stroke="${O}" stroke-width="3"/>
        <path d="M36 66 q 4 4 8 0 q 4 4 8 0 q 4 4 8 0 M36 80 q 4 4 8 0 q 4 4 8 0 q 4 4 8 0" fill="none" stroke="#d8cfbf" stroke-width="2"/>
        <path d="M37 30 L32 8 L45 24 Z M61 30 L66 8 L53 24 Z" fill="#f4efe6" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
        <ellipse cx="49" cy="40" rx="16" ry="18" fill="#f4efe6" stroke="${O}" stroke-width="3"/>
        <path d="M38 25 q 3 -6 6 0 q 3 -6 6 0 q 3 -6 6 0" fill="#f4efe6" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>
        <rect x="31" y="33" width="36" height="10" rx="5" fill="#ff4fd8" stroke="${O}" stroke-width="2.5"/>
        <path d="M35 36 H63" stroke="#fff" stroke-width="1.5" opacity=".6"/>
        <ellipse cx="49" cy="51" rx="10" ry="7" fill="#e6dccd" stroke="${O}" stroke-width="2"/>
        <path d="M45 49 h1 M53 49 h1" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M44 54 Q 50 57 55 53" fill="none" stroke="${O}" stroke-width="2" stroke-linecap="round"/>
        <path d="M49 22 V10" stroke="${O}" stroke-width="2.5"/>
        <circle cx="49" cy="8" r="3.5" fill="#39ff88" stroke="${O}" stroke-width="1.5"/>
        <rect x="66" y="12" width="30" height="18" rx="4" fill="${O}" stroke="#39ff88" stroke-width="2"/>
        <path d="M70 30 L66 38 L76 30" fill="${O}" stroke="#39ff88" stroke-width="2" stroke-linejoin="round"/>
        <text x="81" y="25" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#39ff88">&gt;_</text>`),
    },
  ];
})();
