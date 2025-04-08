/*
 * Copyright 2020 The Backstage Authors
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

import { withLogCollector } from '@backstage/test-utils';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { useAnalyticsContext } from '../analytics/AnalyticsContext';
import { useApp, ErrorBoundaryFallbackProps } from '../app';
import { createPlugin } from '../plugin';
import { createRouteRef } from '../routing';
import { getComponentData } from './componentData';
import {
  createComponentExtension,
  createReactExtension,
  createRoutableExtension,
} from './extensions';

jest.mock('../app');

const mocked = (f: Function) => f as jest.Mock;

const plugin = createPlugin({
  id: 'my-plugin',
});

describe('extensions', () => {
  it('should create a react extension with component data', () => {
    const Component = () => <div />;

    const extension = createReactExtension({
      name: 'Extension',
      component: {
        sync: Component,
      },
      data: {
        myData: { foo: 'bar' },
      },
    });

    const ExtensionComponent = plugin.provide(extension);
    const element = <ExtensionComponent />;

    expect(getComponentData(element, 'core.plugin')).toBe(plugin);
    expect(getComponentData(element, 'myData')).toEqual({ foo: 'bar' });
  });

  it('should create react extensions of different types', () => {
    const Component = () => <div />;
    const routeRef = createRouteRef({ id: 'foo' });

    let extension1: ReturnType<typeof createComponentExtension>;
    const { warn } = withLogCollector(['warn'], () => {
      extension1 = createComponentExtension({
        component: {
          sync: Component,
        },
      });
    });
    expect(warn).toEqual([
      expect.stringMatching(
        /^Declaring extensions without name is DEPRECATED. /,
      ),
    ]);

    const extension2 = createRoutableExtension({
      name: 'Extension2',
      component: () => Promise.resolve(Component),
      mountPoint: routeRef,
    });

    const ExtensionComponent1 = plugin.provide(extension1!);
    const ExtensionComponent2 = plugin.provide(extension2);

    const element1 = <ExtensionComponent1 />;
    const element2 = <ExtensionComponent2 />;

    expect(getComponentData(element1, 'core.plugin')).toBe(plugin);
    expect(getComponentData(element2, 'core.plugin')).toBe(plugin);
    expect(getComponentData(element2, 'core.mountPoint')).toBe(routeRef);
  });

  it('should wrap extended component with error boundary', async () => {
    const BrokenComponent = plugin.provide(
      createComponentExtension({
        name: 'BrokenComponent',
        component: {
          sync: () => {
            throw new Error('Test error');
          },
        },
      }),
    );

    mocked(useApp).mockReturnValue({
      getComponents: () => ({
        Progress: () => null,
        ErrorBoundaryFallback: (props: ErrorBoundaryFallbackProps) => (
          <>Error in {props.plugin?.getId()}</>
        ),
      }),
    });

    const { error: errors } = await withLogCollector(['error'], async () => {
      render(<BrokenComponent />);
    });
    screen.getByText('Error in my-plugin');
    expect(errors[0]).toMatchObject({ detail: new Error('Test error') });
  });

  it('should wrap extended component with analytics context', async () => {
    const AnalyticsSpyExtension = plugin.provide(
      createReactExtension({
        name: 'AnalyticsSpy',
        component: {
          sync: () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const context = useAnalyticsContext();
            return (
              <>
                <div data-testid="plugin-id">{context.pluginId}</div>
                <div data-testid="route-ref">{context.routeRef}</div>
                <div data-testid="extension">{context.extension}</div>
              </>
            );
          },
        },
        data: { 'core.mountPoint': { id: 'some-ref' } },
      }),
    );

    const result = render(<AnalyticsSpyExtension />);

    expect(result.getByTestId('plugin-id')).toHaveTextContent('my-plugin');
    expect(result.getByTestId('route-ref')).toHaveTextContent('some-ref');
    expect(result.getByTestId('extension')).toHaveTextContent('AnalyticsSpy');
  });
});
