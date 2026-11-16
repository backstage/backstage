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

import { screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  AppRootElementBlueprint,
  appTreeApiRef,
  iconsApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import { IconBundleBlueprint } from '@backstage/plugin-app-react';
import { convertLegacyAppOptions } from './convertLegacyAppOptions';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  FrontendModule,
  toInternalFrontendModule,
} from '../../frontend-plugin-api/src/wiring/createFrontendModule';
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

  it('should convert legacy icon components to elements with inherited sizing', async () => {
    const Icon = ({ fontSize }: { fontSize?: string }) => (
      <svg role="img" aria-label="Custom icon" style={{ fontSize }} />
    );
    const module = convertLegacyAppOptions({ icons: { custom: Icon } });
    function Consumer() {
      const icon = useApi(iconsApiRef).icon('custom');
      const { tree } = useApi(appTreeApiRef).getTree();
      const bundle = tree.nodes
        .get('icon-bundle:app/app-options')
        ?.instance?.getData(IconBundleBlueprint.dataRefs.icons);
      expect(bundle?.custom).toBe(icon);
      expect(icon).toMatchObject({
        type: Icon,
        props: { fontSize: 'inherit' },
      });
      return icon;
    }

    await renderTestApp({
      features: [module],
      extensions: [
        AppRootElementBlueprint.make({
          name: 'icon-consumer',
          params: { element: <Consumer /> },
        }),
      ],
    });
    expect(await screen.findByRole('img', { name: 'Custom icon' })).toHaveStyle(
      {
        fontSize: 'inherit',
      },
    );
  });

  it('should reject legacy root router components', () => {
    expect(() =>
      convertLegacyAppOptions({
        components: { Router: () => null } as any,
      }),
    ).toThrow('components.Router is not supported by convertLegacyAppOptions');
  });
});
