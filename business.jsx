// business.jsx — Business (divisions + sub-tabs) + History

const { useState: useStateBiz } = React;

function PLBusiness({ copy, initialDiv }) {
  const validInitial = copy.divisions.find(d => d.key === initialDiv) ? initialDiv : copy.divisions[0].key;
  const [div, setDiv] = useStateBiz(validInitial);
  const [sub, setSub] = useStateBiz({}); // {pet:'p1', raw:'r1'}

  // React to route-driven changes (e.g., footer link → 원료사업부)
  React.useEffect(() => {
    if (initialDiv && copy.divisions.find(d => d.key === initialDiv)) {
      setDiv(initialDiv);
    }
  }, [initialDiv]);

  const currentDiv = copy.divisions.find(d => d.key === div);
  const currentSubKey = sub[div] || currentDiv.subs[0].key;
  const currentSub = currentDiv.subs.find(s => s.key === currentSubKey);

  return (
    <section id="business" className="pl-biz" data-screen-label="04 Business">
      <div className="pl-section__inner">
        <div className="pl-section__head">
          <Tag>{copy.bizTag}</Tag>
          <span className="pl-mono">— PL · 004</span>
        </div>
        <H2 text={copy.bizHead} />
        <p className="pl-biz__lead">{copy.bizLead}</p>

        <div className="pl-biz__tabs">
          {copy.divisions.map((d, i) => (
            <button key={d.key}
                    className={`pl-div-tab ${div === d.key ? 'is-on' : ''}`}
                    onClick={() => setDiv(d.key)}>
              <span className="pl-div-tab__num">0{i + 1} /</span>
              <span>{d.name}</span>
              <span className="pl-div-tab__sub">— {d.sub}</span>
            </button>
          ))}
        </div>

        <div className="pl-sub-tabs">
          {currentDiv.subs.map(s => (
            <button key={s.key}
                    className={`pl-sub-tab ${currentSubKey === s.key ? 'is-on' : ''}`}
                    onClick={() => setSub({ ...sub, [div]: s.key })}>
              {s.label}
            </button>
          ))}
        </div>

        <BizContent sub={currentSub} divKey={div} />
      </div>
    </section>
  );
}

