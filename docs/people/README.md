# People 운영 가이드 (교수/학생/인턴/졸업생)

이 문서는 **People 탭만 유지보수**할 때 필요한 실무 가이드입니다.  
대상 독자는 비개발자 운영자이며, “어디를 어떻게 고치면 화면이 바뀌는지”를 단계별로 설명합니다.

---

## 1) 먼저 알아야 할 주요 사항

People는 현재 `content/` 폴더가 아니라 아래 파일을 직접 읽어 렌더링합니다.

1. 구성원 데이터(텍스트):
    - `src/assets/dataset/people.json`
2. 프로필 이미지 매핑(파일 연결):
    - `src/assets/images/people/people_image_index.js`
3. 실제 카드 렌더링 컴포넌트:
    - `src/components/tabs/People.jsx`
    - `src/components/tabs/People.Card.jsx`
    - `src/components/tabs/People.ProfessorCard.jsx`
    - `src/utils/peopleData.js`

즉, 보통 운영자는 다음 2개만 수정하면 됩니다.

- `people.json` (이름/이메일/소속/링크/관심분야/상태)
- `people_image_index.js` (이미지 파일 연결)

---

## 2) 섹션(역할) 규칙: 어떤 사람이 어디로 가야 하나

`src/assets/dataset/people.json`의 `meta.section_order` 기준으로 화면 섹션 순서가 결정됩니다.

현재 기본 키는 다음과 같습니다.

1. `professor` → Professor
2. `intergrated_mp` → Integrated M.S. and Ph.D.
    - **주의: 키 철자(`intergrated_mp`)는 현재 코드 기준 값입니다.**
    - 오타처럼 보여도 임의로 바꾸면 렌더링이 깨질 수 있습니다.
3. `phd` → Ph.D
4. `master` → M.S
5. `intern` → Intern
6. `alumni` → Alumni

### Alumni 표시 여부 (중요)

- 현재 사이트는 **Alumni를 실제로 화면에 표시**합니다.
- `People.jsx`에서 `section_order`에 있는 섹션을 모두 렌더링하므로, `alumni`도 현재 노출됩니다.
- Alumni 카드는 `research_interests`보다 `current_position` 정보를 우선적으로 사용합니다.

---

## 3) 데이터 구조 설명 (people.json)

기본 구조:

```json
{
    "meta": {
        "schema_version": "2.0",
        "section_order": [
            "professor",
            "intergrated_mp",
            "phd",
            "master",
            "intern",
            "alumni"
        ]
    },
    "sections": {
        "master": {
            "title": "M.S",
            "entries": {
                "hong_gildong": {
                    "order": 0,
                    "name": "Hong Gildong",
                    "position": "M.S Student",
                    "email": "example@ajou.ac.kr",
                    "homepage": "https://example.com",
                    "research_interests": ["Computer Vision"],
                    "current_position": [],
                    "links": {
                        "github": "https://github.com/example",
                        "linkedin": null,
                        "google_scholar": null
                    }
                }
            }
        }
    }
}
```

### 항목별 의미

- `id`(엔트리 키, 예: `hong_gildong`)
    - 영어 소문자 + `_` 권장
    - 같은 섹션 내 중복 금지
- `order`
    - 작은 숫자가 먼저 노출
- `name`
    - 카드 제목(이름)
- `position`
    - 직책/과정 (교수 카드에서는 보이고, 일반 카드에서는 섹션 맥락에 따라 비중이 낮음)
- `email`
    - 메일 링크
- `homepage`
    - Personal webpage 아이콘 링크
- `research_interests`
    - 일반 구성원 카드의 하단 메타 정보
- `current_position`
    - Alumni 섹션에서 주로 사용
- `links.github / links.linkedin / links.google_scholar`
    - 아이콘 링크

### 교수 전용 상세 정보

교수 항목에는 `profile_details`를 넣을 수 있습니다.

```json
"profile_details": {
  "biography": "약력 ...",
  "research_overview": "연구 개요 ...",
  "education": "학력 ...",
  "affiliations": "학회/직책 ...",
  "achievements": "주요 성과 ..."
}
```

---

## 4) 카드가 데이터에서 화면으로 만들어지는 방식

