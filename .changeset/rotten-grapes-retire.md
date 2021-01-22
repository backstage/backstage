---
'@backstage/core': patch
---

Extracted all React components and hooks out of core into a new `@backstage/core-components`package.

The user is still expected to import `@backstage/core`, which re-exports this package. This is therefore just a patch release.

I have not yet added any lint rule against directly importing this new package.

I tried to update the workflows accordingly as well; please double check that those look sane still.

These components have some remnants of the old core naming in them. Notably, they refer to settings keys. I have left those unchanged.

```ts
// packages/core-components/src/layout/Sidebar/config.ts
export const SIDEBAR_INTRO_LOCAL_STORAGE =
  '@backstage/core/sidebar-intro-dismissed';
// packages/core-components/src/layout/SignInPage/providers.tsx
const PROVIDER_STORAGE_KEY = '@backstage/core:SignInPage:provider';
```
