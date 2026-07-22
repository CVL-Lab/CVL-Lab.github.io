# Content Operations 개요 (초안)

이번 단계는 구조/자동화 코드만 정리한 상태입니다.

- 원본 content: `content/news`, `content/publications`, `content/photos/raw`, `src/assets/dataset/people.json`, `src/assets/images/people`
- 자동 생성 데이터: `src/generated/*.generated.json`
- Photo 최적화 산출물: `public/uploads/photos/...`
- People 최적화 산출물: `src/assets/images/people/optimized/...`

명령:

- `npm run content:bootstrap` (기존 데이터 1회 마이그레이션 보조)
- `npm run content:sync` (News/Publication/Photo/People 동기화 + generated 갱신)
- `npm run validate:content` (People 이미지 매칭을 포함한 schema/형식 검증)
- `npm run photos:sync` (Photo만 resize/manifest 생성)
- `npm run people:sync` (People WebP/index/manifest 생성)

다음 단계에서는 운영 문서를 더 상세한 운영 절차 중심으로 확장할 예정입니다.
