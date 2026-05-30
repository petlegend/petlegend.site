// admin.jsx — Administrator mode for PET LEGEND site
// Activation: URL `?admin=1`  OR  Ctrl+Shift+A
// Login password: petlegend2026 (change __ADMIN_PASSWORD below)

const __ADMIN_PASSWORD = "petlegend2026";

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

const ADMIN_FIELDS = [
  {
    section: "hero",
    label: "히어로 / Hero",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heroLead", label: "Hero Lead", type: "text" },
      { key: "heroEm", label: "Hero Emphasis (이탤릭)", type: "text" },
      { key: "heroSub", label: "Hero Subtitle", type: "textarea" },
      { key: "ctaPrimary", label: "CTA — 주요 버튼", type: "text" },
      { key: "ctaSecondary", label: "CTA — 보조 버튼", type: "text" },
      { key: "stats.0.v", label: "통계 1 — 숫자", type: "text" },
      { key: "stats.0.l", label: "통계 1 — 라벨", type: "text" },
      { key: "stats.1.v", label: "통계 2 — 숫자", type: "text" },
      { key: "stats.1.l", label: "통계 2 — 라벨", type: "text" },
      { key: "stats.2.v", label: "통계 3 — 숫자", type: "text" },
      { key: "stats.2.l", label: "통계 3 — 라벨", type: "text" },
      { key: "stats.3.v", label: "통계 4 — 숫자", type: "text" },
      { key: "stats.3.l", label: "통계 4 — 라벨", type: "text" }
    ]
  },
  {
    section: "about",
    label: "회사소개 / About",
    fields: [
      { key: "aboutHead", label: "Heading (줄바꿈: \\n)", type: "textarea" },
      { key: "aboutLead", label: "Lead paragraph", type: "textarea" }
    ]
  },
  {
    section: "ceo",
    label: "대표이사 / CEO",
    fields: [
      { key: "ceoName", label: "사진 카드 이름", type: "text" },
      { key: "ceoTitle", label: "직함", type: "text" },
      { key: "ceoHead", label: "헤딩 (줄바꿈: \\n)", type: "textarea" },
      { key: "ceoBody", label: "약력 본문", type: "textarea" }
    ]
  },
  {
    section: "contact",
    label: "연락처 / Contact",
    fields: [
      { key: "contactLead", label: "Lead", type: "textarea" },
      { key: "contactInfo.0.val", label: "본사 주소", type: "textarea" },
      { key: "contactInfo.1.val", label: "모스크바 법인 주소", type: "textarea" },
      { key: "contactInfo.2.val", label: "전화", type: "text" },
      { key: "contactInfo.3.val", label: "이메일", type: "text" }
    ]
  },
  {
    section: "images",
    label: "이미지 / Images",
    fields: [
      { key: "$logo", label: "로고 (원형 PNG · 정사각형 권장)", type: "image" },
      { key: "$ceoPhoto", label: "대표이사 사진 (3:4 비율 권장)", type: "image" }
    ]
  }
];

// ── Login modal ────────────────────────────────────────────────
function AdminLogin({ onAuthed, onCancel }) {
  const [pw, setPw] = useStateA("");
  const [err, setErr] = useStateA("");
  const submit = (e) => {
    e.preventDefault();
    if (pw === __ADMIN_PASSWORD) {
      sessionStorage.setItem("pl-admin-authed", "1");
      onAuthed();
    } else {
      setErr("비밀번호가 올바르지 않습니다.");
    }
  };
  return (
    <div className="pl-admin-modal" onClick={onCancel}>
      <form className="pl-admin-login" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>관리자 로그인</h2>
        <p>관리자 비밀번호를 입력하세요.</p>
        <input type="password" value={pw} autoFocus
               onChange={(e) => { setPw(e.target.value); setErr(""); }}
               placeholder="비밀번호" />
        {err && <p className="pl-admin-login__err">{err}</p>}
        <div className="pl-admin-login__actions">
          <button type="button" className="pl-admin__btn" onClick={onCancel}>취소</button>
          <button type="submit" className="pl-admin__btn pl-admin__btn--primary">로그인</button>
        </div>
      </form>
    </div>
  );
}

