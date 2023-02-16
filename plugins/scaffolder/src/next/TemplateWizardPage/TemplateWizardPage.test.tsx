/*
 * Copyright 2022 The Backstage Authors
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
import { ApiProvider } from '@backstage/core-app-api';
import { analyticsApiRef } from '@backstage/core-plugin-api';
import {
  MockAnalyticsApi,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  ScaffolderApi,
  scaffolderApiRef,
  SecretsContextProvider,
} from '@backstage/plugin-scaffolder-react';
import { TemplateWizardPage } from './TemplateWizardPage';
import { rootRouteRef } from '../../routes';
import { nextRouteRef } from '../routes';

jest.mock('react-router-dom', () => {
  return {
    ...(jest.requireActual('react-router-dom') as any),
    useParams: () => ({
      templateName: 'test',
    }),
  };
});

const scaffolderApiMock: jest.Mocked<ScaffolderApi> = {
  scaffold: jest.fn(),
  getTemplateParameterSchema: jest.fn(),
  getIntegrationsList: jest.fn(),
  getTask: jest.fn(),
  streamLogs: jest.fn(),
  listActions: jest.fn(),
  listTasks: jest.fn(),
};

const analyticsMock = new MockAnalyticsApi();
const apis = TestApiRegistry.from(
  [scaffolderApiRef, scaffolderApiMock],
  [analyticsApiRef, analyticsMock],
);

describe('TemplateWizardPage', () => {
  it('captures expected analytics events', async () => {
    scaffolderApiMock.scaffold.mockResolvedValue({ taskId: 'xyz' });
    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
      steps: [
        {
          title: 'Step 1',
          schema: {
            properties: {
              name: {
                type: 'string',
              },
            },
          },
        },
      ],
      title: 'React JSON Schema Form Test',
    });

    const { findByRole, getByRole } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <SecretsContextProvider>
          <TemplateWizardPage customFieldExtensions={[]} />,
        </SecretsContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': nextRouteRef,
          '/create-legacy': rootRouteRef,
        },
      },
    );

    // Fill out the name field
    fireEvent.change(getByRole('textbox', { name: 'name' }), {
      target: { value: 'expected-name' },
    });

    // Go to the final page
    await act(async () => {
      fireEvent.click(await findByRole('button', { name: 'Review' }));
    });

    // Create the software
    await act(async () => {
      fireEvent.click(await findByRole('button', { name: 'Create' }));
    });

    // The "Next Step" button should have fired an event
    expect(analyticsMock.getEvents()[0]).toMatchObject({
      action: 'click',
      subject: 'Next Step (1)',
      context: { entityRef: 'template:default/test' },
    });

    // And the "Create" button should have fired an event
    expect(analyticsMock.getEvents()[1]).toMatchObject({
      action: 'create',
      subject: 'expected-name',
      context: { entityRef: 'template:default/test' },
    });
  });
});
