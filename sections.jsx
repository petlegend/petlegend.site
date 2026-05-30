// sections.jsx — About + CEO + Vision

function PLAbout({ copy }) {
  const [ref, shown] = useReveal();
  return (
    <section id="about" className="pl-about" data-screen-label="01 About" ref={ref}>
      <div className="pl-section__inner">
        <div className="pl-section__head">
          <Tag>{copy.aboutTag}</Tag>
          <span className="pl-mono">— PL · 001</span>
        </div>

        <div className="pl-about__grid">
          <div>
            <H2 text={copy.aboutHead} />
            <p className="pl-about__lead">{copy.aboutLead}</p>
          </div>
          <div>
            <table className="pl-about__table">
              <tbody>
                {copy.aboutTable.map((row, i) => (
                  <tr key={i}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pl-offices">
          {copy.offices.map((o, i) => (
            <div className="pl-office" key={i}>
              <div className="pl-office__coords pl-mono">{o.coords}</div>
              <div className="pl-office__flag">
                <span className="pl-office__flag-wave">
                  <LangFlag code={i === 0 ? 'KR' : 'RU'} />
                </span>
              </div>
              <div className="pl-office__label">{o.label}</div>
              <div className="pl-office__lines">
                {o.lines.map((l, j) => <div key={j}>{l}</div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PLCeo({ copy }) {
  const ceoPhoto = useStoredImage('ceoPhoto', 'assets/ceo-photo.png');
  return (
    <section id="ceo" className="pl-ceo" data-screen-label="02 CEO">
      <div className="pl-section__inner">
        <div className="pl-section__head">
          <Tag>{copy.ceoTag}</Tag>
          <span className="pl-mono">— PL · 002</span>
        </div>

        <div className="pl-ceo__hero">
          <div className="pl-ceo__card pl-ceo__card--compact">
            <div className={`pl-ceo__photo ${ceoPhoto ? 'pl-ceo__photo--img' : ''}`}>
              {ceoPhoto
                ? <img src={ceoPhoto} alt={copy.ceoName} className="pl-ceo__photo-img" />
                : <span>[ CEO PORTRAIT<br />{(copy.ceoName || '').toUpperCase()} ]</span>}
            </div>
            <div className="pl-ceo__name-block">
              <div className="pl-ceo__name">{copy.ceoName}</div>
              <div className="pl-ceo__title-en">{copy.ceoTitle}</div>
            </div>
          </div>

          <div className="pl-ceo__body">
            <div className="pl-ceo__msg-tag">{copy.ceoMessageTag}</div>
            <H2 text={copy.ceoHead} />
            <div className="pl-ceo__message">
              {(copy.ceoMessage || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="pl-ceo__signature">
              <span className="pl-ceo__sig-rule" />
              <span className="pl-ceo__sig-text">{copy.ceoSignature}</span>
            </div>
          </div>
        </div>

        <div className="pl-ceo__career-section">
          <div className="pl-ceo__career-label">CAREER</div>
          <ol className="pl-ceo__career pl-ceo__career--compact">
            {copy.ceoCareer.map((c, i) => (
              <li className="pl-career__item" key={i}>
                <span className="pl-career__year">{c.y}</span>
                <span className="pl-career__co">{c.c}</span>
                <span className="pl-career__role">{c.r}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function PLVision({ copy }) {
  return (
    <section id="vision" className="pl-vision" data-screen-label="03 Vision">
      <div className="pl-section__inner">
        <div className="pl-section__head">
          <Tag light>{copy.visionTag}</Tag>
          <span className="pl-mono pl-mono--light">— PL · 003</span>
        </div>
        <H2 text={copy.visionHead} light />

        <div className="pl-vision__grid">
          {copy.visionCards.map((c, i) => (
            <div className="pl-vision__card" key={i}>
              <div className="pl-vision__roman">{c.roman}</div>
              <div className="pl-vision__label">{c.label}</div>
              <div className="pl-vision__text">{c.text}</div>
              <div className="pl-vision__kicker">— {c.kicker}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { PLAbout, PLCeo, PLVision });
