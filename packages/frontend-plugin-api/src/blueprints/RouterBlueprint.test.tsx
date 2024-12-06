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
import { RouterBlueprint } from './RouterBlueprint';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import {
  coreExtensionData,
  createExtension,
  createExtensionInput,
} from '../wiring';
import { createExtensionTester } from '@backstage/frontend-test-utils';

describe('RouterBlueprint', () => {
  it('should return an extension when calling make with sensible defaults', () => {
    const extension = RouterBlueprint.make({
      params: {
        Component: props => <div>{props.children}</div>,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "app/root",
          "input": "router",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "app-router-component",
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

  it('should work with simple options', async () => {
    const extension = RouterBlueprint.make({
      params: {
        Component: ({ children }) => (
          <MemoryRouter>
            <div data-testid="test-router">{children}</div>
          </MemoryRouter>
        ),
      },
    });

    const tester = createExtensionTester(extension);
    const Component = tester.get(RouterBlueprint.dataRefs.component);

    const { getByTestId } = render(
      <Component>
        <div data-testid="test-contents" />
      </Component>,
    );

    await waitFor(() => {
      expect(getByTestId('test-contents')).toBeInTheDocument();
      expect(getByTestId('test-router')).toBeInTheDocument();
    });
  });

  it('should work with complex options and props', async () => {
    const extension = RouterBlueprint.makeWithOverrides({
      name: 'test',
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
            <MemoryRouter>
              <div
                data-testid={`test-router-${config.name}-${inputs.children.length}`}
              >
                {children}
              </div>
            </MemoryRouter>
          ),
        });
      },
    });

    const tester = createExtensionTester(extension, {
      config: { name: 'Robin' },
    }).add(
      createExtension({
        attachTo: {
          id: 'app-router-component:test',
          input: 'children',
        },
        output: [coreExtensionData.reactElement],
        *factory() {
          yield coreExtensionData.reactElement(<div />);
        },
      }),
    );
    const Component = tester.get(RouterBlueprint.dataRefs.component);

    const { getByTestId } = render(
      <Component>
        <div data-testid="test-contents" />
      </Component>,
    );

    await waitFor(() => {
      expect(getByTestId('test-contents')).toBeInTheDocument();
      expect(getByTestId('test-router-Robin-1')).toBeInTheDocument();
    });
  });
});
