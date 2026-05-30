// flags.jsx — Small waving country flags for language switcher
// CSS-driven gentle wave via skew animation.

function FlagKR() {
  // Use the canonical Taegukgi image — guaranteed accurate rendering.
  // The wave animation is handled by the parent wrapper via CSS.
  return (
    <img className="pl-flag pl-flag--img" src="assets/flag-kr.png" alt="" aria-hidden="true" />
  );
}

function FlagRU() {
  return (
    <svg className="pl-flag" viewBox="0 0 60 40" aria-hidden="true">
      <rect y="0"  width="60" height="13.33" fill="#fff" />
      <rect y="13.33" width="60" height="13.34" fill="#0039A6" />
      <rect y="26.67" width="60" height="13.33" fill="#D52B1E" />
    </svg>
  );
}

function FlagEN() {
  // Stars-and-stripes (US) as English-language flag indicator.
  return (
    <svg className="pl-flag" viewBox="0 0 60 40" aria-hidden="true">
      {/* 13 stripes */}
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x="0" y={i * (40 / 13)} width="60" height={40 / 13}
              fill={i % 2 === 0 ? "#B22234" : "#fff"} />
      ))}
      {/* Canton */}
      <rect x="0" y="0" width="24" height={40 * 7 / 13} fill="#3C3B6E" />
      {/* Simplified stars dots */}
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 6 }, (_, c) => (
          <circle key={`${r}-${c}`}
                  cx={3 + c * 3.6}
                  cy={3 + r * 4}
                  r="0.8" fill="#fff" />
        ))
      )}
    </svg>
  );
}

function LangFlag({ code }) {
  if (code === "KR") return <FlagKR />;
  if (code === "RU") return <FlagRU />;
  return <FlagEN />;
}

Object.assign(window, { LangFlag });
