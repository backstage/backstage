---
'@backstage/create-app': minor
'@backstage/theme': minor
---

Separates MUI 5 class name generator code into separate file and entry point that can be imported before any MUI 5 component loads.

This addresses the problem where the elements contain the `v5-` prefix for MUI class names, but the static class names from the library do not.

Import should be made as follows to ensure the prefix problem is addressed correctly:

```diff
// packages/app/src/index.ts

+ import '@backstage/theme/MuiClassNameSetup'; // must be the very first import!
import '@backstage/cli/asset-types';
import ReactDOM from 'react-dom/client';
import app from './App';
import '@backstage/ui/css/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(app);
```
