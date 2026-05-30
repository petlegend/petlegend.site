# PET LEGEND — 프로젝트 인수인계 (Handoff to Claude Code)

> 작성일: 2026-05-24 (배포 노트 갱신: 2026-05-30)
> 현재 상태: 정적 HTML 프로토타입 (React + Babel inline)
> 다음 목표: 실제 배포 가능한 웹사이트 구축 (Next.js 또는 Vite + React)

---

## 🚨 GitHub → Netlify 배포 (중요)

**반드시 "폴더(멀티파일)" 그대로 올리세요. 단일 번들 파일은 쓰지 마세요.**

- `index.html` 이 진입점이며, `PET LEGEND.html` 과 동일한 멀티파일 버전입니다.
- 같은 폴더의 `*.jsx`, `copy.js`, `styles.css`, `assets/` 가 모두 함께 있어야 합니다.
- ❌ 과거에 `[bundle] error` + 로고/태극기 미표시가 발생한 원인:
  모든 자산을 base64로 압축해 넣은 **단일 번들 파일**을 올렸기 때문.
  라이브 서버에서 그 압축 해제 런타임이 실패 → `[bundle] error` → 이미지 미표시.
- ✅ 해결: 번들을 버리고 원본 폴더를 그대로 배포. 번들 런타임이 없으니 에러가 사라지고,
  로고·태극기는 `assets/` 상대경로에서 정상 로드됩니다.

**GitHub/Netlify 배포 절차**
1. 이 프로젝트 전체 폴더를 GitHub 저장소에 push (index.html이 루트에 있어야 함)
2. Netlify에서 该 저장소 연결 → Build command 비움, Publish directory = `/` (루트)
3. 배포 후 시크릿창에서 확인 (캐시 시 Cmd/Ctrl+Shift+R)
- 폰트는 Google Fonts CDN `<link>` 로 자동 로드 (온라인 필요, 별도 설정 없음)

---

## 📁 프로젝트 구조

```
PET LEGEND.html             # 메인 진입점
copy.js                     # 모든 다국어 카피 (KR / EN / RU)
styles.css                  # 전체 스타일시트
tweaks-panel.jsx            # Tweaks 패널 (개발용)

# JSX 컴포넌트 (Babel 인라인 트랜스파일)
hooks-atoms.jsx             # 공통 훅 + 작은 유틸 (useMergedCopy, useStoredImage 등)
bg-illustrations.jsx        # 히어로 배경 SVG (MoscowSkyline, ContainerShip, EurasiaMap)
nav-hero.jsx                # PLNav + PLHero
sections.jsx                # PLAbout + PLCeo + PLVision
business.jsx                # PLBusiness + PLHistory
marquee.jsx                 # BrandMarquee (재사용 가능, label+brands props)
contact.jsx                 # PLNetwork + PLContact + PLFooter
admin.jsx                   # 관리자 모드 (PLAdmin, AdminPanel, AdminLogin)
app.jsx                     # App 진입점, Tweaks 정의, PLAdmin 마운트

assets/
  petlegend-logo.png        # 원형 골드 로고
  petlegend-wordmark.jpg    # 워드마크 (보조)
  ceo-photo.png             # 김재근 대표 사진
```

---

## 🎨 디자인 시스템

### 컬러 (CSS 변수)
```css
--navy:        #1A2B4A     /* primary 어두운 톤 */
--navy-deep:   #0F1828
--navy-light:  #2D4070
--gold:        #C8956C     /* primary 액센트 */
--gold-light:  #E2B68E
--gold-deep:   #9A6940
--gold-bg:     #FBF5EF
--ivory:       #F5F0E8     /* 라이트 배경 */
--paper:       #FAF7F1
--ink:         #1F1B16     /* 본문 텍스트 */
--ink-mute:    #6B6357
```

### 폰트
```css
--font-h:  Cormorant Garamond + Noto Serif KR   /* 헤딩 (세리프) */
--font-s:  Inter + Pretendard                    /* 본문 (산세리프) */
--font-m:  Arial                                 /* 캡션 · 모노 */
--font-n:  Arial                                 /* 숫자 전용 */
```

### 타입 스케일
```css
--fs-display: 72px       /* 히어로 */
--fs-h1:      56px
--fs-h2:      44px       /* 섹션 헤딩 */
--fs-h3:      26px
--fs-lead:    18px       /* 도입 문단 */
--fs-body:    15px
--fs-small:   13px
--fs-caption: 11px
--fs-micro:   10px
```

---

## 🌏 다국어 (i18n)

- 3개 언어: KR, EN, RU
- 전체 카피는 `copy.js`의 `window.PL_COPY` 객체에 통합
- 언어 전환은 Tweaks 패널 또는 `localStorage[pl-edits-{lang}]`로 동작
- **모든 카피 변경은 반드시 KR/EN/RU 동시 수정**할 것

