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
  renderInTestApp,
  renderWithEffects,
  TestApiRegistry,
} from '@backstage/test-utils';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import { act, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';
import { scaffolderApiRef } from '../../api';
import { ScaffolderApi } from '../../types';
import { rootRouteRef } from '../../routes';
import { TemplatePage } from './TemplatePage';
import {
  featureFlagsApiRef,
  FeatureFlagsApi,
} from '@backstage/core-plugin-api';

import { ApiProvider } from '@backstage/core-app-api';
import { errorApiRef } from '@backstage/core-plugin-api';

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
        <TemplatePage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );

    expect(rendered.queryByText('Create a New Component')).toBeInTheDocument();
    expect(rendered.queryByText('React SSR Template')).toBeInTheDocument();
  });

  it('renders spinner while loading', async () => {
    let resolve: Function;
    const promise = new Promise<any>(res => {
      resolve = res;
    });
    scaffolderApiMock.getTemplateParameterSchema.mockReturnValueOnce(promise);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <TemplatePage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );

    expect(rendered.queryByText('Create a New Component')).toBeInTheDocument();
    expect(rendered.queryByTestId('loading-progress')).toBeInTheDocument();

    await act(async () => {
      resolve!({
        title: 'React SSR Template',
        steps: [],
      });
    });
  });

  it('navigates away if no template was loaded', async () => {
    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue(
      undefined as any,
    );

    const rendered = await renderWithEffects(
      <ApiProvider apis={apis}>
        <ThemeProvider theme={lightTheme}>
          <MemoryRouter initialEntries={['/create/test']}>
            <Route path="/create/test">
              <TemplatePage />
            </Route>
            <Route path="/create" element={<>This is root</>} />
          </MemoryRouter>
        </ThemeProvider>
      </ApiProvider>,
    );

    expect(
      rendered.queryByText('Create a New Component'),
    ).not.toBeInTheDocument();
    expect(rendered.queryByText('This is root')).toBeInTheDocument();
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
          <TemplatePage />
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

    const { queryByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <TemplatePage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    expect(await queryByText('Name')).not.toBeInTheDocument();
    expect(await queryByText('Description')).toBeInTheDocument();
    expect(await queryByText('Owner')).toBeInTheDocument();
    expect(await queryByText('Send data')).toBeInTheDocument();
  });
});
