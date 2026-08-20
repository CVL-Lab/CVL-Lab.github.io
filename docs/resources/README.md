# Resources 운영 가이드 (Lab Resources & Infrastructure)

이 문서는 **Resources tab**(`/resources`, "Lab Resources & Infrastructure" 카드)만 유지보수할 때 필요한 실무 가이드입니다.

> Resources tab은 원래 Research tab 하단에 있던 "Lab Resources & Infrastructure" 섹션을 별도 메뉴로 분리한 것입니다. 데이터 원본과 검증 스크립트는 Research 파이프라인(`research_resources.json`, `npm run research:validate`)을 그대로 공유합니다.

---

## 1) 먼저 알아야 할 source of truth

| 목적 | 직접 수정하는 원본 |
| --- | --- |
| Lab Resources & Infrastructure 카드(제목/수량/설명) | `src/assets/dataset/research_resources.json` |
| Resource 카드가 참조하는 공용 이미지 정보 | `src/assets/dataset/home_media.json` |
| 공용 이미지의 실제 import/path 연결 | `src/assets/images/home/home_media_index.js` |
| 화면 렌더링 component | `src/components/tabs/Resources.jsx`, `src/components/tabs/Resources.css` |
| 데이터 조회 유틸 | `src/utils/researchData.js`의 `getResearchResources()` |

`getResearchResources()`는 이름이 `research`로 시작하지만 Research tab이 아니라 Resources tab에서만 사용됩니다(과거 이름을 그대로 유지 중).

---

## 2) research_resources.json 구조

```json
{
    "meta": {
        "schema_version": "1.0",
        "home_summary": "144 GPUs, 1 Robot"
    },
    "items": [
        {
            "id": "gpu",
            "label": "GPU Nodes",
            "value": "144 x NVIDIA GPU",
            "description": "Dedicated training nodes for large-scale vision and learning experiments.",
            "image_key": "resource_gpu_nodes"
        }
    ]
}
```

### 필드 의미

- `meta.home_summary`: Home 소개 카드에 표시할 짧은 요약 (예: `"144 GPUs, 1 Robot"`)
- `items[].id`: 고유 식별자, 중복 불가
- `items[].label`: 카드 제목
- `items[].value`: 공개할 장비 수량/모델
- `items[].description`: 용도 설명
- `items[].image_key`: `home_media.json`의 `items`에 존재해야 하는 공용 이미지 key

---

## 3) 사용자 시나리오

### A. Resource 수량·설명 수정

`research_resources.json`에서 대상 item의 다음 값을 수정합니다.

- `meta.home_summary`
- `label`
- `value`
- `description`
- `image_key`

수량과 장비명은 실제 근거를 확인한 값만 게시합니다. Resource 수량을 바꾸면 `meta.home_summary`도 같은 사실을 반영하도록 함께 수정합니다. 확인되지 않은 예상 수량을 placeholder로 넣지 않습니다.

```bash
npm run research:validate
npm run build
```

### B. Resource 카드 추가·삭제·순서 변경

- 추가: `items` 배열에 고유한 `id`를 가진 객체 추가
- 삭제: 해당 객체 제거
- 순서 변경: `items` 배열 순서 변경 (배열 순서가 곧 카드 노출 순서)

`image_key`는 `home_media.json`의 `items`에 존재해야 합니다. 기존 이미지를 재사용할 때는 사용 가능한 key를 선택하면 됩니다.

새 공용 이미지를 추가해야 한다면:

1. 이미지 파일 또는 Photo pipeline 결과를 준비합니다.
2. `home_media.json`에 의미 있는 `image_key`, 설명과 alt를 추가합니다.
3. `home_media_index.js`에 같은 key의 실제 import/path를 연결합니다.
4. `research_resources.json`에서 그 key를 사용합니다.

### C. Resource 카드 이미지 교체

1. `home_media_index.js`에서 해당 `image_key`가 가리키는 원본 파일을 교체하거나, 새 파일을 추가하고 `image_key`를 새로 연결합니다.
2. 카드 이미지는 `aspect-ratio: 16 / 9` 박스에 `object-fit: cover`로 표시되므로, 원본 이미지의 중요한 부분이 가운데에 오도록 크롭/리사이즈합니다.
3. 검증합니다.

```bash
npm run research:validate
npm run build
```

---

## 4) 로컬 확인과 배포

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

1. `/resources` 페이지 전체 카드
2. Home의 Lab Resources 요약(`meta.home_summary`)
3. 카드 이미지가 잘리거나 여백 없이 잘 보이는지
4. 좁은 화면에서 3컬럼 → 2컬럼 → 1컬럼으로 반응형이 잘 되는지

확인 후 변경한 원본과 생성된 JSON을 커밋하고 `main`에 push합니다. GitHub Actions의 `Content Build Check`와 `Deploy GitHub Pages`가 모두 성공한 뒤 실제 사이트를 확인합니다.

---

## 5) 오류 메시지 해석

Resource 데이터는 `research_resources.json`을 검증하는 `npm run research:validate`(`scripts/content/research.mjs`)로 함께 검사됩니다.

- `image_key ... is not defined in home_media.json`: `research_resources.json`이 존재하지 않는 Home media key를 참조
- `image_key ... is not connected in home_media_index.js`: `home_media.json`에는 key가 있지만 `home_media_index.js`에서 실제 이미지로 연결되지 않음
- `duplicate values`: `resources.items` id 중복

---

## 6) 배포 전 체크리스트

1. Resource 수량·모델·설명이 현재 사실과 일치하는가?
2. `meta.home_summary`가 카드 값과 일치하는가?
3. `image_key`가 `home_media.json` / `home_media_index.js`에 모두 연결됐는가?
4. `npm run research:validate`가 통과하는가?
5. `npm run build:static`이 `/resources` route를 prerender하는가?
6. 실제 `/resources` 페이지와 Home 요약에서 의도한 대로 보이는가?
7. push 후 두 GitHub Actions(`Content Build Check`, `Deploy GitHub Pages`)가 성공했는가?
