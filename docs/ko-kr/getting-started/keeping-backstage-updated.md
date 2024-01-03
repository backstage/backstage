---
id: keeping-backstage-updated
title: Backstage 최신 상대로 유지하기
description: Backstage 앱을 최신 상태로 유지하는 방법
---

Backstage는 항상 개선되고 있으므로 최신 릴리스와 동기화를 유지하는 것이 좋습니다. Backstage는 애플리케이션이나 서비스라기보다는 라이브러리에 가깝습니다.
`create-react-app`과 유사하게 `@backstage/create-app` 도구는 진화할 시작점을 제공합니다.

## backstage-cli를 사용하여 Backstage 버전 업데이트하기

Backstage CLI에는 사용 중인 모든 `@backstage` 패키지와 종속성을 최신 버전으로 적용하는 명령이 있습니다.
[버전:범프](https://backstage.io/docs/local-dev/cli-commands#versionsbump).

```bash
yarn backstage-cli versions:bump
```

모든 `@backstage` 패키지를 한 번에 범핑(bumping)하는 이유는 패키지 간에 존재하는 종속성을 유지하기 위해서입니다.

기본적으로 범프 명령은 `@backstage` 패키지를 매월 출시되는 최신 `main` 릴리스 라인으로 업그레이드합니다. 매주 릴리스되는 `next` 릴리스 라인을 추적하려는 급한 사용자는 `--release next` 옵션을 사용하여 추적할 수 있습니다.

```bash
yarn backstage-cli versions:bump --release next
```

다른 플러그인을 사용하는 경우 `@backstage/*` 종속성 이상의 업데이트를 위해 `--pattern` 옵션을 전달할 수 있습니다.

```bash
yarn backstage-cli versions:bump --pattern '@{backstage,roadiehq}/*'
```

## "create-app" 변경 사항 추적하기

`@backstage/create-app` 명령은 **template**에서 Backstage 설치의 초기구조를 만듭니다.
Backstage 저장소에 있는 이 템플릿의 소스는 주기적으로 업데이트되지만 로컬 `app` 및 `backend` 패키지는 
`create-app` 시간에 설정되며 이러한 템플릿 업데이트를 자동으로 가져오지 않습니다.

이러한 이유로 템플릿에 대한 모든 변경 사항은 `@backstage/create-app` 패키지의 
[changelog](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md)에 
업그레이드 지침과 함께 문서화됩니다. 패키지를 업그레이드할 때 적용 가능한 업데이트가 있는지 이 변경 로그를 살펴보는 것이 좋습니다.
대안으로 [Backstage Upgrade Helper](https://backstage.github.io/upgrade-helper/) 는 두 Backstage 버전 간의
모든 변경 사항을 통합된 보기로 제공합니다. `backstage.json`에서 Backstage 현재 설치된 버전을 찾을 수 있습니다.

## 종속성 불일치에 대한 추가 정보

Backstage는 [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)이 포함된
모노레포(Monorepo)로 구성됩니다. 즉, `app`과 `backend` 패키지는 물론 추가한 모든 사용자 정의 플러그인이 
자체 `package.json` 및 종속성을 포함하는 별도의 패키지라는 의미입니다.

지정된 종속성 버전이 서로 다른 패키지 간에 _동일_할 경우 패키지간에 공유되도록 모노레포(Monorepo) 루트의 기본 `node_modules` 폴터로
끌어올려집니다. 동일한 종속성의 _다른_ 버전이 발견되면 Yarn은 특정 패키지 내에 `node_modules` 폴더를 생성합니다.

이로 인해 타업 정의(type definitions) 또는 전역 상태(global state)와 관련된 혼란스러운 상황이 발생할 수 있습니다.
예를 들어, React [Context](https://reactjs.org/docs/context.html)는 "global referential equality"에 
의존합니다. 이로 인해 Backstage에서 API 조회 또는 구성 로딩에 문제가 발생할 수 있습니다.

이러한 상황을 해결하는 데 도움이 되도록 Backstage CLI에는 [versions:check](https://backstage.io/docs/local-dev/cli-commands#versionscheck)가 있습니다.
그러면 앱에 있는 `@backstage` 패키지 버전의 유효성을 검사하여 중복된 정의가 있는지 확인합니다.

```bash
# Add --fix to attempt automatic resolution in yarn.lock
yarn backstage-cli versions:check
```
