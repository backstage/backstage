---
'@backstage/ui': patch
---

Fixed React 17 compatibility by using `useId` from `react-aria` instead of React's built-in hook which is only available in React 18+.
