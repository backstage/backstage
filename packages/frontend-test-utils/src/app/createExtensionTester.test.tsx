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
  createSchemaFromZod,
  useAnalytics,
  useApi,
} from '@backstage/frontend-plugin-api';
import { MockAnalyticsApi } from '../apis';
import { createExtensionTester } from './createExtensionTester';

describe('createExtensionTester', () => {
  const defaultDefinition = {
    namespace: 'test',
    attachTo: { id: 'ignored', input: 'ignored' },
    output: { element: coreExtensionData.reactElement },
    factory: () => ({ element: <div>test</div> }),
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
    expect(() => tester.render()).toThrow(
      "Failed to instantiate extension 'app/routes', input 'routes' did not receive required extension data 'core.reactElement' from extension 'test'",
    );
  });

  it('should render multiple extensions', async () => {
    const indexPageExtension = createExtension({
      ...defaultDefinition,
      factory: () => ({
        element: (
          <div>
            Index page <Link to="/details">See details</Link>
          </div>
        ),
      }),
    });
    const detailsPageExtension = createExtension({
      ...defaultDefinition,
      name: 'details',
      attachTo: { id: 'app/routes', input: 'routes' },
      output: {
        path: coreExtensionData.routePath,
        element: coreExtensionData.reactElement,
      },
      factory: () => ({ path: '/details', element: <div>Details page</div> }),
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
      configSchema: createSchemaFromZod(z =>
        z.object({ title: z.string().optional() }),
      ),
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
        return {
          element: <Component />,
        };
      },
    });

    const detailsPageExtension = createExtension({
      ...defaultDefinition,
      name: 'details',
      attachTo: { id: 'app/routes', input: 'routes' },
      configSchema: createSchemaFromZod(z =>
        z.object({ title: z.string().optional() }),
      ),
      output: {
        path: coreExtensionData.routePath,
        element: coreExtensionData.reactElement,
      },
      factory: ({ config }) => ({
        path: '/details',
        element: <div>{config.title ?? 'Details page'}</div>,
      }),
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

        return {
          element: <Component />,
        };
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
});
