# Research 운영 가이드 (영역·상세·리소스)

이 문서는 Research tab을 처음 관리하는 운영자가 코드 구조를 추측하지 않고 영역, 상세 정보, Lab Resources & Infrastructure를 안전하게 수정하는 절차를 설명합니다.

---

## 1) 먼저 알아야 할 source of truth

| 목적 | 직접 수정하는 원본 |
| --- | --- |
| 영역 이름, 순서, URL, 요약, 키워드, 대표 이미지 | `src/assets/dataset/research_areas.json` |
| Research Area Details | `src/assets/dataset/research_area_details.json` |
| Lab Resources & Infrastructure 카드 | `src/assets/dataset/research_resources.json` |
| 영역 대표 이미지 | `src/assets/images/research_concepts/optimized/*.webp` |
| Resource 카드가 참조하는 공용 이미지 정보 | `src/assets/dataset/home_media.json` |
| 공용 이미지의 실제 import/path 연결 | `src/assets/images/home/home_media_index.js` |
| Publication 원본 | `content/publications/<area_key>/*.md` |

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
      "workstreams": [
        {
          "title": "Current Workstream",
          "description": "현재 수행하는 연구와 방법"
        }
      ],
      "applications": [
        "대표 적용 방향"
      ],
      "milestones": [
        "검증 가능한 단기 목표"
      ]
    }
  }
}
```

- `headline`, `abstract`: 상세 영역의 소개
- `workstreams`: Current Workstreams 카드
- `applications`: Application Directions 목록
- `milestones`: Near-term Milestones 목록

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
2. `headline`, `abstract`, `workstreams`, `applications`, `milestones`를 수정합니다.
3. 같은 workstream title을 중복해서 넣지 않습니다.
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

### H. Lab Resource 수량·설명 수정

`research_resources.json`에서 대상 item의 다음 값을 수정합니다.

- `meta.home_summary`: Home 소개 카드에 표시할 짧은 요약
- `label`: 카드 제목
- `value`: 공개할 장비 수량/모델
- `description`: 용도
- `image_key`: 공용 이미지 key

수량과 장비명은 실제 근거를 확인한 값만 게시합니다. Resource 수량을 바꾸면 `meta.home_summary`도 같은 사실을 반영하도록 함께 수정합니다. 확인되지 않은 예상 수량을 placeholder로 넣지 않습니다.

```bash
npm run research:validate
npm run build
```

### I. Lab Resource 카드 추가·삭제·순서 변경

- 추가: `items` 배열에 고유한 `id`를 가진 객체 추가
- 삭제: 해당 객체 제거
- 순서 변경: `items` 배열 순서 변경

`image_key`는 `home_media.json`의 `items`에 존재해야 합니다. 기존 이미지를 재사용할 때는 사용 가능한 key를 선택하면 됩니다.

새 공용 이미지를 추가해야 한다면:

1. 이미지 파일 또는 Photo pipeline 결과를 준비합니다.
2. `home_media.json`에 의미 있는 `image_key`, 설명과 alt를 추가합니다.
3. `home_media_index.js`에 같은 key의 실제 import/path를 연결합니다.
4. `research_resources.json`에서 그 key를 사용합니다.

### J. Research와 Publication category 연결

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
6. Lab Resources & Infrastructure 카드와 이미지
7. 좁은 화면에서 탭·카드·긴 제목의 줄바꿈

확인 후 필요한 원본과 생성된 Publication/News JSON을 커밋하고 `main`에 push합니다. GitHub Actions의 `Content Build Check`와 `Deploy GitHub Pages`가 모두 성공한 뒤 실제 사이트를 확인합니다.

---

## 7) 오류 메시지 해석

- `Area keys must match`: `area_order`, `areas`, `topics` 중 한 곳의 key가 빠짐
- `slug must be ...`: snake_case key와 kebab-case URL이 불일치
- `Missing image`: `images`에 기록한 WebP 파일이 없음
- `image_key ... is not defined`: Resource가 존재하지 않는 Home media key를 참조
- `unsupported category`: Publication category가 현재 Research area key가 아님
- `duplicate values`: order, resource id 또는 workstream title 중복

---

## 8) 배포 전 체크리스트

1. key가 제목의 의미와 일치하는가?
2. key는 `snake_case`, slug는 같은 단어의 `kebab-case`인가?
3. `area_order`, `areas`, `topics`, Publication category가 일치하는가?
4. 이미지 세 variant와 의미 있는 alt가 있는가?
5. 상세 내용은 실제 공개 가능한 연구와 목표를 설명하는가?
6. Resource 수량·모델·설명이 현재 사실과 일치하는가?
7. `npm run research:validate`가 통과하는가?
8. `npm run build:static`이 모든 Research route를 prerender하는가?
9. Home, Research, Publication에서 같은 영역명이 표시되는가?
10. push 후 두 GitHub Actions가 성공했는가?
