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

import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
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
import { renderTestApp } from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';

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

  it('should convert a legacy Router component into one that wraps the app', async () => {
    const module = convertLegacyAppOptions({
      components: {
        // A root router replacement has to supply React Router context, since
        // app chrome still reads it — hence MemoryRouter rather than a plain
        // wrapper element.
        Router: ({ children }: { children?: ReactNode }) => (
          <MemoryRouter>
            <span>Legacy router</span>
            {children}
          </MemoryRouter>
        ),
      } as any,
    });

    expect(serializeModule(module)).toEqual([
      'Extension{id=app-router-component:app}',
    ]);

    // The compat layer overrides the blueprint factory so that migrating apps
    // are not warned about a blueprint they never chose. That override has to
    // yield the same data the blueprint would have, so this asserts the
    // converted router actually ends up wrapping the app.
    renderTestApp({ features: [module] });

    expect(await screen.findByText('Legacy router')).toBeInTheDocument();
  });
});
