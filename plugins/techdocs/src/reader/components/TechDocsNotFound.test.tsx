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

import { TechDocsNotFound } from './TechDocsNotFound';
import { screen, waitFor } from '@testing-library/react';
import {
  mockApis,
  TestApiProvider,
  renderInTestApp,
} from '@backstage/test-utils';
import { analyticsApiRef } from '@backstage/core-plugin-api';

jest.mock('@backstage/plugin-techdocs-react', () => {
  const actualModule = jest.requireActual('@backstage/plugin-techdocs-react');
  return {
    ...actualModule,
    useTechDocsReaderPage: () => ({
      entityRef: { name: 'name', namespace: 'namespace', kind: 'kind' },
    }),
  };
});

jest.mock('react-router-dom', () => {
  const actualModule = jest.requireActual('react-router-dom');
  return {
    ...actualModule,
    useLocation: () =>
      ({
        pathname: '/the/pathname',
        search: '?the=search',
        hash: '#the-anchor',
      } as Location),
  };
});

jest.mock('@backstage/core-plugin-api', () => {
  const actual = jest.requireActual('@backstage/core-plugin-api');
  return {
    ...actual,
    useApp: () => ({
      ...actual.useApp(),
      getComponents: () => ({
        ...actual.useApp().getComponents(),
        NotFoundErrorPage: ({ statusMessage }: { statusMessage: string }) => (
          <div data-testid="not-found-page">{statusMessage}</div>
        ),
      }),
    }),
  };
});

describe('<TechDocsNotFound />', () => {
  it('should render with status code and status message', async () => {
    await renderInTestApp(<TechDocsNotFound />);
    expect(screen.getByTestId('not-found-page')).toBeDefined();
  });

  it('should trigger analytics event not-found', async () => {
    const mockAnalyticsApi = mockApis.analytics();

    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, mockAnalyticsApi]]}>
        <TechDocsNotFound />
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(mockAnalyticsApi.captureEvent).toHaveBeenCalledWith({
        action: 'not-found',
        subject: '/the/pathname?the=search#the-anchor',
        attributes: {
          name: 'name',
          namespace: 'namespace',
          kind: 'kind',
        },
        context: expect.anything(),
      });
    });
  });
});

describe('<TechDocsNotFound errorMessage="This is a custom error message" />', () => {
  it('should render with a 404 code, custom error message and go back link', async () => {
    await renderInTestApp(
      <TechDocsNotFound errorMessage="This is a custom error message" />,
    );
    screen.getByText(/This is a custom error message/i);
    expect(screen.getByTestId('not-found-page')).toBeDefined();
  });
});
