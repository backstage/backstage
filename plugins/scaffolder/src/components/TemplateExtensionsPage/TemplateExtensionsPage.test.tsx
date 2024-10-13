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
  ListTemplateExtensionsResponse,
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { fireEvent, within } from '@testing-library/react';
import { capitalize, difference, forIn } from 'lodash';
import React from 'react';
import { rootRouteRef } from '../../routes';
import { TemplateExtensionsPage } from './TemplateExtensionsPage';
import { TabKey } from './navigation';

const listTemplateExtensions = jest.fn();

const scaffolderApiMock: jest.Mocked<ScaffolderApi> = {
  scaffold: jest.fn(),
  cancelTask: jest.fn(),
  getTemplateParameterSchema: jest.fn(),
  getIntegrationsList: jest.fn(),
  getTask: jest.fn(),
  streamLogs: jest.fn(),
  listActions: jest.fn(),
  listTemplateExtensions,
  listTasks: jest.fn(),
  autocomplete: jest.fn(),
};

const apis = TestApiRegistry.from([scaffolderApiRef, scaffolderApiMock]);

const r = async () =>
  renderInTestApp(
    <ApiProvider apis={apis}>
      <TemplateExtensionsPage />
    </ApiProvider>,
    {
      mountedRoutes: {
        '/create/template-extensions': rootRouteRef,
      },
    },
  );

const emptyExtensions: ListTemplateExtensionsResponse = {
  filters: {},
  globals: {
    functions: {},
    values: {},
  },
};

