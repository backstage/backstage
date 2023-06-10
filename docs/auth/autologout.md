---
id: autologout
title: Autologout
# prettier-ignore
description: This section describes how to setup the Autologout mechanism in Backstage
---

This section describes how to setup the Autologout mechanism in Backstage in case your organization needs it.

## Summary

The Autologout feature is an optional added security to Backstage, designed to automatically log out users after a preconfigured duration of inactivity. This capability helps to effectively mitigate the risks associated with unauthorized access through abandoned sessions, especially in shared device scenarios.

The Autologout mechanism actively tracks user activity such as mouse movements, clicks, key pressing, and taps. If the system detects no activity over a set time span (idle timeout), it invalidates the user session and redirects to the login page.
_Inactive users_ are the ones that don't perform any action on the Backstage app or that are logged in but no Backstage tab is open in the browser.

This feature is particularly beneficial if your application should comply with internal policies within your organization that may require automatic logout after a specific period of inactivity.

This is how it looks like:

![Autologout Preview](../assets/auth/autologout-preview.png)

## Quick start

To enable and configure Autologout, you will need to add the `<AutoLogoutProvider>` component to your Backstage's instance entry point, located at `App.tsx`.

Here's how to add it:

```ts
import { AutoLogoutProvider } from '@backstage/core-components';

// ... App.tsx contents

export default app.createRoot(
  <>
    // ...
    <AutoLogoutProvider>
      <Root>{routes}</Root>
    </AutoLogoutProvider>
    // ...
  </>,
);
```

## Configuration

You can further adjust the Autologout settings by tweaking the available `<AutoLogoutProvider>` properties:

```ts
<AutoLogoutProvider
  idleTimeoutMinutes={30}
  useWorkerTimers={false}
  logoutIfDisconnected={false}
>
  <Root>{routes}</Root>
</AutoLogoutProvider>
```

If you prefer to have different settings for each Backstage instance deployed at your infrastructure, you can instead leverage the `<ConfigBasedAutoLogoutProvider>` which reads the Autologout settings from `app-config`.

To do so, adjust your `App.tsx` as follows:

```ts
import { ConfigBasedAutoLogoutProvider } from '@backstage/core-components';

// ... App.tsx contents

export default app.createRoot(
  <>
    // ...
    <ConfigBasedAutoLogoutProvider>
      <Root>{routes}</Root>
    </ConfigBasedAutoLogoutProvider>
    // ...
  </>,
);
```

And add these lines into your `app-config`:

```yaml
auth:
  autologout:
    enabled: true
```

You will now be able to configure the AutoLogoutProvider through your `app-config`. These are the available settings:

| Configuration Key                         | Component Property        | Description                                                                                                                                                                                                                                                           | Allowed Values                                                                                | Default Value                                                                                                                                                  |
| ----------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth.autologout.enabled`                 | `enabled`                 | Enable/disable the Autologout feature.                                                                                                                                                                                                                                | `true`/`false`                                                                                | `false`                                                                                                                                                        |
| `auth.autologout.idleTimeoutMinutes`      | `idleTimeoutMinutes`      | Sets the idle time (in minutes) after which the user will be logged out.                                                                                                                                                                                              | `>= 0.5` minutes                                                                              | `60`                                                                                                                                                           |
| `auth.autologout.promptBeforeIdleSeconds` | `promptBeforeIdleSeconds` | Determines the time (in seconds) prior to idle state when a prompt will appear. A value of 0 disables the prompt. This must be less than the value of `idleTimeoutMinutes`.                                                                                           | `>= 0` seconds                                                                                | `10`                                                                                                                                                           |
| `auth.autologout.events`                  | `events`                  | Specifies the list of events used to detect user activity.                                                                                                                                                                                                            | Allowed values are standard [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events) | `'mousemove', 'keydown', 'wheel', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart' 'touchmove', 'MSPointerDown', 'MSPointerMove', 'visibilitychange'` |
| `auth.autologout.useWorkerTimers`         | `useWorkerTimers`         | Enables or disables the use of Node's worker thread timers instead of main thread timers. This can be beneficial if the browser is terminating timers in inactive tabs, like those used by Autologout. In case of browser incompatibility, try setting this to false. | `true`/`false`                                                                                | `true`                                                                                                                                                         |
| `auth.autologout.logoutIfDisconnected`    | `logoutIfDisconnected`    | Enable/disable autologout for disconnected users. Disconnected users are those who are logged in but do not have any active Backstage tabs open in their browsers. If enabled, such users will be automatically logged out after `idleTimeoutMinutes`.                | `true`/`false`                                                                                | `true`                                                                                                                                                         |
