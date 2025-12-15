---
'@backstage/cli': patch
---

Switched compilation target to ES2022 in order to match the new set of supported Node.js versions, which are 22 and 24.

The TypeScript compilation target has been set to ES2022, because setting it to a higher target will break projects on older TypeScript versions. If you use a newer TypeScript version in your own project, you can bump `compilerOptions.target` to ES2023 or ES2024 in your own `tsconfig.json` file.
