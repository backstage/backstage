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

import {
  MockAnalyticsApi,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { act, fireEvent, screen, within } from '@testing-library/react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  scaffolderApiRef,
  ScaffolderApi,
  SecretsContextProvider,
} from '@backstage/plugin-scaffolder-react';
import { TemplatePage } from './TemplatePage';
import {
  featureFlagsApiRef,
  FeatureFlagsApi,
  analyticsApiRef,
} from '@backstage/core-plugin-api';
import { ApiProvider } from '@backstage/core-app-api';
import { errorApiRef } from '@backstage/core-plugin-api';
import { rootRouteRef } from '../../routes';

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

const featureFlagsApiMock: jest.Mocked<FeatureFlagsApi> = {
  isActive: jest.fn(),
  registerFlag: jest.fn(),
  getRegisteredFlags: jest.fn(),
  save: jest.fn(),
};

const errorApiMock = { post: jest.fn(), error$: jest.fn() };

const analyticsMock = new MockAnalyticsApi();

const schemaMockValue = {
  title: 'my-schema',
  steps: [
    {
      title: 'Fill in some steps',
      schema: {
        title: 'Fill in some steps',
        'backstage:featureFlag': 'experimental-feature',
        properties: {
          name: {
            title: 'Name',
            type: 'string',
            'backstage:featureFlag': 'should-show-some-stuff-first-option',
          },
          description: {
            title: 'Description',
            type: 'string',
            description: 'A description for the component',
          },
          owner: {
            title: 'Owner',
            type: 'string',
            description: 'Owner of the component',
          },
        },
        type: 'object',
      },
    },
    {
      title: 'Send data',
      schema: {
        title: 'Send data',
        properties: {
          user: {
            title: 'User',
            type: 'string',
          },
        },
        type: 'object',
      },
    },
  ],
};

const apis = TestApiRegistry.from(
  [scaffolderApiRef, scaffolderApiMock],
  [errorApiRef, errorApiMock],
  [featureFlagsApiRef, featureFlagsApiMock],
  [analyticsApiRef, analyticsMock],
);

describe('TemplatePage', () => {
  beforeEach(() => jest.resetAllMocks());

  it('renders correctly', async () => {
    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
      title: 'React SSR Template',
      steps: [],
    });
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <SecretsContextProvider>
          <TemplatePage />
        </SecretsContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );

    expect(rendered.getByText('Create a New Component')).toBeInTheDocument();
    expect(rendered.getByText('React SSR Template')).toBeInTheDocument();
  });

  it('renders spinner while loading', async () => {
    let resolve: Function;
    const promise = new Promise<any>(res => {
      resolve = res;
    });
    scaffolderApiMock.getTemplateParameterSchema.mockReturnValueOnce(promise);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <SecretsContextProvider>
          <TemplatePage />
        </SecretsContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );

    expect(rendered.getByText('Create a New Component')).toBeInTheDocument();
    expect(rendered.getByTestId('loading-progress')).toBeInTheDocument();

    await act(async () => {
      resolve!({
        title: 'React SSR Template',
        steps: [],
      });
    });
  });

  it('captures expected analytics events', async () => {
    scaffolderApiMock.scaffold.mockResolvedValue({ taskId: 'xyz' });
    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
      title: 'schema-4-analytics',
      steps: [
        {
          title: 'Fill in some steps',
          schema: {
            properties: {
              name: {
                title: 'Name',
                type: 'string',
              },
            },
            required: ['name'],
          },
        },
      ],
    });
    const { findByLabelText, findByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <SecretsContextProvider>
          <TemplatePage />
        </SecretsContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );

    // Fill out the name field
    expect(await findByText('Fill in some steps')).toBeInTheDocument();
    fireEvent.change(await findByLabelText('Name', { exact: false }), {
      target: { value: 'expected-name' },
    });

    // Go to the final page
    fireEvent.click(await findByText('Next step'));
    expect(await findByText('Reset')).toBeInTheDocument();

    // Create the software
    await act(async () => {
      fireEvent.click(await findByText('Create'));
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

  it('navigates away if no template was loaded', async () => {
    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue(
      undefined as any,
    );

    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <Routes>
          <Route
            path="/create/test"
            element={
              <SecretsContextProvider>
                <TemplatePage />
              </SecretsContextProvider>
            }
          />
          <Route path="/create" element={<>This is root</>} />
        </Routes>
      </ApiProvider>,
      {
        routeEntries: ['/create'],
        mountedRoutes: { '/create': rootRouteRef },
      },
    );

    expect(
      rendered.queryByText('Create a New Component'),
    ).not.toBeInTheDocument();
    expect(rendered.getByText('This is root')).toBeInTheDocument();
  });

  it('display template with oneOf', async () => {
    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
      title: 'my-schema',
      steps: [
        {
          title: 'Fill in some steps',
          schema: {
            oneOf: [
              {
                title: 'First',
                properties: {
                  name: {
                    title: 'Name',
                    type: 'string',
                  },
                },
                required: ['name'],
              },
              {
                title: 'Second',
                properties: {
                  something: {
                    title: 'Something',
                    type: 'string',
                  },
                },
                required: ['something'],
              },
            ],
          },
        },
      ],
    });

    const { findByText, findByLabelText, findAllByRole, findByRole } =
      await renderInTestApp(
        <ApiProvider apis={apis}>
          <SecretsContextProvider>
            <TemplatePage />
          </SecretsContextProvider>
        </ApiProvider>,
        {
          mountedRoutes: {
            '/create/actions': rootRouteRef,
          },
        },
      );

    expect(await findByText('Fill in some steps')).toBeInTheDocument();

    // Fill the first option
    fireEvent.change(await findByLabelText('Name', { exact: false }), {
      target: { value: 'my-name' },
    });

    // Switch to second option
    fireEvent.mouseDown((await findAllByRole('button'))[0]);
    const listbox = within(await findByRole('listbox'));
    fireEvent.click(listbox.getByText(/Second/i));

    // Fill the second option
    fireEvent.change(await findByLabelText('Something', { exact: false }), {
      target: { value: 'my-something' },
    });

    // Go to the final page
    fireEvent.click(await findByText('Next step'));
    expect(await findByText('Reset')).toBeInTheDocument();
  });

  it('should display a section or property based on a feature flag', async () => {
    featureFlagsApiMock.isActive.mockImplementation(flag => {
      if (flag === 'experimental-feature') {
        return true;
      }
      return false;
    });
    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue(
      schemaMockValue,
    );

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <SecretsContextProvider>
          <TemplatePage />
        </SecretsContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    expect(screen.queryByText('Name')).not.toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Send data')).toBeInTheDocument();
  });
});
