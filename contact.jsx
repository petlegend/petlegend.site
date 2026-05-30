// contact.jsx — Network + Contact + Footer

const { useState: useStateC } = React;

function PLNetwork({ copy }) {
  return (
    <section id="network" className="pl-net" data-screen-label="06 Network">
      <div className="pl-section__inner">
        <div className="pl-section__head">
          <Tag>{copy.netTag}</Tag>
          <span className="pl-mono">— PL · 006</span>
        </div>
        <H2 text={copy.netHead} />

        <div className="pl-net__grid">
          {copy.netCards.map((n, i) => {
            const flagCode = i === 0 ? 'KR' : i === 1 ? 'RU' : null;
            return (
              <div className="pl-net__card" key={i}>
                <div className="pl-net__num">/  0{i + 1}</div>
                <div className="pl-net__flag">
                  {flagCode
                    ? <span className="pl-net__flag-wave"><LangFlag code={flagCode} /></span>
                    : n.flag}
                </div>
                <div className="pl-net__country">{n.country}</div>
                <div className="pl-net__sub">{n.sub}</div>
                <ul className="pl-net__bullets">
                  {n.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PLContact({ copy }) {
  const [type, setType] = useStateC(copy.form.types[0]);
  const [sent, setSent] = useStateC(false);
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    e.target.reset();
  };
  return (
    <section id="contact" className="pl-contact" data-screen-label="07 Contact">
      <div className="pl-section__inner">
        <div className="pl-section__head">
          <Tag>{copy.contactTag}</Tag>
          <span className="pl-mono">— PL · 007</span>
        </div>

        <div className="pl-contact__grid">
          <div>
            <H2 text={copy.contactHead} />
            <p className="pl-contact__lead">{copy.contactLead}</p>

            <div className="pl-contact__info">
              {copy.contactInfo.map((info, i) => (
                <div className="pl-contact__info-item" key={i}>
                  <div className="pl-contact__info-label">{info.label}</div>
                  <div className="pl-contact__info-val">{info.val}</div>
                </div>
              ))}
            </div>
          </div>

          <form className="pl-form" onSubmit={submit}>
            <div className="pl-form__head">{copy.form.submit}</div>
            <div className="pl-field">
              <label>{copy.form.name}</label>
              <input type="text" required />
            </div>
            <div className="pl-field">
              <label>{copy.form.tel}</label>
              <input type="tel" />
            </div>
            <div className="pl-field">
              <label>{copy.form.email}</label>
              <input type="email" required />
            </div>
            <div className="pl-field">
              <label>{copy.form.type}</label>
              <div className="pl-type-opts">
                {copy.form.types.map((opt, i) => (
                  <button type="button" key={i}
                          className={type === opt ? 'is-on' : ''}
                          onClick={() => setType(opt)}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="pl-field">
              <label>{copy.form.msg}</label>
              <textarea rows="4"></textarea>
            </div>
            <button type="submit" className="pl-btn pl-btn--navy" style={{ marginTop: 8, justifyContent: 'center' }}>
              <span>{copy.form.submit}</span>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            {sent && <div className="pl-sent">{copy.form.sent}</div>}
          </form>
        </div>
      </div>
    </section>
  );
}

function PLFooter({ copy, onNav }) {
  const logoSrc = useStoredImage('logo', 'assets/petlegend-logo.png');
  const renderLink = (link, j) => {
    if (link.mail) {
      return <li key={j}><a href={`mailto:${link.mail}`}>{link.label}</a></li>;
    }
    if (link.tel) {
      return <li key={j}><a href={`tel:${link.tel}`}>{link.label}</a></li>;
    }
    if (link.page) {
      const handle = (e) => {
        e.preventDefault();
        if (typeof onNav === 'function') onNav(link.page, link.sub);
      };
      const hashCore = link.sub ? `${link.page}-${link.sub}` : link.page;
      const href = link.page === 'home' ? '#' : `#${hashCore}`;
      return <li key={j}><a href={href} onClick={handle}>{link.label}</a></li>;
    }
    return <li key={j}><a href="#">{link.label}</a></li>;
  };
  return (
    <footer className="pl-foot">
      <div className="pl-foot__inner">
        <div className="pl-foot__top">
          <div>
            <div className="pl-logo">
              <img src={logoSrc} alt="petlegend" className="pl-logo__img" />
              <span className="pl-logo__word">
                <span className="pl-logo__since" style={{ color: 'var(--gold-light)' }}>SINCE 2013</span>
                <span className="pl-logo__name" style={{ color: 'var(--gold)' }}>petlegend</span>
              </span>
            </div>
            <p className="pl-foot__brand-desc">{copy.footerDesc}</p>
            <div className="pl-foot__est">SEOUL ⇋ MOSCOW  ·  KR · RU · CIS</div>
          </div>
          {copy.footerCols.map((col, i) => (
            <div key={i}>
              <div className="pl-foot__col-title">{col.title}</div>
              <ul className="pl-foot__links">
                {col.links.map(renderLink)}
              </ul>
            </div>
          ))}
        </div>
        <div className="pl-foot__bottom">
          <span>{copy.copyright}</span>
        </div>
        <div className="pl-foot__legal">
          {copy.legalCompany && <div className="pl-foot__legal-co">{copy.legalCompany}</div>}
          {(copy.legalNotices || []).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { PLNetwork, PLContact, PLFooter });
