// world-map.jsx — Realistic-ish world silhouette for the hero background
// Uses an equirectangular-style projection. Russia / Central Asia / Korea
// are rendered as a darker overlay on top of the faint global landmass.
// Moscow + Seoul carry pin-style markers (drop pins).

// Projection: viewBox 0 0 1200 620
//   X = (lon + 180) * (1200 / 360)
//   Y = (88 - lat)  * (620 / 178)   (slightly cropped at poles)

function WorldMap() {
  // Continent silhouettes — simplified but recognizable.
  // Africa
  const africa = "M 583 192 L 612 178 L 638 175 L 658 180 L 668 174 L 691 180 L 711 198 L 716 210 L 728 218 L 740 232 L 750 248 L 765 258 L 770 270 L 758 282 L 750 296 L 740 310 L 723 332 L 705 358 L 690 376 L 678 388 L 668 408 L 656 416 L 647 413 L 637 405 L 620 392 L 612 376 L 604 358 L 596 338 L 593 318 L 590 300 L 583 282 L 576 268 L 568 252 L 562 240 L 558 226 L 562 212 L 572 200 Z";

  // Europe (Western/Central Europe + Iberia + UK shape contiguous to Eurasia)
  const europe = "M 562 174 L 580 168 L 600 162 L 620 160 L 638 158 L 656 156 L 672 152 L 685 148 L 700 144 L 715 140 L 695 132 L 670 130 L 645 132 L 620 135 L 600 138 L 580 142 L 568 150 L 558 162 Z M 545 175 L 555 178 L 558 188 L 545 192 L 540 184 Z";

  // North America (cdn + USA + central america)
  const namerica = "M 200 90 L 240 80 L 280 75 L 310 72 L 340 70 L 360 75 L 370 88 L 360 102 L 350 118 L 340 132 L 332 148 L 322 162 L 312 178 L 302 192 L 295 208 L 285 222 L 278 236 L 280 250 L 270 262 L 258 270 L 248 278 L 240 285 L 230 282 L 222 270 L 215 258 L 210 248 L 205 235 L 200 222 L 196 210 L 192 195 L 190 180 L 188 165 L 186 150 L 188 135 L 192 120 L 196 105 Z";

  // South America
  const samerica = "M 312 270 L 332 268 L 348 275 L 358 285 L 365 300 L 370 318 L 372 335 L 370 355 L 365 375 L 358 395 L 350 412 L 342 425 L 330 430 L 318 425 L 310 412 L 305 395 L 302 378 L 300 358 L 300 338 L 302 318 L 305 298 Z";

  // Eurasia main mass (Western boundary → Iberia, Eastern → Kamchatka, South → India/Arabia)
  const eurasia = "M 568 168 L 580 165 L 596 160 L 612 158 L 632 152 L 650 148 L 668 145 L 685 142 L 705 138 L 725 135 L 745 132 L 770 128 L 798 124 L 825 120 L 858 116 L 895 112 L 930 108 L 968 105 L 1005 102 L 1040 100 L 1075 98 L 1105 100 L 1125 108 L 1138 122 L 1140 138 L 1132 152 L 1120 162 L 1108 168 L 1095 172 L 1085 178 L 1080 188 L 1078 198 L 1080 208 L 1078 218 L 1070 224 L 1060 222 L 1048 218 L 1038 220 L 1028 226 L 1020 234 L 1015 242 L 1010 252 L 1002 258 L 990 258 L 978 254 L 968 256 L 960 264 L 956 274 L 952 284 L 945 290 L 932 290 L 922 286 L 912 282 L 902 282 L 894 286 L 888 294 L 884 304 L 880 314 L 875 320 L 868 322 L 862 318 L 858 308 L 854 298 L 850 290 L 845 286 L 840 290 L 838 300 L 836 310 L 832 318 L 825 322 L 815 322 L 808 318 L 802 308 L 800 298 L 800 288 L 803 278 L 808 272 L 814 268 L 818 262 L 818 254 L 815 248 L 808 246 L 800 248 L 792 252 L 782 254 L 775 256 L 770 262 L 768 270 L 765 278 L 758 284 L 748 282 L 738 276 L 728 268 L 720 262 L 712 258 L 702 258 L 695 262 L 692 270 L 695 280 L 700 288 L 702 298 L 698 305 L 692 308 L 685 305 L 678 298 L 672 290 L 668 282 L 665 274 L 660 268 L 652 264 L 645 264 L 638 268 L 632 274 L 628 282 L 625 290 L 622 296 L 618 298 L 612 296 L 608 290 L 605 280 L 602 270 L 600 260 L 598 250 L 595 240 L 592 230 L 588 220 L 583 212 L 578 204 L 572 195 L 568 186 L 565 178 Z";

  // Australia
  const australia = "M 1010 360 L 1030 352 L 1052 350 L 1075 352 L 1098 358 L 1115 365 L 1122 380 L 1118 395 L 1108 405 L 1095 410 L 1078 412 L 1058 410 L 1038 408 L 1020 402 L 1008 390 L 1005 378 Z";

  // Indonesia / SE Asia archipelago (small islands)
  const sea = [
    "M 960 290 L 985 286 L 1005 290 L 1015 296 L 1010 304 L 990 308 L 970 306 L 958 300 Z",
    "M 1020 302 L 1040 300 L 1058 304 L 1062 312 L 1052 318 L 1035 318 L 1022 312 Z",
    "M 1065 310 L 1080 308 L 1090 314 L 1088 322 L 1075 324 L 1067 318 Z"
  ];

  // ── Highlight regions: Russia + Central Asia + Korean Peninsula ──

  // Russia — long horizontal band across northern Eurasia (Karelia to Chukotka)
  const russia = "M 642 142 L 672 138 L 705 132 L 740 128 L 778 124 L 818 120 L 858 116 L 898 112 L 938 108 L 978 105 L 1015 102 L 1048 100 L 1078 102 L 1100 110 L 1115 122 L 1118 135 L 1110 148 L 1095 158 L 1078 165 L 1058 172 L 1038 178 L 1015 182 L 990 184 L 962 182 L 935 178 L 908 175 L 880 172 L 852 170 L 825 168 L 798 165 L 772 162 L 748 158 L 725 154 L 705 150 L 685 146 L 668 144 L 652 144 Z";

  // Central Asia — Kazakhstan + Uzbekistan + Turkmenistan + Kyrgyzstan + Tajikistan
  const centralAsia = "M 778 178 L 815 175 L 850 175 L 882 178 L 905 184 L 920 192 L 925 202 L 915 210 L 898 215 L 875 218 L 848 220 L 820 220 L 795 218 L 778 215 L 768 208 L 765 196 L 770 185 Z";

  // Korean Peninsula (more saturated than rest of Eurasia)
  const korea = "M 1018 210 L 1024 212 L 1030 218 L 1034 228 L 1036 240 L 1037 252 L 1036 262 L 1032 268 L 1027 268 L 1023 262 L 1020 252 L 1018 240 L 1017 228 L 1017 218 Z";

  // ── Marker pins (drop-pin style) ──
  // Moscow: 55.7°N, 37.6°E → x = (37.6+180)*3.333 = 725.3, y = (88-55.7)*3.483 = 112.6
  // Seoul:  37.6°N, 126.8°E → x = (126.8+180)*3.333 = 1023, y = (88-37.6)*3.483 = 175.5
  const moscowPos = { x: 725, y: 173 };
  const seoulPos  = { x: 1023, y: 232 };

  return (
    <svg className="pl-hero__map" viewBox="380 40 820 540"
         preserveAspectRatio="xMidYMid meet" aria-hidden="true">

      {/* Base continents — faint */}
      <g className="pl-map-base" fill="currentColor">
        <path d={africa} />
        <path d={europe} />
        <path d={eurasia} />
        <path d={australia} />
        {sea.map((p, i) => <path key={i} d={p} />)}
      </g>

      {/* Highlight overlay — Russia + Central Asia + Korea (more saturated) */}
      <g className="pl-map-highlight" fill="currentColor">
        <path d={russia} />
        <path d={centralAsia} />
        <path d={korea} />
      </g>

      {/* Highlight outline */}
      <g className="pl-map-highlight" fill="none" stroke="currentColor" strokeWidth="1">
        <path d={russia} />
        <path d={centralAsia} />
        <path d={korea} />
      </g>

      {/* Route arc — Moscow → Seoul */}
      <path
        className="pl-map-route"
        d={`M ${moscowPos.x} ${moscowPos.y} Q 880 90 ${seoulPos.x} ${seoulPos.y}`}
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeDasharray="6 8"
      />

      {/* MOSCOW pin */}
      <Pin x={moscowPos.x} y={moscowPos.y} label="MOSCOW" coords="55.7°N · 37.6°E" labelOffset="right" />

      {/* SEOUL pin */}
      <Pin x={seoulPos.x} y={seoulPos.y} label="SEOUL" coords="37.6°N · 126.8°E" labelOffset="bottom" />

      {/* Caption */}
      <text x={(moscowPos.x + seoulPos.x) / 2} y="80" fontFamily="Arial, sans-serif"
            fontSize="11" letterSpacing="2.5" fill="currentColor" opacity="0.8"
            textAnchor="middle">EURASIA TRADE ROUTE  ·  10,000 KM</text>
    </svg>
  );
}

