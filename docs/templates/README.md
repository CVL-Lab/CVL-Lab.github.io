# Operations Templates (복사 사용 가이드)

이 폴더는 운영자가 새 content를 추가할 때 바로 복사해 사용할 수 있는 예시를 제공합니다.  
실제 운영 시에는 아래 원본 template도 함께 참고하세요.

- News 원본 template: `content/news/_template.md`
- Publication 원본 template: `content/publications/_template.md`
- Photo metadata template: `content/photos/metadata.template.json`
- People 데이터 template(운영 참고): `docs/templates/people.entry.template.json`

---

## 1) 사용 순서

1. 이 폴더에서 필요한 template을 복사합니다.
2. 대상 경로에 새 파일을 만듭니다.
3. 필드 값을 실제 값으로 수정합니다.
4. 아래 명령으로 검증합니다.

```bash
npm run content:sync
npm run validate:content
```

---

## 2) template 파일 목록

1. News: `docs/templates/news.template.md`
2. Publication: `docs/templates/publication.template.md`
3. Photo metadata: `docs/templates/photos.metadata.template.json`
4. People entry 샘플: `docs/templates/people.entry.template.json`

---

## 3) 주의사항

1. `id`는 중복되면 안 됩니다.
2. `date`는 반드시 `YYYY-MM-DD` 형식이어야 합니다.
3. 링크는 `http://` 또는 `https://`로 시작해야 합니다.
4. template 파일 자체를 운영 파일로 쓰지 말고, 복사본을 만들어 사용하세요.
