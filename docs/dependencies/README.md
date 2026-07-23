# 의존성·보안 업데이트 가이드 (개발/운영용)

이 문서는 npm 의존성 경고를 확인하고, 호환성을 유지하면서 안전한 버전으로 갱신하는 절차를 설명합니다.

---

## 1) Source of truth

의존성은 아래 두 파일을 한 변경 단위로 관리합니다.

1. `package.json`
    - 직접 의존성과 허용 버전 범위
    - 프로젝트가 요구하는 최소 보안 버전
2. `package-lock.json`
    - CI와 배포가 실제 설치하는 전체 의존성 graph와 정확한 버전

`node_modules/`는 생성물입니다. 직접 수정하거나 커밋하지 않습니다.

GitHub Dependabot alert는 외부 검증 결과입니다. 실제 수정은 `package.json`과 `package-lock.json`에 반영하고, alert는 새 lockfile이 push된 뒤 GitHub가 자동으로 재평가하게 둡니다.

---

## 2) 업데이트 policy

1. 먼저 `npm audit` 결과와 영향 경로를 확인합니다.
2. 현재 major 안의 patch/minor 보안 버전을 우선합니다.
3. 직접 의존성은 `package.json`의 최소 버전도 안전한 버전으로 올립니다.
4. 전이 의존성은 검토된 lockfile 갱신으로 해결합니다.
5. `npm audit fix`는 사용할 수 있지만 `--force`는 사용하지 않습니다.
6. major 업데이트는 migration guide와 실제 화면 회귀 검증이 필요한 별도 작업으로 분리합니다.
7. Dependabot alert는 근거 없이 dismiss하지 않습니다.
8. lockfile 충돌을 손으로 맞추지 말고 `npm install` 또는 `npm audit fix`로 다시 생성합니다.

비밀 token, private registry credential, 개인 `.npmrc` 내용은 문서·로그·커밋에 넣지 않습니다.

---

## 3) 정기 점검

저장소 root에서 실행합니다.

```bash
npm ci
npm run audit:dependencies
npm outdated
```

- `npm ci`: committed lockfile과 동일한 의존성을 재현
- `audit:dependencies`: low 이상 취약점이 하나라도 있으면 실패
- `npm outdated`: 보안 경고와 별개로 직접 의존성의 현재/wanted/latest 버전 확인

특정 취약 패키지가 어디에서 들어오는지 확인하려면 다음 명령을 사용합니다.

```bash
npm explain <package-name>
```

---

## 4) 안전한 수정 절차

### 직접 의존성

현재 major 안에서 검증된 보안 버전을 명시합니다.

```bash
npm install <package>@^<safe-version>
```

개발 의존성은 `-D`를 사용합니다.

```bash
npm install -D <package>@^<safe-version>
```

### 전이 의존성

먼저 비파괴 update를 실행합니다.

```bash
npm audit fix
```

그다음 변경 범위와 결과를 확인합니다.

```bash
git diff -- package.json package-lock.json
npm run audit:dependencies
npm run build
```

`npm audit fix --force`가 필요하다고 나오면 즉시 적용하지 않습니다. 어떤 direct dependency의 major 변경이 필요한지 확인하고 별도 migration 작업으로 처리합니다.

---

## 5) Install script 경고

npm이 `preinstall`, `install`, `postinstall` 같은 lifecycle script를 경고하면 일괄 승인하지 않습니다.

1. package 이름과 정확한 버전을 확인합니다.
2. `package-lock.json`의 registry와 integrity 변경을 확인합니다.
3. package의 `scripts`와 repository 정보를 확인합니다.
4. 현재 build에 필요한 package인지 확인한 뒤 승인 여부를 결정합니다.

현재 lockfile에는 platform binary 설치에 관여하는 `esbuild`와 macOS optional dependency인 `fsevents`의 install script가 포함됩니다. 버전이나 배포 출처가 달라졌다면 기존 package라는 이유만으로 자동 승인하지 않습니다.

---

## 6) 검증과 CI

의존성 변경 후 최소 검증:

```bash
npm ci
npm run audit:dependencies
npm run build
```

build tooling, router 또는 prerender 관련 package가 바뀌었다면 정적 build도 확인합니다.

```bash
npm run build:static
```

GitHub Actions의 두 workflow는 `npm ci` 직후 dependency audit를 실행합니다.

- `Content Build Check`
- `Deploy GitHub Pages`

audit가 실패하면 build와 deploy를 진행하지 않습니다. 검증 단계를 삭제하거나 alert를 dismiss해서 우회하지 않습니다.

---

## 7) GitHub Actions 의존성

`.github/workflows/*.yml`의 `uses:` 항목도 실행 의존성으로 관리합니다.

1. GitHub 공식 action은 공식 release에서 현재 안정 major와 runner 요구사항을 확인합니다.
2. major alias(예: `actions/checkout@v7`)를 사용하되, major 변경 시 workflow 전체를 실제 실행해 검증합니다.
3. action이 사용하는 Node runtime의 지원 종료 경고를 방치하지 않습니다.
4. third-party action은 저장소·release 상태와 권한 범위를 확인한 뒤 갱신합니다.

현재 GitHub 공식 action baseline:

- `actions/checkout@v7`
- `actions/setup-node@v7`

---

## 8) Rollback

기능 회귀가 생기면 dependency 변경 commit을 `git revert`하고 `npm ci`로 이전 graph를 재현합니다.

단, rollback으로 알려진 취약 버전이 복원된다면 그대로 배포하지 않습니다. 호환되는 다른 patched version을 선택하거나, 필요한 major migration을 별도 변경으로 진행합니다.

---

## 9) 2026-07-23 보안 baseline

이번 정리에서는 GitHub와 npm이 보고한 12건(High 9, Moderate 2, Low 1)을 현재 major 범위 안에서 해소했습니다.

| 구분 | 이전 | 보안 baseline |
| --- | --- | --- |
| Vite | `6.4.1` | `6.4.3` |
| React Router DOM | `7.13.0` | `7.18.1` |
| Babel Core(전이) | `7.25.2` | `7.29.7` |
| Rollup(전이) | `4.57.1` | `4.62.2` |
| js-yaml(전이) | `4.1.1` | `4.3.0` |
| gh-pages | `6.1.1` | `6.3.0` |

완료 기준은 `npm audit`의 전체 severity가 0이고 production build가 성공하는 것입니다.
