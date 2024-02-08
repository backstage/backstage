---
id: built-in-extensions
title: App Built-in Extensions
sidebar_label: Built-in extensions
# prettier-ignore
description: Configuring or overriding built-in extensions
---

Built-in extensions are default app extensions that are always installed when you create a Backstage app.

## Disable built-in extensions

All built-in extensions can be disabled in the same way as you disable any other extension:

```yaml title="app-config.yaml"
extensions:
  # Disabling the built-in app root alert element
  - app-root-element:app/alert-display: false
```

:::warning
Be careful when disabling built-in extensions, as there may be other extensions depending on their existence. For example, the built-in "alert display" extension displays messages retrieved via [AlertApi](https://backstage.io/docs/reference/core-plugin-api.alertapi) and disabling this extension will cause the application to no longer display these messages unless you install another extension that displays messages from `AlertApi`.
:::

## Override built-in extensions

You can override any built-in extension whenever their customizations, whether through configuration or input, do not meet a use case for your Backstage instance. Check out [this](../architecture/05-extension-overrides.md) documentation on how to override application extensions.

:::warning
Be aware there could be some implementation requirements to properly override an built-in extension, such as using same apis and do not remove inputs or configurations otherwise you can cause a side effect in other parts of the system that expects same minimal behavior.
:::

## Default built-in extensions

### App

This extension is the first extension attached to the extension tree. It is responsible for receiving the application's root element and other Frontend framework inputs.

#### Inputs

| Name         | Description                | Type                                                                                                                                                   | Optional | Default                                                   | Extension creator                                                                                                |
| ------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| root         | The app root element.      | [coreExtensionData.reactElement](https://backstage.io/docs/reference/frontend-plugin-api.coreextensiondata)                                            | false    | The [`App/Root`](#app-root) extension output.             | No creator available, configure or override the [`App/Root`](#app-root) extension.                               |
| apis         | The app apis factories.    | [createApiExtension.factoryDataRef](https://backstage.io/docs/reference/frontend-plugin-api.createapiextension.factorydataref)                         | false    | See [default apis](#default-apis-extensions).             | [createApiExtension](https://backstage.io/docs/reference/frontend-plugin-api.createapiextension)                 |
| themes       | The app themes list.       | [createThemeExtension.themeDataRef](https://backstage.io/docs/reference/frontend-plugin-api.createthemeextension.themedataref)                         | false    | See [default themes](#default-theme-extensions).          | [createThemeExtension](https://backstage.io/docs/reference/frontend-plugin-api.createthemeextension)             |
| components   | The app components list.   | [createComponentExtension.componentDataRef](https://backstage.io/docs/reference/frontend-plugin-api.createcomponentextension.componentdataref)         | false    | See [default components](#default-components-extensions). | [createComponentExtension](https://backstage.io/docs/reference/frontend-plugin-api.createcomponentextension)     |
| translations | The app translations list. | [createTranslationExtension.translationDataRef](https://backstage.io/docs/reference/frontend-plugin-api.createtranslationextension.translationdataref) | false    | -                                                         | [createTranslationExtension](https://backstage.io/docs/reference/frontend-plugin-api.createtranslationextension) |

#### Default theme extensions

Extensions that provides default theme inputs for the `App` extension.

| kind  | namespace | name  |        id         |
| :---: | :-------: | :---: | :---------------: |
| theme |    app    | light | `theme:app/light` |
| theme |    app    | dark  | `theme:app/dark`  |

#### Default components extensions

Extensions that provides default components inputs for the `App` extension.

|    kind    | namespace |                 name                  |                           id                           |
| :--------: | :-------: | :-----------------------------------: | :----------------------------------------------------: |
| components |    app    |       core.components.progress        |       `components:app/core.components.progress`        |
| components |    app    |   core.components.notFoundErrorPage   |   `components:app/core.components.notFoundErrorPage`   |
| components |    app    | core.components.errorBoundaryFallback | `components:app/core.components.errorBoundaryFallback` |

#### Default apis extensions

Extensions that provides default apis inputs for the `App` extension.

| kind |         namespace          | name |                id                |
| :--: | :------------------------: | :--: | :------------------------------: |
| api  |       core.discovery       |  -   |       `api:core.discovery`       |
| api  |         core.alert         |  -   |         `api:core.alert`         |
| api  |       core.analytics       |  -   |       `api:core.analytics`       |
| api  |         core.error         |  -   |         `api:core.error`         |
| api  |        core.storage        |  -   |        `api:core.storage`        |
| api  |         core.fetch         |  -   |         `api:core.fetch`         |
| api  |     core.oauthrequest      |  -   |     `api:core.oauthrequest`      |
| api  |      core.auth.google      |  -   |      `api:core.auth.google`      |
| api  |    core.auth.microsoft     |  -   |    `api:core.auth.microsoft`     |
| api  |      core.auth.github      |  -   |      `api:core.auth.github`      |
| api  |       core.auth.okta       |  -   |       `api:core.auth.okta`       |
| api  |      core.auth.gitlab      |  -   |      `api:core.auth.gitlab`      |
| api  |     core.auth.onelogin     |  -   |     `api:core.auth.onelogin`     |
| api  |    core.auth.bitbucket     |  -   |    `api:core.auth.bitbucket`     |
| api  | core.auth.bitbucket-server |  -   | `api:core.auth.bitbucket-server` |
| api  |    core.auth.atlassian     |  -   |    `api:core.auth.atlassian`     |
| api  |   plugin.permission.api    |  -   |   `api:plugin.permission.api`    |

### App root

This is the extension that creates the app root element, so it renders root level components such as app router and layout.

#### Inputs

| Name       | Description                                                                             | Requirements                                                                                                                                                               | Optional | Default                                                                                                                                                                                      | Extension creator                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| router     | A React component that should manager the app routes context.                           | It must be one [router](https://reactrouter.com/en/main/routers/picking-a-router#web-projects) component or a custom component compatible with the 'react-router' library. | true     | [BrowserRouter](https://reactrouter.com/en/main/router-components/browser-router)                                                                                                            | [createRouterExtension](https://backstage.io/docs/reference/frontend-plugin-api.createrouterextension)                  |
| signInPage | A React component that should render the app sign-in page.                              | Should call the `onSignInSuccess` prop when the user has been successfully authorized, otherwise the user will not be correctly redirected to the application home page.   | true     | The default `AppRoot` extension does not use a default component for this input, it bypasses the user authentication check and always renders all routes when a login page is not installed. | [createSignInPageExtension](https://backstage.io/docs/reference/frontend-plugin-api.createsigninpageextension/)         |
| children   | A React component that renders the app sidebar and main content in a particular layout. | -                                                                                                                                                                          | false    | The [`App/Layout`](#app-layout) extension output.                                                                                                                                            | No creator available, configure or override the [`App/Layout`](#app-layout) extension.                                  |
| elements   | React elements to be rendered outside of the app layout, such as shared popups.         | -                                                                                                                                                                          | false    | See [default elements](#default-app-root-elements-extensions).                                                                                                                               | [createAppRootElementExtension](https://backstage.io/docs/reference/frontend-plugin-api.createapprootelementextension/) |
| wrappers   | React components that should wrap the root element.                                     | -                                                                                                                                                                          | true     | -                                                                                                                                                                                            | [createAppRootWrapperExtension](https://backstage.io/docs/reference/frontend-plugin-api.createapprootwrapperextension/) |

#### Default app root elements extensions

##### Alert Display

An app root element extension that displays messages posted via the [`AlertApi`](https://backstage.io/docs/reference/core-plugin-api.alertapi).

|       kind       | namespace |     name      |                  id                  |
| :--------------: | :-------: | :-----------: | :----------------------------------: |
| app-root-element |    app    | alert-display | `app-root-element:app/alert-display` |

###### Configurations

| Key                  | Type                                                                       | Default value                             | Description                                                       |
| -------------------- | -------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| `transientTimeoutMs` | number                                                                     | 5000                                      | Time in milliseconds to wait before displaying messages.          |
| `anchorOrigin`       | { vertical: 'top' \| 'bottom', horizontal: 'left' \| 'center' \| 'right' } | { vertical: 'top', horizontal: 'center' } | Position on the screen where the message alert will be displayed. |

###### Override or disable the extension

If you do not want to display alerts, disable this extension or if the available settings do not meet your needs, override this extension.

:::warning
The built-in "alert display" extension displays messages retrieved via [AlertApi](https://backstage.io/docs/reference/core-plugin-api.alertapi) and disabling this extension will cause the application to no longer display these messages unless you install another extension that displays messages from `AlertApi`.
:::

##### OAuth Request Dialog

An app root element extension that renders the oauth request dialog, it is based on the [oauthRequestApi](https://backstage.io/docs/reference/core-plugin-api.oauthrequestapi/).

|       kind       | namespace |         name         |                     id                      |
| :--------------: | :-------: | :------------------: | :-----------------------------------------: |
| app-root-element |    app    | oauth-request-dialog | `app-root-element:app/oauth-request-dialog` |

### App layout

Renders the app's sidebar and content in a specific layout.

| kind | namespace |  name  |      id      |
| :--: | :-------: | :----: | :----------: |
|  -   |    app    | layout | `app/layout` |

#### Inputs

| Name    | Description                                   | Type                                                                                                        | Optional | Default | Extension creator                    |
| ------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------- | ------- | ------------------------------------ |
| nav     | A React element that renders the app sidebar. | [coreExtensionData.reactElement](https://backstage.io/docs/reference/frontend-plugin-api.coreextensiondata) | false    | -       | Override the `App/Nav` extension.    |
| content | A React element that renders the app content. | [coreExtensionData.reactElement](https://backstage.io/docs/reference/frontend-plugin-api.coreextensiondata) | false    | -       | Override the `App/Routes` extension. |

### App nav

Extension responsible for rendering the logo and items in the app's sidebar.

| kind | namespace | name |    id     |
| :--: | :-------: | :--: | :-------: |
|  -   |    app    | nav  | `app/nav` |

#### Inputs

| Name  | Description               | Type                                                                                                                                             | Optional | Default | Extension creator                                                                                        |
| ----- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------- | -------------------------------------------------------------------------------------------------------- |
| logos | A nav logos object.       | [createNavLogoExtension.logoElementsDataRef](https://backstage.io/docs/reference/frontend-plugin-api.createnavlogoextension.logoelementsdataref) | true     | -       | [createNavLogoExtension](https://backstage.io/docs/reference/frontend-plugin-api.createnavlogoextension) |
| items | Nav items target objects. | [createNavItemExtension.targetDataRef](https://backstage.io/docs/reference/frontend-plugin-api.createnavitemextension.targetdataref)             | true     | -       | [createNavItemExtension](https://backstage.io/docs/reference/frontend-plugin-api.createnavitemextension) |

### App routes

Renders a route element for each route received as input and a `NotFoundErrorPage` component.

| kind | namespace |  name  |      id      |
| :--: | :-------: | :----: | :----------: |
|  -   |    app    | routes | `app/routes` |

#### Caveats

Be careful when overriding this extension, as to do so correctly you must consider these implementation requirements:

- The routing system is managed by more than one extension, and they all use `react-router` behind the scenes. There are also some utilities that are based on the same `routing` library like `useRouteRefParams`. Therefore, you cannot use a different library without causing side effects in these other extensions and helper utilities;
- Don't remove configs or inputs, just extend these things yourself with optional new options, otherwise it will cause breaking changes for extensions like `createPageExtension` that depend on this type of inputs;
- Remember to user the route refs for getting paths dynamically, otherwise if an adopter modifies a path through configuration, the route is not going to point to the configured path;
- Adopters expect to be able to customize the `NotFoundErrorPage` component via Components API, you should render this component for routes not configured.

#### Inputs

| Name   | Description             | Type                                                                                                                         | Optional | Default | Extension creator                                                                                  |
| ------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- | ------- | -------------------------------------------------------------------------------------------------- |
| routes | The route objects list. | `{ path: coreExtensionData.routePath, ref: coreExtensionData.routeRef.optional(), element: coreExtensionData.reactElement }` | false    | -       | [createPageExtension](https://backstage.io/docs/reference/frontend-plugin-api.createpageextension) |
