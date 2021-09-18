---
'@backstage/cli': patch
---

Disabled ECMAScript transforms in app and backend builds in order to reduce bundle size and runtime performance. For the rationale and a full list of syntax that is no longer transformed, see https://github.com/alangpierce/sucrase#transforms. This also enables TypeScripts `useDefineForClassFields` flag by default, which in rare occasions could cause build failures. For instructions on how to mitigate issues due to the flag, see the [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier).
