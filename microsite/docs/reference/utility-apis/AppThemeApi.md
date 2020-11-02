The AppThemeApi type is defined at
[packages/core-api/src/apis/definitions/AppThemeApi.ts:50](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/core-api/src/apis/definitions/AppThemeApi.ts#L50).

The following Utility API implements this type:
[appThemeApiRef](./README.md#apptheme)

## Members

### getInstalledThemes()

Get a list of available themes.

```
getInstalledThemes(): <a href="#apptheme">AppTheme</a>[]
```

### activeThemeId\$()

Observe the currently selected theme. A value of undefined means no specific
theme has been selected.

```
activeThemeId$(): <a href="#observable">Observable</a>&lt;string | undefined&gt;
```

### getActiveThemeId()

Get the current theme ID. Returns undefined if no specific theme is selected.

```
getActiveThemeId(): string | undefined
```

### setActiveThemeId()

Set a specific theme to use in the app, overriding the default theme selection.

Clear the selection by passing in undefined.

```
setActiveThemeId(themeId?: string): void
```

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### AppTheme

Describes a theme provided by the app.

```
export type AppTheme = {
  /**
   * ID used to remember theme selections.
   */
  id: string;

  /**
   * Title of the theme
   */
  title: string;

  /**
   * Theme variant
   */
  variant: 'light' | 'dark';

  /**
   * The specialized MaterialUI theme instance.
   */
  theme: <a href="#backstagetheme">BackstageTheme</a>;
}
```

Defined at
[packages/core-api/src/apis/definitions/AppThemeApi.ts:24](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/core-api/src/apis/definitions/AppThemeApi.ts#L24).

Referenced by: [getInstalledThemes](#getinstalledthemes).

### BackstagePalette

```
export type BackstagePalette = Palette &amp; <a href="#paletteadditions">PaletteAdditions</a>
```

Defined at
[packages/theme/src/types.ts:70](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/theme/src/types.ts#L70).

Referenced by: [BackstageTheme](#backstagetheme).

### BackstageTheme

```
export interface BackstageTheme extends Theme {
  palette: <a href="#backstagepalette">BackstagePalette</a>;
}
```

Defined at
[packages/theme/src/types.ts:73](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/theme/src/types.ts#L73).

Referenced by: [AppTheme](#apptheme).

### Observable

Observable sequence of values and errors, see TC39.

https://github.com/tc39/proposal-observable

This is used as a common return type for observable values and can be created
using many different observable implementations, such as zen-observable or
RxJS 5.

```
export type Observable&lt;T&gt; = {
  /**
   * Subscribes to this observable to start receiving new values.
   */
  subscribe(observer: <a href="#observer">Observer</a>&lt;T&gt;): <a href="#subscription">Subscription</a>;
  subscribe(
    onNext: (value: T) =&gt; void,
    onError?: (error: Error) =&gt; void,
    onComplete?: () =&gt; void,
  ): <a href="#subscription">Subscription</a>;
}
```

Defined at
[packages/core-api/src/types.ts:53](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/core-api/src/types.ts#L53).

Referenced by: [activeThemeId\$](#activethemeid).

### Observer

This file contains non-react related core types used through Backstage.

Observer interface for consuming an Observer, see TC39.

```
export type Observer&lt;T&gt; = {
  next?(value: T): void;
  error?(error: Error): void;
  complete?(): void;
}
```

Defined at
[packages/core-api/src/types.ts:24](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/core-api/src/types.ts#L24).

Referenced by: [Observable](#observable).

### PaletteAdditions

```
type PaletteAdditions = {
  status: {
    ok: string;
    warning: string;
    error: string;
    pending: string;
    running: string;
    aborted: string;
  };
  border: string;
  textContrast: string;
  textVerySubtle: string;
  textSubtle: string;
  highlight: string;
  errorBackground: string;
  warningBackground: string;
  infoBackground: string;
  errorText: string;
  infoText: string;
  warningText: string;
  linkHover: string;
  link: string;
  gold: string;
  navigation: {
    background: string;
    indicator: string;
  };
  tabbar: {
    indicator: string;
  };
  bursts: {
    fontColor: string;
    slackChannelText: string;
    backgroundColor: {
      default: string;
    };
  };
  pinSidebarButton: {
    icon: string;
    background: string;
  };
  banner: {
    info: string;
    error: string;
  };
}
```

Defined at
[packages/theme/src/types.ts:23](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/theme/src/types.ts#L23).

Referenced by: [BackstagePalette](#backstagepalette).

### Subscription

Subscription returned when subscribing to an Observable, see TC39.

```
export type Subscription = {
  /**
   * Cancels the subscription
   */
  unsubscribe(): void;

  /**
   * Value indicating whether the subscription is closed.
   */
  readonly closed: Boolean;
}
```

Defined at
[packages/core-api/src/types.ts:33](https://github.com/spotify/backstage/blob/0406ace29aba7332a98ff9ef9feedd65adc75223/packages/core-api/src/types.ts#L33).

Referenced by: [Observable](#observable).
