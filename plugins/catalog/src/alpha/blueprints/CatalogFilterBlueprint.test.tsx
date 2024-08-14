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
import React from 'react';
import { CatalogFilterBlueprint } from './CatalogFilterBlueprint';
import {
  coreExtensionData,
  createExtension,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { waitFor, screen } from '@testing-library/react';

describe('CatalogFilterBlueprint', () => {
  it('should create an extension with sane defaults', () => {
    const extension = CatalogFilterBlueprint.make({
      params: {
        loader: async () => <div />,
      },
    });
    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "attachTo": {
          "id": "page:catalog",
          "input": "filters",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "catalog-filter",
        "name": undefined,
        "namespace": undefined,
        "output": [
          [Function],
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should allow overrding of inputs and config', async () => {
    const extension = CatalogFilterBlueprint.makeWithOverrides({
      name: 'test-name',
      inputs: {
        mock: createExtensionInput([coreExtensionData.reactElement]),
      },
      config: {
        schema: {
          test: z => z.string(),
        },
      },
      factory(originalFactory, { config, inputs }) {
        return originalFactory({
          loader: async () => (
            <div data-testid="test">
              config: {config.test}
              <div data-testid="contents">
                {inputs.mock.map(i => i.get(coreExtensionData.reactElement))}
              </div>
            </div>
          ),
        });
      },
    });

    const mockExtension = createExtension({
      attachTo: { id: 'catalog-filter:test-name', input: 'mock' },
      output: [coreExtensionData.reactElement],
      factory() {
        return [coreExtensionData.reactElement(<div>im a mock</div>)];
      },
    });

    createExtensionTester(extension, { config: { test: 'mock test config' } })
      .add(mockExtension)
      .render();

    await waitFor(() => {
      expect(screen.getByTestId('test')).toBeInTheDocument();
      expect(screen.getByTestId('test')).toHaveTextContent(
        'config: mock test config',
      );
      expect(screen.getByTestId('contents')).toHaveTextContent('im a mock');
    });
  });
});
