/*
 * Copyright 2024 The Backstage Authors
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

import { AppTheme } from '@backstage/core-plugin-api';
import { createExtensionBlueprint } from '../wiring';
import { createThemeExtension } from './createThemeExtension';

export const ThemeBlueprint = createExtensionBlueprint({
  kind: 'theme',
  namespace: 'app',
  name: ({ theme }) => theme.id,
  attachTo: { id: 'app', input: 'themes' },
  output: [createThemeExtension.themeDataRef],
  dataRefs: {
    theme: createThemeExtension.themeDataRef,
  },
  factory: ({ theme }: { theme: AppTheme }) => [
    createThemeExtension.themeDataRef(theme),
  ],
});
