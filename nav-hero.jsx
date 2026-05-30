// nav-hero.jsx — Top navigation + Hero

const { useState: useStateNH, useEffect: useEffectNH } = React;

function PLNav({ t, copy, setTweak, active, onNav }) {
  const sections = ["about", "ceo", "vision", "business", "history", "network", "contact"];
  const progress = useScrollProgress();
  const logoSrc = useStoredImage('logo', 'assets/petlegend-logo.png');
  const [scrolled, setScrolled] = useStateNH(false);
  useEffectNH(() => {
    const onS = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onS, { passive: true });
    onS();
    return () => window.removeEventListener('scroll', onS);
  }, []);

  const go = (key) => (e) => {
    e.preventDefault();
    if (typeof onNav === 'function') onNav(key);
  };

  return (
    <header className={`pl-nav ${scrolled ? 'pl-nav--scrolled' : ''}`}>
      <div className="pl-nav__inner">
        <a href="#" className="pl-logo" onClick={go('home')}>
          <img src={logoSrc} alt="petlegend" className="pl-logo__img" />
          <span className="pl-logo__word">
            <span className="pl-logo__since">SINCE 2013</span>
            <span className="pl-logo__name">petlegend</span>
          </span>
        </a>
        <nav className="pl-nav__items">
          {copy.nav.map((label, i) => (
            <a key={i} href={`#${sections[i]}`}
               className={active === sections[i] ? 'is-active' : ''}
               onClick={go(sections[i])}>
              <span className="pl-nav__num">0{i + 1}</span>
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="pl-nav__right">
          <div className="pl-lang">
            {["KR", "RU", "EN"].map(L => (
              <button key={L} className={t.lang === L ? 'is-on' : ''}
                      onClick={() => setTweak('lang', L)}
                      title={L}>
                <span className="pl-flag-wrap"><LangFlag code={L} /></span>
                <span className="pl-lang__code">{L}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="pl-nav__progress"><div style={{ width: `${progress * 100}%` }} /></div>
    </header>
  );
}

function PLHero({ copy, onNav }) {
  const [time, setTime] = useStateNH(() => new Date());
  useEffectNH(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const fmt = (tz) => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZone: tz, hour12: false
      }).format(time);
    } catch { return '--:--:--'; }
  };

  return (
    <section id="top" className="pl-hero" data-screen-label="00 Hero">
      <div className="pl-hero__bg" aria-hidden="true">
        <MoscowSkyline />
        <ContainerShip />
      </div>
      <div className="pl-hero__grid">
        <div className="pl-hero__eyebrow">
          <span className="pl-dot" />
          <span>{copy.eyebrow}</span>
        </div>

        <h1 className="pl-hero__title">
          <span className="pl-hero__line1">{copy.heroLead}</span>
          <span className="pl-hero__line2"><em>{copy.heroEm}</em></span>
        </h1>

        <div className="pl-hero__meta">
          <p className="pl-hero__sub">{copy.heroSub}</p>
          <div className="pl-hero__cta">
            <a href="#contact" className="pl-btn pl-btn--gold"
               onClick={(e) => { e.preventDefault(); onNav && onNav('contact'); }}>
              <span>{copy.ctaPrimary}</span>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </a>
            <a href="#business" className="pl-btn pl-btn--ghost"
               onClick={(e) => { e.preventDefault(); onNav && onNav('business'); }}>
              <span>{copy.ctaSecondary}</span>
            </a>
          </div>
        </div>

        <aside className="pl-hero__side">
          <div className="pl-hero__clock">
            <div>
              <span className="pl-mono">SEOUL  ·  HQ</span>
              <span className="pl-mono pl-time">{fmt('Asia/Seoul')}</span>
            </div>
            <div>
              <span className="pl-mono">MOSCOW  ·  RU</span>
              <span className="pl-mono pl-time">{fmt('Europe/Moscow')}</span>
            </div>
            <div>
              <span className="pl-mono">ALMATY  ·  CIS</span>
              <span className="pl-mono pl-time">{fmt('Asia/Almaty')}</span>
            </div>
          </div>
          <div className="pl-hero__ship">
            <div className="pl-mono pl-mono--gold">▢  IN TRANSIT</div>
            <div className="pl-ship-line">
              <span>SEOUL</span>
              <div className="pl-ship-bar"><i /></div>
              <span>MOSCOW</span>
            </div>
            <div className="pl-mono pl-mono--light">CONT. PL-2026-0418  ·  ETA 03 DAYS</div>
          </div>
        </aside>

        <div className="pl-hero__scroll">
          <span>{copy.scrollHint}</span>
          <span className="pl-scroll-bar"><i /></span>
        </div>
      </div>

      <div className="pl-hero__stats">
        {copy.stats.map((s, i) => (
          <div className="pl-hero__stat" key={i}>
            <div className="pl-hero__stat-v"><CountStat value={s.v} /></div>
            <div className="pl-hero__stat-l">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { PLNav, PLHero });