// ── Image upload field ─────────────────────────────────────────
function ImageField({ value, onChange }) {
  const ref = useRefA(null);
  const handle = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  return (
    <div className="pl-admin__img">
      <div className="pl-admin__img-preview">
        {value ? <img src={value} alt="preview" /> : <span>이미지 없음</span>}
      </div>
      <input type="file" ref={ref} accept="image/*"
             onChange={handle} style={{ display: "none" }} />
      <div className="pl-admin__img-btns">
        <button type="button" className="pl-admin__btn"
                onClick={() => ref.current && ref.current.click()}>
          파일 선택
        </button>
        {value && (
          <button type="button" className="pl-admin__btn"
                  onClick={() => onChange("")}>
            제거
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────
function AdminPanel({ lang, onClose }) {
  const [activeSection, setActiveSection] = useStateA(ADMIN_FIELDS[0].section);
  const [drafts, setDrafts] = useStateA({});
  const [savedFlash, setSavedFlash] = useStateA(false);

  const base = window.PL_COPY[lang] || window.PL_COPY.KR;
  const overrides = (() => {
    try { return JSON.parse(localStorage.getItem(`pl-edits-${lang}`) || "{}"); }
    catch { return {}; }
  })();

  const getCurrent = (field) => {
    if (drafts[field.key] !== undefined) return drafts[field.key];
    if (field.key.startsWith("$")) {
      return localStorage.getItem("pl-image-" + field.key.slice(1)) || "";
    }
    if (overrides[field.key] !== undefined) return overrides[field.key];
    const v = __plGetPath(base, field.key);
    return v == null ? "" : v;
  };

  const set = (key, value) => {
    setDrafts((prev) => ({ ...prev, [key]: value }));
  };

  const save = () => {
    const next = { ...overrides };
    let textChanged = false;
    let imgChanged = false;
    Object.entries(drafts).forEach(([key, value]) => {
      if (key.startsWith("$")) {
        const ik = key.slice(1);
        if (value) localStorage.setItem("pl-image-" + ik, value);
        else localStorage.removeItem("pl-image-" + ik);
        imgChanged = true;
      } else {
        next[key] = value;
        textChanged = true;
      }
    });
    if (textChanged) {
      localStorage.setItem(`pl-edits-${lang}`, JSON.stringify(next));
      __plBumpCopy();
    }
    if (imgChanged) {
      __plBumpImages();
    }
    setDrafts({});
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  const resetLang = () => {
    if (!window.confirm(`${lang} 언어의 텍스트 변경사항을 모두 초기화할까요?`)) return;
    localStorage.removeItem(`pl-edits-${lang}`);
    setDrafts({});
    __plBumpCopy();
  };

  const resetImages = () => {
    if (!window.confirm("로고와 대표이사 사진을 기본값으로 되돌릴까요?")) return;
    localStorage.removeItem("pl-image-logo");
    localStorage.removeItem("pl-image-ceoPhoto");
    setDrafts((prev) => {
      const next = { ...prev };
      delete next["$logo"];
      delete next["$ceoPhoto"];
      return next;
    });
    __plBumpImages();
  };

  const currentSection = ADMIN_FIELDS.find((s) => s.section === activeSection);
  const isDirty = Object.keys(drafts).length > 0;

  return (
    <aside className="pl-admin" role="dialog" aria-label="Admin">
      <header className="pl-admin__hd">
        <div className="pl-admin__title">
          <h2>관리자 모드</h2>
          <span className="pl-admin__lang">{lang} 편집</span>
        </div>
        <button className="pl-admin__close" onClick={onClose} title="닫기">✕</button>
      </header>

      <nav className="pl-admin__sections">
        {ADMIN_FIELDS.map((s) => (
          <button key={s.section} type="button"
                  className={activeSection === s.section ? "is-on" : ""}
                  onClick={() => setActiveSection(s.section)}>
            {s.label}
          </button>
        ))}
      </nav>

      <div className="pl-admin__body">
        <div className="pl-admin__hint">
          {activeSection === "images"
            ? "이미지는 모든 언어에서 공통으로 사용됩니다."
            : "변경사항은 현재 선택된 언어(" + lang + ")에만 적용됩니다."}
        </div>
        {currentSection.fields.map((f) => (
          <div className="pl-admin__field" key={f.key}>
            <label className="pl-admin__label">{f.label}</label>
            {f.type === "text" && (
              <input type="text" className="pl-admin__input"
                     value={getCurrent(f)}
                     onChange={(e) => set(f.key, e.target.value)} />
            )}
            {f.type === "textarea" && (
              <textarea rows={4} className="pl-admin__input pl-admin__textarea"
                        value={getCurrent(f)}
                        onChange={(e) => set(f.key, e.target.value)} />
            )}
            {f.type === "image" && (
              <ImageField value={getCurrent(f)}
                          onChange={(v) => set(f.key, v)} />
            )}
          </div>
        ))}
      </div>

      <footer className="pl-admin__ft">
        <div className="pl-admin__ft-l">
          {savedFlash && <span className="pl-admin__saved">✓ 저장됨</span>}
        </div>
        <div className="pl-admin__ft-r">
          {activeSection === "images" ? (
            <button type="button" className="pl-admin__btn" onClick={resetImages}>
              이미지 초기화
            </button>
          ) : (
            <button type="button" className="pl-admin__btn" onClick={resetLang}>
              {lang} 초기화
            </button>
          )}
          <button type="button"
                  className={`pl-admin__btn pl-admin__btn--primary ${!isDirty ? "is-disabled" : ""}`}
                  onClick={save} disabled={!isDirty}>
            저장
          </button>
        </div>
      </footer>
    </aside>
  );
}

// ── Top-level controller ───────────────────────────────────────
function PLAdmin({ lang }) {
  const [enabled, setEnabled] = useStateA(false);
  const [open, setOpen] = useStateA(false);
  const [authed, setAuthed] = useStateA(
    () => sessionStorage.getItem("pl-admin-authed") === "1"
  );

  // Enable when URL has ?admin=1 OR Ctrl+Shift+A pressed
  useEffectA(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("admin") === "1") setEnabled(true);

    const handler = (e) => {
      const k = (e.key || "").toLowerCase();
      if (e.ctrlKey && e.shiftKey && k === "a") {
        e.preventDefault();
        setEnabled(true);
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {!open && (
        <button className="pl-admin-trigger" onClick={() => setOpen(true)}>
          <span className="pl-admin-trigger__icon">⚙</span>
          <span>관리자 모드</span>
        </button>
      )}
      {open && !authed && (
        <AdminLogin onAuthed={() => setAuthed(true)}
                    onCancel={() => setOpen(false)} />
      )}
      {open && authed && (
        <AdminPanel lang={lang} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

Object.assign(window, { PLAdmin });
