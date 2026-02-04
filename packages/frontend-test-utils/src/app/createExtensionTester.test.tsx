/*
 * Copyright 2023 The Backstage Authors
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

import {
  analyticsApiRef,
  coreExtensionData,
  createExtension,
  createExtensionDataRef,
  createExtensionInput,
  useAnalytics,
} from '@backstage/frontend-plugin-api';
import { createExtensionTester } from './createExtensionTester';
import { screen } from '@testing-library/react';
import { renderInTestApp } from './renderInTestApp';

const stringDataRef = createExtensionDataRef<string>().with({
  id: 'test.string',
});

describe('createExtensionTester', () => {
  it('should return the correct dataRef when called', () => {
    const extension = createExtension({
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: () => [stringDataRef('test-text')],
    });

    const tester = createExtensionTester(extension);

    expect(tester.get(stringDataRef)).toBe('test-text');
  });

  it('should throw an error if trying to access an instance not provided to the tester', () => {
    const extension = createExtension({
      name: 'e1',
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: () => [stringDataRef('test-text')],
    });

    const extension2 = createExtension({
      name: 'e2',
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: () => [stringDataRef('test-text')],
    });

    const tester = createExtensionTester(extension);

    expect(() => tester.query(extension2)).toThrow(
      "Extension with ID 'e2' not found, please make sure it's added to the tester",
    );
  });

  it('should throw an error if trying to access an instance which is not part of the tree', () => {
    const extension = createExtension({
      name: 'e1',
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: () => [stringDataRef('test-text')],
    });

    const extension2 = createExtension({
      name: 'e2',
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: () => [stringDataRef('test-text')],
    });

    const tester = createExtensionTester(extension).add(extension2);

    expect(() => tester.query(extension2)).toThrow(
      "Extension with ID 'e2' has not been instantiated, because it is not part of the test subject's extension tree",
    );
  });

  it('should not allow getting extension data for an output that was not defined in the extension', () => {
    const internalRef = createExtensionDataRef<number>().with({
      id: 'test.internal',
    });

    const internalRef2 = createExtensionDataRef<number>().with({
      id: 'test.internal2',
    });

    const extension = createExtension({
      name: 'e1',
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef, internalRef.optional()],
      factory: () => [stringDataRef('test-text')],
    });

    const tester = createExtensionTester(extension);

    const test: string = tester.get(stringDataRef);

    // @ts-expect-error - internalRef is optional
    const test2: number = tester.get(internalRef);

    // @ts-expect-error - internalRef2 is not defined in the extension
    const test3: number = tester.get(internalRef2);

    expect([test, test2, test3]).toBeDefined();
  });

  it('should support getting outputs from a query response', () => {
    const internalRef = createExtensionDataRef<number>().with({
      id: 'test.internal',
    });

    const internalRef2 = createExtensionDataRef<number>().with({
      id: 'test.internal2',
    });

    const extension = createExtension({
      name: 'e1',
      inputs: {
        ignored: createExtensionInput([stringDataRef]),
      },
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [coreExtensionData.reactElement],
      factory: () => [coreExtensionData.reactElement(<div>bob</div>)],
    });

    const extraExtension = createExtension({
      name: 'e2',
      attachTo: { id: 'e1', input: 'ignored' },
      output: [stringDataRef, internalRef.optional()],
      factory: () => [stringDataRef('test-text')],
    });

    const tester = createExtensionTester(extension)
      .add(extraExtension)
      .query(extraExtension);

    const test: string = tester.get(stringDataRef);

    // @ts-expect-error - internalRef is optional
    const test2: number = tester.get(internalRef);

    // @ts-expect-error - internalRef2 is not defined in the extension
    const test3: number = tester.get(internalRef2);

    expect([test, test2, test3]).toBeDefined();
  });

  it('should support API overrides via options', async () => {
    const analyticsApiMock = { captureEvent: jest.fn() };

    const TestComponent = () => {
      const analytics = useAnalytics();
      analytics.captureEvent('test', 'value');
      return <div>Test</div>;
    };

    const extension = createExtension({
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [coreExtensionData.reactElement],
      factory: () => [coreExtensionData.reactElement(<TestComponent />)],
    });

    const tester = createExtensionTester(extension, {
      apis: [[analyticsApiRef, analyticsApiMock]],
    });

    renderInTestApp(tester.reactElement(), {
      apis: [[analyticsApiRef, analyticsApiMock]],
    });

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(analyticsApiMock.captureEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'test',
        subject: 'value',
      }),
    );
  });

  describe('snapshot', () => {
    it('should return a snapshot of the extension tree', () => {
      const extension = createExtension({
        name: 'root',
        attachTo: { id: 'ignored', input: 'ignored' },
        output: [stringDataRef],
        factory: () => [stringDataRef('test-text')],
      });

      const tester = createExtensionTester(extension);

      expect(tester.snapshot()).toMatchInlineSnapshot(`
        {
          "id": "root",
          "outputs": [
            "test.string",
          ],
        }
      `);
    });

    it('should include child extensions in the tree', () => {
      const childInput = createExtensionInput([stringDataRef]);

      const rootExtension = createExtension({
        name: 'root',
        attachTo: { id: 'ignored', input: 'ignored' },
        inputs: {
          children: childInput,
        },
        output: [coreExtensionData.reactElement],
        factory: () => [coreExtensionData.reactElement(<div>root</div>)],
      });

      const childExtension = createExtension({
        name: 'child',
        attachTo: { id: 'root', input: 'children' },
        output: [stringDataRef],
        factory: () => [stringDataRef('child-data')],
      });

      const tester = createExtensionTester(rootExtension).add(childExtension);

      expect(tester.snapshot()).toMatchInlineSnapshot(`
        {
          "children": {
            "children": [
              {
                "id": "child",
                "outputs": [
                  "test.string",
                ],
              },
            ],
          },
          "id": "root",
          "outputs": [
            "core.reactElement",
          ],
        }
      `);
    });

    it('should include multiple children in sorted order', () => {
      const childInput = createExtensionInput([stringDataRef]);

      const rootExtension = createExtension({
        name: 'root',
        attachTo: { id: 'ignored', input: 'ignored' },
        inputs: {
          children: childInput,
        },
        output: [coreExtensionData.reactElement],
        factory: () => [coreExtensionData.reactElement(<div>root</div>)],
      });

      const child1 = createExtension({
        name: 'child1',
        attachTo: { id: 'root', input: 'children' },
        output: [stringDataRef],
        factory: () => [stringDataRef('child1-data')],
      });

      const child2 = createExtension({
        name: 'child2',
        attachTo: { id: 'root', input: 'children' },
        output: [stringDataRef],
        factory: () => [stringDataRef('child2-data')],
      });

      const tester = createExtensionTester(rootExtension)
        .add(child1)
        .add(child2);

      expect(tester.snapshot()).toMatchInlineSnapshot(`
        {
          "children": {
            "children": [
              {
                "id": "child1",
                "outputs": [
                  "test.string",
                ],
              },
              {
                "id": "child2",
                "outputs": [
                  "test.string",
                ],
              },
            ],
          },
          "id": "root",
          "outputs": [
            "core.reactElement",
          ],
        }
      `);
    });

    it('should omit empty children and outputs', () => {
      const extension = createExtension({
        name: 'root',
        attachTo: { id: 'ignored', input: 'ignored' },
        output: [],
        factory: () => [],
      });

      const tester = createExtensionTester(extension);

      expect(tester.snapshot()).toMatchInlineSnapshot(`
        {
          "id": "root",
        }
      `);
    });

    it('should produce serializable snapshot data', () => {
      const extension = createExtension({
        name: 'root',
        attachTo: { id: 'ignored', input: 'ignored' },
        output: [stringDataRef],
        factory: () => [stringDataRef('test-text')],
      });

      const tester = createExtensionTester(extension);
      const snapshot = tester.snapshot();

      expect(snapshot).toEqual({
        id: 'root',
        outputs: ['test.string'],
      });

      expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
    });
  });
});
