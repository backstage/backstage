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

import React, { useEffect } from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import {
  mockApis,
  TestApiProvider,
  withLogCollector,
} from '@backstage/test-utils';
import { ExtensionBoundary } from './ExtensionBoundary';
import { coreExtensionData, createExtension } from '../wiring';
import { analyticsApiRef, useAnalytics } from '@backstage/core-plugin-api';
import { createRouteRef } from '../routing';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';

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
    const analyticsApiMock = mockApis.analytics();

    const AnalyticsComponent = () => {
      const analytics = useAnalytics();
      useEffect(() => {
        analytics.captureEvent(action, subject);
      }, [analytics]);
      return null;
    };

    renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsApiMock]]}>
        {createExtensionTester(
          wrapInBoundaryExtension(<AnalyticsComponent />),
        ).reactElement()}
      </TestApiProvider>,
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

  // TODO(Rugvip): Need a way to be able to override APIs in the app to be able to test this properly
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should emit analytics events if routable', async () => {
    const Emitter = () => {
      const analytics = useAnalytics();
      useEffect(() => {
        analytics.captureEvent('dummy', 'dummy');
      });
      return null;
    };
    const analyticsApiMock = mockApis.analytics();

    await act(async () => {
      renderInTestApp(
        createExtensionTester(
          wrapInBoundaryExtension(<Emitter />),
        ).reactElement(),
        // { apis: [[analyticsApiRef, analyticsApiMock]] },
      );
    });

    expect(analyticsApiMock.captureEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'navigate',
        subject: '/',
        context: expect.objectContaining({
          pluginId: 'root',
          extensionId: 'test',
        }),
      }),
    );
    expect(analyticsApiMock.captureEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'dummy' }),
    );
  });
});
