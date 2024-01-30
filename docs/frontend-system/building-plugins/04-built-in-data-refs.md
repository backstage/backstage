---
id: built-in-data-refs
title: Built-in data refs
sidebar_label: Built-in data refs
# prettier-ignore
description: Configuring or overriding built-in extension data references
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

To have a better understanding of extension data references please read [extension data section the extensions architecture documentation](../architecture/03-extensions.md#extension-data) first.

## Built-in extension data references

Data references help to define the inputs and outputs of an extension. A data ref is uniquely identified through its `id`. Through the data ref, strong typing is enforced for the input/output of the extension.

### Core Extension Data

Commonly used `ExtensionDataRef`s for extensions.

| namespace |     name     |     type      |         id          |
| :-------: | :----------: | :-----------: | :-----------------: |
|     -     | reactElement | `JSX.Element` | `core.reactElement` |
|     -     |  routePath   |   `string`    | `core.routing.path` |
|     -     |   routeRef   |  `RouteRef`   | `core.routing.ref`  |

### Core API Data

|     namespace      |      name      |      type       |         id         |
| :----------------: | :------------: | :-------------: | :----------------: |
| createApiExtension | factoryDataRef | `AnyApiFactory` | `core.api.factory` |

### Core Navigation

#### Item Data

```ts
type DataType = {
  title: string;
  icon: IconComponent;
  routeRef: RouteRef<undefined>;
};
```

|       namespace        |     name      |    type    |           id           |
| :--------------------: | :-----------: | :--------: | :--------------------: |
| createNavItemExtension | targetDataRef | `DataType` | `core.nav-item.target` |

#### Logo Data

```ts
type DataType = {
  logoIcon?: JSX.Element;
  logoFull?: JSX.Element;
};
```

|       namespace        |        name         |                  type                  |              id               |
| :--------------------: | :-----------------: | :------------------------------------: | :---------------------------: |
| createNavLogoExtension | logoElementsDataRef | `ComponentType<PropsWithChildren<{}>>` | `core.nav-logo.logo-elements` |

### Core App Components Data

|         namespace         |       name       |               type               |              id               |
| :-----------------------: | :--------------: | :------------------------------: | :---------------------------: |
| createSignInPageExtension | componentDataRef | `ComponentType<SignInPageProps>` | `core.sign-in-page.component` |

### Core Theme Data

|      namespace       |     name     |    type    |         id         |
| :------------------: | :----------: | :--------: | :----------------: |
| createThemeExtension | themeDataRef | `AppTheme` | `core.theme.theme` |

### Core Components

```ts
type DataType = {
  ref: ComponentRef;
  impl: ComponentType;
};
```

|        namespace         |       name       |    type    |             id             |
| :----------------------: | :--------------: | :--------: | :------------------------: |
| createComponentExtension | componentDataRef | `DataType` | `core.component.component` |

### Core Translation

|         namespace          |        name        |                      type                      |               id               |
| :------------------------: | :----------------: | :--------------------------------------------: | :----------------------------: |
| createTranslationExtension | translationDataRef | `TranslationResource` or `TranslationMessages` | `core.translation.translation` |

### App Root

|           namespace           |       name       |                  type                  |         id         |
| :---------------------------: | :--------------: | :------------------------------------: | :----------------: |
| createAppRootWrapperExtension | componentDataRef | `ComponentType<PropsWithChildren<{}>>` | `app.root.wrapper` |

### App Router

|       namespace       |       name       |                  type                  |          id          |
| :-------------------: | :--------------: | :------------------------------------: | :------------------: |
| createRouterExtension | componentDataRef | `ComponentType<PropsWithChildren<{}>>` | `app.router.wrapper` |
