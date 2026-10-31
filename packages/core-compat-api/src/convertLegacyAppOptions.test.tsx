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

import { convertLegacyAppOptions } from './convertLegacyAppOptions';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  FrontendModule,
  toInternalFrontendModule,
} from '../../frontend-plugin-api/src/wiring/createFrontendModule';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtension } from '../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
import {
  AppTheme,
  createApiFactory,
  createApiRef,
  createPlugin,
} from '@backstage/core-plugin-api';

function serializeModule(module: FrontendModule) {
  const { extensions } = toInternalFrontendModule(module);
  return extensions.map(e => String(e));
}

const testApiRef = createApiRef<string>({ id: 'test' });
const test2ApiRef = createApiRef<string>({ id: 'test2' });

describe('convertLegacyAppOptions', () => {
  it('should ignore empty options', () => {
    expect(serializeModule(convertLegacyAppOptions())).toMatchInlineSnapshot(
      `[]`,
    );
  });

  it('should convert all options', () => {
    expect(
      serializeModule(
        convertLegacyAppOptions({
          apis: [createApiFactory(testApiRef, 'foo')],
          plugins: [
            createPlugin({
              id: 'test',
              apis: [createApiFactory(test2ApiRef, 'bar')],
            }),
          ],

          icons: { test: () => null },
          components: { SignInPage: () => null },
          themes: [{ id: 'other-theme' } as AppTheme],
        }),
      ),
    ).toMatchInlineSnapshot(`
      [
        "Extension{id=api:app/test2}",
        "Extension{id=api:app/test}",
        "Extension{id=icon-bundle:app/app-options}",
        "Extension{id=theme:app/light}",
        "Extension{id=theme:app/dark}",
        "Extension{id=theme:app/other-theme}",
        "Extension{id=sign-in-page:app}",
      ]
    `);
  });

  it('should create uniquely named swappable component overrides', () => {
    const { extensions } = toInternalFrontendModule(
      convertLegacyAppOptions({
        components: {
          Progress: () => null,
          NotFoundErrorPage: () => null,
          ErrorBoundaryFallback: () => null,
        },
      }),
    );

    expect(extensions.map(extension => extension.id)).toEqual([
      'component:app/core-progress',
      'component:app/core-not-found-error-page',
      'component:app/core-error-display',
    ]);

    expect(
      extensions.map(extension => {
        const internalExtension = toInternalExtension(extension);
        if (internalExtension.version !== 'v2') {
          throw new Error('Expected a v2 extension');
        }
        const [componentData] = Array.from(
          internalExtension.factory({} as never),
        );
        return componentData.value.ref.id;
      }),
    ).toEqual([
      'core-progress',
      'core-not-found-error-page',
      'core-error-display',
    ]);
  });
});
