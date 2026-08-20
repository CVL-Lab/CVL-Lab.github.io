# Research 운영 가이드 (영역·상세)

이 문서는 Research tab을 처음 관리하는 운영자가 코드 구조를 추측하지 않고 영역과 상세 정보를 안전하게 수정하는 절차를 설명합니다.

> "Lab Resources & Infrastructure" 카드는 별도의 Resources tab(`/resources`)으로 분리되었습니다. 해당 내용은 [`docs/resources/README.md`](../resources/README.md)를 참고하세요.

---

## 1) 먼저 알아야 할 source of truth

| 목적 | 직접 수정하는 원본 |
| --- | --- |
| 영역 이름, 순서, URL, 요약, 키워드, 대표 이미지 | `src/assets/dataset/research_areas.json` |
| Research Area Details | `src/assets/dataset/research_area_details.json` |
| 영역 대표 이미지 | `src/assets/images/research_concepts/optimized/*.webp` |
| Publication 원본 | `content/publications/<area_key>/*.md` |

Lab Resources & Infrastructure 카드(`research_resources.json`)는 Resources tab 소관입니다. [`docs/resources/README.md`](../resources/README.md)를 참고하세요.

`src/utils/researchData.js`, route 목록과 화면 component는 위 데이터를 읽어 자동으로 구성합니다. 일반적인 콘텐츠 수정에서는 이 코드들을 직접 고치지 않습니다.

---

## 2) canonical key 규칙

영역 key는 화면 내용과 같은 의미의 영문 `snake_case`를 사용합니다. URL slug는 같은 key의 `_`를 `-`로 바꾼 값이어야 합니다.

| canonical key | URL slug | 화면 제목 |
| --- | --- | --- |
| `computer_vision_and_learning_algorithms` | `computer-vision-and-learning-algorithms` | Computer Vision and Learning Algorithms |
| `efficient_learning_for_llms` | `efficient-learning-for-llms` | Efficient Learning for LLMs |
| `robot_learning` | `robot-learning` | Robot Learning |
| `industrial_and_medical_ai` | `industrial-and-medical-ai` | Industrial and Medical AI |

예전 `core_ai`, `multi-modal_ai`, `application_ai`, `biomedical_ai` 같은 이름은 새 데이터 key로 사용하지 않습니다. 기존 링크 호환을 위한 `legacy_aliases`에만 남깁니다.

이 key는 다음 위치에서 동일해야 합니다.

1. `research_areas.json`의 `meta.area_order`
2. `research_areas.json`의 `areas.<area_key>`
3. `research_area_details.json`의 `topics.<area_key>`
4. 관련 Publication의 `category`

`npm run research:validate`가 이 일치 여부를 검사합니다.

---

## 3) research_areas.json 구조

```json
{
  "meta": {
    "schema_version": "2.0",
    "area_order": ["new_research_area"]
  },
  "areas": {
    "new_research_area": {
      "slug": "new-research-area",
      "title": "New Research Area",
      "subtitle": ["Topic A", "Topic B"],
      "explanation": "카드와 상세 상단에 사용하는 한두 문장 설명",
      "tags": ["Topic A", "Topic B"],
      "legacy_aliases": [],
      "images": {
        "default": "new-research-area.webp",
        "landscape": "new-research-area-landscape.webp",
        "wide": "new-research-area-wide.webp",
        "alt": "이미지가 전달하는 연구 흐름을 설명하는 대체 텍스트"
      }
    }
  }
}
```

### 필드 의미

- `area_order`: Home과 Research tab의 표시 순서
- `slug`: `/research/<slug>` 상세 URL
- `title`: 탭과 카드 제목
- `subtitle`, `tags`: 키워드 chip
- `explanation`: 영역 소개
- `legacy_aliases`: 과거 key/slug로 들어온 사용자를 새 영역으로 연결할 때만 사용
- `images.default`: 넓은 화면의 기본 이미지
- `images.landscape`: 중간/작은 화면용 이미지
- `images.wide`: Home Research 카드용 이미지
- `images.alt`: 이미지가 전달하는 의미를 설명하는 문장

