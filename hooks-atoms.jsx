// hooks-atoms.jsx — shared hooks + small atoms

const { useState, useEffect, useRef } = React;

// Reveal on scroll
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids.join(',')]);
  return active;
}

function H2({ text, light }) {
  return (
    <h2 className={`pl-h2 ${light ? 'pl-h2--light' : ''}`}>
      {text.split('\n').map((l, i) => <span key={i}>{l}</span>)}
    </h2>
  );
}

function Tag({ children, light }) {
  return <span className={`pl-tag ${light ? 'pl-tag--light' : ''}`}>{children}</span>;
}

function Reveal({ children, delay = 0 }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={`pl-reveal ${shown ? 'is-shown' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Admin mode infrastructure ──────────────────────────────────
// localStorage paths:
//   pl-edits-{KR|EN|RU}  →  { "field.path": "new value", ... }
//   pl-image-{logo|ceoPhoto}  →  data URL (base64)
// Components subscribe to "pl-copy-changed" / "pl-images-changed" custom events
// so saves from the admin panel propagate without a reload.

function __plGetPath(obj, path) {
  return path.split('.').reduce((acc, k) => {
    if (acc == null) return undefined;
    return /^\d+$/.test(k) ? acc[parseInt(k, 10)] : acc[k];
  }, obj);
}

function __plSetPath(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = /^\d+$/.test(parts[i]) ? parseInt(parts[i], 10) : parts[i];
    if (cur[k] == null) cur[k] = /^\d+$/.test(parts[i+1]) ? [] : {};
    cur = cur[k];
  }
  const last = parts[parts.length - 1];
  const lk = /^\d+$/.test(last) ? parseInt(last, 10) : last;
  cur[lk] = value;
}

function __plBumpCopy() {
  window.dispatchEvent(new CustomEvent('pl-copy-changed'));
}

function __plBumpImages() {
  window.dispatchEvent(new CustomEvent('pl-images-changed'));
}

// useMergedCopy — base copy + localStorage overrides for the given language.
function useMergedCopy(lang) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const h = () => setV(n => n + 1);
    window.addEventListener('pl-copy-changed', h);
    return () => window.removeEventListener('pl-copy-changed', h);
  }, []);
  return React.useMemo(() => {
    const base = window.PL_COPY[lang] || window.PL_COPY.KR;
    const cloned = JSON.parse(JSON.stringify(base));
    try {
      const overrides = JSON.parse(localStorage.getItem(`pl-edits-${lang}`) || '{}');
      for (const path in overrides) {
        __plSetPath(cloned, path, overrides[path]);
      }
    } catch (e) {}
    return cloned;
  }, [lang, v]);
}

// useStoredImage — returns current uploaded image (data URL) or fallback src.
function useStoredImage(key, fallback) {
  const [src, setSrc] = useState(() => localStorage.getItem('pl-image-' + key) || fallback);
  useEffect(() => {
    const h = () => setSrc(localStorage.getItem('pl-image-' + key) || fallback);
    window.addEventListener('pl-images-changed', h);
    return () => window.removeEventListener('pl-images-changed', h);
  }, [key, fallback]);
  return src;
}

Object.assign(window, {
  useReveal, useScrollProgress, useActiveSection, H2, Tag, Reveal,
  useCountUp, CountStat,
  useMergedCopy, useStoredImage,
  __plGetPath, __plSetPath, __plBumpCopy, __plBumpImages
});

// Count-up animation for stat numbers. Parses out the first numeric block
// from a string like "1,000+" or "₽2.4B", animates it from 0 → target, and
// preserves prefix/suffix characters around it.
function useCountUp(str, duration = 1800, triggerShown = true) {
  const m = String(str).match(/[\d,.]+/);
  const numStr = m ? m[0] : '0';
  const hasComma = numStr.includes(',');
  const decimals = (numStr.split('.')[1] || '').length;
  const target = parseFloat(numStr.replace(/,/g, '')) || 0;
  const idx = m ? str.indexOf(numStr) : 0;
  const before = m ? str.slice(0, idx) : '';
  const after = m ? str.slice(idx + numStr.length) : str;

  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!triggerShown) { setVal(0); return; }
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [triggerShown, target, duration]);

  const fmt = decimals > 0
    ? val.toFixed(decimals)
    : (hasComma ? Math.round(val).toLocaleString() : String(Math.round(val)));
  return before + fmt + after;
}

function CountStat({ value }) {
  const [ref, shown] = useReveal(0.25);
  const display = useCountUp(value, 1800, shown);
  return <span ref={ref}>{display}</span>;
}
