/*
 * Copyright 2024 The Backstage Authors
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
import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import React from 'react';
import { rootRouteRef } from '../../routes';
import { TemplateGlobalsPage } from './TemplateGlobalsPage';
import { within } from '@testing-library/react';

const scaffolderApiMock: jest.Mocked<ScaffolderApi> = {
  scaffold: jest.fn(),
  cancelTask: jest.fn(),
  getTemplateParameterSchema: jest.fn(),
  getIntegrationsList: jest.fn(),
  getTask: jest.fn(),
  streamLogs: jest.fn(),
  listActions: jest.fn(),
  listBuiltInTemplateFilters: jest.fn(),
  listAdditionalTemplateFilters: jest.fn(),
  listTemplateGlobalFunctions: jest.fn(),
  listTemplateGlobalValues: jest.fn(),
  listTasks: jest.fn(),
  autocomplete: jest.fn(),
};

const apis = TestApiRegistry.from([scaffolderApiRef, scaffolderApiMock]);

const r = async () =>
  renderInTestApp(
    <ApiProvider apis={apis}>
      <TemplateGlobalsPage />
    </ApiProvider>,
    {
      mountedRoutes: {
        '/create/template-globals': rootRouteRef,
      },
    },
  );

describe('TemplateGlobalsPage', () => {
  beforeEach(() => jest.resetAllMocks());

  it('renders with no globals', async () => {
    scaffolderApiMock.listTemplateGlobalFunctions.mockResolvedValue({});
    scaffolderApiMock.listTemplateGlobalValues.mockResolvedValue({});

    const { getByTestId } = await r();

    const fn = getByTestId('global-functions');
    expect(fn).toBeInTheDocument();
    expect(
      within(fn).getByText('No information to display'),
    ).toBeInTheDocument();

    const v = getByTestId('global-values');
    expect(v).toBeInTheDocument();
    expect(
      within(v).getByText('No information to display'),
    ).toBeInTheDocument();
  });
  it('renders global functions', async () => {
    scaffolderApiMock.listTemplateGlobalFunctions.mockResolvedValue({
      truthy: {
        description: 'evaluate truthiness',
        schema: {
          arguments: [
            {
              title: 'input',
            },
          ],
          output: {
            type: 'boolean',
          },
        },
        examples: [
          {
            description: 'basic usage',
            example: "truthy('foo')",
            notes: 'yields `true`',
          },
        ],
      },
    });
    scaffolderApiMock.listTemplateGlobalValues.mockResolvedValue({});

    const { getByTestId } = await r();

    const truthy = getByTestId('truthy');

    expect(within(truthy).getByText('truthy')).toBeInTheDocument();
    expect(within(truthy).getByText('evaluate truthiness')).toBeInTheDocument();

    expect(within(truthy).getByText('[0]')).toBeInTheDocument();
    expect(within(truthy).getByTestId('root_truthy.arg0')).toBeInTheDocument();
    expect(
      within(truthy).queryByTestId('root_truthy.arg1'),
    ).not.toBeInTheDocument();
    expect(
      within(truthy).getByTestId('root_truthy.output'),
    ).toBeInTheDocument();

    const x = within(truthy).getByTestId('examples');
    expect(x).toBeInTheDocument();
    const xd0 = within(x).getByTestId('example_desc0');
    expect(xd0).toBeInTheDocument();
    expect(xd0).toHaveTextContent(/basic usage\s*yields\s*true/);

    const xc0 = within(x).getByTestId('example_code0');
    expect(within(xc0).getByText("truthy('foo')")).toBeInTheDocument();
  });
  it('renders global values', async () => {
    scaffolderApiMock.listTemplateGlobalFunctions.mockResolvedValue({});
    const msvValue = ['foo', 'bar', 'baz'];
    scaffolderApiMock.listTemplateGlobalValues.mockResolvedValue({
      msv: {
        description: 'metasyntactic variables',
        value: msvValue,
      },
    });
    const { getByTestId } = await r();

    const msv = getByTestId('msv');
    expect(msv).toBeInTheDocument();

    expect(within(msv).getByText('msv')).toBeInTheDocument();
    expect(
      within(msv).getByText('metasyntactic variables'),
    ).toBeInTheDocument();

    const msvValueElement = within(msv).getByTestId('msv.value');
    expect(msvValueElement).toBeInTheDocument();
    expect(JSON.parse(msvValueElement.textContent!)).toEqual(msvValue);
  });
});