`slug`는 반드시 key의 `_`를 `-`로 바꾼 값이어야 합니다. 이 규칙 덕분에 새 영역을 추가할 때 route 코드를 별도로 수정하지 않아도 됩니다.

---

## 4) Research Area Details 구조

`research_area_details.json`의 동일한 key 아래에 상세 내용을 작성합니다.

```json
{
  "topics": {
    "new_research_area": {
      "headline": "영역의 핵심 목표",
      "abstract": "연구 범위와 문제의식을 설명하는 문단",
      "focus_areas": [
        {
          "title": "Focus Area Title",
          "description": "이 세부 연구 주제를 한 문장으로 설명"
        }
      ]
    }
  }
}
```

- `headline`, `abstract`: Abstract 영역(이미지 5 : 텍스트 5 비율)에 표시되는 소개
- `focus_areas`: 세부 연구 주제 카드 배열. 각 카드는 위에서부터 이미지(현재는 공용 샘플 이미지 `focus-sample.svg`), `title`, `description` 순으로 표시됨
- 화면은 `focus_areas`를 3컬럼 그리드로 표시하며(좁은 화면은 2컬럼 → 1컬럼으로 자동 축소), 현재 각 영역당 3개를 유지 중
- `title`은 영역 내에서 중복될 수 없음 (`npm run research:validate`가 검사)

빈 placeholder를 만들지 말고, 실제로 공개 가능한 내용이 있을 때 추가합니다.

---

## 5) 사용자 시나리오

### A. 기존 영역의 제목·설명·키워드 수정

1. `research_areas.json`에서 대상 key를 찾습니다.
2. `title`, `explanation`, `tags`를 수정합니다.
3. 제목 의미가 달라졌다면 key와 slug를 그대로 둘 수 있는 단순 문구 변경인지 먼저 판단합니다.
4. 아래 명령으로 확인합니다.

```bash
npm run research:validate
npm run build
```

key/slug 변경은 공개 URL과 Publication category에 영향을 주므로 시나리오 F를 따릅니다.

### B. Research Area Detail 내용 수정

1. `research_area_details.json`에서 동일한 canonical key를 찾습니다.
2. `headline`, `abstract`, `focus_areas`(각 `title`+`description`)를 수정합니다.
3. 같은 `focus_areas[].title`을 중복해서 넣지 않습니다.
4. 실제 Research tab에서 탭 전환과 모바일 줄바꿈을 확인합니다.

```bash
npm run research:validate
npm run dev
```

### C. 새 Research Area 추가

예: `foundation_models_for_science`

1. `research_areas.json`의 `meta.area_order`에서 표시할 위치에 key를 추가합니다.
2. `areas.foundation_models_for_science`를 추가합니다.
3. `slug`를 `foundation-models-for-science`로 지정합니다.
4. `research_area_details.json`에 같은 key의 상세 내용을 추가합니다.
5. 아래 WebP 파일을 준비하고 `images`에 파일명을 기록합니다.

```text
src/assets/images/research_concepts/optimized/
  foundation-models-for-science.webp
  foundation-models-for-science-landscape.webp
  foundation-models-for-science-wide.webp
```

6. 관련 Publication을 등록한다면 아래 폴더를 만들고 frontmatter의 `category`에도 같은 key를 사용합니다.

```text
content/publications/foundation_models_for_science/
```

7. 검증과 정적 build를 실행합니다.

```bash
npm run research:validate
npm run content:sync
npm run validate:content
npm run build:static
```

route와 정적 prerender 경로는 catalog에서 자동 생성됩니다. `routeDefinitions.js`에 같은 URL을 수동으로 추가하지 않습니다.

### D. Research Area 표시 순서 변경

`research_areas.json`의 `meta.area_order` 순서만 변경합니다. `areas`와 `topics`의 객체 순서를 손으로 맞출 필요는 없습니다.

변경 후 Home Research 카드와 Research Detail 탭의 순서를 모두 확인합니다.

### E. Research Area 이미지 교체

1. 기존 WebP를 같은 파일명으로 교체하거나 새 파일명을 사용합니다.
2. 새 파일명이면 `research_areas.json`의 `images` 값을 수정합니다.
3. `default`, `landscape`, `wide` 세 파일이 모두 존재하는지 확인합니다.
4. `alt`도 새 이미지의 의미에 맞게 수정합니다.

