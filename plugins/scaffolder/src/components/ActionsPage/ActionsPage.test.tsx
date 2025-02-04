/*
 * Copyright 2021 The Backstage Authors
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
import React from 'react';
import { ActionsPage } from './ActionsPage';
import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { ApiProvider } from '@backstage/core-app-api';
import { rootRouteRef } from '../../routes';
import { userEvent } from '@testing-library/user-event';
import { permissionApiRef } from '@backstage/plugin-permission-react';

const scaffolderApiMock: jest.Mocked<ScaffolderApi> = {
  scaffold: jest.fn(),
  cancelTask: jest.fn(),
  getTemplateParameterSchema: jest.fn(),
  getIntegrationsList: jest.fn(),
  getTask: jest.fn(),
  streamLogs: jest.fn(),
  listActions: jest.fn(),
  listTasks: jest.fn(),
  autocomplete: jest.fn(),
};

const mockPermissionApi = { authorize: jest.fn() };
const apis = TestApiRegistry.from(
  [scaffolderApiRef, scaffolderApiMock],
  [permissionApiRef, mockPermissionApi],
);

describe('TemplatePage', () => {
  beforeEach(() => jest.resetAllMocks());

  it('renders action with input', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            required: ['foobar'],
            properties: {
              foobar: {
                title: 'Test title',
                type: 'string',
              },
            },
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );
    expect(rendered.getByText('Test title')).toBeInTheDocument();
    expect(rendered.getByText('example description')).toBeInTheDocument();
    expect(rendered.getByText('foobar')).toBeInTheDocument();
    expect(rendered.queryByText('output')).not.toBeInTheDocument();
  });

  it('renders action with input and output', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            required: ['foobar'],
            properties: {
              foobar: {
                title: 'Test title',
                type: 'string',
              },
            },
          },
          output: {
            type: 'object',
            properties: {
              buzz: {
                title: 'Test output',
                type: 'string',
              },
            },
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );
    expect(rendered.getByText('Test title')).toBeInTheDocument();
    expect(rendered.getByText('example description')).toBeInTheDocument();
    expect(rendered.getByText('foobar')).toBeInTheDocument();
    expect(rendered.getByText('Test output')).toBeInTheDocument();
  });

  it('renders action with oneOf output', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            required: ['foobar'],
            properties: {
              foobar: {
                title: 'Test title',
                type: 'string',
              },
            },
          },
          output: {
            oneOf: [
              {
                type: 'object',
                properties: {
                  buzz: {
                    title: 'Test output1',
                    type: 'string',
                  },
                },
              },
              {
                type: 'object',
                properties: {
                  buzz: {
                    title: 'Test output2',
                    type: 'string',
                  },
                },
              },
            ],
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );
    expect(rendered.getByText('oneOf')).toBeInTheDocument();
    expect(rendered.getByText('Test title')).toBeInTheDocument();
    expect(rendered.getByText('Test output1')).toBeInTheDocument();
    expect(rendered.getByText('Test output2')).toBeInTheDocument();
  });

  it('renders action with multiple input types', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            required: ['foobar'],
            properties: {
              foobar: {
                title: 'Test title',
                type: ['array', 'number'],
              },
            },
          },
          output: {
            type: 'object',
            properties: {
              buzz: {
                title: 'Test output',
                type: 'string',
              },
            },
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );
    expect(rendered.getByText('array')).toBeInTheDocument();
    expect(rendered.getByText('number')).toBeInTheDocument();
  });

  it('renders action with oneOf input', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            oneOf: [
              {
                type: 'object',
                required: ['foo'],
                properties: {
                  foo: {
                    title: 'Foo title',
                    description: 'Foo description',
                    type: 'string',
                  },
                },
              },
              {
                type: 'object',
                required: ['bar'],
                properties: {
                  bar: {
                    title: 'Bar title',
                    description: 'Bar description',
                    type: 'string',
                  },
                },
              },
            ],
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );
    expect(rendered.getByText('oneOf')).toBeInTheDocument();
    expect(rendered.getByText('Foo title')).toBeInTheDocument();
    expect(rendered.getByText('Foo description')).toBeInTheDocument();
    expect(rendered.getByText('Bar title')).toBeInTheDocument();
    expect(rendered.getByText('Bar description')).toBeInTheDocument();
  });

  it('renders action with object input type', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            required: ['foobar'],
            properties: {
              foobar: {
                title: 'Test object',
                type: ['object'],
                properties: {
                  a: {
                    title: 'nested prop a',
                    type: 'string',
                  },
                  b: {
                    title: 'nested prop b',
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    expect(rendered.getByText('Test object')).toBeInTheDocument();
    const objectChip = rendered.getByText('object');
    expect(objectChip).toBeInTheDocument();

    expect(rendered.queryByText('nested prop a')).not.toBeInTheDocument();
    expect(rendered.queryByText('string')).not.toBeInTheDocument();
    expect(rendered.queryByText('nested prop b')).not.toBeInTheDocument();
    expect(rendered.queryByText('number')).not.toBeInTheDocument();

    await userEvent.click(objectChip);

    expect(rendered.queryByText('nested prop a')).toBeInTheDocument();
    expect(rendered.queryByText('string')).toBeInTheDocument();
    expect(rendered.queryByText('nested prop b')).toBeInTheDocument();
    expect(rendered.queryByText('number')).toBeInTheDocument();
  });

  it('renders action with nested object input type', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            required: ['foobar'],
            properties: {
              foobar: {
                title: 'Test object',
                type: 'object',
                properties: {
                  a: {
                    title: 'nested object a',
                    type: 'object',
                    properties: {
                      c: {
                        title: 'nested object c',
                        type: 'object',
                      },
                    },
                  },
                  b: {
                    title: 'nested prop b',
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    expect(rendered.getByText('Test object')).toBeInTheDocument();
    const objectChip = rendered.getByText('object');
    expect(objectChip).toBeInTheDocument();

    expect(rendered.queryByText('nested object a')).not.toBeInTheDocument();
    expect(rendered.queryByText('nested prop b')).not.toBeInTheDocument();
    expect(rendered.queryByText('nested object c')).not.toBeInTheDocument();

    await userEvent.click(objectChip);

    expect(rendered.queryByText('nested object a')).toBeInTheDocument();
    expect(rendered.queryByText('nested prop b')).toBeInTheDocument();
    expect(rendered.queryByText('nested object c')).not.toBeInTheDocument();

    const allObjectChips = rendered.getAllByText('object');
    expect(allObjectChips.length).toBe(2);
    await userEvent.click(allObjectChips[1]);

    expect(rendered.queryByText('nested object a')).toBeInTheDocument();
    expect(rendered.queryByText('nested prop b')).toBeInTheDocument();
    expect(rendered.queryByText('nested object c')).toBeInTheDocument();
  });

  it('renders action with object input type and no properties', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            required: ['foobar'],
            properties: {
              foobar: {
                title: 'Test object',
                type: ['object'],
              },
            },
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    expect(rendered.getByText('Test object')).toBeInTheDocument();
    const objectChip = rendered.getByText('object');
    expect(objectChip).toBeInTheDocument();

    expect(rendered.queryByText('No schema defined')).not.toBeInTheDocument();

    await userEvent.click(objectChip);

    expect(rendered.queryByText('No schema defined')).toBeInTheDocument();
  });

  it('renders action with array(string) input type', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            properties: {
              foobar: {
                title: 'Test array',
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    expect(rendered.getByText('Test array')).toBeInTheDocument();
    expect(rendered.getByText('array(string)')).toBeInTheDocument();
  });

  it('renders action with array(object) input type', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            properties: {
              foobar: {
                title: 'Test array',
                type: 'array',
                items: {
                  title: 'nested object',
                  type: 'object',
                  properties: {
                    a: {
                      title: 'nested object a',
                      type: 'object',
                      properties: {
                        c: {
                          title: 'nested object c',
                          type: 'object',
                        },
                      },
                    },
                    b: {
                      title: 'nested prop b',
                      type: 'number',
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    expect(rendered.getByText('Test array')).toBeInTheDocument();
    const objectChip = rendered.getByText('array(object)');
    expect(objectChip).toBeInTheDocument();

    expect(rendered.queryByText('nested object a')).not.toBeInTheDocument();
    expect(rendered.queryByText('nested prop b')).not.toBeInTheDocument();

    await userEvent.click(objectChip);

    expect(rendered.queryByText('nested object a')).toBeInTheDocument();
    expect(rendered.queryByText('nested prop b')).toBeInTheDocument();
  });

  it('renders action with array input type and no items', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'test',
        description: 'example description',
        schema: {
          input: {
            type: 'object',
            properties: {
              foo: {
                type: 'array',
              },
            },
          },
        },
      },
    ]);
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    expect(rendered.getByText('array(unknown)')).toBeInTheDocument();
  });

  it('should filter an action', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'githut:repo:create',
        description: 'Create a new Github repository',
        schema: {
          input: {
            type: 'object',
            required: ['name'],
            properties: {
              name: {
                title: 'Repository name',
                type: 'string',
              },
            },
          },
        },
      },
      {
        id: 'githut:repo:push',
        description: 'Push to a Github repository',
        schema: {
          input: {
            type: 'object',
            required: ['url'],
            properties: {
              url: {
                title: 'Repository url',
                type: 'string',
              },
            },
          },
        },
      },
    ]);

    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    expect(
      rendered.getByRole('heading', { name: 'githut:repo:create' }),
    ).toBeInTheDocument();
    expect(
      rendered.getByRole('heading', { name: 'githut:repo:push' }),
    ).toBeInTheDocument();

    // should filter actions when searching
    await userEvent.type(
      rendered.getByPlaceholderText('Search for an action'),
      'create',
    );
    await userEvent.keyboard('[ArrowDown][Enter]');
    expect(
      rendered.getByRole('heading', { name: 'githut:repo:create' }),
    ).toBeInTheDocument();
    expect(
      rendered.queryByRole('heading', { name: 'githut:repo:push' }),
    ).not.toBeInTheDocument();

    // should show all actions when clearing the search
    await userEvent.click(rendered.getByTitle('Clear'));
    expect(
      rendered.getByRole('heading', { name: 'githut:repo:create' }),
    ).toBeInTheDocument();
    expect(
      rendered.getByRole('heading', { name: 'githut:repo:push' }),
    ).toBeInTheDocument();
  });
});
