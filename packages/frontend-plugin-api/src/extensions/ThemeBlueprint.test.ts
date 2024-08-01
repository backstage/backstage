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
import { ThemeBlueprint } from './ThemeBlueprint';
import { createExtensionTester } from '@backstage/frontend-test-utils';

describe('ThemeBlueprint', () => {
  const theme = {
    id: 'light',
    colors: { primary: 'blue' },
    variant: 'dark',
    title: 'lols',
    Provider: (_: { children: React.ReactNode }) => null,
  } as AppTheme;

  it('should create an extension with sensible defaults', () => {
    expect(
      // todo(blam): we can't inject theme.id as the name here like the old extension creator.
      // Wonder if theres a better solution.
      ThemeBlueprint.make({ name: 'blob', params: { theme } }),
    ).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "attachTo": {
          "id": "app",
          "input": "themes",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "theme",
        "name": "blob",
        "namespace": "app",
        "output": [
          [Function],
        ],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should return the theme as an themeDataRef', async () => {
    const extension = ThemeBlueprint.make({ name: 'blob', params: { theme } });

    expect(
      createExtensionTester(extension).data(ThemeBlueprint.dataRefs.theme),
    ).toEqual(theme);
  });
});
