---
id: configure-app-with-plugins
title: 플러그인으로 앱 구성
description: 플러그인으로 앱을 구성하는 방법에 대한 문서
---

Backstage 플러그인은 필요에 따라 사용자가 원하는데로 정의할 수 있습니다.
CI/C, 모니터링, 감사 . 등 다양한 일반적인 인프라 요구 사항을 위한 플러그인이 포함된
[plugin directory](https://backstage.io/plugins)가 있습니다..

## 앱에 플로그인 추가

다음 단계에서는 [created a Backstage app](./create-an-app.md)가 존재하고 플러그인을 추가하고싶다고 가정합니다.

이 예제에서는 [CircleCI](https://github.com/CircleCI-Public/backstage-plugin/tree/main/plugins/circleci) 
플러그인을 사용하고 있습니다. 이 플러그인은 소프트웨어 카탈로그의 엔터티입니다.

1. 저장소에 플러그인의 npm 패키지를 추가:

   ```bash
   # From your Backstage root directory
   yarn add --cwd packages/app @circleci/backstage-plugin
   ```

  주의할 점은 플러그인은 루트 `package.json`이 아닌 `app`패키지에 추가됩니다.
  Backstage 앱은 [Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)를
  사용하여 단일 저장소로 설정됩니다. CircleCI는 프론트엔드 UI 플러그인이므로 `backend`가 아닌 `app`에 들어갑니다.
  
2. 앱의 엔티티 페이지에 `EntityCircleCIContent` 확장을 추가:

   ```tsx title="packages/app/src/components/catalog/EntityPage.tsx"
   /* highlight-add-start */
   import {
     EntityCircleCIContent,
     isCircleCIAvailable,
   } from '@circleci/backstage-plugin';
   /* highlight-add-end */

   const cicdContent = (
     <EntitySwitch>
       {/* ... */}
       {/* highlight-add-next-line */}
       <EntitySwitch.Case if={isCircleCIAvailable}>
         <EntityCircleCIContent />
       </EntitySwitch.Case>
       ;{/* highlight-add-end */}
     </EntitySwitch>
   );
   ```

   이는 하나의 예시일뿐이지만 각 Backstage 인스턴스는 다양한 페이지, 탭 등 필요에 맞게 콘텐츠나 카드를 통합할 수 있습니다.
   또한 이 예제와 같은 일부 플러그인은 특정 소프트웨어 카탈로그 엔티티에 주석을 달거나 지원하도록 설계된 반면, 다른 플러그인은
   독립적인 방법으로 사용할 수 있으며 메인 네비게이션에 추가되는 것과 같이 `EntityPage` 외부에 추가됩니다.

3. _[선택사항]_ 프록시 설정 추가:

   외부 서비스에서 데이터를 수집하는 플러그인에는 프록시 서비스를 사용해야할 수도 있습니다. 이 플러그인은 CircleCI REST API에
   액세스하므로 프록시 정의가 필요합니다.

   ```yaml title="app-config.yaml"
   proxy:
     '/circleci/api':
       target: https://circleci.com/api/v1.1
       headers:
         Circle-Token: ${CIRCLECI_AUTH_TOKEN}
   ```

### 사이드바에 플러그인 페이지 추가

[@backstage/create-app](./create-an-app.md)로 생성된 표준 Backstage 에서 사이드바는 
`packages/app/src/components/Root/Root.tsx`내에서 관리됩니다. 파일은 앱의 전체 `Sidebar` 요소를
내보내며, 새로운 `SidebarItem` 요소를 추가하여 추가 항목으로 확장할 수 있습니다.

예를 들어 `api-docs` 플러그인을 설치할 경우 일치하는 `SidebarItem`은 다음과 같습니다.

```tsx title="packages/app/src/components/Root/Root.tsx"
// Import icon from Material UI
import ExtensionIcon from '@material-ui/icons/Extension';

// ... inside the AppSidebar component
<SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />;
```

자신만의 SV를 아이콘 구성 요소로 직접 사용할 수도 있습니다. Material UI에 따라 크기가 조정되었는지 
확인하세요. [SvgIcon](https://material-ui.com/api/svg-icon/) 기본값은 24x24px이고 확장자를
`.icon.svg`로 설정합니다. 다음 예시를 참고하세요:

```tsx
import InternalToolIcon from './internal-tool.icon.svg';
```

모바일 기기에서는 `Sidebar`가 화면 하단에 표시됩니다. 경험(experience)를 사용자 정의하려면 
`SidebarGroup`(Example 1)에서 `SidebarItems`를 그룹화하거나 링크가 있는 `SidebarGroup`을
생성할 수 있습니다(Example 2). 모든 `SidebarGroup`은 아이콘과 함께 하단 탐색에 표시됩니다.

```tsx
// Example 1
<SidebarGroup icon={<MenuIcon />} label="Menu">
  ...
  <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
  ...
<SidebarGroup />
```

```tsx
// Example 2
<SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
  ...
  <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
  ...
<SidebarGroup />
```

`SidebarGroup`이 제공되지 않으면 기본 메뉴에 `Sidebar` 콘텐츠가 표시됩니다.