function Pin({ x, y, label, coords, labelOffset = "right" }) {
  // Pin shape — teardrop pointing down ending at (x, y)
  const headR = 10;
  const tipY = y;
  const headY = y - 24;

  const tx = labelOffset === "right" ? x + 26 : x;
  const tAnchor = labelOffset === "right" ? "start" : "middle";
  const tBaseY = labelOffset === "right" ? y - 6 : y + 40;

  return (
    <g className="pl-pin">
      {/* Outer halo rings (decorative) */}
      <circle cx={x} cy={headY} r="22" fill="none"
              stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <circle cx={x} cy={headY} r="15" fill="none"
              stroke="currentColor" strokeWidth="0.9" opacity="0.65" />

      {/* Pin teardrop — darker than the base map */}
      <path
        d={`M ${x} ${tipY}
            L ${x - 7} ${y - 16}
            A ${headR} ${headR} 0 1 1 ${x + 7} ${y - 16}
            Z`}
        fill="currentColor"
        opacity="1"
      />
      {/* Inner dot */}
      <circle cx={x} cy={headY} r="3.2" fill="var(--navy)" />

      {/* Ground shadow */}
      <ellipse cx={x} cy={tipY + 3} rx="7" ry="1.6"
               fill="currentColor" opacity="0.5" />

      {/* Label — stronger weight + halo for legibility */}
      <text x={tx} y={tBaseY}
            fontFamily="Arial, sans-serif" fontSize="16" fontWeight="800"
            letterSpacing="2" fill="currentColor" textAnchor={tAnchor}>
        {label}
      </text>
    </g>
  );
}

Object.assign(window, { WorldMap });
