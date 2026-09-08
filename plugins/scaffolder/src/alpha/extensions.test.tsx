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

import { createExtensionTester } from '@backstage/frontend-test-utils';
import { scaffolderTemplatesSubPage } from './extensions';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { rootRouteRef } from '../routes';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  catalogApiRef,
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
import { permissionApiRef } from '@backstage/plugin-permission-react';

describe('scaffolder extensions', () => {
  describe('sub-page:scaffolder/templates', () => {
    describe('templateFilter', () => {
      it('should not filter anything when omitted', async () => {
        const catalogMock = catalogApiMock({
          entities: [
            {
              apiVersion: 'scaffolder.backstage.io/v1beta3',
              kind: 'Template',
              metadata: { name: 'template-foo' },
              spec: { type: 'service', steps: [] },
            },
            {
              apiVersion: 'scaffolder.backstage.io/v1beta3',
              kind: 'Template',
              metadata: { name: 'template-bar' },
              spec: { type: 'service', steps: [] },
            },
            {
              apiVersion: 'scaffolder.backstage.io/v1beta3',
              kind: 'Template',
              metadata: { name: 'template-baz' },
              spec: { type: 'service', steps: [] },
            },
          ],
        });
        const tester = createExtensionTester(
          Object.assign(
            { namespace: 'scaffolder' },
            scaffolderTemplatesSubPage,
          ),
        );
        await renderInTestApp(
          <TestApiProvider
            apis={[
              [catalogApiRef, catalogMock],
              [
                starredEntitiesApiRef,
                new DefaultStarredEntitiesApi({
                  storageApi: mockApis.storage(),
                }),
              ],
              [permissionApiRef, mockApis.permission()],
            ]}
          >
            {tester.reactElement()}
          </TestApiProvider>,
          {
            mountedRoutes: {
              '/templates/': rootRouteRef,
              '/catalog/:namespace/:kind/:name': entityRouteRef,
            },
          },
        );

        await waitForElementToBeRemoved(() => screen.getByTestId('progress'));
        expect(await screen.findByText('template-foo')).toBeInTheDocument();
        expect(await screen.findByText('template-bar')).toBeInTheDocument();
        expect(await screen.findByText('template-baz')).toBeInTheDocument();
      });

      it('should filter templates', async () => {
        const catalogMock = catalogApiMock({
          entities: [
            {
              apiVersion: 'scaffolder.backstage.io/v1beta3',
              kind: 'Template',
              metadata: { name: 'template-foo' },
              spec: { type: 'service', steps: [] },
            },
            {
              apiVersion: 'scaffolder.backstage.io/v1beta3',
              kind: 'Template',
              metadata: { name: 'template-wip', tags: ['wip'] },
              spec: { type: 'service', steps: [] },
            },
          ],
        });
        const tester = createExtensionTester(
          Object.assign(
            { namespace: 'scaffolder' },
            scaffolderTemplatesSubPage,
          ),
          {
            config: {
              templateFilter: {
                $not: {
                  'metadata.tags': { $contains: 'wip' },
                },
              },
            },
          },
        );
        await renderInTestApp(
          <TestApiProvider
            apis={[
              [catalogApiRef, catalogMock],
              [
                starredEntitiesApiRef,
                new DefaultStarredEntitiesApi({
                  storageApi: mockApis.storage(),
                }),
              ],
              [permissionApiRef, mockApis.permission()],
            ]}
          >
            {tester.reactElement()}
          </TestApiProvider>,
          {
            mountedRoutes: {
              '/templates/': rootRouteRef,
              '/catalog/:namespace/:kind/:name': entityRouteRef,
            },
          },
        );

        await waitForElementToBeRemoved(() => screen.getByTestId('progress'));
        expect(await screen.findByText('template-foo')).toBeInTheDocument();
        expect(screen.queryByText('template-wip')).not.toBeInTheDocument();
      });

      it.each([
        ['0', 0],
        ['false', false],
        ['empty string', ''],
      ])(
'should filter out everything with falsy value (%s)',
        async (_name, value) => {
          const catalogMock = catalogApiMock({
            entities: [
              {
                apiVersion: 'scaffolder.backstage.io/v1beta3',
                kind: 'Template',
                metadata: { name: 'template-foo' },
                spec: { type: 'service', steps: [] },
              },
            ],
          });
          const tester = createExtensionTester(
            Object.assign(
              { namespace: 'scaffolder' },
              scaffolderTemplatesSubPage,
            ),
            {
              config: {
                templateFilter: value,
              },
            },
          );
          await renderInTestApp(
            <TestApiProvider
              apis={[
                [catalogApiRef, catalogMock],
                [
                  starredEntitiesApiRef,
                  new DefaultStarredEntitiesApi({
                    storageApi: mockApis.storage(),
                  }),
                ],
                [permissionApiRef, mockApis.permission()],
              ]}
            >
              {tester.reactElement()}
            </TestApiProvider>,
            {
              mountedRoutes: {
                '/templates/': rootRouteRef,
                '/catalog/:namespace/:kind/:name': entityRouteRef,
              },
            },
          );

          await waitForElementToBeRemoved(() => screen.getByTestId('progress'));
          expect(screen.queryByText('template-foo')).not.toBeInTheDocument();
        },
      );
    });
  });
});
