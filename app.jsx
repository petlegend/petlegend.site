// app.jsx — Main App entry + Tweaks + page-by-page routing

const { useEffect: useEffectA, useState: useStateApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "KR",
  "palette": ["#1A2B4A", "#C8956C", "#F5F0E8"],
  "heading": "Cormorant Garamond",
  "showGrain": true,
  "section": "default"
}/*EDITMODE-END*/;

// Section keys in nav order
const PAGE_KEYS = ["home", "about", "ceo", "vision", "business", "history", "network", "contact"];

// Parse "#business" or "#business-raw" → { page, sub }
function routeFromHash() {
  const h = (window.location.hash || "").replace("#", "");
  if (!h) return { page: "home", sub: null };
  const [base, sub] = h.split("-");
  return {
    page: PAGE_KEYS.includes(base) ? base : "home",
    sub: sub || null
  };
}

function PLTweaks({ t, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Language" />
      <TweakRadio label="Locale" value={t.lang}
        options={["KR", "RU", "EN"]}
        onChange={(v) => setTweak('lang', v)} />

      <TweakSection label="Brand palette" />
      <TweakColor label="Palette" value={t.palette}
        options={[
          ["#1A2B4A", "#C8956C", "#F5F0E8"],
          ["#0F1828", "#B8845A", "#EFE8DC"],
          ["#102236", "#D4B27A", "#F8F4EC"],
          ["#0B1F3A", "#A47148", "#F0E6D2"]
        ]}
        onChange={(v) => setTweak('palette', v)} />

      <TweakSection label="Typography" />
      <TweakSelect label="Heading font" value={t.heading}
        options={["Cormorant Garamond", "Playfair Display", "Libre Caslon Text", "EB Garamond"]}
        onChange={(v) => setTweak('heading', v)} />

      <TweakSection label="Surface" />
      <TweakToggle label="Paper grain" value={t.showGrain}
        onChange={(v) => setTweak('showGrain', v)} />
    </TweaksPanel>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const copy = useMergedCopy(t.lang);
  const [route, setRoute] = useStateApp(() => routeFromHash());
  const { page, sub } = route;

  // Sync from hash changes (back/forward, manual edits)
  useEffectA(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Navigation helper — updates hash + scrolls to top
  const goTo = (key, subKey) => {
    const nextPage = PAGE_KEYS.includes(key) ? key : "home";
    const nextSub = subKey || null;
    if (nextPage === "home") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      window.location.hash = nextSub ? `${nextPage}-${nextSub}` : nextPage;
    }
    setRoute({ page: nextPage, sub: nextSub });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffectA(() => {
    const r = document.documentElement;
    const [navy, gold, ivory] = t.palette;
    r.style.setProperty('--navy', navy);
    r.style.setProperty('--gold', gold);
    r.style.setProperty('--ivory', ivory);
    r.style.setProperty('--navy-deep', shade(navy, -0.18));
    r.style.setProperty('--navy-light', shade(navy, 0.18));
    r.style.setProperty('--gold-light', shade(gold, 0.15));
    r.style.setProperty('--gold-deep', shade(gold, -0.22));
    r.style.setProperty('--paper', shade(ivory, 0.025));
    r.style.setProperty('--font-h', `'${t.heading}', 'Noto Serif KR', Garamond, serif`);
    r.dataset.grain = t.showGrain ? '1' : '0';
    document.documentElement.lang = t.lang.toLowerCase();
  }, [t.palette, t.heading, t.showGrain, t.lang]);

  const pageContent = () => {
    switch (page) {
      case "about":    return <PLAbout copy={copy} />;
      case "ceo":      return <PLCeo copy={copy} />;
      case "vision":   return <PLVision copy={copy} />;
      case "business": return (
        <>
          <PLBusiness copy={copy} initialDiv={sub} />
          <BrandMarquee label={copy.russiaMarquee.label}
                        brands={copy.russiaMarquee.brands}
                        code="RUSSIA" />
        </>
      );
      case "history":  return <PLHistory copy={copy} />;
      case "network":  return <PLNetwork copy={copy} />;
      case "contact":  return <PLContact copy={copy} />;
      case "default":
      default:
        return (
          <>
            <PLHero copy={copy} onNav={goTo} />
            <BrandMarquee label={copy.partnerMarquee.label}
                          brands={copy.partnerMarquee.brands}
                          code="PARTNERS" />
          </>
        );
    }
  };

  return (
    <div className="pl-app" data-page={page}>
      <PLNav t={t} copy={copy} setTweak={setTweak} active={page} onNav={goTo} />
      <main key={page} className="pl-main-fade">
        {pageContent()}
      </main>
      <PLFooter copy={copy} onNav={goTo} />
      <PLTweaks t={t} setTweak={setTweak} />
      <PLAdmin lang={t.lang} />
    </div>
  );
}

// shade helper — adjust hex by factor (-1..1)
function shade(hex, factor) {
  const h = hex.replace('#', '');
  const x = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  let r = parseInt(x.slice(0, 2), 16);
  let g = parseInt(x.slice(2, 4), 16);
  let b = parseInt(x.slice(4, 6), 16);
  if (factor > 0) {
    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);
  } else {
    const k = 1 + factor;
    r = Math.round(r * k); g = Math.round(g * k); b = Math.round(b * k);
  }
  const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