1. `people.json`을 `src/utils/peopleData.js`가 읽음
2. 섹션별로 정렬(`order`) 후 카드 데이터 생성
3. `People.jsx`가 섹션별 렌더링
    - `professor`는 `PeopleProfessorCard`
    - 나머지는 `PeopleCard`
4. 링크 아이콘은 아래 순서로 렌더링
    - Personal webpage
    - GitHub
    - LinkedIn
    - Google Scholar
    - View publications(내부 이동)

링크가 비어 있으면 해당 아이콘은 비활성(회색) 상태로 표시됩니다.

---

## 5) 프로필 사진 추가/교체 방법

### 5-1. 사진 교체(가장 쉬운 방법)

1. 기존 파일명 확인 (예: `Sunki Joo.png`)
2. 같은 파일명으로 새 이미지를 업로드/덮어쓰기
3. `people_image_index.js` 수정 없이 반영됨

### 5-2. 새 파일명으로 교체/신규 추가

1. 이미지 파일을 `src/assets/images/people/`에 업로드
2. `src/assets/images/people/people_image_index.js`에서 import 추가
3. 해당 섹션 객체에 `id: 이미지변수` 매핑 추가

예:

```js
import HongGildong from "./Hong Gildong.jpg";

const people_images = {
    master: {
        hong_gildong: HongGildong,
    },
};
```

> 중요: `people.json`의 엔트리 키(`hong_gildong`)와 이미지 매핑 키가 정확히 같아야 합니다.

---

## 6) 개인 링크(홈페이지/GitHub/LinkedIn/Scholar) 관리

수정 위치:

- `people.json` 내 각 사람의 `homepage`, `links` 필드

예:

```json
"homepage": "https://example.com",
"links": {
  "github": "https://github.com/example",
  "linkedin": "https://www.linkedin.com/in/example/",
  "google_scholar": "https://scholar.google.com/citations?user=xxxxx"
}
```

### 링크 제거 방법

- 값을 `null` 또는 빈 문자열(`""`)로 변경
- 저장 후 해당 아이콘은 비활성 상태로 표시됨

---

## 7) 상태 전환(라이프사이클) 운영 규칙

이 섹션이 People 운영에서 가장 중요합니다.

### 7-1. 인턴 → 석사(M.S.) 전환

원칙:

1. `sections.intern.entries`에서 해당 사람 항목 삭제
2. `sections.master.entries`에 동일 인물 항목 추가
3. `position`을 `M.S Student`로 변경
4. `order` 재정렬
5. 이미지 매핑 키가 유지되는지 확인

---

### 7-2. 석사 → 통합과정(Integrated M.S. and Ph.D.) 전환

원칙:

1. `sections.master.entries`에서 삭제
2. `sections.intergrated_mp.entries`에 추가
3. `position`을 `Integrated M.S./Ph.D Student`로 변경
4. `order` 재정렬

---

### 7-3. 재학생 졸업 → Alumni 이동

원칙:

1. 기존 섹션(`master`, `intergrated_mp`, `phd`)에서 항목 삭제
2. `sections.alumni.entries`에 추가
3. `position`을 `Alumni`로 설정
4. `current_position`에 진로/소속 입력 (예: `["LG Energy Solution"]`)
5. `research_interests`는 비워도 무방 (`[]`)

> Alumni는 현재 실제 화면에 표시되므로, 이동 즉시 People 페이지 Alumni 그룹에 반영됩니다.

---

### 7-4. 임시 휴학/비활성 멤버 처리

운영 권장안(공개 노출을 잠시 숨기고 데이터는 보관):

1. `sections` 아래에 보관용 섹션(예: `inactive`)을 만들 수 있음
2. 단, `meta.section_order`에 `inactive`를 넣지 않으면 화면에는 표시되지 않음
3. 복귀 시 원래 섹션으로 다시 이동

예시:

```json
"sections": {
  "inactive": {
    "title": "Inactive",
    "entries": {
      "hong_gildong": { "...": "..." }
    }
  }
}
```

> 현재 코드 기준으로 `section_order`에 없는 섹션은 렌더링하지 않습니다.

---

### 7-5. 교수 정보 업데이트

수정 위치:

- `sections.professor.entries.<교수id>`

주요 수정 항목:

- `position`, `email`, `homepage`
- `links.*`
- `profile_details.*` (약력/연구개요/학력/소속/성과)
- 교수 사진은 `people_image_index.js`의 `professor` 매핑에서 관리

