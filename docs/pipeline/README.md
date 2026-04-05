# 전체 유지보수 파이프라인 가이드 (운영자용)

이 문서는 Lab-LVM 사이트를 **지속 운영**할 때 필요한 전체 흐름을 한 번에 설명합니다.  
목표는 “무엇을 수정하고, 어떤 명령을 실행하고, 무엇이 자동 생성되며, GitHub Pages에 어떻게 반영되는지”를 명확히 이해하는 것입니다.

> 전제: 이 프로젝트는 **GitHub Pages 정적 사이트**입니다. 서버/DB/CMS 없이 파일 + 빌드 + GitHub Actions로 운영합니다.

---

## 1) 먼저 이해할 운영 구조

운영 대상은 크게 4개입니다.

1. 뉴스
2. 논문
3. 사진
4. People(교수/학생/인턴/졸업생)

주요 원칙:

- 운영자는 **원본 콘텐츠 파일만 수정**합니다.
- 생성 파일은 스크립트가 다시 만들기 때문에 직접 수정하지 않습니다.

---

## 2) 어떤 파일을 직접 수정하는가 / 자동 생성되는가

## 2-1. 운영자가 직접 수정하는 경로 (Hand-edited)

1. 뉴스 원본
    - `content/news/*.md`
2. 논문 원본
    - `content/publications/**/*.md`
3. 사진 원본 + 선택 메타데이터
    - `content/photos/raw/**`
    - `content/photos/metadata.json` (선택)
4. People 데이터
    - `src/assets/dataset/people.json`
    - `src/assets/images/people/people_image_index.js` (사람 사진 연결 시)

## 2-2. 자동 생성되는 경로 (Auto-generated)

1. 동기화 결과(JSON)
    - `src/generated/news.generated.json`
    - `src/generated/publications.generated.json`
    - `src/generated/photos.generated.json`
2. 사진 최적화 결과
    - `public/uploads/photos/...`
3. 빌드 산출물
    - `dist/...`

## 2-3. 직접 수정 금지 경로

- `src/generated/*`
- `public/uploads/photos/*`
- `dist/*`

이 경로들은 직접 고치는 대신, `content:sync` / `photos:sync` / `build`로 재생성해야 합니다.

---

## 3) 전체 유지보수 흐름(처음 맡은 사람용)

아래 순서대로 진행하면 안전합니다.

1. 뉴스 추가/수정
    - `content/news/*.md`
2. 논문 추가/수정
    - `content/publications/**/*.md`
3. 사진 원본 추가
    - `content/photos/raw/<category>/<YYYY-MM-DD>__<slug>/...`
4. People 정보 수정
    - `src/assets/dataset/people.json`
    - 필요 시 `src/assets/images/people/people_image_index.js`
5. 콘텐츠 동기화
    ```bash
    npm run content:sync
    ```
6. 콘텐츠 검증
    ```bash
    npm run validate:content
    ```
7. 로컬 확인(개발 서버)
    ```bash
    npm run dev
    ```
8. 빌드 확인
    ```bash
    npm run build
    ```
9. Git commit / push
10. GitHub Actions 배포 확인
    - `Content Build Check`
    - `Deploy GitHub Pages`

---

## 4) 운영 명령어(실제 프로젝트 기준)

아래는 `package.json` 기준 실제 명령어입니다.

```bash
# (초기 1회 권장) 레거시 데이터에서 content 구조 생성 보조
npm run content:bootstrap

# 뉴스/논문/사진 전체 동기화 (generated JSON 갱신)
npm run content:sync

# 사진만 동기화(리사이즈/최적화/manifest)
npm run photos:sync

# 스키마/형식 검증
npm run validate:content

# 로컬 개발 서버 실행
npm run dev

# 프로덕션 빌드 (prebuild에서 validate:content 자동 실행)
npm run build

# 빌드 결과 로컬 프리뷰
npm run preview

# 운영자용 종합 점검(동기화 + 빌드)
npm run operator:verify
```

---

## 5) 사진 최적화 파이프라인은 어떻게 동작하는가

사진은 원본만 넣으면 자동으로 파생 산출물이 생성됩니다.

1. 입력: `content/photos/raw/**`
2. 실행: `npm run photos:sync` (또는 `npm run content:sync`)
3. 출력:
    - 갤러리용 썸네일
    - 확대보기용 큰 이미지
    - `src/generated/photos.generated.json`
4. UI 사용:
    - 목록: 썸네일 사용
    - 라이트박스: 큰 이미지 사용

즉, 운영자는 사진 import 코드/컴포넌트 코드를 수동으로 추가하지 않아도 됩니다.

---

## 6) 검증(Validation)은 무엇을 확인하는가

