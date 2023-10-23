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
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { createSentryCreateProjectAction } from './createProject';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import { InputError } from '@backstage/errors';
import { randomBytes } from 'crypto';

describe('sentry:project:create action', () => {
  const createScaffolderConfig = (configData: JsonObject = {}) => ({
    config: new ConfigReader({
      scaffolder: {
        ...configData,
      },
    }),
  });

  let fetch: jest.Func;

  const mockFetch = (response = {}) => {
    const mockedResponse = {
      status: 201,
      headers: {
        get: () => 'application/json',
      },
      json: async () =>
        Promise.resolve({
          detail: 'project creation mocked result',
        }),
      text: async () => Promise.resolve('Unexpected error.'),
      ...response,
    };

    fetch = jest.fn().mockImplementation(() => Promise.resolve(mockedResponse));
    return mockedResponse;
  };

  const getActionContext = (): ActionContext<{
    organizationSlug: string;
    teamSlug: string;
    name: string;
    slug?: string;
    authToken?: string;
  }> => ({
    workspacePath: './dev/proj',
    createTemporaryDirectory: jest.fn(),
    logger: jest.createMockFromModule('winston'),
    logStream: jest.createMockFromModule('stream'),
    input: {
      organizationSlug: 'org',
      teamSlug: 'team',
      name: 'test project',
      authToken: randomBytes(5).toString('hex'),
    },
    output: jest.fn(),
  });

  beforeEach(() => {
    mockFetch();
  });

  test('should request sentry project create with specified parameters.', async () => {
    const action = createSentryCreateProjectAction(createScaffolderConfig(), {
      fetch,
    });

    const actionContext = getActionContext();

    await action.handler(actionContext);

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${actionContext.input.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: actionContext.input.name,
        }),
      },
    );
  });

  test('should request sentry project create with added optional specified project slug', async () => {
    const action = createSentryCreateProjectAction(createScaffolderConfig(), {
      fetch,
    });

    const actionContext = getActionContext();

    actionContext.input = { ...actionContext.input, slug: 'project-slug' };

    await action.handler(actionContext);

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${actionContext.input.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: actionContext.input.name,
          slug: actionContext.input.slug,
        }),
      },
    );
  });

  test('should take Sentry auth token from scaffolder config when input authToken is missing.', async () => {
    const sentryScaffolderConfigToken = randomBytes(5).toString('hex');
    const action = createSentryCreateProjectAction(
      createScaffolderConfig({
        sentry: {
          token: sentryScaffolderConfigToken,
        },
      }),
      { fetch },
    );

    const actionContext = getActionContext();

    actionContext.input.authToken = undefined;

    await action.handler(actionContext);

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sentryScaffolderConfigToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: actionContext.input.name,
        }),
      },
    );
  });

  test('should throw InputError when auth token is missing from input parameters and scaffolder config.', async () => {
    const action = createSentryCreateProjectAction(createScaffolderConfig(), {
      fetch,
    });
    const actionContext = getActionContext();

    actionContext.input.authToken = undefined;

    expect.assertions(1);

    await expect(async () => {
      await action.handler(actionContext);
    }).rejects.toThrow(new InputError('No valid sentry token given'));
  });

  test('should throw InputError when sentry API returns unexpected content-type.', async () => {
    const actionContext = getActionContext();

    const mockedFetchResponse = mockFetch({
      headers: {
        get: () => 'text/html',
      },
    });

    const action = createSentryCreateProjectAction(createScaffolderConfig(), {
      fetch,
    });

    expect.assertions(1);

    await expect(async () => {
      await action.handler(actionContext);
    }).rejects.toThrow(
      new InputError(
        `Unexpected Sentry Response Type: ${await mockedFetchResponse.text()}`,
      ),
    );
  });

  test('should throw InputError when sentry API returns unexpected status code.', async () => {
    const actionContext = getActionContext();

    const mockedFetchResponse = mockFetch({
      status: 400,
    });

    const action = createSentryCreateProjectAction(createScaffolderConfig(), {
      fetch,
    });

    expect.assertions(1);

    await expect(async () => {
      await action.handler(actionContext);
    }).rejects.toThrow(
      new InputError(
        `Sentry Response was: ${(await mockedFetchResponse.json()).detail}`,
      ),
    );
  });
});
