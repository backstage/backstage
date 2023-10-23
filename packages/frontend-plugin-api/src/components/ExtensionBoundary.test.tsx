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
import {
  MockAnalyticsApi,
  MockConfigApi,
  TestApiProvider,
  renderWithEffects,
} from '@backstage/test-utils';
import { ExtensionBoundary } from './ExtensionBoundary';
import {
  Extension,
  coreExtensionData,
  createExtension,
  createPlugin,
} from '../wiring';
import { analyticsApiRef, useAnalytics } from '@backstage/core-plugin-api';
import { createApp } from '@backstage/frontend-app-api';
import { JsonObject } from '@backstage/types';
import { createRouteRef } from '../routing';

function renderExtensionInTestApp(
  extension: Extension<unknown>,
  options?: {
    config?: JsonObject;
  },
) {
  const { config = {} } = options ?? {};

  const app = createApp({
    features: [
      createPlugin({
        id: 'plugin',
        extensions: [extension],
      }),
    ],
    configLoader: async () => new MockConfigApi(config),
  });

  return renderWithEffects(app.createRoot());
}

const wrapInBoundaryExtension = (element: JSX.Element) => {
  const id = 'plugin.extension';
  const routeRef = createRouteRef();
  return createExtension({
    id,
    attachTo: { id: 'core.routes', input: 'routes' },
    output: {
      element: coreExtensionData.reactElement,
      path: coreExtensionData.routePath,
      routeRef: coreExtensionData.routeRef.optional(),
    },
    factory({ bind, source }) {
      bind({
        routeRef,
        path: '/',
        element: (
          <ExtensionBoundary id={id} source={source}>
            {element}
          </ExtensionBoundary>
        ),
      });
    },
  });
};

describe('ExtensionBoundary', () => {
  it('should render children when there is no error', async () => {
    const text = 'Text Component';
    const TextComponent = () => {
      return <p>{text}</p>;
    };
    await renderExtensionInTestApp(wrapInBoundaryExtension(<TextComponent />));
    await waitFor(() => expect(screen.getByText(text)).toBeInTheDocument());
  });

  it('should show app error component when an error is thrown', async () => {
    const error = 'Something went wrong';
    const ErrorComponent = () => {
      throw new Error(error);
    };
    await renderExtensionInTestApp(wrapInBoundaryExtension(<ErrorComponent />));
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

    await renderExtensionInTestApp(
      wrapInBoundaryExtension(
        <TestApiProvider apis={[[analyticsApiRef, analyticsApiMock]]}>
          <AnalyticsComponent />
        </TestApiProvider>,
      ),
    );

    await waitFor(() =>
      expect(analyticsApiMock.getEvents()[0]).toMatchObject({
        action,
        subject,
        context: {
          extension: 'plugin.extension',
          routeRef: 'unknown',
        },
      }),
    );
  });
});
