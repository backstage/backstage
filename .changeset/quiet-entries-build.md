---
'@backstage/cli-module-build': patch
---

Fixed package builds ignoring declared `module` and `main` entries such as `src/index.tsx` when no exports map is present. The `module` entry takes precedence over `main`. Root build outputs retain their `index` filenames, and packages without either entry retain the conventional `src/index.ts` fallback. Backend application builds retain their conventional `src/index.ts` entry unless an exports map is provided.
