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

import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import {
  analyticsApiRef,
  configApiRef,
  coreExtensionData,
  createApiExtension,
  createApiFactory,
  createExtension,
  createExtensionDataRef,
  createExtensionInput,
  useAnalytics,
  useApi,
} from '@backstage/frontend-plugin-api';
import { MockAnalyticsApi } from '../apis';
import { createExtensionTester } from './createExtensionTester';

const stringDataRef = createExtensionDataRef<string>().with({
  id: 'test.string',
});

describe('createExtensionTester', () => {
  const defaultDefinition = {
    namespace: 'test',
    attachTo: { id: 'ignored', input: 'ignored' },
    output: [coreExtensionData.reactElement],
    factory: () => [coreExtensionData.reactElement(<div>test</div>)],
  };

  it('should render a simple extension', async () => {
    const extension = createExtension(defaultDefinition);
    const tester = createExtensionTester(extension);
    tester.render();
    await expect(screen.findByText('test')).resolves.toBeInTheDocument();
  });

  it('should render an extension even if disabled by default', async () => {
    const extension = createExtension({
      ...defaultDefinition,
      disabled: true,
    });
    const tester = createExtensionTester(extension);
    tester.render();
    await expect(screen.findByText('test')).resolves.toBeInTheDocument();
  });

  it("should fail to render an extension that doesn't output a react element", async () => {
    const extension = createExtension({
      ...defaultDefinition,
      output: { path: coreExtensionData.routePath },
      factory: () => ({ path: '/foo' }),
    });
    const tester = createExtensionTester(extension);
    expect(() => tester.render()).toThrowErrorMatchingInlineSnapshot(
      `"Failed to instantiate extension 'app/routes', extension 'test' could not be attached because its output data ('core.routing.path') does not match what the input 'routes' requires ('core.routing.path', 'core.reactElement')"`,
    );
  });

  it('should render multiple extensions', async () => {
    const indexPageExtension = createExtension({
      ...defaultDefinition,
      factory: () => [
        coreExtensionData.reactElement(
          <div>
            Index page <Link to="/details">See details</Link>
          </div>,
        ),
      ],
    });
    const detailsPageExtension = createExtension({
      ...defaultDefinition,
      name: 'details',
      attachTo: { id: 'app/routes', input: 'routes' },
      output: [coreExtensionData.routePath, coreExtensionData.reactElement],
      factory: () => [
        coreExtensionData.routePath('/details'),
        coreExtensionData.reactElement(<div>Details page</div>),
      ],
    });

    const tester = createExtensionTester(indexPageExtension);
    tester.add(detailsPageExtension);
    tester.render();

    await expect(screen.findByText('Index page')).resolves.toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: 'See details' }));

    await expect(
      screen.findByText('Details page'),
    ).resolves.toBeInTheDocument();
  });

  it('should accepts a custom config', async () => {
    const indexPageExtension = createExtension({
      ...defaultDefinition,
      config: {
        schema: {
          title: z => z.string().optional(),
        },
      },
      factory: ({ config }) => {
        const Component = () => {
          const configApi = useApi(configApiRef);
          const appTitle = configApi.getOptionalString('app.title');
          return (
            <div>
              <h2>{appTitle ?? 'Backstafe app'}</h2>
              <h3>{config.title ?? 'Index page'}</h3>
              <Link to="/details">See details</Link>
            </div>
          );
        };

        return [coreExtensionData.reactElement(<Component />)];
      },
    });

    const detailsPageExtension = createExtension({
      ...defaultDefinition,
      name: 'details',
      attachTo: { id: 'app/routes', input: 'routes' },
      config: {
        schema: {
          title: z => z.string().optional(),
        },
      },
      output: [coreExtensionData.routePath, coreExtensionData.reactElement],
      factory: ({ config }) => [
        coreExtensionData.routePath('/details'),
        coreExtensionData.reactElement(
          <div>{config.title ?? 'Details page'}</div>,
        ),
      ],
    });

    const tester = createExtensionTester(indexPageExtension, {
      config: { title: 'Custom index' },
    });

    tester.add(detailsPageExtension, {
      config: { title: 'Custom details' },
    });

    tester.render({
      config: {
        app: {
          title: 'Custom app',
        },
      },
    });

    await expect(
      screen.findByRole('heading', { name: 'Custom app' }),
    ).resolves.toBeInTheDocument();

    await expect(
      screen.findByRole('heading', { name: 'Custom index' }),
    ).resolves.toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: 'See details' }));

    await expect(
      screen.findByText('Custom details'),
    ).resolves.toBeInTheDocument();
  });

  it('should capture click events in analytics', async () => {
    // Mocking the analytics api implementation
    const analyticsApiMock = new MockAnalyticsApi();

    const analyticsApiOverride = createApiExtension({
      factory: createApiFactory({
        api: analyticsApiRef,
        deps: {},
        factory: () => analyticsApiMock,
      }),
    });

    const indexPageExtension = createExtension({
      ...defaultDefinition,
      factory: () => {
        const Component = () => {
          const analyticsApi = useAnalytics();
          const handleClick = useCallback(() => {
            analyticsApi.captureEvent('click', 'See details');
          }, [analyticsApi]);
          return (
            <div>
              Index Page
              <button onClick={handleClick}>See details</button>
            </div>
          );
        };

        return [coreExtensionData.reactElement(<Component />)];
      },
    });

    const tester = createExtensionTester(indexPageExtension);

    // Overriding the analytics api extension
    tester.add(analyticsApiOverride);

    tester.render();

    fireEvent.click(await screen.findByRole('button', { name: 'See details' }));

    await waitFor(() =>
      expect(analyticsApiMock.getEvents()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            action: 'click',
            subject: 'See details',
          }),
        ]),
      ),
    );
  });

  it('should return the correct dataRef when called', () => {
    const extension = createExtension({
      namespace: 'test',
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: () => [stringDataRef('test-text')],
    });

    const tester = createExtensionTester(extension);

    expect(tester.get(stringDataRef)).toBe('test-text');
  });

  it('should throw an error if trying to access an instance not provided to the tester', () => {
    const extension = createExtension({
      namespace: 'test',
      name: 'e1',
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: () => [stringDataRef('test-text')],
    });

    const extension2 = createExtension({
      namespace: 'test',
      name: 'e2',
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: () => [stringDataRef('test-text')],
    });

    const tester = createExtensionTester(extension);

    expect(() => tester.query(extension2)).toThrow(
      "Extension with ID 'test/e2' not found, please make sure it's added to the tester",
    );
  });

  it('should throw an error if trying to access an instance which is not part of the tree', () => {
    const extension = createExtension({
      namespace: 'test',
      name: 'e1',
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: () => [stringDataRef('test-text')],
    });

    const extension2 = createExtension({
      namespace: 'test',
      name: 'e2',
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [stringDataRef],
      factory: () => [stringDataRef('test-text')],
    });

    const tester = createExtensionTester(extension).add(extension2);

    expect(() => tester.query(extension2)).toThrow(
      "Extension with ID 'test/e2' has not been instantiated, because it is not part of the test subject's extension tree",
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
      namespace: 'test',
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
      namespace: 'test',
      name: 'e1',
      inputs: {
        ignored: createExtensionInput([stringDataRef]),
      },
      attachTo: { id: 'ignored', input: 'ignored' },
      output: [coreExtensionData.reactElement],
      factory: () => [coreExtensionData.reactElement(<div>bob</div>)],
    });

    const extraExtension = createExtension({
      namespace: 'test',
      name: 'e2',
      attachTo: { id: 'test/e1', input: 'ignored' },
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
});
