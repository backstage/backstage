---
id: project-structure
title: Backstage 프로젝트 구조
# prettier-ignore
description: Backstage 프로젝트 저장소의 파일 및 폴더 소개
---

Backstage는 복잡한 프로젝트이며 GitHub 저장소에는 다양한 파일과 폴더가 포함되어 있습니다. 이 문서의 목적은 
해당 파일과 폴더의 목적을 명확히 하는 것입니다.

## 범용 파일 및 폴더

프로젝트 루트에는 프로젝트의 일부가 아닌 일련의 파일 및 폴더가 있으며 코드를 살펴보는 사람에게 익숙할 수도 있고 그렇지 않을 수도 있습니다.

- [`.changeset/`](https://github.com/backstage/backstage/tree/master/.changeset) -
  이 폴더는 마지막 릴리즈 이후 프로젝트에서 발생한 변경 사항을 간략하게 설명하는 파일이 포함되어 있습니다.
  이 파일들은 수동으로 추가되지만, [changesets](https://github.com/atlassian/changesets)
  에 의해 관리되고 새 릴리즈마다 모두 제거될 것입니다. 이것은 CHANGELOG의 구성요소입니다.

- [`.github/`](https://github.com/backstage/backstage/tree/master/.github) -
  표준 Github 폴더로 워크프로우 정의와 템플릿이 포함되어있습니다. 특히 마크다운 맞춤법 검사기에 사용되는
  [vale](https://github.com/backstage/backstage/tree/master/.github/vale)가 포함되어있습니다.

- [`.yarn/`](https://github.com/backstage/backstage/tree/master/.yarn) -
  Backstage에는 자체 `yarn` 구현이 포함되어 있습니다. 이를 통해 `yarn.lock` 파일을 효율적으로 제어할 수 있고
  yarn 버전 차이로인한 문제를 피할 수 있기를 기대합니다.

- [`contrib/`](https://github.com/backstage/backstage/tree/master/contrib) -
  커뮤니티에서 제공한 예시 또는 리소스 모음입니다. 우리는 여기에 기여해 주신 것에 진심으로 감사드리며 
  최신 소식을 받아볼 수 있도록 격려합니다.

- [`docs/`](https://github.com/backstage/backstage/tree/master/docs) - 
  여기에는 모든 문서 Markdown 파일이 보관됩니다. 이 내용은 "https://backstage.io/docs"에 있습니다.
  섹션이 추가/제거됨에 따라 [`sidebars.json`](https://github.com/backstage/backstage/blob/master/microsite/sidebars.json)
  파일을 변경해야 할 수도 있습니다.

- [`.editorconfig`](https://github.com/backstage/backstage/tree/master/.editorconfig) -
  가장 일반적인 코드 편집기에서 사용되는 환경설정 파일입니다. [EditorConfig.org](https://editorconfig.org/)에서 자세히 확인하세요.

- [`.imgbotconfig`](https://github.com/backstage/backstage/tree/master/.imgbotconfig) -
  이미지 크기를 줄이는데 도움이되는 [bot](https://imgbot.net/)의 구성입니다..

## Monorepo packages

`packages/` 와 `plugins/`의 모든 폴더는 [`package.json`](https://github.com/backstage/backstage/blob/master/package.json) 
에 정의된 대로 모노레포(Monorepo) 설정 내에 있습니다

```json
 "workspaces": {
    "packages": [
      "packages/*",
      "plugins/*"
    ]
  },
```

개별적으로 살펴보겠습니다.

### `packages/`

이는 우리가 프로젝트 내에서 사용하는 모든 패키지입니다. [Plugins](#plugins)은 자체 폴더로 분리되어 있습니다. 자세한 내용은 아래를 참조하세요.

- [`app/`](https://github.com/backstage/backstage/tree/master/packages/app) -
  이것은 패키지와 플러그인 세트를 작동하는 Backstage 앱으로 통합하여 앱이 어떻게 보일 수 있는지에 대한 우리의 견해입니다.
  이것은 발표된 패키지가 아니며 주요 목표는 앱의 모습에 대한 데모를 제공하고 로컬 개발을 활성화하는 것입니다.

- [`backend/`](https://github.com/backstage/backstage/tree/master/packages/backend) -
  모든 독립형 Backstage 프로젝트에는 `app` 및 `backend` 패키지를 갖고있습니다. `backend` 는
  플러그인을 사용하여 프론트엔드(`app`)가 사용할 수 있는 작동하는 backend를 구성합니다.
  
- [`backend-common/`](https://github.com/backstage/backstage/tree/master/packages/backend-common) -
  백엔드(backend)에는 "core" 패키지가 없는 대신 헬퍼 미들웨어와 기타 유틸리티가 포함된 `backend-common` 이 있습니다.

- [`catalog-client`](https://github.com/backstage/backstage/tree/master/packages/catalog-client) -
  소프트웨어 카탈로그와 상호작용하는 동일한 형태 클라이언트입니다. 백엔드 플러그인은 패키지를 직접 사용할 수 있습니다.
  프런트엔드 플러그인은 `useApi` 및 `catalogApiRef`와 함께 `@backstage/plugin-catalog`를 사용하여 클라이언트를 사용할 수 있습니다.
  
- [`catalog-model/`](https://github.com/backstage/backstage/tree/master/packages/catalog-model) -
  당신은 이를 일종의 카탈로그 작업을 위한 라이브러리로 간주할 수 있습니다. 여기에는 
  [Entity](https://backstage.io/docs/features/software-catalog/references#docsNav)뿐만 아니라
  이와 관련된 유효성 검사 및 기타 로직이 포함됩니다. 이 패키지는 frontend 와 backend 모두에서 사용할 수 있습니다.

- [`cli/`](https://github.com/backstage/backstage/tree/master/packages/cli) -
  우리 프로젝트의 가장 큰 패키지 중 하나인 `cli` 는 플러그인 빌드, 제공, 비교, 생성 등에 사용됩니다.
  이 프로젝트 초기에는 `package.json`을 통해 직접 도구 - `eslint` 와 같은 - 를 직접 호출하는 것으로 시작했습니다.
  하지만 명명된 도구를 변경할 때 이에 대한 좋은 개발 경험을 갖기가 까다로웠기 때문에 이를 자체 CLI에 래핑하기로 결정했습니다.
  그렇게 하면 [react-scripts](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts)
  와 유사하게 `package.json`에서 모든 것이 동일하게 보입니다.

- [`cli-common/`](https://github.com/backstage/backstage/tree/master/packages/cli-common) -
  이 패키지는 주로 경로 확인을 처리합니다. [CLI](https://github.com/backstage/backstage/tree/master/packages/cli)
  에서 버그를 줄이기 위해 별도의 패키지로 제공됩니다. 또한 우리는 CLI를 실행할 때 다운로드 시간을 줄이기 위해 가능한 한 적은 종속성을 원하며 
  이는 이것이 별도 패키지인 또 다른 이유입니다.

- [`config/`](https://github.com/backstage/backstage/tree/master/packages/config) -
  우리가 환경 설정 데이터를 읽는 방식입니다. 이 패키지는 여러 구성 개체를 가져와 함께 병합할 수 있습니다.
  [app-config.yaml](https://github.com/backstage/backstage/blob/master/app-config.yaml)는
  환경 설정 객체의 예시를 보여줍니다.

- [`config-loader/`](https://github.com/backstage/backstage/tree/master/packages/config-loader) -
  이 패키지는 환경 설정 객체를 읽는 데 사용됩니다. 이것은 병합하는 방법은 모르지만 파일을 읽고 환경 설정에 전달하기만합니다.
  이 부분은 backend에서만 사용되므로 `config` 와 `config-loader`를 두개의 다른 패키지로 분리하기로 결정했습니다.

- [`core-app-api/`](https://github.com/backstage/backstage/tree/master/packages/core-app-api) -
  이 패키지에는 Backstage 앱을 함께 연결하는 데 사용되는 핵심 API가 포함되어 있습니다.

- [`core-components/`](https://github.com/backstage/backstage/tree/master/packages/core-components) -
  이 패키지는 시각적 React 구성 요소가 포함되어 있으며 그 중 일부는 
  [plugin examples](https://backstage.io/storybook/?path=/story/plugins-examples--plugin-with-data)
  에서 찾을 수 있습니다. 

- [`core-plugin-api/`](https://github.com/backstage/backstage/tree/master/packages/core-plugin-api) -
  이 패키지에는 Backstage 플러그인을 빌드하는 데 사용되는 핵심 API가 포함되어 있습니다.

- [`create-app/`](https://github.com/backstage/backstage/tree/master/packages/create-app) -
  이 패키지는 새로운 Backstage 앱을 특별히 스캐폴드하기 위한 CLI입니다. 이는 
  [template](https://github.com/backstage/backstage/tree/master/packages/create-app/templates/default-app)을 
  사용하여 수행됩니다.

- [`dev-utils/`](https://github.com/backstage/backstage/tree/master/packages/dev-utils) -
  이 패키지는 격리된 개발을 위한 플러그인을 설정하여 별도로 제공될 수 있도록 도와줍니다.

- [`e2e-test/`](https://github.com/backstage/backstage/tree/master/packages/e2e-test) -
  모든 패키지를 빌드하고 게시하고 새 앱을 만든 다음 실행하면 어떤 일이 발생하는지 시험하기 위해 실행할 수 있는 
  또 다른 CLI입니다. CI는 이를 e2e 테스트에 사용합니다.

- [`integration/`](https://github.com/backstage/backstage/tree/master/packages/integration) -
  GitHub, GitLab 등과 같은 통합의 일반적인 기능입니다.

- [`storybook/`](https://github.com/backstage/backstage/tree/master/storybook) -
  이 폴더에는 재사용 가능한 React 구성 요소를 시각화하는 데 도움이 되는 Storybook 구성만 포함되어 있습니다.
  스토리(Stories)는 핵심 패키지에 포함되어 있으며, [Backstage Storybook](https://backstage.io/storybook)에 게시되어 있습니다.

- [`techdocs-node/`](https://github.com/backstage/backstage/tree/master/plugins/techdocs-node) -
  [techdocs-backend](https://github.com/backstage/backstage/tree/master/plugins/techdocs-backend) 
  플러그인과 [techdocs-cli](https://github.com/backstage/techdocs-cli) 간에 공유되는 
  TechDocs용 공통 node.js 기능입니다.

- [`test-utils/`](https://github.com/backstage/backstage/tree/master/packages/test-utils) -
  이 패키지에는 Backstage 앱 또는 해당 플러그인을 테스트하기 위한 범용 테스트 기능이 포함되어 있습니다.

- [`theme/`](https://github.com/backstage/backstage/tree/master/packages/theme) -
  백스테이지(Backstage) 테마를 보유하고있습니다.

### `plugins/`

Backstage 앱의 기능 대부분은 플러그인에서 비롯됩니다. 핵심 기능도 플러그인이 될 수 있습니다. 
[catalog](https://github.com/backstage/backstage/tree/master/plugins/catalog)에서 
예를 확인할 수 있습니다.

플러그인을 세 가지 유형(**Frontend**, **Backend** 그리고 **GraphQL** )으로 분류할 수 있습니다;
이러한 유형의 플러그인은 이름을 붙일 때 대시 접미사를 사용하여 구별합니다. `-backend`는 백엔드 플러그인 등을 의미합니다.

플러그인을 분할하는 한 가지 이유는 종속성 때문입니다. 또 다른 이유는 관심사의 명확한 분리 때문입니다.

[플러그인 디렉터리](https://backstage.io/plugins)를 살펴보거나 
[`plugins/`](https://github.com/backstage/backstage/tree/master/plugins) 폴더를 살펴보세요.

## monorepo 외부 패키지

편의를 위해 monorepo 설정의 일부가 아닌 패키지를 포함합니다.

- [`microsite/`](https://github.com/backstage/backstage/blob/master/microsite) -
  이 폴더에는 backstage.io의 소스 코드가 포함되어 있습니다. [Docusaurus](https://docusaurus.io/)를 기반으로 제작되었습니다.
  이 폴더는 종속성 문제로 인해 monorepo의 일부가 아닙니다. 로컬에서 실행하는 방법에 대한 지침은 
  [microsice READE](https://github.com/backstage/backstage/blob/master/microsite/README.md)를 참조하세요.

## `app`에서 특별히 사용되는 루트 파일

이러한 파일은 주로 역사적인 이유로 프로젝트 루트에 보관됩니다. 이러한 파일 중 일부는 향후 루트에서 이동될 수 있습니다.

- [`.npmrc`](https://github.com/backstage/backstage/tree/master/.npmrc) - 
  회사에서는 자체 npm 레지스트리를 갖는 것이 일반적이며 이 파일은 이 폴더가 항상 공용 레지스트리를 사용하는지 확인합니다.

- [`.yarnrc.yml`](https://github.com/backstage/backstage/tree/master/.yarnrc.yml) -
  "우리" 버전의 Yarn 을 적용합니다.

- [`app-config.yaml`](https://github.com/backstage/backstage/tree/master/app-config.yaml) -
  프런트엔드와 백엔드 모두에 대한 앱 설정입니다.

- [`catalog-info.yaml`](https://github.com/backstage/backstage/tree/master/catalog-info.yaml) -
  Backstage 엔터티 형식의 Backstage에 대한 설명입니다.

- [`lerna.json`](https://github.com/backstage/backstage/tree/master/lerna.json) -
  [Lerna](https://github.com/lerna/lerna) monorepo 설정입니다.
  우리는 `yarn workspaces`를 사용하고있으므로, 이 파일은 스크립트 실행에만 사용됩니다.
