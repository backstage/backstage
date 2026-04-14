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
import { ActionsPage } from './ActionsPage';
import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { ApiProvider } from '@backstage/core-app-api';
import { rootRouteRef } from '../../routes';
import { userEvent } from '@testing-library/user-event';
import { screen } from '@testing-library/react';
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
  retry: jest.fn(),
  listTemplatingExtensions: jest.fn(),
  dryRun: jest.fn(),
};

const mockPermissionApi = { authorize: jest.fn() };
const apis = TestApiRegistry.from(
  [scaffolderApiRef, scaffolderApiMock],
  [permissionApiRef, mockPermissionApi],
);

async function selectAction(actionId: string) {
  const row = await screen.findByRole('row', {
    name: new RegExp(actionId),
  });
  await userEvent.click(row);
}

describe('ActionsPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    window.location.hash = '';
  });

  it('renders actions in a table and shows detail on row click', async () => {
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
    await renderInTestApp(
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
      await screen.findByRole('row', { name: /test/ }),
    ).toBeInTheDocument();

    await selectAction('test');

    expect(await screen.findByText('foobar *')).toBeInTheDocument();
  });

  it('renders action with input and output on row click', async () => {
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
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    await selectAction('test');

    expect(await screen.findByText('foobar *')).toBeInTheDocument();
    expect(screen.getByText('buzz')).toBeInTheDocument();
  });

  it('renders action with oneOf output on row click', async () => {
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
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    await selectAction('test');

    expect(
      await screen.findByRole('button', { name: /oneOf/ }),
    ).toBeInTheDocument();
    expect(screen.getByText('foobar *')).toBeInTheDocument();
  });

  it('renders action with multiple input types on row click', async () => {
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
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    await selectAction('test');

    expect(await screen.findByText('array')).toBeInTheDocument();
    expect(screen.getByText('number')).toBeInTheDocument();
  });

  it('renders action with oneOf input on row click', async () => {
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
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    await selectAction('test');

    const oneOfButton = await screen.findByRole('button', { name: /oneOf/ });
    expect(oneOfButton).toBeInTheDocument();

    expect(screen.queryByText('foo *')).not.toBeInTheDocument();

    await userEvent.click(oneOfButton);

    expect(await screen.findByText('foo *')).toBeInTheDocument();
    expect(screen.getByText('Foo description')).toBeInTheDocument();
    expect(screen.getByText('bar *')).toBeInTheDocument();
    expect(screen.getByText('Bar description')).toBeInTheDocument();
  });

  it('renders action with expandable object input type', async () => {
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
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    await selectAction('test');

    const objectButton = await screen.findByRole('button', { name: /object/ });
    expect(objectButton).toBeInTheDocument();

    expect(screen.queryByText(/^string$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^number$/)).not.toBeInTheDocument();

    await userEvent.click(objectButton);

    expect(screen.queryByText('a')).toBeInTheDocument();
    expect(screen.queryByText(/^string$/)).toBeInTheDocument();
    expect(screen.queryByText('b')).toBeInTheDocument();
    expect(screen.queryByText(/^number$/)).toBeInTheDocument();
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
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    await selectAction('test');

    const objectButton = await screen.findByRole('button', { name: /object/ });
    expect(objectButton).toBeInTheDocument();

    await userEvent.click(objectButton);

    expect(screen.queryByText('a')).toBeInTheDocument();
    expect(screen.queryByText('b')).toBeInTheDocument();
    expect(screen.queryByText('c')).not.toBeInTheDocument();

    const allObjectButtons = screen.getAllByRole('button', { name: /object/ });
    expect(allObjectButtons.length).toBe(2);
    await userEvent.click(allObjectButtons[1]);

    expect(screen.queryByText('c')).toBeInTheDocument();
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
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    await selectAction('test');

    const objectButton = await screen.findByRole('button', { name: /object/ });
    expect(objectButton).toBeInTheDocument();

    expect(screen.queryByText('No schema defined')).not.toBeInTheDocument();

    await userEvent.click(objectButton);

    expect(screen.queryByText('No schema defined')).toBeInTheDocument();
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
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    await selectAction('test');

    expect(await screen.findByText('array(string)')).toBeInTheDocument();
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
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    await selectAction('test');

    const arrayButton = await screen.findByRole('button', {
      name: /array\(object\)/,
    });
    expect(arrayButton).toBeInTheDocument();

    expect(screen.queryByText('b')).not.toBeInTheDocument();

    await userEvent.click(arrayButton);

    expect(screen.queryByText('a')).toBeInTheDocument();
    expect(screen.queryByText('b')).toBeInTheDocument();
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
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    await selectAction('test');

    expect(await screen.findByText('array(unknown)')).toBeInTheDocument();
  });

  it('should filter actions via the search field', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'github:repo:create',
        description: 'Create a new GitHub repository',
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
        id: 'github:repo:push',
        description: 'Push to a GitHub repository',
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

    await renderInTestApp(
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
      await screen.findByRole('row', { name: /github:repo:create/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: /github:repo:push/ }),
    ).toBeInTheDocument();

    await userEvent.type(
      screen.getByPlaceholderText('Search for an action'),
      'create',
    );

    expect(
      await screen.findByRole('row', { name: /github:repo:create/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('row', { name: /github:repo:push/ }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Clear search'));

    expect(
      await screen.findByRole('row', { name: /github:repo:create/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: /github:repo:push/ }),
    ).toBeInTheDocument();
  });

  it('should pre-select the action matching the URL hash on load', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'publish:github',
        description: 'Publish to GitHub',
        schema: {
          input: {
            type: 'object',
            properties: {
              repo: { title: 'Repo name', type: 'string' },
            },
          },
        },
      },
      {
        id: 'fetch:plain',
        description: 'Fetch plain content',
        schema: {},
      },
    ]);

    window.location.hash = '#publish:github';

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
        routeEntries: ['/create/actions#publish:github'],
      },
    );

    expect(
      await screen.findByRole('heading', { name: 'publish:github' }),
    ).toBeInTheDocument();
  });

  it('should update the URL hash when selecting and deselecting actions', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'publish:github',
        description: 'Publish to GitHub',
        schema: {},
      },
      {
        id: 'fetch:plain',
        description: 'Fetch plain content',
        schema: {},
      },
    ]);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    await selectAction('publish:github');
    expect(window.location.hash).toBe('#publish:github');

    await selectAction('publish:github');
    expect(window.location.hash).toBe('');
  });

  it('should keep search field focused when filtering causes empty then non-empty results', async () => {
    scaffolderApiMock.listActions.mockResolvedValue([
      {
        id: 'github:repo:create',
        description: 'Create a new GitHub repository',
        schema: {},
      },
    ]);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ActionsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create/actions': rootRouteRef,
        },
      },
    );

    const searchField = screen.getByPlaceholderText('Search for an action');
    await userEvent.click(searchField);
    expect(searchField).toHaveFocus();

    await userEvent.type(searchField, 'zzz-no-match');
    expect(searchField).toHaveFocus();
    expect(
      screen.queryByRole('row', { name: /github:repo:create/ }),
    ).not.toBeInTheDocument();

    await userEvent.clear(searchField);
    await userEvent.type(searchField, 'create');
    expect(searchField).toHaveFocus();
    expect(
      await screen.findByRole('row', { name: /github:repo:create/ }),
    ).toBeInTheDocument();
  });
});
