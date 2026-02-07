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

import { useEffect, ReactNode } from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import { withLogCollector } from '@backstage/test-utils';
import { ExtensionBoundary } from './ExtensionBoundary';
import { coreExtensionData, createExtension } from '../wiring';
import { analyticsApiRef } from '../apis/definitions/AnalyticsApi';
import { useAnalytics } from '../analytics';
import { createRouteRef } from '../routing';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import {
  pluginWrapperApiRef,
  PluginWrapperApi,
} from '../apis/definitions/PluginWrapperApi';
import { useAppNode } from '@backstage/frontend-plugin-api';

const wrapInBoundaryExtension = (element?: JSX.Element) => {
  const routeRef = createRouteRef();
  return createExtension({
    name: 'test',
    attachTo: { id: 'app/routes', input: 'routes' },
    output: [
      coreExtensionData.reactElement,
      coreExtensionData.routePath,
      coreExtensionData.routeRef.optional(),
    ],
    factory({ node }) {
      return [
        coreExtensionData.reactElement(
          <ExtensionBoundary node={node}>{element}</ExtensionBoundary>,
        ),
        coreExtensionData.routePath('/'),
        coreExtensionData.routeRef(routeRef),
      ];
    },
  });
};

describe('ExtensionBoundary', () => {
  it('should render children when there is no error', async () => {
    const text = 'Text Component';
    const TextComponent = () => {
      return <p>{text}</p>;
    };
    renderInTestApp(
      createExtensionTester(
        wrapInBoundaryExtension(<TextComponent />),
      ).reactElement(),
    );
    await waitFor(() => expect(screen.getByText(text)).toBeInTheDocument());
  });

  it('should show app error component when an error is thrown', async () => {
    const errorMsg = 'Something went wrong';
    const ErrorComponent = () => {
      throw new Error(errorMsg);
    };
    const { error } = await withLogCollector(['error'], async () => {
      renderInTestApp(
        createExtensionTester(
          wrapInBoundaryExtension(<ErrorComponent />),
        ).reactElement(),
      );
      await waitFor(() =>
        expect(screen.getByText(errorMsg)).toBeInTheDocument(),
      );
    });
    expect(error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining(errorMsg),
        }),
      ]),
    );
  });

  it('should wrap children with analytics context', async () => {
    const action = 'render';
    const subject = 'analytics';
    const analyticsApiMock = { captureEvent: jest.fn() };

    const AnalyticsComponent = () => {
      const analytics = useAnalytics();
      useEffect(() => {
        analytics.captureEvent(action, subject);
      }, [analytics]);
      return null;
    };

    renderInTestApp(
      createExtensionTester(
        wrapInBoundaryExtension(<AnalyticsComponent />),
      ).reactElement(),
      {
        apis: [[analyticsApiRef, analyticsApiMock]],
      },
    );

    await waitFor(() => {
      expect(analyticsApiMock.captureEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action,
          subject,
          context: expect.objectContaining({
            extensionId: 'test',
          }),
        }),
      );
    });
  });

  it('should wrap children with PluginWrapper when provided', async () => {
    const text = 'Wrapped Content';
    const TextComponent = () => {
      return <p>{text}</p>;
    };

    const WrapperComponent = ({ children }: { children: ReactNode }) => {
      const node = useAppNode();
      return (
        <div data-testid="plugin-wrapper">
          <span>Wrapper for {node?.spec.id}</span>
          {children}
        </div>
      );
    };

    const pluginWrapperApi: PluginWrapperApi = {
      getPluginWrapper: jest.fn((pluginId: string) => {
        if (pluginId === 'app') {
          return WrapperComponent;
        }
        return undefined;
      }),
    };

    renderInTestApp(
      createExtensionTester(
        wrapInBoundaryExtension(<TextComponent />),
      ).reactElement(),
      {
        apis: [[pluginWrapperApiRef, pluginWrapperApi]],
      },
    );

    const wrappers = await screen.findAllByTestId('plugin-wrapper');
    expect(wrappers.length).toBeGreaterThan(1);
    expect(screen.getByText('Wrapper for app')).toBeInTheDocument();
    expect(screen.getByText('Wrapper for test')).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(pluginWrapperApi.getPluginWrapper).toHaveBeenCalledWith('app');
  });

  it('should handle errors thrown by PluginWrapper with ErrorDisplayBoundary', async () => {
    const errorMsg = 'PluginWrapper error';
    const TextComponent = () => {
      return <p>Content</p>;
    };

    const ThrowingWrapper = () => {
      throw new Error(errorMsg);
    };

    const pluginWrapperApi: PluginWrapperApi = {
      getPluginWrapper: jest.fn((pluginId: string) => {
        if (pluginId === 'app') {
          return ThrowingWrapper;
        }
        return undefined;
      }),
    };

    const { error } = await withLogCollector(['error'], async () => {
      renderInTestApp(
        createExtensionTester(
          wrapInBoundaryExtension(<TextComponent />),
        ).reactElement(),
        {
          apis: [[pluginWrapperApiRef, pluginWrapperApi]],
        },
      );
      await waitFor(() =>
        expect(screen.getByText(errorMsg)).toBeInTheDocument(),
      );
    });

    expect(error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining(errorMsg),
        }),
      ]),
    );
  });

  it('should emit analytics events if routable', async () => {
    const Emitter = () => {
      const analytics = useAnalytics();
      useEffect(() => {
        analytics.captureEvent('dummy', 'dummy');
      });
      return null;
    };
    const analyticsApiMock = { captureEvent: jest.fn() };

    await act(async () => {
      renderInTestApp(
        createExtensionTester(
          wrapInBoundaryExtension(<Emitter />),
        ).reactElement(),
        { apis: [[analyticsApiRef, analyticsApiMock]] },
      );
    });

    // The navigate event is emitted by the app's routing, with app context
    expect(analyticsApiMock.captureEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'navigate',
        subject: '/',
      }),
    );
    // The dummy event from our test extension has the correct extension context
    expect(analyticsApiMock.captureEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'dummy',
        context: expect.objectContaining({
          extensionId: 'test',
        }),
      }),
    );
  });
});
