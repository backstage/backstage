---
id: logo
title: Customizing Your Logo
sidebar_label: Logo
description: Learn how to customize your logo.
---

In addition to a custom theme, you can also customize the logo displayed at the far top left of the site.

In your frontend app, locate `src/components/Root/` folder. You'll find two components:

- `LogoFull.tsx` - A larger logo used when the Sidebar navigation is opened.
- `LogoIcon.tsx` - A smaller logo used when the Sidebar navigation is closed.

To replace the images, you can simply replace the relevant code in those components with raw SVG definitions.

You can also use another web image format such as PNG by importing it. To do this, place your new image into a new subdirectory such as `src/components/Root/logo/my-company-logo.png`, and then add this code:

```tsx
import MyCustomLogoFull from './logo/my-company-logo.png';

const LogoFull = () => {
  return <img src={MyCustomLogoFull} />;
};
```
