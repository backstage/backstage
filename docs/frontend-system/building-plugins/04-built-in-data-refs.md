---
id: built-in-data-refs
title: Built-in data refs
sidebar_label: Built-in data refs
# prettier-ignore
description: Configuring or overriding built-in extension data references
---

To have a better understanding of extension data references please read [extension data section the extensions architecture documentation](../architecture/03-extensions.md#extension-data) first.

## Built-in extension data references

### Frontend Plugin API

#### Core Extension Data

| namespace |     name     |    type     |         id          |
| :-------: | :----------: | :---------: | :-----------------: |
|     -     | reactElement | JSX.Element | `core.reactElement` |
|     -     |  routePath   |   string    | `core.routing.path` |
|     -     |   routeRef   |  RouteRef   | `core.routing.ref`  |

####

|     namespace      |      name      |     type      |        id        |
| :----------------: | :------------: | :-----------: | :--------------: |
| createApiExtension | factoryDataRef | AnyApiFactory | core.api.factory |

####

|           namespace           |       name       |                 type                 |        id        |
| :---------------------------: | :--------------: | :----------------------------------: | :--------------: |
| createAppRootWrapperExtension | componentDataRef | ComponentType<PropsWithChildren<{}>> | app.root.wrapper |

####

|       namespace       |       name       |                 type                 |        id        |
| :-------------------: | :--------------: | :----------------------------------: | :--------------: |
| createRouterExtension | componentDataRef | ComponentType<PropsWithChildren<{}>> | app.root.wrapper |

####

```ts
type DataType = {
  title: string;
  icon: IconComponent;
  routeRef: RouteRef<undefined>;
};
```

|       namespace        |     name      |   type   |          id          |
| :--------------------: | :-----------: | :------: | :------------------: |
| createNavItemExtension | targetDataRef | DataType | core.nav-item.target |

####

```ts
type DataType = {
  logoIcon?: JSX.Element;
  logoFull?: JSX.Element;
};
```

|       namespace        |        name         |                 type                 |             id              |
| :--------------------: | :-----------------: | :----------------------------------: | :-------------------------: |
| createNavLogoExtension | logoElementsDataRef | ComponentType<PropsWithChildren<{}>> | core.nav-logo.logo-elements |

####

|         namespace         |       name       |              type              |             id              |
| :-----------------------: | :--------------: | :----------------------------: | :-------------------------: |
| createSignInPageExtension | componentDataRef | ComponentType<SignInPageProps> | core.sign-in-page.component |

####

|      namespace       |     name     |   type   |        id        |
| :------------------: | :----------: | :------: | :--------------: |
| createThemeExtension | themeDataRef | AppTheme | core.theme.theme |

####

```ts
type DataType = {
  ref: ComponentRef;
  impl: ComponentType;
};
```

|        namespace         |       name       |   type   |            id            |
| :----------------------: | :--------------: | :------: | :----------------------: |
| createComponentExtension | componentDataRef | DataType | core.component.component |

####

|         namespace          |        name        |                    type                    |              id              |
| :------------------------: | :----------------: | :----------------------------------------: | :--------------------------: |
| createTranslationExtension | translationDataRef | TranslationResource or TranslationMessages | core.translation.translation |
