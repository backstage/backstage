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
import { coreExtensionData } from './coreExtensionData';
import { createExtensionKind } from './createExtensionKind';
import { createExtensionTester } from '@backstage/frontend-test-utils';

describe('createExtensionKind', () => {
  it('should allow creation of extension kinds', () => {
    const TestExtension = createExtensionKind({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: {
        element: coreExtensionData.reactElement,
      },
      factory(_, options: { text: string }) {
        return {
          element: <h1>{options.text}</h1>,
        };
      },
    });

    const extension = TestExtension.new({
      name: 'my-extension',
      options: {
        text: 'Hello, world!',
      },
    });

    expect(extension).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      attachTo: {
        id: 'test',
        input: 'default',
      },
      configSchema: undefined,
      disabled: false,
      inputs: {},
      kind: 'test-extension',
      name: 'my-extension',
      namespace: undefined,
      output: {
        element: {
          $$type: '@backstage/ExtensionDataRef',
          config: {},
          id: 'core.reactElement',
          optional: expect.any(Function),
          toString: expect.any(Function),
        },
      },
      factory: expect.any(Function),
      toString: expect.any(Function),
      override: expect.any(Function),
      version: 'v1',
    });

    const { container } = createExtensionTester(extension).render();
    expect(container.querySelector('h1')).toHaveTextContent('Hello, world!');
  });

  it('should allow overriding of the default factory', () => {
    const TestExtension = createExtensionKind({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: {
        element: coreExtensionData.reactElement,
      },
      factory(_, options: { text: string }) {
        return {
          element: <h1>{options.text}</h1>,
        };
      },
    });

    const extension = TestExtension.new({
      name: 'my-extension',
      options: {
        text: 'Hello, world!',
      },
      factory(_, options: { text: string }) {
        return {
          element: <h2>{options.text}</h2>,
        };
      },
    });

    expect(extension).toBeDefined();

    const { container } = createExtensionTester(extension).render();
    expect(container.querySelector('h2')).toHaveTextContent('Hello, world!');
  });

  it('should allow calling of the default value from override', () => {
    const TestExtension = createExtensionKind({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: {
        element: coreExtensionData.reactElement,
      },
      factory(_, options: { text: string }) {
        return {
          element: <h1>{options.text}</h1>,
        };
      },
    });

    const extension = TestExtension.new({
      name: 'my-extension',
      options: {
        text: 'Hello, world!',
      },
      factory({ originalFactory }, options: { text: string }) {
        const { element } = originalFactory();
        return {
          element: (
            <h2>
              {options.text}
              {element}
            </h2>
          ),
        };
      },
    });

    expect(extension).toBeDefined();

    const { container } = createExtensionTester(extension).render();

    expect(container.querySelector('h2 h1')).toHaveTextContent('Hello, world!');
  });

  it('should allow overriding options of the default value from override', () => {
    const TestExtension = createExtensionKind({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: {
        element: coreExtensionData.reactElement,
      },
      factory(_, options: { text: string }) {
        return {
          element: <h1>{options.text}</h1>,
        };
      },
    });

    const extension = TestExtension.new({
      name: 'my-extension',
      options: {
        text: 'Hello, world!',
      },
      factory({ originalFactory }, options: { text: string }) {
        const { element } = originalFactory(undefined, { text: 'nothing!' });
        return {
          element: (
            <h2>
              {options.text}
              {element}
            </h2>
          ),
        };
      },
    });

    expect(extension).toBeDefined();

    const { container } = createExtensionTester(extension).render();

    expect(container.querySelector('h2 h1')).toHaveTextContent('nothing!');
  });

  describe('override', () => {
    it('should allow overriding of the default factory', () => {
      const TestExtension = createExtensionKind({
        kind: 'test-extension',
        attachTo: { id: 'test', input: 'default' },
        output: {
          element: coreExtensionData.reactElement,
        },
        factory(_, options: { text: string }) {
          return {
            element: <h1>{options.text}</h1>,
          };
        },
      });

      const extension = TestExtension.new({
        name: 'my-extension',
        options: {
          text: 'Hello, world!',
        },
        factory(_, options: { text: string }) {
          return {
            element: <h2>{options.text}</h2>,
          };
        },
      });

      const overridden = extension.override({
        factory({ originalFactory }, { text }) {
          return {
            element: (
              <div>
                {originalFactory().element}
                <h3>{text}</h3>
              </div>
            ),
          };
        },
      });

      const { container } = createExtensionTester(overridden).render();
      expect(container.querySelector('h2')).toHaveTextContent('Hello, world!');
      expect(container.querySelector('h3')).toHaveTextContent('Hello, world!');
    });
  });

  it('should allow calling the kind factory if another factory is not defined in the instance', () => {
    const TestExtension = createExtensionKind({
      kind: 'test-extension',
      attachTo: { id: 'test', input: 'default' },
      output: {
        element: coreExtensionData.reactElement,
      },
      factory(_, options: { text: string }) {
        return {
          element: <h1>{options.text}</h1>,
        };
      },
    });

    const extension = TestExtension.new({
      name: 'my-extension',
      options: {
        text: 'Hello, world!',
      },
    });

    const overridden = extension.override({
      factory({ originalFactory }, { text }) {
        return {
          element: (
            <div>
              {originalFactory().element}
              <h3>{text}</h3>
            </div>
          ),
        };
      },
    });

    const { container } = createExtensionTester(overridden).render();
    expect(container.querySelector('h1')).toHaveTextContent('Hello, world!');
    expect(container.querySelector('h3')).toHaveTextContent('Hello, world!');
  });
});
