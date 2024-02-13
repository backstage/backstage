---
'@backstage/core-components': minor
---

**BREAKING**: Removed the `SidebarIntro` component as it was providing instructions for features that do not exist, along with `IntroCard`. If you were relying on this component and want to keep using it you can refer to the original implementations of [`SidebarIntro`](https://github.com/backstage/backstage/blob/80f2413334ed9b221ec3c2b7c22fa737ad8d8885/packages/core-components/src/layout/Sidebar/Intro.tsx#L149) and [`IntroCard`](https://github.com/backstage/backstage/blob/80f2413334ed9b221ec3c2b7c22fa737ad8d8885/packages/core-components/src/layout/Sidebar/Intro.tsx#L100).
