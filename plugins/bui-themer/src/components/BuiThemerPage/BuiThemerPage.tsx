/*
 * Copyright 2025 The Backstage Authors
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

/*

IMPLEMENTATION PLAN:

- Create a converter utility that maps a MUI v5 `Theme` to BUI CSS variables,
  covering palette, typography, spacing, and shape tokens to match
  `packages/ui/src/css/core.css`.
- Place it in an adjacent `convertMuiToBuiTheme.ts` file exporting
  `convertMuiToBuiTheme(theme: Theme, options?): string`, returning
  deterministic CSS text.
- Scope output blocks as:
  - `:root { ... }` for light themes
  - `[data-theme-mode='dark'] { ... }` for dark themes
  Optionally prefix by theme id (e.g. `[data-app-theme='<id>']`) so multiple
  theme blocks can coexist without conflicts.
- Do not modify `packages/ui/src/css/core.css`; generate CSS for copy/download
  only.
- Define a mapping from MUI fields to `--bui-*` tokens with sensible fallbacks
  aligning with core defaults. Handle success/warning/error/background/text
  surfaces, borders, and link/hover states.
- Add tests for light/dark and fallback behavior using MUI `createTheme` and
  snapshot the generated CSS.
- Build the page to list all installed themes via `useApi(appThemeApiRef)`,
  render a minimal child under each theme `Provider`, and read `useTheme()` to
  get the runtime theme instance. Provide Copy and Download actions and an
  optional live preview applying the generated variables.
- Performance: memoize generated CSS by theme id and regenerate when the
  installed theme list changes. Observing `activeThemeId$()` is optional unless
  previewing the active theme.

REQUIREMENTS:

- No changes can be made outside the plugins/bui-themer/src directory
- Only components from the `@backstage/ui` package at `packages/ui` can be used

*/

export function BuiThemerPage() {
  return <div>TODO</div>;
}
