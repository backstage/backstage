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
      factory(_, props: { text: string }) {
        return {
          element: <h1>{props.text}</h1>,
        };
      },
    });

    const extension = TestExtension.new({
      name: 'my-extension',
      props: {
        text: 'Hello, world!',
      },
    });

    expect(extension).toBeDefined();

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
      factory(_, props: { text: string }) {
        return {
          element: <h1>{props.text}</h1>,
        };
      },
    });

    const extension = TestExtension.new({
      name: 'my-extension',
      props: {
        text: 'Hello, world!',
      },
      factory(_, props: { text: string }) {
        return {
          element: <h2>{props.text}</h2>,
        };
      },
    });

    expect(extension).toBeDefined();

    const { container } = createExtensionTester(extension).render();
    expect(container.querySelector('h2')).toHaveTextContent('Hello, world!');
  });
});
