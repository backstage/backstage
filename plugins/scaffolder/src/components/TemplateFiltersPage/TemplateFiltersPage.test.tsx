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
import { TestApiRegistry, renderInTestApp } from '@backstage/test-utils';
import { within } from '@testing-library/react';
import React from 'react';
import { rootRouteRef } from '../../routes';
import { TemplateFiltersPage } from './TemplateFiltersPage';

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
      <TemplateFiltersPage />
    </ApiProvider>,
    {
      mountedRoutes: {
        '/create/template-filters': rootRouteRef,
      },
    },
  );

describe('TemplateFiltersPage', () => {
  beforeEach(() => jest.resetAllMocks());

  it('renders with no filters', async () => {
    scaffolderApiMock.listBuiltInTemplateFilters.mockResolvedValue({});
    scaffolderApiMock.listAdditionalTemplateFilters.mockResolvedValue({});

    const { getByTestId } = await r();

    const builtIn = getByTestId('built-in');
    expect(builtIn).toBeInTheDocument();
    expect(
      within(builtIn).getByText('No information to display'),
    ).toBeInTheDocument();

    expect(
      within(builtIn).getByText(
        'There are no built-in template filters available or there was an issue communicating with the backend.',
      ),
    ).toBeInTheDocument();

    const additional = getByTestId('additional');
    expect(
      within(additional).getByText('No information to display'),
    ).toBeInTheDocument();
    expect(
      within(additional).getByText(
        'There are no additional template filters available or there was an issue communicating with the backend.',
      ),
    ).toBeInTheDocument();
  });

  describe('renders with custom filters', () => {
    it('renders filter without metadata', async () => {
      scaffolderApiMock.listAdditionalTemplateFilters.mockResolvedValue({
        bar: {},
      });
      const { getByTestId, queryByTestId } = await r();
      const bar = getByTestId('bar');
      expect(bar).toBeInTheDocument();
      expect(bar.id).toBe('bar');
      expect(
        within(bar).getByText('Filter metadata unavailable'),
      ).toBeInTheDocument();

      expect(queryByTestId('root_bar.input')).not.toBeInTheDocument();
      expect(queryByTestId('root_bar.arg0')).not.toBeInTheDocument();
      expect(queryByTestId('root_bar.output')).not.toBeInTheDocument();
    });
    it('renders input/output with empty filter schema', async () => {
      scaffolderApiMock.listAdditionalTemplateFilters.mockResolvedValue({
        foo: {
          schema: {},
        },
      });
      const { getByTestId, queryByTestId } = await r();

      const foo = getByTestId('foo');
      expect(foo).toBeInTheDocument();
      expect(foo.id).toBe('foo');

      expect(getByTestId('root_foo.input')).toBeInTheDocument();
      expect(queryByTestId('root_foo.arg0')).not.toBeInTheDocument();
      expect(getByTestId('root_foo.output')).toBeInTheDocument();
    });
    it('renders fully specified filter metadata', async () => {
      scaffolderApiMock.listAdditionalTemplateFilters.mockResolvedValue({
        foo: {
          description: 'foo filter',
          schema: {
            input: {
              description: 'a value',
            },
            arguments: [
              {
                description: 'an arg',
              },
            ],
            output: {
              description: 'same value',
            },
          },
        },
      });
      const { getByTestId, queryByTestId } = await r();

      const foo = getByTestId('foo');
      expect(foo).toBeInTheDocument();
      expect(foo.id).toBe('foo');

      expect(within(foo).getByText('foo filter')).toBeInTheDocument();

      expect(getByTestId('root_foo.input')).toBeInTheDocument();
      expect(getByTestId('root_foo.arg0')).toBeInTheDocument();
      expect(queryByTestId('root_foo.arg1')).not.toBeInTheDocument();
      expect(getByTestId('root_foo.output')).toBeInTheDocument();
    });
    it('renders multiple args', async () => {
      scaffolderApiMock.listAdditionalTemplateFilters.mockResolvedValue({
        baz: {
          schema: {
            arguments: [
              {
                type: 'number',
              },
              {
                type: 'string',
              },
            ],
          },
        },
      });
      const { getByTestId } = await r();

      const baz = getByTestId('baz');
      expect(baz).toBeInTheDocument();
      expect(baz.id).toBe('baz');

      expect(getByTestId('root_baz.input')).toBeInTheDocument();
      expect(getByTestId('root_baz.arg0')).toBeInTheDocument();
      expect(getByTestId('root_baz.arg1')).toBeInTheDocument();
      expect(getByTestId('root_baz.output')).toBeInTheDocument();
    });
    it('renders examples', async () => {
      scaffolderApiMock.listBuiltInTemplateFilters.mockResolvedValue({
        wut: {
          examples: [
            {
              description: 'thing 1',
              example: 'let me show you',
            },
            {
              description: 'thing 2',
              example: "how it's done",
            },
          ],
        },
      });
      const { getByTestId } = await r();
      const wut = getByTestId('wut');
      expect(wut).toBeInTheDocument();
      expect(within(wut).getByTestId('examples')).toBeInTheDocument();
    });
  });
});
