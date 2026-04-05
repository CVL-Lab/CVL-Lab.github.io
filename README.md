# CVL-Lab 웹사이트

CVL-Lab 웹사이트를 위한 React + Vite 단일 페이지 애플리케이션입니다.

## 운영 문서

콘텐츠 운영 문서는 `docs/`에 분리되어 있습니다.

- 총괄: `docs/README.md`
- 파이프라인(전체 운영 흐름): `docs/pipeline/README.md`
- 뉴스: `docs/news/README.md`
- 논문: `docs/publications/README.md`
- 사진: `docs/photos/README.md`
- People: `docs/people/README.md`
- 배포: `docs/deployment/README.md`
- 문제 해결: `docs/troubleshooting/README.md`
- 템플릿: `docs/templates/README.md`

## 로컬 개발

```bash
npm install
npm run dev
```

## 프로덕션 빌드

```bash
npm run build
```

## 콘텐츠 운영 (GitHub Pages static workflow)

이 프로젝트는 장기 운영 콘텐츠와 UI 코드를 분리해서 관리합니다.

- `content/news` (Markdown + frontmatter)
- `content/publications` (Markdown + frontmatter)
- `content/photos/raw` (raw originals)
- `src/generated` (generated manifests consumed by React)
- `public/uploads/photos` (optimized photo outputs)

주요 명령어:

```bash
npm run content:bootstrap   # one-time migration helper from legacy JSON/assets
npm run content:sync        # regenerate news/publications/photos outputs
npm run validate:content    # schema/date/link validation
npm run photos:sync         # photo resize + manifest only
npm run operator:verify     # operator-friendly check (sync + build)
```

`npm run build`는 먼저 `validate:content`를 실행합니다.

## Static prerender build

클라이언트 내비게이션과 hydration을 유지하면서 route 단위 HTML 파일(예: `/news/index.html`, `/research/index.html`)을 생성합니다.

```bash
npm run build:static
```

prerender 대상 route 목록은 `src/routes/routeDefinitions.js`에 정의되어 있습니다.

prerender output을 GitHub Pages로 배포하려면:

```bash
npm run deploy:static
```

## GitHub Pages 배포 참고 (SPA routing 대응)

이 프로젝트에는 GitHub Pages용 SPA fallback이 포함되어 있습니다.

- `public/404.html` redirects unknown routes back to `index.html` using a query token.
- `index.html` restores the original route before React bootstraps.

다음 문제가 해결됩니다:

- nested route 직접 URL 접근
- nested route 새로고침
- 이전에 404가 발생하던 nested route에서 브라우저 뒤로/앞으로 이동

### GitHub Pages base path 설정

repository path(예: `https://<user>.github.io/<repo>/`)로 배포하는 경우, 빌드 시 base path를 지정하세요.

```bash
VITE_BASE_PATH=/<repo>/ npm run build
```

Static prerender output의 경우:

```bash
VITE_BASE_PATH=/<repo>/ npm run build:static
```

`src/main.jsx`는 `import.meta.env.BASE_URL`을 읽어 `BrowserRouter`의 `basename`에 적용하므로, 해당 base path에서도 routing이 올바르게 동작합니다.

## GitHub Actions (콘텐츠 + 배포)

- `Content Build Check`: validates content sync + build on push/PR
- `Deploy GitHub Pages`: deploys `dist` to `gh-pages` on push to `main`
