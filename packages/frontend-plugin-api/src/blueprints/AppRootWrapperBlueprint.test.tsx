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

import { AppRootWrapperBlueprint } from './AppRootWrapperBlueprint';
import { screen, waitFor } from '@testing-library/react';
import {
  coreExtensionData,
  createExtension,
  createExtensionInput,
} from '../wiring';
import { renderInTestApp } from '@backstage/frontend-test-utils';

describe('AppRootWrapperBlueprint', () => {
  it('should return an extension with sensible defaults', () => {
    const extension = AppRootWrapperBlueprint.make({
      params: {
        Component: () => <div>Hello</div>,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "app/root",
          "input": "wrappers",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "app-root-wrapper",
        "name": undefined,
        "output": [
          [Function],
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should render the simple component wrapper', async () => {
    const extension = AppRootWrapperBlueprint.make({
      name: 'test',
      params: {
        Component: () => <div>Hello</div>,
      },
    });

    renderInTestApp(<div />, { extensions: [extension] });

    await waitFor(() => expect(screen.getByText('Hello')).toBeInTheDocument());
  });

  it('should render the complex component wrapper', async () => {
    const extension = AppRootWrapperBlueprint.makeWithOverrides({
      config: {
        schema: {
          name: z => z.string(),
        },
      },
      inputs: {
        children: createExtensionInput([coreExtensionData.reactElement]),
      },
      *factory(originalFactory, { inputs, config }) {
        yield* originalFactory({
          Component: ({ children }) => (
            <div data-testid={`${config.name}-${inputs.children.length}`}>
              {children}
              {inputs.children.flatMap(c =>
                c.get(coreExtensionData.reactElement),
              )}
            </div>
          ),
        });
      },
    });

    renderInTestApp(<div />, {
      extensions: [
        extension,
        createExtension({
          name: 'test-child',
          attachTo: { id: 'app-root-wrapper:test', input: 'children' },
          output: [coreExtensionData.reactElement],
          factory: () => [coreExtensionData.reactElement(<div>Its Me</div>)],
        }),
      ],
      config: {
        app: {
          extensions: [
            {
              'app-root-wrapper:test': { config: { name: 'Robin' } },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('Robin-1')).toBeInTheDocument();
      expect(screen.getByText('Its Me')).toBeInTheDocument();
    });
  });
});
