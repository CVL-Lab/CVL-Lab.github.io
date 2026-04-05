# SSG 준비 상태 메모

이 프로젝트는 기존 콘텐츠와 디자인을 유지하면서, route 단위 static HTML을 생성하는 **SSR + prerender pipeline**이 동작하는 상태입니다.

## 현재 동작하는 항목

### 1) route 단위 prerender 출력

- `npm run build:static` 실행 시 다음 파일이 생성됩니다:
    - `dist/index.html`
    - `dist/news/index.html`
    - `dist/research/index.html`
    - `dist/publication/index.html`
    - `dist/people/index.html`
    - `dist/photo/index.html`
    - `dist/contact/index.html`
    - `dist/join/index.html`
    - `dist/test/index.html`
- route 목록은 `src/routes/routeDefinitions.js`에서 일원화해 관리합니다.

### 2) client + prerender용 명시적 route manifest

- Client (lazy pages): `src/routes/pageManifest.jsx`
- Prerender (eager pages): `src/routes/pageManifest.ssg.jsx`
- Client routes: `src/routes/AppRoutes.jsx`
- Prerender routes: `src/routes/AppRoutes.ssg.jsx`
- 공통 base-path helper: `src/routes/routerBasename.js`

### 3) server render entry와 prerender script

- SSR entry: `src/ssg/entry-server.jsx`
- prerender tool: `scripts/prerender.mjs`
- 빌드 스크립트:
    - `build:client`
    - `build:ssr`
    - `prerender`
    - `build:static`
- `entry-server`는 prerender 시 router `basename`을 적용하므로, subpath 배포(예: GitHub Pages repository path)에서도 생성 링크가 올바르게 유지됩니다.

### 4) hydration 안전한 앱 부트스트랩

- `src/main.jsx`는 prerender된 HTML이 있으면 `hydrateRoot`로 hydration하고, 없으면 `createRoot`로 일반 client 렌더링을 수행합니다.

## 현재 아키텍처 분리 상태 (SSG 중심)

### 공통 셸/레이아웃

- `App.jsx` / `App.ssg.jsx`
- `src/components/Nav.jsx`
- `src/components/MainContent.jsx`
- `src/components/Footer.jsx`

### route/page 콘텐츠

- `src/pages/*` wrappers
- `src/components/tabs/*` page bodies

### 로컬 콘텐츠 데이터 (빌드 시점 친화)

- 로컬 JSON: `src/assets/dataset/`
- 데이터 정규화 헬퍼: `src/utils/` (예: `newsData.js`, `peopleData.js`)

### client 전용 인터랙션 요소

- 사진 갤러리/라이트박스 동작
- 스크롤 reveal observer
- 스크롤 진행도 / 맨 위로 이동 동작
- 모바일 내비게이션 열림/닫힘 상태
- route 전환 효과

## “완전 정적 + island hydration”을 막는 현재 제약

1. **Hydration이 아직 앱 전체 단위입니다**
    - 사이트는 `#root`에서 전체 React 트리를 hydration합니다.
    - React SPA + prerender에서는 일반적이지만, 선택적 island hydration은 아닙니다.

2. **Client 전용 로직이 React page/components 내부에 포함되어 있습니다**
    - 인터랙션 모듈이 컴포넌트 경계로 분리되어 있어도, 하나의 루트 앱 안에 함께 마운트됩니다.

3. **Router가 client-first(`BrowserRouter`) 구조를 유지합니다**
    - prerender된 HTML + client 내비게이션 조합에서는 잘 동작합니다.
    - framework 수준 islands와 page별 server routing semantics까지 고려하면, 전용 SSG framework가 장기적으로 더 깔끔한 선택입니다.

## 권장 최종 방향

### 옵션 A (변경 최소, 현재 권장)

Vite + React를 유지하면서 현재 prerender 파이프라인을 확장합니다:

1. route definition을 단일 기준(Single Source of Truth)으로 유지합니다.
2. non-dynamic route를 계속 prerender합니다.
3. 인터랙션 기능은 가능한 범위에서 client 모듈로 지연 로드합니다.

### 옵션 B (진짜 island hydration, 다음 메이저 전환)

셸/페이지를 island를 지원하는 SSG 프레임워크(예: Astro)로 마이그레이션합니다:

1. 기존 JSON/content와 CSS 토큰을 유지합니다.
2. 인터랙션 파트는 React 컴포넌트를 island로 재사용합니다.
3. 기본은 정적 HTML을 렌더링하고, modal/nav/motion 위젯만 hydrate합니다.

이 방식이 현재 콘텐츠와 디자인을 유지하면서 진짜 선택적 hydration으로 가는 가장 깔끔한 경로입니다.