function BizContent({ sub, divKey }) {
  return (
    <div className="pl-biz__content" key={`${divKey}-${sub.key}`}>
      <div>
        <div className="pl-biz__small-tag">{sub.tag}</div>
        <h3 className="pl-biz__title">{sub.title}</h3>
        <p className="pl-biz__desc">{sub.desc}</p>
        {sub.itemGroups ? (
          <div className="pl-biz__groups">
            {sub.itemGroups.map((g, gi) => (
              <div className="pl-biz__group" key={gi}>
                <div className="pl-biz__group-label">{g.label}</div>
                <ul className="pl-biz__items">
                  {g.items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="pl-biz__items">
            {sub.items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        )}
      </div>
      <BizVisual sub={sub} />
    </div>
  );
}

function PartnerCard({ partner }) {
  return (
    <>
      <div className="pl-biz__visual-tag">KEY PARTNER</div>
      <div className="pl-partner-card">
        <div className="pl-partner-card__label">PRIMARY SUPPLIER</div>
        <div className="pl-partner-card__name">{partner.name}</div>
        <div className="pl-partner-card__note">{partner.note}</div>
      </div>
    </>
  );
}

function BizVisual({ sub }) {
  // p2 — Russia (brand grid)
  if (sub.key === 'p2') {
    return (
      <div className="pl-biz__visual">
        <div className="pl-biz__visual-tag">RUSSIA PORTFOLIO</div>
        <div className="pl-brand-grid">
          {sub.brands.map((b, i) => (
            <div className="pl-brand" key={i}>
              <div>
                <div className="pl-brand__name">{b.name}</div>
                <div className="pl-brand__note">{b.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // p1 — Domestic (vertical brand list)
  if (sub.brands) {
    return (
      <div className="pl-biz__visual">
        <div className="pl-biz__visual-tag">BRANDS</div>
        {sub.brands.map((b, i) => (
          <div className="pl-brand" key={i}>
            <div>
              <div className="pl-brand__name">{b.name}</div>
              <div className="pl-brand__note">{b.note}</div>
            </div>
            {b.flag && <span className="pl-brand__flag">{b.flag}</span>}
          </div>
        ))}
      </div>
    );
  }

  // r1 — Animal fats: KEY PARTNER + chips
  if (sub.key === 'r1') {
    return (
      <div className="pl-biz__visual">
        <PartnerCard partner={sub.partner} />
        <div className="pl-chips">
          {sub.chips.map((c, i) => <span className="pl-chip" key={i}>{c}</span>)}
        </div>
      </div>
    );
  }

  // r2 — Vegetable oils: KEY PARTNER + product line
  if (sub.key === 'r2') {
    const romans = ["Ⅰ", "Ⅱ", "Ⅲ"];
    return (
      <div className="pl-biz__visual">
        <PartnerCard partner={sub.partner} />
        <div className="pl-biz__visual-tag" style={{ marginTop: 8 }}>PRODUCT LINE</div>
        <div className="pl-oils">
          {sub.oils.map((o, i) => (
            <div className="pl-oil" key={i}>
              <div className="pl-oil__roman">{romans[i]}</div>
              <div className="pl-oil__name">{o.name}</div>
              <div className="pl-oil__en">{o.en}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // r3 — Feed ingredients: KEY PARTNER + spec table
  if (sub.key === 'r3') {
    return (
      <div className="pl-biz__visual">
        <PartnerCard partner={sub.partner} />
        <div className="pl-biz__visual-tag" style={{ marginTop: 8 }}>SPECIFICATION</div>
        <table className="pl-spec">
          <tbody>
            {sub.spec.map((row, i) => (
              <tr key={i}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

function PLHistory({ copy }) {
  const eras = copy.histEras || [
    { key: "all", label: "", range: "2013 — 2026", caption: "", from: 0, to: 9999 }
  ];
  const [activeEra, setActiveEra] = useStateBiz(eras[eras.length - 1].key);
  const current = eras.find(e => e.key === activeEra) || eras[0];

  const filtered = copy.history
    .filter(g => {
      const y = parseInt(g.y, 10);
      return y >= current.from && y <= current.to;
    })
    .sort((a, b) => parseInt(b.y, 10) - parseInt(a.y, 10));

  const totalEvents = filtered.reduce((sum, g) => sum + g.events.length, 0);
  const yearsSpan = current.to - current.from + 1;
  const [ref, shown] = useReveal(0.05);

  const lang = (document.documentElement.lang || 'kr').toUpperCase();
  const labels = {
    KR: { yrs: '년', evts: '마일스톤' },
    EN: { yrs: 'YEARS', evts: 'MILESTONES' },
    RU: { yrs: 'лет', evts: 'вех' }
  }[lang] || { yrs: 'YRS', evts: 'EVENTS' };

  return (
    <section id="history" className="pl-hist" data-screen-label="05 History" ref={ref}>
      <div className="pl-section__inner">
        <div className="pl-section__head">
          <Tag light>{copy.histTag}</Tag>
          <span className="pl-mono pl-mono--light">— PL · 005</span>
        </div>
        <H2 text={copy.histHead} light />

        <div className="pl-hist__eras">
          {eras.map(e => (
            <button
              key={e.key}
              className={`pl-hist__era ${activeEra === e.key ? 'is-on' : ''}`}
              onClick={() => setActiveEra(e.key)}
            >
              <div className="pl-hist__era-meta">
                <span className="pl-hist__era-label">{e.label}</span>
                <span className="pl-hist__era-num pl-num">{e.range}</span>
              </div>
              <div className="pl-hist__era-cap">{e.caption}</div>
            </button>
          ))}
        </div>

        <div className="pl-hist__lay" key={activeEra}>
          <aside className="pl-hist__aside">
            <div className="pl-hist__aside-tag">{current.label}</div>
            <div className="pl-hist__aside-range pl-num">{current.range}</div>
            <div className="pl-hist__aside-cap">{current.caption}</div>
            <div className="pl-hist__aside-stats">
              <div>
                <div className="pl-num pl-hist__stat-v">{yearsSpan}</div>
                <div className="pl-hist__stat-l">{labels.yrs}</div>
              </div>
              <div>
                <div className="pl-num pl-hist__stat-v">{totalEvents}</div>
                <div className="pl-hist__stat-l">{labels.evts}</div>
              </div>
            </div>
          </aside>

          <ol className="pl-hist__years">
            {filtered.map((g, gi) => (
              <li className={`pl-hist__year-block ${shown ? 'is-shown' : ''}`}
                  key={g.y}
                  style={{ transitionDelay: `${gi * 80}ms` }}>
                <div className="pl-hist__y pl-num">{g.y}</div>
                <ul className="pl-hist__evs">
                  {g.events.map((ev, ei) => (
                    <li key={ei}>
                      <span className="pl-hist__ev-tag">{ev.tag}</span>
                      <span className="pl-hist__ev-desc">{ev.desc}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { PLBusiness, PLHistory });