---

## 8) 요청된 실무 예시 6가지

### 예시 A) 새 인턴 추가하기

1. `people.json` → `sections.intern.entries`에 새 키 추가
2. `order` 마지막 번호 부여
3. `name`, `email`, `research_interests`, `links` 입력
4. 사진 파일 추가 후 `people_image_index.js` `intern` 섹션에 매핑 추가

---

### 예시 B) 인턴을 석사 과정으로 변경하기

1. `intern.entries.<id>` 복사
2. `master.entries.<id>`에 붙여넣기
3. `position`을 `M.S Student`로 수정
4. `intern.entries.<id>` 삭제
5. `order` 재정렬

---

### 예시 C) 석사 졸업 후 alumni로 이동하기

1. `master.entries.<id>`를 `alumni.entries.<id>`로 이동
2. `position: "Alumni"`로 수정
3. `current_position` 입력 (예: 회사/기관)
4. `master`에서 원본 삭제

---

### 예시 D) 통합과정 학생 정보 수정하기

1. `intergrated_mp.entries.<id>` 찾기
2. `email`, `research_interests`, `links`, `homepage` 등 필요한 필드만 수정
3. 이름 변경 시 `View publications` 검색 연동을 위해 철자 오탈자 재확인

---

### 예시 E) 프로필 사진 교체하기

방법 1(권장): 기존 파일명 그대로 덮어쓰기  
방법 2: 새 파일 추가 + `people_image_index.js` import/매핑 수정

---

### 예시 F) GitHub / LinkedIn / Scholar / Personal webpage 수정하기

1. 해당 사람의 `homepage`, `links.github`, `links.linkedin`, `links.google_scholar` 수정
2. URL 형식(`https://...`) 확인
3. 링크 제거 시 `null` 또는 `""`

---

## 9) 로컬/깃허브 웹 작업 절차

### 9-1. 로컬에서 수정

1. 파일 수정
2. 개발 서버 확인
    ```bash
    npm run dev
    ```
3. 빌드 확인
    ```bash
    npm run build
    ```
4. 커밋/푸시

### 9-2. GitHub 웹에서 바로 수정

1. `src/assets/dataset/people.json` 편집
2. 필요 시 `src/assets/images/people/` 업로드 + `people_image_index.js` 편집
3. Commit
4. Actions 배포 완료 확인 후 사이트 확인

---

## 10) 문제 해결 (짧은 트러블슈팅)

### 10-1. 사진이 안 보임

점검 순서:

1. `people_image_index.js`에 import가 있는지
2. 섹션 매핑 키와 사람 id가 같은지
3. 파일명/확장자 오타가 없는지 (`.jpg`, `.png` 등)

### 10-2. 사람이 잘못된 섹션에 나옴

1. `people.json`에서 해당 엔트리가 어떤 `sections.<key>.entries` 아래 있는지 확인
2. 잘못된 섹션에서 삭제 후 올바른 섹션에 추가

### 10-3. 개인 링크 클릭 시 오류

1. URL이 `http://` 또는 `https://`로 시작하는지 확인
2. 링크 값 오타/공백 제거
3. 값이 `null`이면 비활성 아이콘이 정상 동작

### 10-4. 카드가 아예 안 렌더링됨

1. JSON 쉼표/괄호 문법 오류 확인
2. `entries` 구조가 객체 형태인지 확인
3. `name` 필드 누락 여부 확인
4. `npm run build`로 오류 메시지 확인

### 10-5. 필드가 비어 있을 때 어떻게 보이나

- 이메일/링크 없음: 비활성 또는 숨김 처리
- `research_interests` 비어 있음: 빈/기본 메타 표시
- Alumni는 `current_position`이 있으면 해당 정보 중심으로 표시

---

## 11) 운영 체크리스트 (People 전용)

1. 대상 사람을 올바른 섹션에 넣었는가?
2. `order`가 중복/누락 없이 정렬됐는가?
3. 사진 매핑(`people_image_index.js`)이 정확한가?
4. 링크 URL 형식이 올바른가?
5. 인턴→석사 / 졸업→alumni 전환 규칙을 지켰는가?
6. `npm run build` 후 오류 없이 완료되는가?
7. 실제 People 페이지에서 카드/아이콘/섹션이 의도대로 보이는가?
