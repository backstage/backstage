/*
 * Copyright 2022 The Backstage Authors
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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import {
  EntityPresentationApi,
  entityPresentationApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { TemplateTitleColumn } from './TemplateTitleColumn';

describe('<TemplateTitleColumn />', () => {
  it('should render a link to the template entity and nothing when missing', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[]}>
        <TemplateTitleColumn entityRef="template:default/one-template" />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const link = await screen.findByRole('link', { name: 'one-template' });
    expect(link).toHaveAttribute(
      'href',
      '/catalog/default/template/one-template',
    );

    const { container } = await renderInTestApp(
      <TestApiProvider apis={[]}>
        <TemplateTitleColumn />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should display the title from the entity presentation API', async () => {
    const entityPresentationApi: EntityPresentationApi = {
      forEntity: () => ({
        snapshot: {
          entityRef: 'template:default/one-template',
          primaryTitle: 'Presented Template',
        },
        promise: Promise.resolve({
          entityRef: 'template:default/one-template',
          primaryTitle: 'Presented Template',
        }),
      }),
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[[entityPresentationApiRef, entityPresentationApi]]}
      >
        <TemplateTitleColumn entityRef="template:default/one-template" />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const link = await screen.findByRole('link', {
      name: 'Presented Template',
    });
    expect(link).toHaveAttribute(
      'href',
      '/catalog/default/template/one-template',
    );
  });
});
