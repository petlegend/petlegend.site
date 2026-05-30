// marquee.jsx — Infinite horizontal brand ribbon
// Takes label + brands array via props for flexible reuse.

function BrandMarquee({ label, brands, code = "BRANDS" }) {
  const list = brands || [];

  const Strip = () => (
    <>
      {list.map((b, i) => (
        <React.Fragment key={i}>
          <span className="pl-marquee__item">{b}</span>
          <span className="pl-marquee__sep">✦</span>
        </React.Fragment>
      ))}
    </>
  );

  return (
    <section className="pl-marquee" aria-label="Brand ribbon">
      <div className="pl-marquee__top">
        <span className="pl-mono pl-mono--gold">{label}</span>
        <span className="pl-mono pl-mono--muted">PET LEGEND · {code} · 2026</span>
      </div>
      <div className="pl-marquee__track">
        <div className="pl-marquee__inner">
          <Strip />
          <Strip />
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { BrandMarquee });
