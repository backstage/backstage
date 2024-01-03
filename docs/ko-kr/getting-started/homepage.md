---
id: homepage
title: Backstage 홈페이지 - 설치와 사용자화ß
description: 백스테이지 홈페이지 설정 및 사용자 관리에 관한 문서
---

## 홈페이지(Homepage)

좋은 Backstage 홈페이지를 갖추면 플랫폼의 검색 가능성이 크게 향상될 수 있습니다. 사용자가 홈페이지에서 바로 필요한 모든 것을 찾을 수 있기를 원하며 Backstage에서 직접 URL을 기억할 필요가 없습니다. [Home plugin](https://github.com/backstage/backstage/tree/master/plugins/home)에는 관련 정보를 표시하고 일반적인 작업에 대한 편리한 바로 가기를 제공하기 위해 Backstage 홈페이지를 구성하는 시스템이 도입되었습니다. 누구나 모든 컴포넌트에 기여하고 모든 홈페이지에 포함될 수 있는 개방형 생태계를 통해 구성 가능성을 염두에 두고 설계되었습니다.

앱 통합자(App Integrators)의 경우 시스템은 조직의 요구 사항에 맞는 홈페이지를 자유롭게 디자인할 수 있도록 구성 가능하도록 설계되었습니다. 홈페이지에 포함할 빌딩 블록에 기여하려는 구성 요소 개발자의 관점에서 보면 다양한 부분을 묶고 오류 경계와 표면 아래에서 처리되는 지연 로딩을 모두 사용하여 내보낼 수 있는 편리한 인터페이스가 있습니다.

이 튜토리얼이 끝나면 다음 결과를 기대할 수 있습니다:

- Backstage 앱은 소프트웨어 카탈로그 대신 전용 홈페이지를 갖습니다.
- 홈페이지의 구성 가능성과 조직에 맞게 홈페이지를 맞춤설정하는 방법을 이해합니다.

### 전제조건

시작하기 전에 다음 사항을 확인하세요.

- [backstage](https://github.com/backstage/backstage) 저장소의 포크를 사용하지 않고 [`@backstage/create-app`](index.md#create-your-backstage-app)을 사용하여 독립 실행형 Backstage 앱을 만들었습니다.
- 기존 홈페이지가 없으며 기본적으로 Backstage를 열면 소프트웨어 카탈로그로 리디렉션됩니다.

이제 홈 플러그인을 설치하고 Backstage 앱을 위한 간단한 홈페이지를 만들어 시작해 보겠습니다.

### 홈페이지 설치

#### 1. 플러그인 설치하기

```bash
# From your Backstage root directory
yarn add --cwd packages/app @backstage/plugin-home
```

#### 2. 새 홈페이지 구성요소 생성하기

`packages/app` 디렉토리 안에서 새로운 홈페이지 컴포넌트가 위치할 새 파일을 만듭니다. 다음 초기 코드를 사용하여 `packages/app/src/components/home/HomePage.tsx`를 생성합니다.

```tsx
import React from 'react';

export const HomePage = () => (
  /* We will shortly compose a pretty homepage here. */
  <h1>Welcome to Backstage!</h1>
);
```

#### 3. 루트 `/` 경로의 라우터 업데이트하기

아직 홈페이지가 없다면 카탈로그 홈페이지를 홈페이지로 사용하기 위한 리다이렉션 설정이 있을 가능성이 높습니다. 

`packages/app/src/App.tsx` 파일에서 다음을 찾으세요

```tsx title="packages/app/src/App.tsx"
const routes = (
  <FlatRoutes>
    <Navigate key="/" to="catalog" />
    {/* ... */}
  </FlatRoutes>
);
```

`<Navigate>` 줄을 바꾸고 이전 단계에서 만든 새 컴포넌트를 새 홈페이지로 사용하겠습니다.

```tsx title="packages/app/src/App.tsx"
/* highlight-add-start */
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { HomePage } from './components/home/HomePage';
/* highlight-add-end */

const routes = (
  <FlatRoutes>
    {/* highlight-remove-next-line */}
    <Navigate key="/" to="catalog" />
    {/* highlight-add-start */}
    <Route path="/" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>
    {/* highlight-add-end */}
    {/* ... */}
  </FlatRoutes>
);
```

#### 4. 사이드바 항목 업데이트하기

새 홈페이지를 가리키도록 Backstage 사이드바의 "Home" 경로를 업데이트해 보겠습니다. 또한 카탈로그를 빠르게 열 수 있도록 사이드바 항목도 추가하겠습니다.

| Before                                                                            | After                                                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| ![Sidebar without Catalog](../assets/getting-started/sidebar-without-catalog.png) | ![Sidebar with Catalog](../assets/getting-started/sidebar-with-catalog.png) |

Backstage 사이드 바의 코드는 [`packages/app/src/components/Root/Root.tsx`](https://github.com/backstage/backstage/blob/master/packages/app/src/components/Root/Root.tsx)내에 있을 가능성이 높습니다.

다음과 같이 변경해보겠습니다.

```tsx title="packages/app/src/components/Root/Root.tsx"
/* highlight-add-next-line */
import CategoryIcon from '@material-ui/icons/Category';

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      {/* ... */}
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* Global nav, not org-specific */}
        {/* highlight-remove-next-line */}
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
        {/* highlight-add-start */}
        <SidebarItem icon={HomeIcon} to="/" text="Home" />
        <SidebarItem icon={CategoryIcon} to="catalog" text="Catalog" />
        {/* highlight-add-end */}
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        <SidebarItem icon={LayersIcon} to="explore" text="Explore" />
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
        {/* End global nav */}
        <SidebarDivider />
        {/* ... */}
      </SidebarGroup>
    </Sidebar>
  </SidebarPage>
);
```

이게 전부입니다. 이제 _(약간 허전하지만)_ 홈페이지가 생겼습니다.!

<!-- todo: Needs zoomable plugin -->

![Screenshot of a blank homepage](../assets/getting-started/simple-homepage.png)

다음 단계에서는 더 흥미롭고 유용하게 만들겠습니다!

### 기본 템플릿 사용하기

홈페이지를 설정하는 데 사용할 기본 홈페이지 템플릿([storybook link](https://backstage.io/storybook/?path=/story/plugins-home-templates--default-template))이 있습니다. 자세한 내용은 Backstage 홈페이지 템플릿에 대한 [blog post announcement](https://backstage.io/blog/2022/01/25/backstage-homepage-templates)를 확인하세요.

<!-- TODO for later: detailed instructions for using one of these templates. -->

### 홈페이지 작성하기

홈페이지를 구성하는 것은 일반 React 구성 요소를 만드는 것과 다르지 않습니다. 즉, App Integrator는 
원하는 콘텐츠를 자유롭게 포함할 수 있습니다. 하지만 홈페이지를 염두에 두고 개발된 컴포넌트도 있습니다. 
홈페이지 구성 시 사용할 컴포넌트를 찾고 있다면 스토리북의 [홈페이지 컴포넌트 모음](https://backstage.io/storybook?path=/story/plugins-home-components)
을 살펴보시면 됩니다.귀하의 필요에 맞는 구성 요소를 찾지 못했지만 기여를 원하는 경우 
[기여 문서](https://github.com/backstage/backstage/blob/master/plugins/home/README.md#contributing)를 확인하세요.

> 사용 가능한 홈페이지 템플릿 . 중하나를 사용하려면 "Home" 플러그인 아래 스토리 북에서 
> [템플릿](https://backstage.io/storybook/?path=/story/plugins-home-templates)를
> 찾을 수 있습니다. 그리고 템플릿을 기여하고 싶다면 
> [기여 문서](https://github.com/backstage/backstage/blob/master/plugins/home/README.md#contributing) 를 참조하세요

```tsx
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { HomePageCompanyLogo } from '@backstage/plugin-home';

export const homePage = (
  <Grid container spacing={3}>
    <Grid item xs={12} md={4}>
      <HomePageCompanyLogo />
    </Grid>
  </Grid>
);
```