### 카피 데이터 구조
```js
window.PL_COPY = {
  KR: {
    nav: [...],
    eyebrow: "...", heroLead: "...", heroEm: "...", heroSub: "...",
    stats: [{v, l}, ...],
    aboutTag, aboutHead, aboutLead, aboutTable: [[label, value], ...],
    offices: [{flag, label, lines: [...], coords}, ...],
    ceoName, ceoTag, ceoHead, ceoTitle, ceoBody,
    ceoCareer: [{y, c, r}, ...],
    visionTag, visionHead, visionCards: [{label, roman, text, kicker}, ...],
    bizTag, bizHead, bizLead,
    divisions: [
      { key, name, sub, subs: [
        { key, label, tag, title, desc, items: [...], itemGroups: [{label, items}], brands: [{name, note, flag}], partner: {name, note}, chips, oils, spec, ... }
      ]}
    ],
    histTag, histHead, history: [{y, events: [{tag, desc}, ...]}],
    netTag, netHead, netCards: [{flag, country, sub, bullets}, ...],
    contactTag, contactHead, contactLead, contactInfo: [{label, val}, ...],
    form: {name, email, type, msg, submit, sent, types: [...]},
    partnerMarquee: {label, brands},
    russiaMarquee: {label, brands},
    footerDesc, footerCols: [{title, links}, ...],
    copyright
  },
  EN: { ... 동일 구조 ... },
  RU: { ... 동일 구조 ... }
}
```

---

## 🔧 주요 기능

### 1. 관리자 모드
- 접속: URL에 `?admin=1` 추가 또는 단축키 `Ctrl + Shift + A`
- 비밀번호: `petlegend2026` (변경: `admin.jsx` 상단 `__ADMIN_PASSWORD`)
- 편집 가능: Hero / About / CEO / Contact 텍스트 + 로고/CEO 사진
- 저장 위치: 브라우저 LocalStorage (서버 X)
  - `pl-edits-KR`, `pl-edits-EN`, `pl-edits-RU` (텍스트)
  - `pl-image-logo`, `pl-image-ceoPhoto` (base64 이미지)

### 2. 히어로 배경 일러스트 (3개 레이어)
- `MoscowSkyline` — 하단 모스크바 스카이라인 실루엣
- `ContainerShip` — 중앙 컨테이너선
- `EurasiaMap` — 우상단 유라시아 지도 + 모스크바·서울 마킹
- 모두 opacity 0.11~0.13, blur 0.6~0.8px, gold-light 컬러로 통일

### 3. 브랜드 마키 (2개)
- 협력 파트너 — Vision과 Business 섹션 사이
- 러시아 진출 브랜드 — Business와 History 섹션 사이
- 호버 시 일시 정지, 양끝 페이드 마스크

### 4. 카운트업 애니메이션
- 히어로 통계 4개 (13+, 100+, 200+, 1,000+) 가 0에서 카운트업
- `useCountUp` 훅 (`hooks-atoms.jsx`)

### 5. 멀티 사업부 탭
- 펫사업부 (국내 유통 / 러시아 사업)
- 원료사업부 (동물성 유지 / 식물성 유지 / 동물성 사료원료)
- 각 서브탭마다 다른 KEY PARTNER + 비주얼 패널

---

## 🚀 Claude Code 인수인계 - 단계별 작업 지침

### Step 1: Claude Code에서 프로젝트 열기
1. 이 OmiAgent 프로젝트의 **모든 파일을 다운로드** 받음 (전체 ZIP 또는 개별)
2. 로컬 빈 폴더에 압축 해제
3. `claude` CLI 실행하여 작업 시작

### Step 2: Next.js로 마이그레이션 (권장)

Claude Code에 아래 프롬프트를 그대로 입력:

```
이 폴더의 PET LEGEND 사이트를 Next.js 14 (App Router) + TypeScript로 마이그레이션해줘.

요구사항:
1. 현재 파일 구조 그대로 유지하되 확장자를 .tsx로 변경
2. copy.js → app/lib/copy.ts (typed 인터페이스 추가)
3. 모든 JSX 컴포넌트 → React 컴포넌트로 변환 (Babel inline 제거)
4. styles.css → 그대로 사용 또는 CSS Modules로 점진 마이그레이션
5. 다국어는 URL 라우팅 (/kr, /en, /ru) — next-intl 또는 자체 구현
6. 이미지는 next/image 사용
7. 관리자 모드는 그대로 유지하되 인증을 NextAuth로 업그레이드
8. 배포 타겟: Vercel

기존 디자인 시스템(Cormorant + Arial, navy/gold), 모든 텍스트 콘텐츠,
SVG 배경 일러스트, 마키 애니메이션, 카운트업 효과 등을 100% 보존해줘.
```

