---
id: icons
title: Customizing Icons
sidebar_label: Icons
description: Learn how to customize and add icons to your Backstage app.
---

::::info
This documentation is written for the new frontend system, which is the default
in new Backstage apps. If your Backstage app still uses the old frontend system,
read the [old frontend system version of this guide](./icons--old.md) instead.
::::

Backstage comes with a set of [default icons](https://github.com/backstage/backstage/blob/master/packages/app-defaults/src/defaults/icons.tsx) used throughout the app, for example in the sidebar, entity links, and catalog kind badges. You can override any of these icons or register additional ones to match your organization's visual identity.

## Custom icons

To override a default icon, create an icon bundle extension using
`IconBundleBlueprint` from `@backstage/plugin-app-react`. Each entry in the
`icons` object maps an icon key to a React component or JSX element that
replaces the built-in icon with the same key.

### Requirements

- Files in `.svg` format or any image format that can be rendered as a React
  component.
- React components created for the icons, or `IconElement` JSX elements.

### Create a React component

In your frontend application, locate the `src` folder. Create an
`assets/icons` directory and a `customIcons.tsx` file:

```tsx title="packages/app/src/assets/icons/customIcons.tsx"
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export const ExampleIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M11.6335 10.8398C11.6335 11.6563 12.065 12.9922 13.0863 12.9922C14.1075 12.9922 14.539 11.6563 14.539 10.8398C14.539 10.0234 14.1075 8.6875 13.0863 8.6875C12.065 8.6875 11.6335 10.0234 11.6335 10.8398V10.8398ZM2.38419e-07 8.86719C2.38419e-07 10.1133 0.126667 11.4336 0.692709 12.5781C2.19292 15.5703 6.3175 15.5 9.27042 15.5C12.2708 15.5 16.6408 15.6055 18.2004 12.5781C18.7783 11.4453 19 10.1133 19 8.86719C19 7.23047 18.4498 5.68359 17.3573 4.42969C17.5631 3.8125 17.6621 3.16406 17.6621 2.52344C17.6621 1.68359 17.4681 1.26172 17.0842 0.5C15.291 0.5 14.1431 0.851562 12.7775 1.90625C11.6296 1.63672 10.45 1.51562 9.26646 1.51562C8.19771 1.51562 7.12104 1.62891 6.08396 1.875C4.73813 0.832031 3.59021 0.5 1.81687 0.5C1.42896 1.26172 1.23896 1.68359 1.23896 2.52344C1.23896 3.16406 1.34188 3.80078 1.54375 4.40625C0.455209 5.67188 2.38419e-07 7.23047 2.38419e-07 8.86719V8.86719ZM2.54521 10.8398C2.54521 9.125 3.60208 7.61328 5.45458 7.61328C6.20271 7.61328 6.91917 7.74609 7.67125 7.84766C8.26104 7.9375 8.85083 7.97266 9.45646 7.97266C10.0581 7.97266 10.6479 7.9375 11.2417 7.84766C11.9819 7.74609 12.7063 7.61328 13.4583 7.61328C15.3108 7.61328 16.3677 9.125 16.3677 10.8398C16.3677 14.2695 13.1852 14.7969 10.4144 14.7969H8.50646C5.72375 14.7969 2.54521 14.2734 2.54521 10.8398V10.8398ZM5.81479 8.6875C6.83604 8.6875 7.2675 10.0234 7.2675 10.8398C7.2675 11.6563 6.83604 12.9922 5.81479 12.9922C4.79354 12.9922 4.36208 11.6563 4.36208 10.8398C4.36208 10.0234 4.79354 8.6875 5.81479 8.6875Z"
    />
  </SvgIcon>
);
```

### Use the custom icon

Supply your custom icon in `packages/app/src/App.tsx` by creating an icon
bundle extension and installing it as a module for the `app` plugin:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { IconBundleBlueprint } from '@backstage/plugin-app-react';
import { ExampleIcon } from './assets/icons/customIcons';

const customIconBundle = IconBundleBlueprint.make({
  name: 'custom-icons',
  params: {
    icons: {
      github: <ExampleIcon fontSize="inherit" />,
    },
  },
});

const app = createApp({
  features: [
    createFrontendModule({
      pluginId: 'app',
      extensions: [customIconBundle],
    }),
  ],
});

export default app.createRoot();
```

The `icons` object maps icon keys to React components or JSX elements. In this
example, the built-in `github` icon is replaced with `ExampleIcon`. You can
override multiple icons at once by adding more entries to the object.

The module can also be declared in a separate module package if you prefer to
keep icon customizations separate from your app setup.

## Adding icons

If the [default icons](https://github.com/backstage/backstage/blob/master/packages/app-defaults/src/defaults/icons.tsx) do not cover your needs, you can register additional icons so that they
can be referenced in places like entity links. For this example we use the
`RiAlarmLine` icon from [Remix Icon](https://remixicon.com/), declared as a JSX
element:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { RiAlarmLine } from '@remixicon/react';
import { IconBundleBlueprint } from '@backstage/plugin-app-react';

const extraIcons = IconBundleBlueprint.make({
  name: 'extra-icons',
  params: {
    icons: {
      alert: <RiAlarmLine />,
    },
  },
});

const app = createApp({
  features: [
    createFrontendModule({
      pluginId: 'app',
      extensions: [extraIcons],
    }),
  ],
});

export default app.createRoot();
```

You can then reference `alert` as the icon in entity links:

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

And this is the result:

![Example Link with Alert icon](../../assets/getting-started/add-icons-links-example.png)

### Using icons in plugin code

To look up a registered icon at runtime, use the `IconsApi`:

```ts
import { useApi, iconsApiRef } from '@backstage/frontend-plugin-api';

const iconsApi = useApi(iconsApiRef);
const alertIcon = iconsApi.icon('alert');
```

This is useful when you have an icon that you want to render in several
locations within a plugin.

:::note
If an icon key is not available as a default icon or one you have added, a
fallback icon is used instead.
:::
