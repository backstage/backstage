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
import { screen } from '@testing-library/react';
import { mockApis } from '@backstage/test-utils';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { analyticsApiRef } from '@backstage/core-plugin-api';
import {
  TechDocsReaderPageProvider,
  techdocsApiRef,
} from '@backstage/plugin-techdocs-react';

const entityRef = { name: 'name', namespace: 'namespace', kind: 'kind' };

function renderNotFound(
  errorMessage?: string,
  analyticsApi = mockApis.analytics(),
) {
  return renderInTestApp(
    <TechDocsReaderPageProvider entityRef={entityRef}>
      <TechDocsNotFound errorMessage={errorMessage} />
    </TechDocsReaderPageProvider>,
    {
      initialRouteEntries: ['/the/pathname?the=search#the-anchor'],
      apis: [
        [analyticsApiRef, analyticsApi],
        [
          techdocsApiRef,
          {
            getEntityMetadata: async () => ({
              apiVersion: 'v1',
              kind: 'kind',
              metadata: { name: 'name' },
            }),
            getTechDocsMetadata: async () => ({
              site_name: 'Test documentation',
              site_description: 'Documentation for the test entity',
            }),
          },
        ],
      ],
    },
  );
}

describe('<TechDocsNotFound />', () => {
  it('should render with status code, status message and go back link', async () => {
    renderNotFound();
    await screen.findByText(/Documentation not found/i);
    screen.getByText(/404/i);
    screen.getByText(/Looks like someone dropped the mic!/i);
    expect(screen.getByTestId('go-back-link')).toBeDefined();
  });

  it('should trigger analytics event not-found', async () => {
    const analyticsApi = mockApis.analytics();
    renderNotFound(undefined, analyticsApi);
    await screen.findByText(/Documentation not found/i);
    expect(analyticsApi.captureEvent).toHaveBeenCalledWith({
      action: 'not-found',
      subject: '/the/pathname?the=search#the-anchor',
      attributes: entityRef,
      context: expect.anything(),
    });
  });

  it('should render with a 404 code, custom error message and go back link', async () => {
    renderNotFound('This is a custom error message');
    await screen.findByText(/This is a custom error message/i);
    screen.getByText(/404/i);
    screen.getByText(/Looks like someone dropped the mic!/i);
    expect(screen.getByTestId('go-back-link')).toBeDefined();
  });
});
