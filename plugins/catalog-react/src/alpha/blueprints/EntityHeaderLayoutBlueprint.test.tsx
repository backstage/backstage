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

import { Entity } from '@backstage/catalog-model';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';
import { EntityHeaderLayoutBlueprint } from './EntityHeaderLayoutBlueprint';

describe('EntityHeaderLayoutBlueprint', () => {
  it('emits a lazy component that receives composed tab props', async () => {
    const extension = EntityHeaderLayoutBlueprint.make({
      name: 'test',
      params: {
        loader: async () => props =>
          (
            <div>
              <span>{props.tabs.map(tab => tab.label).join(',')}</span>
              <span>{props.activeTabId}</span>
            </div>
          ),
      },
    });
    const Component = createExtensionTester(extension).get(
      EntityHeaderLayoutBlueprint.dataRefs.component,
    );

    await renderInTestApp(
      <Component
        tabs={[{ id: '/overview', label: 'Overview', href: 'overview' }]}
        activeTabId="/overview"
      />,
    );

    expect(await screen.findByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('/overview')).toBeInTheDocument();
  });

  it('emits function filters for params and configured predicates', () => {
    const filter = (_entity: Entity) => true;

    expect(
      createExtensionTester(
        EntityHeaderLayoutBlueprint.make({
          name: 'function-filter',
          params: {
            filter,
            loader: async () => () => <div />,
          },
        }),
      ).get(EntityHeaderLayoutBlueprint.dataRefs.filterFunction),
    ).toBe(filter);

    const configuredFilter = createExtensionTester(
      EntityHeaderLayoutBlueprint.make({
        name: 'configured-filter',
        params: {
          loader: async () => () => <div />,
        },
      }),
      { config: { filter: { kind: 'component' } } },
    ).get(EntityHeaderLayoutBlueprint.dataRefs.filterFunction);

    expect(configuredFilter).toBeDefined();
    expect(
      configuredFilter!({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'example' },
      }),
    ).toBe(true);
    expect(
      configuredFilter!({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'API',
        metadata: { name: 'example' },
      }),
    ).toBe(false);
    expect(EntityHeaderLayoutBlueprint.dataRefs).not.toHaveProperty(
      'filterExpression',
    );
  });
});
