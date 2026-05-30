// bg-illustrations.jsx — Background illustration components for Hero
// Subtle silhouettes: container ship (export) + Moscow skyline (Russian landmarks)

function MoscowSkyline() {
  // Merlons on the Kremlin wall — rendered with a loop
  const merlons = [];
  for (let i = 0; i < 14; i++) {
    merlons.push(<rect key={`m${i}`} x={690 + i * 20} y="262" width="14" height="14" />);
  }

  return (
    <svg className="pl-hero__skyline" viewBox="0 0 1600 360"
         preserveAspectRatio="xMidYEnd slice" aria-hidden="true">
      {/* Far-left industrial silhouettes */}
      <g fill="currentColor" opacity="0.7">
        <rect x="0" y="240" width="36" height="120" />
        <rect x="40" y="260" width="48" height="100" />
        <rect x="92" y="210" width="36" height="150" />
        <rect x="132" y="230" width="58" height="130" />
        <rect x="194" y="250" width="32" height="110" />
      </g>

      {/* Ostankino-style TV tower */}
      <g fill="currentColor">
        <polygon points="260,360 268,360 268,210 271,100 274,210 274,360" />
        <rect x="263" y="200" width="14" height="34" />
        <rect x="265" y="170" width="10" height="22" />
        <rect x="266" y="145" width="8" height="18" />
      </g>

      <g fill="currentColor" opacity="0.7">
        <rect x="300" y="250" width="42" height="110" />
        <rect x="348" y="220" width="56" height="140" />
        <rect x="412" y="240" width="38" height="120" />
      </g>

      {/* Stalinist 'Seven Sisters' tower (stepped skyscraper) */}
      <g fill="currentColor">
        <rect x="470" y="170" width="80" height="190" />
        <rect x="480" y="140" width="60" height="30" />
        <rect x="488" y="112" width="44" height="28" />
        <rect x="496" y="86" width="28" height="26" />
        <polygon points="496,86 524,86 510,50" />
        <line x1="510" y1="50" x2="510" y2="30" stroke="currentColor" strokeWidth="1.5" />
      </g>

      <g fill="currentColor" opacity="0.7">
        <rect x="572" y="248" width="46" height="112" />
        <rect x="624" y="230" width="40" height="130" />
      </g>

      {/* Kremlin Wall + Spasskaya Tower */}
      <g fill="currentColor">
        <rect x="690" y="276" width="280" height="84" />
        {merlons}
        {/* Spasskaya Tower */}
        <rect x="800" y="186" width="60" height="90" />
        <rect x="806" y="164" width="48" height="22" />
        <rect x="812" y="142" width="36" height="22" />
        <polygon points="812,142 848,142 830,96" />
        {/* Soviet star */}
        <polygon points="830,92 832.5,86 838.5,86 833.7,82.2 835.5,76 830,79.7 824.5,76 826.3,82.2 821.5,86 827.5,86" />
        <line x1="830" y1="76" x2="830" y2="64" stroke="currentColor" strokeWidth="1" />
      </g>

      <g fill="currentColor" opacity="0.7">
        <rect x="988" y="246" width="42" height="114" />
        <rect x="1036" y="230" width="44" height="130" />
      </g>

      {/* St. Basil's Cathedral — central main + 4 surrounding domes */}
      <g fill="currentColor" transform="translate(1140, 0)">
        {/* base church block */}
        <rect x="-104" y="244" width="208" height="116" />

        {/* Central tall tower with main onion dome */}
        <g>
          <rect x="-14" y="170" width="28" height="74" />
          <rect x="-17" y="156" width="34" height="14" />
          <path d="M -22 156
                   C -22 132, -28 104, -10 86
                   C -5 78, -2 70, 0 62
                   C 2 70, 5 78, 10 86
                   C 28 104, 22 132, 22 156 Z" />
          <line x1="0" y1="62" x2="0" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="-5" y1="48" x2="5" y2="48" stroke="currentColor" strokeWidth="1.5" />
        </g>

        {/* Left dome */}
        <g transform="translate(-66, 60)">
          <rect x="-11" y="148" width="22" height="36" />
          <path d="M -15 148 C -15 132, -19 110, -8 96 C -3 88, -1 82, 0 76 C 1 82, 3 88, 8 96 C 19 110, 15 132, 15 148 Z" />
          <line x1="0" y1="76" x2="0" y2="62" stroke="currentColor" strokeWidth="1.5" />
        </g>

        {/* Right dome */}
        <g transform="translate(66, 60)">
          <rect x="-11" y="148" width="22" height="36" />
          <path d="M -15 148 C -15 132, -19 110, -8 96 C -3 88, -1 82, 0 76 C 1 82, 3 88, 8 96 C 19 110, 15 132, 15 148 Z" />
          <line x1="0" y1="76" x2="0" y2="62" stroke="currentColor" strokeWidth="1.5" />
        </g>

        {/* Front-left dome (smaller, lower) */}
        <g transform="translate(-36, 96)">
          <rect x="-9" y="138" width="18" height="28" />
          <path d="M -12 138 C -12 126, -15 108, -6 96 C -2 90, -0.5 86, 0 80 C 0.5 86, 2 90, 6 96 C 15 108, 12 126, 12 138 Z" />
        </g>

        {/* Front-right dome */}
        <g transform="translate(36, 96)">
          <rect x="-9" y="138" width="18" height="28" />
          <path d="M -12 138 C -12 126, -15 108, -6 96 C -2 90, -0.5 86, 0 80 C 0.5 86, 2 90, 6 96 C 15 108, 12 126, 12 138 Z" />
        </g>
      </g>

      <g fill="currentColor" opacity="0.7">
        <rect x="1280" y="240" width="46" height="120" />
        <rect x="1334" y="200" width="38" height="160" />
      </g>

      {/* Federation Tower / modern skyscraper cluster */}
      <g fill="currentColor">
        <polygon points="1390,360 1390,154 1404,124 1414,90 1438,76 1462,90 1472,124 1486,154 1486,360" />
        <line x1="1438" y1="76" x2="1438" y2="56" stroke="currentColor" strokeWidth="1" />
        <rect x="1500" y="200" width="36" height="160" />
        <rect x="1542" y="170" width="44" height="190" />
      </g>

      <g fill="currentColor" opacity="0.6">
        <rect x="1590" y="240" width="10" height="120" />
      </g>
    </svg>
  );
}