describe('TemplateExtensionsPage', () => {
  it('renders with error response', async () => {
    listTemplateExtensions.mockRejectedValue(new Error('contrived'));
    const { getByTestId } = await r();

    const empty = getByTestId('empty');
    expect(empty).toBeInTheDocument();

    expect(within(empty).getByText('contrived')).toBeInTheDocument();
  });
  it('renders tabs', async () => {
    listTemplateExtensions.mockResolvedValue(emptyExtensions);
    const { getByRole, findByTestId, queryByTestId } = await r();

    const tabList = getByRole('tablist');
    expect(tabList).toBeInTheDocument();

    const tabKeys: TabKey[] = ['filter', 'function', 'value'];

    const tabs = Object.fromEntries(
      tabKeys.map(
        t =>
          [t, within(tabList).getByText(`${capitalize(t)}s`)] as [
            TabKey,
            HTMLElement,
          ],
      ),
    );

    forIn(tabs, tab => expect(tab).toBeInTheDocument());

    const verifyActiveTab = async (k: TabKey) => {
      expect(await findByTestId(`no-${k}s`)).toBeInTheDocument();
      difference(tabKeys, [k]).forEach(nk =>
        expect(queryByTestId(`no-${nk}s`)).not.toBeInTheDocument(),
      );
    };

    await verifyActiveTab('filter');

    for (let i = tabKeys.length - 1; i >= 0; i--) {
      fireEvent.click(tabs[tabKeys[i]]);
      await verifyActiveTab(tabKeys[i]);
    }
  });
  it('renders with no extensions', async () => {
    listTemplateExtensions.mockResolvedValue(emptyExtensions);
    const { findByTestId, getByRole, getByTestId, queryByTestId } = await r();

    expect(queryByTestId('empty')).not.toBeInTheDocument();

    expect(getByTestId('no-filters')).toBeInTheDocument();

    fireEvent.click(within(getByRole('tablist')).getByText('Functions'));

    await expect(findByTestId('no-functions')).resolves.toBeInTheDocument();

    fireEvent.click(within(getByRole('tablist')).getByText('Values'));

    await expect(findByTestId('no-values')).resolves.toBeInTheDocument();
  });
  describe('renders filters', () => {
    it('renders filter without metadata', async () => {
      listTemplateExtensions.mockResolvedValue({
        ...emptyExtensions,
        filters: {
          bar: {},
        },
      });
      const { getByTestId, queryByTestId } = await r();

      const filters = getByTestId('filters');
      expect(filters).toBeInTheDocument();

      const bar = within(filters).getByTestId('bar');
      expect(bar).toBeInTheDocument();

      const title = within(bar).getByText('bar');
      expect(title).toBeInTheDocument();
      expect(title.id).toBe('filter_bar');

      const link = within(bar).getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        expect.stringMatching(new RegExp(`#${title.id}$`)),
      );

      expect(queryByTestId('root_bar.input')).not.toBeInTheDocument();
      expect(queryByTestId('root_bar.arg0')).not.toBeInTheDocument();
      expect(queryByTestId('root_bar.output')).not.toBeInTheDocument();
    });
    it('renders input/output with empty filter schema', async () => {
      listTemplateExtensions.mockResolvedValue({
        ...emptyExtensions,
        filters: {
          foo: {
            schema: {},
          },
        },
      });
      const { getByTestId, queryByTestId } = await r();

      const filters = getByTestId('filters');
      expect(filters).toBeInTheDocument();

      const foo = within(filters).getByTestId('foo');
      expect(foo).toBeInTheDocument();

      const title = within(foo).getByText('foo');
      expect(title).toBeInTheDocument();
      expect(title.id).toBe('filter_foo');

      const link = within(foo).getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        expect.stringMatching(new RegExp(`#${title.id}$`)),
      );

      expect(getByTestId('root_foo.input')).toBeInTheDocument();
      expect(queryByTestId('root_foo.arg0')).not.toBeInTheDocument();
      expect(getByTestId('root_foo.output')).toBeInTheDocument();
    });
    it('renders fully specified filter metadata', async () => {
      listTemplateExtensions.mockResolvedValue({
        ...emptyExtensions,
        filters: {
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
        },
      });
      const { getByTestId } = await r();

      const filters = getByTestId('filters');
      expect(filters).toBeInTheDocument();

      const foo = within(filters).getByTestId('foo');
      expect(foo).toBeInTheDocument();

      const title = within(foo).getByText('foo');
      expect(title).toBeInTheDocument();
      expect(title.id).toBe('filter_foo');

      const link = within(foo).getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        expect.stringMatching(new RegExp(`#${title.id}$`)),
      );

      expect(within(foo).getByText('foo filter')).toBeInTheDocument();
      expect(within(foo).getByTestId('root_foo.input')).toBeInTheDocument();
      expect(within(foo).getByTestId('root_foo.arg0')).toBeInTheDocument();
      expect(
        within(foo).queryByTestId('root_foo.arg1'),
      ).not.toBeInTheDocument();
      expect(within(foo).getByTestId('root_foo.output')).toBeInTheDocument();
    });
    it('renders multiple args', async () => {
      listTemplateExtensions.mockResolvedValue({
        ...emptyExtensions,
        filters: {
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
        },
      });
      const { getByTestId } = await r();

      const filters = getByTestId('filters');
      expect(filters).toBeInTheDocument();

      const baz = within(filters).getByTestId('baz');
      expect(baz).toBeInTheDocument();

      const title = within(baz).getByText('baz');
      expect(title).toBeInTheDocument();
      expect(title.id).toBe('filter_baz');

      const link = within(baz).getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        expect.stringMatching(new RegExp(`#${title.id}$`)),
      );

      expect(within(baz).getByTestId('root_baz.input')).toBeInTheDocument();
      expect(within(baz).getByTestId('root_baz.arg0')).toBeInTheDocument();
      expect(within(baz).getByTestId('root_baz.arg1')).toBeInTheDocument();
      expect(within(baz).getByTestId('root_baz.output')).toBeInTheDocument();
    });
    it('renders examples', async () => {
      listTemplateExtensions.mockResolvedValue({
        ...emptyExtensions,
        filters: {
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
        },
      });
      const { getByTestId } = await r();

      const filters = getByTestId('filters');
      expect(filters).toBeInTheDocument();

      const wut = within(filters).getByTestId('wut');
      expect(wut).toBeInTheDocument();
      expect(within(wut).getByTestId('examples')).toBeInTheDocument();
    });
  });
  describe('renders global', () => {
    it('renders global functions', async () => {
      listTemplateExtensions.mockResolvedValue({
        ...emptyExtensions,
        globals: {
          ...emptyExtensions.globals,
          functions: {
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
          },
        },
      });
      const { findByTestId, getByRole } = await r();

      fireEvent.click(within(getByRole('tablist')).getByText('Functions'));

      const functions = await findByTestId('functions');

      const truthy = within(functions).getByTestId('truthy');
      const title = within(truthy).getByText('truthy');
      expect(title).toBeInTheDocument();
      expect(title.id).toBe('function_truthy');

      const link = within(truthy).getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        expect.stringMatching(new RegExp(`#${title.id}$`)),
      );

      expect(
        within(truthy).getByText('evaluate truthiness'),
      ).toBeInTheDocument();

      expect(within(truthy).getByText('[0]')).toBeInTheDocument();
      expect(
        within(truthy).getByTestId('root_truthy.arg0'),
      ).toBeInTheDocument();
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
      const msvValue = ['foo', 'bar', 'baz'];
      listTemplateExtensions.mockResolvedValue({
        ...emptyExtensions,
        globals: {
          ...emptyExtensions.globals,
          values: {
            msv: {
              description: 'metasyntactic variables',
              value: msvValue,
            },
          },
        },
      });
      const { findByTestId, getByRole } = await r();

      fireEvent.click(within(getByRole('tablist')).getByText('Values'));

      const values = await findByTestId('values');
      const msv = within(values).getByTestId('msv');
      expect(msv).toBeInTheDocument();

      const title = within(msv).getByText('msv');
      expect(title).toBeInTheDocument();
      expect(title.id).toBe('value_msv');

      const link = within(msv).getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        expect.stringMatching(new RegExp(`#${title.id}$`)),
      );

      expect(
        within(msv).getByText('metasyntactic variables'),
      ).toBeInTheDocument();

      const msvValueElement = within(msv).getByTestId('msv.value');
      expect(msvValueElement).toBeInTheDocument();
      expect(JSON.parse(msvValueElement.textContent!)).toEqual(msvValue);
    });
  });
});