`npm run validate:content`는 다음을 점검합니다.

1. 필수 필드 누락 여부
2. 날짜 형식(`YYYY-MM-DD`)
3. 링크 형식(`http://`, `https://`)
4. 콘텐츠 구조 스키마 오류

검증에서 실패하면 배포 전에 반드시 수정해야 합니다.

---

## 7) GitHub Pages 배포 흐름

현재 배포는 GitHub Actions로 자동화되어 있습니다.

## 7-1. 어떤 워크플로우가 동작하는가

1. `.github/workflows/content-build.yml`
    - 이름: `Content Build Check`
    - 트리거: `main` push, PR
    - 수행: `content:sync` → `validate:content` → `build`
2. `.github/workflows/deploy-pages.yml`
    - 이름: `Deploy GitHub Pages`
    - 트리거: `main` push, 수동 실행
    - 수행: `content:sync` → `validate:content` → `build` → `gh-pages` 배포

## 7-2. push 후 무슨 일이 일어나는가

1. `main`에 push
2. Actions가 Node 설치 + 의존성 설치
3. 콘텐츠 동기화/검증/빌드 수행
4. `dist`가 `gh-pages`에 게시됨
5. GitHub Pages URL에 반영됨

## 7-3. 배포 완료 확인 방법

1. GitHub 저장소 → `Actions` 탭
2. 최신 실행에서 아래 2개가 성공(초록)인지 확인
    - `Content Build Check`
    - `Deploy GitHub Pages`
3. 사이트에서 변경된 내용 확인
    - Home 미리보기
    - `/news`, `/publication`, `/photo`, `/people`

## 7-4. 오래된 내용이 계속 보일 때

1. 브라우저 강력 새로고침 (`Ctrl+F5` / `Cmd+Shift+R`)
2. Actions 재실행 여부 확인
3. 실패 로그 확인
4. 콘텐츠 파일 오타/형식 오류 수정 후 재푸시

---

## 8) 절대 수정하면 안 되는 것

다음은 운영자가 직접 편집하지 않는 것이 원칙입니다.

1. `src/generated/*.generated.json`
    - 수동 수정 금지, 동기화로 재생성
2. `public/uploads/photos/*`
    - 수동 수정 금지, `photos:sync`로 재생성
3. `dist/*`
    - 수동 수정 금지, `build`로 재생성
4. 배포 워크플로우 파일(`.github/workflows/*`)
    - 운영 목적(콘텐츠 수정)에서는 함부로 변경 금지
5. 페이지 컴포넌트(`src/components/tabs/*`)
    - 콘텐츠 운영 단계에서 불필요한 코드 수정 금지

---

## 9) 점검 체크리스트

## 9-1. 뉴스 추가 체크리스트

1. `content/news/*.md`에 파일 추가
2. 필수 필드(`id/type/title/summary/date`) 입력
3. 날짜 형식 확인
4. 외부 링크면 `is_external: true` + `external_url`
5. `npm run content:sync`
6. `npm run validate:content`

## 9-2. 논문 추가 체크리스트

1. `content/publications/<category>/*.md` 추가
2. `category` 허용값 확인
3. 필수 필드 입력
4. `npm run content:sync`
5. `npm run validate:content`

## 9-3. 사진 추가 체크리스트

1. `content/photos/raw/...`에 원본 추가
2. 필요 시 `content/photos/metadata.json` 수정
3. `npm run photos:sync` (또는 `content:sync`)
4. `npm run validate:content`
5. `/photo` 페이지에서 썸네일/확대보기 확인

## 9-4. People 수정 체크리스트

1. `src/assets/dataset/people.json` 수정
2. 섹션 이동 시 기존 섹션에서 제거(중복 방지)
3. 사진 교체 시 `people_image_index.js` 매핑 확인
4. 링크 URL 형식 확인
5. `npm run build`로 JSON/렌더링 오류 확인

## 9-5. 배포 전 체크리스트

1. `npm run content:sync`
2. `npm run validate:content`
3. `npm run build`
4. 필요 시 `npm run preview`
5. 변경사항 커밋/푸시

## 9-6. 배포 후 확인 체크리스트

1. Actions 2개 성공 여부 확인
2. 실제 사이트 반영 확인
3. 주요 경로 확인
    - `/news`, `/publication`, `/photo`, `/people`
4. 캐시 문제 시 강력 새로고침

---

## 10) 관련 문서 바로가기

- 운영 총괄: `docs/README.md`
- 뉴스: `docs/news/README.md`
- 논문: `docs/publications/README.md`
- 사진: `docs/photos/README.md`
- People: `docs/people/README.md`
- 배포: `docs/deployment/README.md`
- 문제 해결: `docs/troubleshooting/README.md`
