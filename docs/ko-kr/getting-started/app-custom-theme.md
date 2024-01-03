---
id: app-custom-theme
title: 사용자의 성향에 맞게 설정하세요
description: 사용자 설정에 관한 문서
---

Backstage에는 밝은 모드와 어두운 모드 변경이 포함된 기본 테마가 함께 제공됩니다. 테마는 
[`@backstage/theme`](https://www.npmjs.com/package/@backstage/theme) 패키지의 
일부로 제공되며, 여기에는 기본 테마를 사용자 정의하거나 완전히 새로운 테마를 생성하기 위한 유틸리티도
포함되어 있습니다.

## 사용자 정의 테마 만들기

새 테마를 생성하는 가장 쉬운 방법은 [`@backstage/theme`](https://www.npmjs.com/package/@backstage/theme)
패키지에서 내보낸 `createTheme` 함수를 사용하는 것입니다. 이를 사용하여 색상 팔레트 및 글꼴과 같은 기본 테마의 
일부 기본 매개변수를 재정의할 수 있습니다.

예를ㄷ르어 다음과같은 기본 밝은 테마를 기반으로 새 테마를 만들 수 있습니다:

```ts
import { createTheme, lightTheme } from '@backstage/theme';

const myTheme = createTheme({
  palette: lightTheme.palette,
  fontFamily: 'Comic Sans MS',
  defaultPageTheme: 'home',
});
```

테마를 더 세밀하게 제어하고 싶다면, 예를 들어 글꼴 크기와 여백을 맞춤설정하려면 
['@backstage/theme](https://www.npmjs.com/package/@backstage/theme)에서 내보낸 하위 수준의 
'createThemeOverrides' 기능을 ['@material-ui/core](https://www.npmjs.com/package/@material-ui/core)의 
['createTheme'](https://material-ui.com/customization/theming/#createmuitheme-options-args-theme)와 
조합하여 사용할 수 있습니다. "Overriding Backstage and Material UI css rules"를 참조하세요

또한 [`@backstage/theme`](https://www.npmjs.com/package/@backstage/theme)에서 내보낸
`BackstageTheme`유형과 일치하는 테마를 처음부터 새로 만들 수도 있습니다.
자세한 내용은 [Material UI docs on theming](https://material-ui.com/customization/theming/)를 참조하세요.

## 사용자 정의 테마 사용하기

Backstage 앱에 사용자 정의 테마를 추가하려면 이를 `createApp`에 구성으로 전달합니다.

예를 들어 이전 섹션에서 만든 테마를 추가하는 작업은 다음과 같이 수행할 수 있습니다:

```tsx
import { createApp } from '@backstage/app-defaults';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import LightIcon from '@material-ui/icons/WbSunny';

const app = createApp({
  apis: ...,
  plugins: ...,
  themes: [{
    id: 'my-theme',
    title: 'My Custom Theme',
    variant: 'light',
    icon: <LightIcon />,
    Provider: ({ children }) => (
      <ThemeProvider theme={myTheme}>
        <CssBaseline>{children}</CssBaseline>
      </ThemeProvider>
    ),
  }]
})
```


사용자 정의 테마 목록은 기본 테마보다 우선 적용됩니다.
여전히 기본 테마를 사용하고 싶다면 [`@backstage/theme`](https://www.npmjs.com/package/@backstage/theme)에서 
`lightTheme` 및 `darkTheme`로 내보내집니다.

## Example of a custom theme

```ts
import {
  createTheme,
  genPageTheme,
  lightTheme,
  shapes,
} from '@backstage/theme';

const myTheme = createTheme({
  palette: {
    ...lightTheme.palette,
    primary: {
      main: '#343b58',
    },
    secondary: {
      main: '#565a6e',
    },
    error: {
      main: '#8c4351',
    },
    warning: {
      main: '#8f5e15',
    },
    info: {
      main: '#34548a',
    },
    success: {
      main: '#485e30',
    },
    background: {
      default: '#d5d6db',
      paper: '#d5d6db',
    },
    banner: {
      info: '#34548a',
      error: '#8c4351',
      text: '#343b58',
      link: '#565a6e',
    },
    errorBackground: '#8c4351',
    warningBackground: '#8f5e15',
    infoBackground: '#343b58',
    navigation: {
      background: '#343b58',
      indicator: '#8f5e15',
      color: '#d5d6db',
      selectedColor: '#ffffff',
    },
  },
  defaultPageTheme: 'home',
  fontFamily: 'Comic Sans MS',
  /* below drives the header colors */
  pageTheme: {
    home: genPageTheme({ colors: ['#8c4351', '#343b58'], shape: shapes.wave }),
    documentation: genPageTheme({
      colors: ['#8c4351', '#343b58'],
      shape: shapes.wave2,
    }),
    tool: genPageTheme({ colors: ['#8c4351', '#343b58'], shape: shapes.round }),
    service: genPageTheme({
      colors: ['#8c4351', '#343b58'],
      shape: shapes.wave,
    }),
    website: genPageTheme({
      colors: ['#8c4351', '#343b58'],
      shape: shapes.wave,
    }),
    library: genPageTheme({
      colors: ['#8c4351', '#343b58'],
      shape: shapes.wave,
    }),
    other: genPageTheme({ colors: ['#8c4351', '#343b58'], shape: shapes.wave }),
    app: genPageTheme({ colors: ['#8c4351', '#343b58'], shape: shapes.wave }),
    apis: genPageTheme({ colors: ['#8c4351', '#343b58'], shape: shapes.wave }),
  },
});
```

Backstage 와 Material UI 구성 요소 재정의를 포함한 사용자 정의 테마의 전체 예를 보려면 
[Backstage demo site](https://demo.backstage.io)에서 
[Aperture theme](https://github.com/backstage/demo/blob/master/packages/app/src/theme/aperture.ts)를
확인하세요.

## Backstage 및 Material UI 컴포넌트 스타일 재정의

사용자 정의 테마를 만들 때 테마 개체를 사용하는 구성 요소의 CSS 규칙에 다른 값을 적용하게 됩니다.
예를들어, Backstage 컴포넌트의 스타일은 다음과 같습니다:

```tsx
const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    header: {
      padding: theme.spacing(3),
      boxShadow: '0 0 8px 3px rgba(20, 20, 20, 0.3)',
      backgroundImage: theme.page.backgroundImage,
    },
  }),
  { name: 'BackstageHeader' },
);
```

주목할 점은 `padding`이 `theme.spacing`에서 값을 얻은 방법입니다 
즉, 사용자 정의 테마에 띄어쓰기 값을 설정하면 . 이구성 요소 패딩 속성에 영향을 미치며,
`theme.page.backgroundImage`를 사용하는 `backgroundImage`도 마찬가지입니다.
그러나 'boxShadow' 속성은 테마의 값을 참조하지 않으므로 사용자 정의 테마를 생성하면 'box-Shadow' 속성을 
변경하거나 여백처럼 정의되지 않은 css 규칙을 추가하기에 충분하지 않습니다. 이러한 경우에는 재정의도 만들어야 합니다.

```tsx
import { createApp } from '@backstage/core-app-api';
import { BackstageTheme, lightTheme } from '@backstage/theme';
/**
 * The `@backstage/core-components` package exposes this type that
 * contains all Backstage and `material-ui` components that can be
 * overridden along with the classes key those components use.
 */
import { BackstageOverrides } from '@backstage/core-components';

export const createCustomThemeOverrides = (
  theme: BackstageTheme,
): BackstageOverrides => {
  return {
    BackstageHeader: {
      header: {
        width: 'auto',
        margin: '20px',
        boxShadow: 'none',
        borderBottom: `4px solid ${theme.palette.primary.main}`,
      },
    },
  };
};

const customTheme: BackstageTheme = {
  ...lightTheme,
  overrides: {
    // These are the overrides that Backstage applies to `material-ui` components
    ...lightTheme.overrides,
    // These are your custom overrides, either to `material-ui` or Backstage components.
    ...createCustomThemeOverrides(lightTheme),
  },
};

const app = createApp({
  apis: ...,
  plugins: ...,
  themes: [{
    id: 'my-theme',
    title: 'My Custom Theme',
    variant: 'light',
    Provider: ({ children }) => (
      <ThemeProvider theme={customTheme}>
        <CssBaseline>{children}</CssBaseline>
      </ThemeProvider>
    ),
  }]
});
```

## 사용자 정의 로고

사용자 정의 테마 외에도 사이트 왼쪽 상단에 표시되는 로고도 사용자 정의할 수 있습니다.

프런트엔드 앱에서 `src/comComponents/Root/` 폴더를 찾습니다. 두 가지 구성 요소를 찾을 수 있습니다:

- `LogoFull.tsx` - 사이드바 탐색이 열릴 때 사용되는 더 큰 로고.
- `LogoIcon.tsx` - 사이드바 탐색이 닫힐 때 사용되는 작은 로고.

이미지를 바꾸려면 해당 구성 요소의 관련 코드를 raw SVG 정의로 바꾸면 됩니다.

PNG와 같은 다른 웹 이미지 포맷을 가져와서 사용할 수도 있습니다. 이 경우 새 이미지를 
`src/comComponents/Root/logo/my-company-logo.png`와 같은 새 하위 디렉터리에 
배치한 후 다음 코드를 추가하세요.

```tsx
import MyCustomLogoFull from './logo/my-company-logo.png';

const LogoFull = () => {
  return <img src={MyCustomLogoFull} />;
};
```

## 아이콘

지금까지 자신만의 테마를 만들고 로고를 추가하는 방법을 살펴보았습니다. 다음 섹션에서는 기존 아이콘을 재정의하는 방법과 더 많은 아이콘을 추가하는 방법을 보여드리겠습니다.

### 사용자 정의 아이콘

프로젝트의 _default_ 아이콘을 사용자 정의할 수도 있습니다.

다음을 참조해 변경할 수 있습니다[icons](https://github.com/backstage/backstage/blob/master/packages/app-defaults/src/defaults/icons.tsx).

#### 요구사항

- `.svg` 형식의 파일
- 아이콘용으로 생성된 React 구성 요소

#### 리액트 컴포넌트 생성

프런트엔드 애플리케이션에서 `src` 폴더를 찾습니다. 'assets/icons' 디렉터리와 'CustomIcons.tsx' 파일을 만드는 것이 좋습니다.

> 밝은 테마와 어두운 테마에서 적절한 동작을 보장하려면 
[here](https://github.com/backstage/backstage/blob/master/plugins/azure-devops/src/components/AzurePipelinesIcon/AzurePipelinesIcon.tsx)
에서 또 다른 테마의 예제를 확인하세요.

```tsx title="customIcons.tsx"
import { SvgIcon, SvgIconProps } from '@material-ui/core';

import React from 'react';

export const ExampleIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      width="1em"
      height="1em"
      display="inline-block"
      d="M11.6335 10.8398C11.6335 11.6563 12.065 12.9922 13.0863 12.9922C14.1075 12.9922 14.539 11.6563 14.539 10.8398C14.539 10.0234 14.1075 8.6875 13.0863 8.6875C12.065 8.6875 11.6335 10.0234 11.6335 10.8398V10.8398ZM2.38419e-07 8.86719C2.38419e-07 10.1133 0.126667 11.4336 0.692709 12.5781C2.19292 15.5703 6.3175 15.5 9.27042 15.5C12.2708 15.5 16.6408 15.6055 18.2004 12.5781C18.7783 11.4453 19 10.1133 19 8.86719C19 7.23047 18.4498 5.68359 17.3573 4.42969C17.5631 3.8125 17.6621 3.16406 17.6621 2.52344C17.6621 1.68359 17.4681 1.26172 17.0842 0.5C15.291 0.5 14.1431 0.851562 12.7775 1.90625C11.6296 1.63672 10.45 1.51562 9.26646 1.51562C8.19771 1.51562 7.12104 1.62891 6.08396 1.875C4.73813 0.832031 3.59021 0.5 1.81687 0.5C1.42896 1.26172 1.23896 1.68359 1.23896 2.52344C1.23896 3.16406 1.34188 3.80078 1.54375 4.40625C0.455209 5.67188 2.38419e-07 7.23047 2.38419e-07 8.86719V8.86719ZM2.54521 10.8398C2.54521 9.125 3.60208 7.61328 5.45458 7.61328C6.20271 7.61328 6.91917 7.74609 7.67125 7.84766C8.26104 7.9375 8.85083 7.97266 9.45646 7.97266C10.0581 7.97266 10.6479 7.9375 11.2417 7.84766C11.9819 7.74609 12.7063 7.61328 13.4583 7.61328C15.3108 7.61328 16.3677 9.125 16.3677 10.8398C16.3677 14.2695 13.1852 14.7969 10.4144 14.7969H8.50646C5.72375 14.7969 2.54521 14.2734 2.54521 10.8398V10.8398ZM5.81479 8.6875C6.83604 8.6875 7.2675 10.0234 7.2675 10.8398C7.2675 11.6563 6.83604 12.9922 5.81479 12.9922C4.79354 12.9922 4.36208 11.6563 4.36208 10.8398C4.36208 10.0234 4.79354 8.6875 5.81479 8.6875Z"
    />
  </SvgIcon>
);
```

#### 사용자 정의 아이콘 사용하기

`packages/app/src/App.tsx`에 사용자 정의 아이콘을 제공하세요.

```tsx title="packages/app/src/App.tsx"
/* highlight-add-next-line */
import { ExampleIcon } from './assets/customIcons'


const app = createApp({
  apis,
  components: {
    {/* ... */}
  },
  themes: [
    {/* ... */}
  ],
  /* highlight-add-start */
  icons: {
    github: ExampleIcon,
  },
  /* highlight-add-end */
  bindRoutes({ bind }) {
    {/* ... */}
  }
})
```

### 아이콘 추가하기

[default icons](https://github.com/backstage/backstage/blob/master/packages/app-defaults/src/defaults/icons.tsx)이 
요구 사항에 맞지 않는 경우 더 많은 아이콘을 추가하여 엔터티의 링크와 같은 다른 위치에서 사용할 수 있습니다.
이 예에서는 [Material UI](https://v4.mui.com/components/material-icons/)의 아이콘, 특히 `AlarmIcon`을 사용합니다. 
이를 수행하는 방법은 다음과 같습니다.

1. 먼저 `/packages/app/src` 내의 `App.tsx` 파일을 여세요.
2. 그런 다음 아이콘을 가져오려면 나머지 가져오기에 다음을 추가하세요. `import AlarmIcon from '@material-ui/icons/Alarm';`
3. 다음으로 `createApp`에 다음과 같은 아이콘을 추가합니다:

   ```tsx title="packages/app/src/App.tsx"
   const app = createApp({
     apis: ...,
     plugins: ...,
     /* highlight-add-start */
     icons: {
       alert: AlarmIcon,
     },
   /* highlight-add-end */
     themes: ...,
     components: ...,
   });
   ```

4. 이제 다음과 같이 엔터티 링크에서 아이콘에 대한 '경고'를 참조할 수 있습니다:

   ```yaml
   apiVersion: backstage.io/v1alpha1
   kind: Component
   metadata:
     name: artist-lookup
     description: Artist Lookup
     links:
       - url: https://example.com/alert
         title: Alerts
         icon: alert
   ```

   결과는 다음과 같습니다:

   ![Example Link with Alert icon](../assets/getting-started/add-icons-links-example.png)

   이러한 아이콘을 사용할 수 있는 또 다른 방법은 다음과 같이 `AppContext`에서 사용하는 것입니다.:

   ```ts
   import { useApp } from '@backstage/core-plugin-api';

   const app = useApp();
   const alertIcon = app.getSystemIcon('alert');
   ```

   여러 위치에서 사용하려는 아이콘이 있는 경우 이 방법을 사용할 수 있습니다.

참고: 아이콘을 기본 아이콘 중 하나로 사용할 수 없거나 추가한 아이콘으로 사용할 수 없는 경우 머티리얼 UI의 `LanguageIcon`으로 대체됩니다.

## 사용자 정의 사이드바

지금까지 살펴본 것처럼 Backstage 앱을 사용자 정의할 수 있는 방법은 다양합니다. 다음 섹션에서는 사이드바를 사용자 정의하는 방법을 보여줍니다.

### 사이드바 하위 메뉴

이 예에서는 하위 메뉴로 사이드바를 확장하는 방법을 보여 드리겠습니다:

1. 사이드바 코드가 있는 `packages/app/src/comComponents/Root`에 있는 `Root.tsx` 파일을 엽니다.
2. 그런 다음 `useApp`에 대해 다음 내용을 추가하려고 합니다:

   ```tsx title="packages/app/src/components/Root/Root.tsx"
   import { useApp } from '@backstage/core-plugin-api';
   ```

3. 그런 다음 `@backstage/core-comComponents` 가져오기를 다음과 같이 수정합니다.

   ```tsx
   import {
     Sidebar,
     sidebarConfig,
     SidebarDivider,
     SidebarGroup,
     SidebarItem,
     SidebarPage,
     SidebarScrollWrapper,
     SidebarSpace,
     useSidebarOpenState,
     Link,
     /* highlight-add-start */
     GroupIcon,
     SidebarSubmenu,
     SidebarSubmenuItem,
     /* highlight-add-end */
   } from '@backstage/core-components';
   ```

4. 마지막으로 `<SidebarItem icon={HomeIcon} to="catalog" text="Home" />` 를 수정합니다:

   ```tsx
   <SidebarItem icon={HomeIcon} to="catalog" text="Home">
     <SidebarSubmenu title="Catalog">
       <SidebarSubmenuItem
         title="Domains"
         to="catalog?filters[kind]=domain"
         icon={useApp().getSystemIcon('kind:domain')}
       />
       <SidebarSubmenuItem
         title="Systems"
         to="catalog?filters[kind]=system"
         icon={useApp().getSystemIcon('kind:system')}
       />
       <SidebarSubmenuItem
         title="Components"
         to="catalog?filters[kind]=component"
         icon={useApp().getSystemIcon('kind:component')}
       />
       <SidebarSubmenuItem
         title="APIs"
         to="catalog?filters[kind]=api"
         icon={useApp().getSystemIcon('kind:api')}
       />
       <SidebarDivider />
       <SidebarSubmenuItem
         title="Resources"
         to="catalog?filters[kind]=resource"
         icon={useApp().getSystemIcon('kind:resource')}
       />
       <SidebarDivider />
       <SidebarSubmenuItem
         title="Groups"
         to="catalog?filters[kind]=group"
         icon={useApp().getSystemIcon('kind:group')}
       />
       <SidebarSubmenuItem
         title="Users"
         to="catalog?filters[kind]=user"
         icon={useApp().getSystemIcon('kind:user')}
       />
     </SidebarSubmenu>
   </SidebarItem>
   ```

Backstage 앱을 실행하면 사이드바의 Home option 위로 마우스 커서를 올리면 카탈로그의 다양한 종류에대한 링크가 포함된 하유 메뉴가 다음과 같이 보일것입니다.

![Sidebar sub-menu example](./../assets/getting-started/sidebar-submenu-example.png)

[Storybook Sidebar examples](https://backstage.io/storybook/?path=/story/layout-sidebar--sample-scalable-sidebar)에서 이를 사용하는 방법을 볼 수 있습니다.

## 사용자 정의 홈페이지

사용자 정의 테마, 사용자 정의 로고 외에도 앱 홈페이지를 사용자 정의할 수도 있습니다. [다음 페이지](homepage.md)에서 전체 가이드를 읽어보세요.

## Material UI v5 로 이전

이제 Backstage에서 Material UI v5를 지원합니다. 시작하려면 [마이그레이션 가이드](../tutorials/ migration-to-mui5.md)를 확인하세요.
