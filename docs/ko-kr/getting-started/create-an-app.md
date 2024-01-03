---
id: create-an-app
title: App 만들기
description: App 만들기 문서
---

To get set up quickly with your own Backstage project you can create a Backstage
App.

Backstage App은 자신의 환경에서 Backstage를 실행하는 데 필요한 모든 것을 포함하는 `lerna`가 포함된 "Monorepo" 설정입니다.

Backstage 프로젝트에 플러그인, 새로운 기능 또는 버그 수정을 기여하려면 
[Contributors](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md)를
읽어보시는 것을 추천합니다.

## 앱(App) 생성

Backstage 앱을 만들려면 Node.js [Active LTS Release](https://nodejs.org/en/about/releases/)가
설치되어 있어야 합니다.

Backstage에서는 새로운 앱을 만들기 위한 유틸리티를 제공합니다. 이 가이드는 앱 이름과 백엔드용 
데이터베이스를 선택하는 초기 설정 과정을 안내합니다. 데이터베이스는 SQLite 또는 PostgreSQL 중 선택하며, 
후자를 사용하려면 별도의 데이터베이스 인스턴스를 설정해야 합니다. 확실하지 않은 경우 SQLite를 선택하세요. 
추후 쉽게 수정할 수 있습니다. 다음 [tutorial](../tutorials/switching-sqlite-postgres.md)를 참조하세요.

앱 패키지 생성을 실행하는 가장 쉬운 방법은 `npx`를 사용하는 것 입니다:

```bash
npx @backstage/create-app@latest
```

그러면 현재 폴더 내에 새로운 Backstage 앱이 생성됩니다. 앱 폴더의 이름은 메시지가 표시될 때 제공된 이름입니다.

![create app](../assets/getting-started/create-app_output.png)

해당 디렉터리 내에 앱을 실행하는 데 필요한 모든 파일과 폴더 구조가 생성됩니다.

### 일반적인 폴더 구조

아래는 앱 제작 시 생성되는 파일과 폴더의 단순화된 레이아웃입니다.

```
app
├── app-config.yaml
├── catalog-info.yaml
├── lerna.json
├── package.json
└── packages
    ├── app
    └── backend
```

- **app-config.yaml**: 앱의 기본 구성 파일입니다. 자세한 내용은
  [Configuration](https://backstage.io/docs/conf/)를 확인하세요.
- **catalog-info.yaml**: 카탈로그 엔티티 설명입니다. 자세한 내용은
  [Descriptor Format of Catalog Entities](https://backstage.io/docs/features/software-catalog/descriptor-format)
  를 확인하세요.
- **lerna.json**: "Monorepo" 설정에 필요한 작업 공간 및 기타 lerna 구성에 대한 정보가 포함되어 있습니다.
- **package.json**: 프로젝트의 루티 package.json입니다. 주의할 점은 npm 종속성은 루트가 아닌 의도한
  작업 공간에 설치되어야 하므로 여기에 npm 종속성을 추가해서는 안됩니다.
- **packages/**: Lern 리프 패키지 또는 "workspaces" 입니다. 여기에 있는 모든 것은 Lerna가 관리하는 별도의 패키지가 될 것입니다.
- **packages/app/**: Backstage를 알아가는 데 좋은 출발점 역할을 하는 완벽하게 작동하는 Backstage 프론트엔드 앱입니다.
- **packages/backend/**: 
  [Authentication](https://backstage.io/docs/auth/),
  [Software Catalog](https://backstage.io/docs/features/software-catalog/),
  [Software Templates](https://backstage.io/docs/features/software-templates/)
  그리고 [TechDocs](https://backstage.io/docs/features/techdocs/)
  를 포함합니다..

### 트러블슈팅

create app 명령이 항상 예상대로 작동하는 것은 아닙니다. 다음 내용은 일반적으로 발생하는 몇 가지 문제와 해결 방법을 모아 놓은 것입니다.

#### Couldn't find any versions for "file-saver"

작업 중 다음과 같은 에러 메시지를 접할 수 있습니다:

```text
Couldn't find any versions for "file-saver" that matches "eligrey-FileSaver.js-1.3.8.tar.gz-art-external"
```

이 경우 `material-table` 종속성 설치를 중단시키는 전역적으로 구성된 npm 프록시가 있기 때문일 수 있습니다.
`material-table`에서 작업 중이지만 현재로서는 다음 방법으로 이 문제를 해결할 수 있습니다:


```bash
NPM_CONFIG_REGISTRY=https://registry.npmjs.org npx @backstage/create-app
```

#### Can't find Python executable "python"

사용 가능한 Python 설치가 없으면 설치 프로세스가 실패할 수도 있습니다. Python은 이미 
대부분의 시스템에서 일반적으로 사용할 수 있지만, 그렇지 않은 경우에는 
[여기](https://www.python.org/downloads/)로 가서 설치할 수 있습니다.

#### Could not execute command yarn install

`npm install --global Yarn`을 사용하여 시스템에 Yarn을 설치하거나 자세한 내용은 
[prerequisites](index.md#prerequisites)을 참조하세요.

## 앱(App) 실행

설치가 완료되면 앱 폴더를 열고 앱을 시작할 수 있습니다.

```bash
cd my-backstage-app
yarn dev
```

`yarn dev` 명령은 프런트엔드와 백엔드를 모두 동일한 창에서 별도의 프로세스(`[0]` 와 `[1]`로 명명)로 
실행합니다. 명령 실행이 완료되면 앱을 표시하는 브라우저 창이 열립니다. 그렇지 않은 경우 브라우저를 열고 
'http://localhost:3000'의 프런트엔드로 직접 이동할 수 있습니다.

당신은 이제 당신만의 Backstage를 자유롭게 다룰 수 있습니다.

앱에 대한 경험이 쌓이면 앞으로는 한 창에서 `yarn start`를 사용하여 프런트엔드만 실행하고 다른 창에서 
`yarn start-backend`를 사용하여 백엔드를 실행할 수 있습니다.