```bash
npm run research:validate
npm run build
```

이미지는 장식 설명이 아니라 연구 흐름을 전달해야 하며, `alt`에는 화면 제목을 반복하는 대신 이미지가 보여주는 관계를 적습니다.

### F. 영역 이름 또는 key 변경

key 변경은 다음 항목을 하나의 변경으로 처리합니다.

1. `meta.area_order`
2. `areas` 객체 key와 `slug`
3. `topics` 객체 key
4. Publication 폴더와 각 파일의 `category`
5. 기존 key/slug를 새 영역의 `legacy_aliases`에 추가
6. 이미지 파일명 또는 `images` 매핑

기존 Publication의 `id`는 외부 검색과 News 연결에 사용될 수 있으므로 category를 바꾼다는 이유로 함께 변경하지 않습니다.

### G. 영역 삭제

1. 공개할 필요가 없는지와 관련 Publication 처리 방향을 먼저 결정합니다.
2. `area_order`, `areas`, `topics`에서 같은 key를 제거합니다.
3. 관련 Publication을 다른 유효 category로 이동하거나 함께 제거합니다.
4. 더 이상 참조되지 않는 영역 이미지를 제거합니다.
5. 기존 공개 URL을 유지해야 한다면 삭제 대신 적절한 영역으로 redirect하는 별도 코드 변경이 필요합니다.

검증기가 남은 고아 detail이나 잘못된 Publication category를 오류로 보고합니다.

### H. Research와 Publication category 연결

Publication `category`는 Research canonical key 중 하나여야 합니다.

```yaml
category: industrial_and_medical_ai
```

이 값은 Publication 필터, 카드 badge와 Home Publication preview의 영역 제목에 사용됩니다. `core`, `biomedical` 같은 과거 category는 새 파일에 사용하지 않습니다.

---

## 6) 로컬 확인과 배포

```bash
git switch main
git pull --ff-only
npm ci

npm run research:validate
npm run content:sync
npm run validate:content
npm run audit:dependencies
npm run build:static
npm run dev
```

로컬에서 다음을 확인합니다.

1. `/research`의 모든 탭
2. 각 `/research/<slug>` 직접 접속과 새로고침
3. 키보드 `←`, `→`, `Home`, `End` 탭 이동
4. Home의 Research Areas 카드
5. `/publication`의 category 필터와 관련 badge
6. 좁은 화면에서 탭·카드·긴 제목의 줄바꿈

확인 후 필요한 원본과 생성된 Publication/News JSON을 커밋하고 `main`에 push합니다. GitHub Actions의 `Content Build Check`와 `Deploy GitHub Pages`가 모두 성공한 뒤 실제 사이트를 확인합니다.

---

## 7) 오류 메시지 해석

- `Area keys must match`: `area_order`, `areas`, `topics` 중 한 곳의 key가 빠짐
- `slug must be ...`: snake_case key와 kebab-case URL이 불일치
- `Missing image`: `images`에 기록한 WebP 파일이 없음
- `unsupported category`: Publication category가 현재 Research area key가 아님
- `duplicate values`: order 또는 focus area title 중복

Resource 관련 오류 메시지(`image_key ... is not defined` 등)는 [`docs/resources/README.md`](../resources/README.md)를 참고하세요.

---

## 8) 배포 전 체크리스트

1. key가 제목의 의미와 일치하는가?
2. key는 `snake_case`, slug는 같은 단어의 `kebab-case`인가?
3. `area_order`, `areas`, `topics`, Publication category가 일치하는가?
4. 이미지 세 variant와 의미 있는 alt가 있는가?
5. 상세 내용은 실제 공개 가능한 연구와 목표를 설명하는가?
6. `npm run research:validate`가 통과하는가?
7. `npm run build:static`이 모든 Research route를 prerender하는가?
8. Home, Research, Publication에서 같은 영역명이 표시되는가?
9. push 후 두 GitHub Actions가 성공했는가?

Lab Resources & Infrastructure 관련 체크리스트는 [`docs/resources/README.md`](../resources/README.md)를 참고하세요.
