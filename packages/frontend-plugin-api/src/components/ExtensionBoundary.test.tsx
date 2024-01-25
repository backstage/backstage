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
import { screen, waitFor } from '@testing-library/react';
import { MockAnalyticsApi, TestApiProvider } from '@backstage/test-utils';
import { ExtensionBoundary } from './ExtensionBoundary';
import { coreExtensionData, createExtension } from '../wiring';
import { analyticsApiRef, useAnalytics } from '@backstage/core-plugin-api';
import { createRouteRef } from '../routing';
import { createExtensionTester } from '@backstage/frontend-test-utils';

const wrapInBoundaryExtension = (element: JSX.Element) => {
  const routeRef = createRouteRef();
  return createExtension({
    name: 'test',
    attachTo: { id: 'app/routes', input: 'routes' },
    output: {
      element: coreExtensionData.reactElement,
      path: coreExtensionData.routePath,
      routeRef: coreExtensionData.routeRef.optional(),
    },
    factory({ node }) {
      return {
        routeRef,
        path: '/',
        element: <ExtensionBoundary node={node}>{element}</ExtensionBoundary>,
      };
    },
  });
};

describe('ExtensionBoundary', () => {
  it('should render children when there is no error', async () => {
    const text = 'Text Component';
    const TextComponent = () => {
      return <p>{text}</p>;
    };
    createExtensionTester(wrapInBoundaryExtension(<TextComponent />)).render();
    await waitFor(() => expect(screen.getByText(text)).toBeInTheDocument());
  });

  it('should show app error component when an error is thrown', async () => {
    const error = 'Something went wrong';
    const ErrorComponent = () => {
      throw new Error(error);
    };
    createExtensionTester(wrapInBoundaryExtension(<ErrorComponent />)).render();
    await waitFor(() => expect(screen.getByText(error)).toBeInTheDocument());
  });

  it('should wrap children with analytics context', async () => {
    const action = 'render';
    const subject = 'analytics';
    const analyticsApiMock = new MockAnalyticsApi();

    const AnalyticsComponent = () => {
      const analytics = useAnalytics();
      useEffect(() => {
        analytics.captureEvent(action, subject);
      }, [analytics]);
      return null;
    };

    createExtensionTester(
      wrapInBoundaryExtension(
        <TestApiProvider apis={[[analyticsApiRef, analyticsApiMock]]}>
          <AnalyticsComponent />
        </TestApiProvider>,
      ),
    ).render();

    await waitFor(() => {
      const event = analyticsApiMock
        .getEvents()
        .find(e => e.subject === subject);

      expect(event).toMatchObject({
        action,
        subject,
        context: {
          extensionId: 'test',
        },
      });
    });
  });
});
