/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/className';

/**
 * This API is introduced in @mui/material (v5.0.5) as a replacement of deprecated createGenerateClassName & only affects v5 Material UI components from `@mui/*`.
 *
 * This needs to be configured before any MUI 5 component can possibly be imported. See: https://v5.mui.com/material-ui/experimental-api/classname-generator/#caveat
 *
 * ```diff
 * // packages/app/src/index.ts
 *
 * + import '@backstage/theme/MuiClassNameSetup'; // must be the very first import!
 * import '@backstage/cli/asset-types';
 * import ReactDOM from 'react-dom/client';
 * import app from './App';
 * import '@backstage/ui/css/styles.css';
 *
 * ReactDOM.createRoot(document.getElementById('root')!).render(app);
 * ```
 */
ClassNameGenerator.configure(componentName => {
  return componentName.startsWith('v5-')
    ? componentName
    : `v5-${componentName}`;
});

export {};