function ContainerShip() {
  // Container deck rows
  const bottomRow = [];
  const topRow = [];
  for (let i = 0; i < 13; i++) {
    bottomRow.push(<rect key={`b${i}`} x={250 + i * 58} y="98" width="54" height="32" />);
  }
  for (let i = 0; i < 11; i++) {
    topRow.push(<rect key={`t${i}`} x={278 + i * 58} y="70" width="54" height="28" />);
  }

  return (
    <svg className="pl-hero__shipline" viewBox="0 0 1400 200"
         preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="currentColor">
        {/* Hull — slight prow */}
        <path d="M 180 130 L 1080 130 L 1118 158 L 226 158 L 180 130 Z" />

        {/* Containers — bottom row */}
        <g>{bottomRow}</g>
        {/* Containers — top row */}
        <g opacity="0.85">{topRow}</g>

        {/* Bridge / wheelhouse at stern */}
        <rect x="978" y="50" width="100" height="80" />
        <rect x="996" y="30" width="64" height="22" />

        {/* Funnel */}
        <rect x="1010" y="6" width="20" height="26" />
        <line x1="1020" y1="6" x2="1020" y2="-6" stroke="currentColor" strokeWidth="1" />

        {/* Mast/crane at bow */}
        <line x1="222" y1="98" x2="222" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="208" y1="52" x2="236" y2="52" stroke="currentColor" strokeWidth="1.2" />
        <line x1="222" y1="32" x2="252" y2="62" stroke="currentColor" strokeWidth="1" />

        {/* Antenna on bridge */}
        <line x1="1030" y1="30" x2="1030" y2="10" stroke="currentColor" strokeWidth="1.2" />
      </g>

      {/* Waterlines */}
      <g stroke="currentColor" fill="none">
        <line x1="40" y1="172" x2="1340" y2="172" strokeWidth="1" opacity="0.45" strokeDasharray="22 10" />
        <line x1="80" y1="184" x2="1300" y2="184" strokeWidth="1" opacity="0.32" strokeDasharray="10 18" />
        <line x1="140" y1="194" x2="1250" y2="194" strokeWidth="0.8" opacity="0.22" strokeDasharray="6 24" />
      </g>
    </svg>
  );
}

