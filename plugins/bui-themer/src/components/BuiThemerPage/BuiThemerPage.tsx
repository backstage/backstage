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

- create a utility that converts the MUI theme palette into printed CSS variables
populating the variables in packages/ui/src/css/core.css
- the conversion utility will be created in an adjacent `convertMuiToBuiTheme` file, which defines a `convertMuiToBuiTheme` function that accepts a MUI theme instance and returns CSS in text format
- create tests for the conversion utility
- Create a page that shows the generated CSS variables and allows the user to copy them
- The page should show coverted CSS variables for all installed themes in the app, which can be acquired via the AppThemeApi, defined at packages/core-plugin-api/src/apis/definitions/AppThemeApi.ts
- The AppThemeApi can be accessed via the useApi(appThemeApiRef) hook
- The app themes only provide a `Provider` component that in turn provides the MUI theme. The theme can be accessed by wrapping the component in the theme's `Provider` component and then using the `useTheme` hook from MUI

*/

export function BuiThemerPage() {
  return <div>TODO</div>;
}