### Step 3: 백엔드 추가 (선택)

관리자 모드를 LocalStorage 기반 → 실제 데이터베이스로 업그레이드:

```
관리자 모드를 다음과 같이 개선해줘:
1. 모든 텍스트 편집을 PostgreSQL(또는 Supabase)에 저장
2. 이미지는 Cloudinary 또는 S3에 업로드
3. 변경 이력(undo) 지원
4. 다중 관리자 계정 + 권한 분리
5. 실시간 미리보기 (편집 즉시 메인 사이트 반영)
6. 변경사항 발행/비공개 워크플로우
```

### Step 4: 이메일·문의 폼 연동

```
연락처 섹션의 문의 폼을 다음과 같이 작동하도록 연결해줘:
1. 백엔드 API endpoint /api/contact 생성
2. webmaster@petlegend.co.kr로 이메일 전송 (Resend 또는 SendGrid)
3. reCAPTCHA v3로 스팸 방어
4. 제출 데이터를 DB에도 기록 (관리자 모드에서 조회 가능)
5. 자동 회신 이메일 (한·영·러 자동 감지)
```

### Step 5: SEO 및 분석

```
SEO 최적화:
1. 각 섹션을 별도 페이지로 분리 (/about, /ceo, /business, /history, /network, /contact)
2. meta tags, OpenGraph, Twitter Cards (한·영·러 각각)
3. JSON-LD Schema.org Organization 마크업
4. sitemap.xml + robots.txt 자동 생성
5. Google Analytics 4 + Vercel Analytics 연동
6. hreflang 태그 (다국어 SEO)
```

---

## ⚠️ 마이그레이션 시 주의사항

### 보존해야 할 디자인 디테일
- 히어로 배경 3-레이어 (Skyline / Ship / EurasiaMap) — opacity 0.11~0.13 통일
- 마키 호버 시 일시정지 + 양끝 페이드 마스크
- 네비 항목 사이의 세로 구분선
- 숫자 전용 Arial 폰트 (font-variant-numeric: tabular-nums)
- CEO 사진의 골드 라이너 액자 효과
- 그룹 라벨(주요 사업군 / 주요 거래처)의 작은 골드 모노 캡션 스타일
- 카운트업 ease-out cubic 1.8초

### 다국어 동기화 원칙
- **반드시 KR/EN/RU 3개 언어 동시 수정**
- 회사명, 주소, 전화, 이메일은 모든 언어 공통
- 브랜드명(JOYSER, MIRATORG 등)도 공통, 단 노출 시 익명화 가능
- 김재근 = Richard Kim = Ричард Ким (영문/러문 통일)

### 콘텐츠 정확성
- 사업자등록번호: 126-86-71849
- 본사: 경기도 고양시 덕양구 으뜸로 130, 위프라임트윈타워 A동 1308호
- 모스크바: Proizvodstvennaya St., 11s8, Office 8108-8109
- 전화: +82 70 7573 0987 / +7 495 181 6055
- 이메일: webmaster@petlegend.co.kr
- 익명화 대상: "MIRATORG" → "러시아 최대 농식품그룹"

---

## 📦 배포 체크리스트

- [ ] 도메인 연결 (petlegend.co.kr)
- [ ] SSL 인증서 자동 갱신 (Vercel/Cloudflare)
- [ ] 다국어 라우팅 (`/kr`, `/en`, `/ru`)
- [ ] 폼 제출 → 이메일 전송 검증
- [ ] 관리자 비밀번호 환경변수로 분리 + 2FA
- [ ] 이미지 최적화 (WebP, 사이즈별 다운로드)
- [ ] 모바일 검증 (현재 < 1024px에서 일부 숨김 처리 있음)
- [ ] Google Search Console 등록
- [ ] 네이버 웹마스터도구 등록 (한국 SEO)
- [ ] Yandex 등록 (러시아 SEO)
- [ ] 백업 정책 (DB + 이미지 일일 백업)
- [ ] 모니터링 (Sentry / LogRocket)

---

## 💡 향후 기능 아이디어

1. **실시간 환율 위젯** — KRW/RUB 환율을 히어로에 표시 (무역 회사 분위기)
2. **컨테이너 추적 시뮬레이터** — 실제 부산→블라디보스토크 항로 애니메이션
3. **PDF 회사소개서 자동 생성** — 다국어 PDF 다운로드
4. **제품 카탈로그 페이지** — JOYSER, Pure Nature 등 각 브랜드 상세
5. **뉴스/공지사항** — Press Room 페이지
6. **채용 페이지** — 인재 영입 정보
7. **CMS 통합** — Strapi 또는 Sanity로 비개발자 편집 환경

---

작성: 2026-05-24