function EurasiaMap() {
  return (
    <svg className="pl-hero__map" viewBox="0 0 1200 640"
         preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* EURASIA mainland — clockwise coastal trace from Lisbon */}
      <path d="M 38 320 L 41 305 L 43 284 L 75 268 L 68 244 L 109 226 L 135 215 L 158 200 L 167 173 L 143 170 L 132 152 L 155 117 L 221 81 L 265 70 L 312 85 L 379 88 L 449 93 L 553 62 L 775 18 L 917 50 L 1100 90 L 1196 105 L 1130 145 L 1140 175 L 1135 200 L 1116 222 L 1095 200 L 1080 180 L 1050 195 L 990 230 L 985 255 L 956 287 L 947 291 L 936 318 L 940 340 L 936 348 L 928 351 L 920 343 L 921 322 L 910 308 L 895 305 L 880 318 L 870 335 L 887 379 L 850 440 L 840 448 L 805 510 L 791 537 L 772 600 L 772 610 L 750 555 L 723 490 L 695 447 L 673 446 L 619 520 L 602 557 L 580 528 L 571 473 L 540 440 L 533 427 L 502 425 L 463 410 L 464 416 L 478 437 L 449 488 L 415 510 L 390 521 L 352 454 L 344 434 L 325 392 L 320 405 L 315 388 L 325 375 L 328 358 L 308 343 L 297 334 L 277 336 L 274 322 L 286 302 L 268 320 L 252 326 L 239 335 L 227 313 L 227 300 L 216 290 L 205 283 L 187 267 L 177 268 L 177 277 L 184 282 L 191 291 L 208 302 L 218 308 L 211 309 L 216 318 L 200 325 L 193 308 L 192 304 L 175 295 L 165 286 L 156 276 L 145 282 L 132 285 L 119 290 L 112 300 L 95 314 L 91 329 L 81 334 L 69 335 L 61 341 L 56 337 L 46 333 Z" fill="currentColor" opacity="0.62" />

      {/* British Isles — separate landmasses */}
      <g fill="currentColor" opacity="0.62">
        {/* Great Britain — elongated NE-SW shape */}
        <path d="M 76 188 L 78 175 L 82 168 L 90 175 L 94 185 L 92 200 L 96 215 L 102 225 L 100 232 L 90 234 L 82 226 L 78 215 L 74 200 Z" />
        {/* Ireland */}
        <ellipse cx="56" cy="208" rx="11" ry="13" />
      </g>

      {/* Japan archipelago — Hokkaido / Honshu / Kyushu */}
      <g fill="currentColor" opacity="0.62">
        {/* Hokkaido */}
        <path d="M 1004 268 L 1020 263 L 1040 270 L 1048 282 L 1040 295 L 1024 300 L 1010 295 L 1000 282 Z" />
        {/* Honshu — long curving body */}
        <path d="M 1006 304 L 1018 310 L 1030 325 L 1040 340 L 1018 348 L 998 355 L 978 358 L 960 362 L 948 360 L 945 354 L 956 348 L 970 342 L 988 332 L 998 320 L 1004 312 Z" />
        {/* Shikoku — small */}
        <ellipse cx="975" cy="362" rx="10" ry="5" />
        {/* Kyushu */}
        <path d="M 940 358 L 950 360 L 955 370 L 952 382 L 944 388 L 936 382 L 934 370 L 935 362 Z" />
      </g>

      {/* Sri Lanka */}
      <ellipse cx="618" cy="572" rx="8" ry="13" fill="currentColor" opacity="0.62" />

      {/* Taiwan */}
      <ellipse cx="892" cy="442" rx="6" ry="13" fill="currentColor" opacity="0.55" />

      {/* Hainan */}
      <ellipse cx="824" cy="475" rx="9" ry="6" fill="currentColor" opacity="0.55" />

      {/* Sakhalin */}
      <ellipse cx="998" cy="248" rx="6" ry="22" transform="rotate(-8 998 248)" fill="currentColor" opacity="0.55" />

      {/* ROUTE arc — Moscow → Seoul */}
      <path d="M 342 188 Q 640 70 922 329"
            stroke="currentColor" strokeWidth="1.8" fill="none"
            strokeDasharray="8 10" opacity="0.95" />

      {/* MOSCOW marker (55.7°N · 37.6°E) */}
      <g>
        <circle cx="342" cy="188" r="6" fill="currentColor" />
        <circle cx="342" cy="188" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="342" y1="188" x2="342" y2="158" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        <text x="362" y="170" fontFamily="Arial, sans-serif" fontSize="14"
              fontWeight="700" letterSpacing="1.5" fill="currentColor">MOSCOW</text>
        <text x="362" y="185" fontFamily="Arial, sans-serif" fontSize="10"
              letterSpacing="0.8" fill="currentColor" opacity="0.85">55.7° N · 37.6° E</text>
      </g>

      {/* SEOUL marker (37.6°N · 126.8°E) */}
      <g>
        <circle cx="922" cy="329" r="6" fill="currentColor" />
        <circle cx="922" cy="329" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="922" y1="329" x2="922" y2="370" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        <text x="838" y="395" fontFamily="Arial, sans-serif" fontSize="14"
              fontWeight="700" letterSpacing="1.5" fill="currentColor">SEOUL</text>
        <text x="838" y="410" fontFamily="Arial, sans-serif" fontSize="10"
              letterSpacing="0.8" fill="currentColor" opacity="0.85">37.6° N · 126.8° E</text>
      </g>

      {/* Route caption */}
      <text x="632" y="120" fontFamily="Arial, sans-serif" fontSize="11"
            letterSpacing="2.5" fill="currentColor" opacity="0.85"
            textAnchor="middle">EURASIA TRADE ROUTE  ·  6,800 KM</text>
    </svg>
  );
}

Object.assign(window, { MoscowSkyline, ContainerShip, EurasiaMap });
