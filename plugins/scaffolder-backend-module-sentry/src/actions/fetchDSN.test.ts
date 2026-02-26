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

import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { randomBytes } from 'node:crypto';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { createSentryFetchDSNAction } from './fetchDSN';

describe('sentry:fetch:dsn action', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  const createScaffolderConfig = (configData: JsonObject = {}) => ({
    config: new ConfigReader({
      scaffolder: {
        ...configData,
      },
    }),
  });

  const getActionContext = (): ActionContext<{
    organizationSlug: string;
    projectSlug: string;
    authToken?: string;
    apiBaseUrl?: string;
  }> =>
    createMockActionContext({
      workspacePath: './dev/proj',
      logger: jest.createMockFromModule('winston'),
      input: {
        organizationSlug: 'org',
        projectSlug: 'project',
        authToken: randomBytes(5).toString('hex'),
      },
    });

  it('should fetch DSN from sentry project with specified parameters.', async () => {
    expect.assertions(3);

    const action = createSentryFetchDSNAction(createScaffolderConfig());
    const actionContext = getActionContext();
    const mockDSN = 'https://test@sentry.io/123';

    worker.use(
      http.get(
        `https://sentry.io/api/0/projects/${actionContext.input.organizationSlug}/${actionContext.input.projectSlug}/keys/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${actionContext.input.authToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          return HttpResponse.json([{ dsn: { public: mockDSN } }], {
            status: 200,
          });
        },
      ),
    );

    await action.handler(actionContext);
    expect(actionContext.output).toHaveBeenCalledWith('dsn', mockDSN);
  });

  it('should take Sentry auth token from scaffolder config when input authToken is missing.', async () => {
    expect.assertions(3);

    const sentryScaffolderConfigToken = randomBytes(5).toString('hex');
    const action = createSentryFetchDSNAction(
      createScaffolderConfig({
        sentry: {
          token: sentryScaffolderConfigToken,
        },
      }),
    );
    const actionContext = getActionContext();
    actionContext.input.authToken = undefined;
    const mockDSN = 'https://test@sentry.io/123';

    worker.use(
      http.get(
        `https://sentry.io/api/0/projects/${actionContext.input.organizationSlug}/${actionContext.input.projectSlug}/keys/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${sentryScaffolderConfigToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          return HttpResponse.json([{ dsn: { public: mockDSN } }], {
            status: 200,
          });
        },
      ),
    );

    await action.handler(actionContext);
    expect(actionContext.output).toHaveBeenCalledWith('dsn', mockDSN);
  });

  it('should throw InputError when auth token is missing from input parameters and scaffolder config.', async () => {
    const action = createSentryFetchDSNAction(createScaffolderConfig());
    const actionContext = getActionContext();
    actionContext.input.authToken = undefined;

    await expect(() => action.handler(actionContext)).rejects.toThrow(
      new InputError('No valid sentry token given'),
    );
  });

  it('should throw InputError when sentry API returns unexpected content-type.', async () => {
    const action = createSentryFetchDSNAction(createScaffolderConfig());
    const actionContext = getActionContext();

    worker.use(
      http.get(
        `https://sentry.io/api/0/projects/${actionContext.input.organizationSlug}/${actionContext.input.projectSlug}/keys/`,
        async () => {
          return HttpResponse.text('Bad response', { status: 400 });
        },
      ),
    );

    await expect(() => action.handler(actionContext)).rejects.toThrow(
      new InputError(`Unexpected Sentry Response Type: Bad response`),
    );
  });

  it('should throw InputError when sentry API returns error status code.', async () => {
    const action = createSentryFetchDSNAction(createScaffolderConfig());
    const actionContext = getActionContext();

    worker.use(
      http.get(
        `https://sentry.io/api/0/projects/${actionContext.input.organizationSlug}/${actionContext.input.projectSlug}/keys/`,
        async () => {
          return HttpResponse.json(
            { detail: 'Project not found' },
            { status: 404 },
          );
        },
      ),
    );

    await expect(() => action.handler(actionContext)).rejects.toThrow(
      new InputError(`Sentry Response was: Project not found`),
    );
  });

  it('should throw InputError when no keys are returned.', async () => {
    const action = createSentryFetchDSNAction(createScaffolderConfig());
    const actionContext = getActionContext();

    worker.use(
      http.get(
        `https://sentry.io/api/0/projects/${actionContext.input.organizationSlug}/${actionContext.input.projectSlug}/keys/`,
        async () => {
          return HttpResponse.json([], { status: 200 });
        },
      ),
    );

    await expect(() => action.handler(actionContext)).rejects.toThrow(
      new InputError('No keys found for the specified project'),
    );
  });

  it('should throw InputError when no public DSN is found in keys.', async () => {
    const action = createSentryFetchDSNAction(createScaffolderConfig());
    const actionContext = getActionContext();

    worker.use(
      http.get(
        `https://sentry.io/api/0/projects/${actionContext.input.organizationSlug}/${actionContext.input.projectSlug}/keys/`,
        async () => {
          return HttpResponse.json([{ dsn: {} }], { status: 200 });
        },
      ),
    );

    await expect(() => action.handler(actionContext)).rejects.toThrow(
      new InputError('No public DSN found in project keys'),
    );
  });

  it('should fetch DSN with custom apiBaseUrl.', async () => {
    expect.assertions(3);

    const action = createSentryFetchDSNAction(createScaffolderConfig());
    const actionContext = getActionContext();
    actionContext.input = {
      ...actionContext.input,
      apiBaseUrl: 'https://custom.sentry.io/api/0',
    };
    const mockDSN = 'https://test@sentry.io/123';

    worker.use(
      http.get(
        `https://custom.sentry.io/api/0/projects/${actionContext.input.organizationSlug}/${actionContext.input.projectSlug}/keys/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${actionContext.input.authToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          return HttpResponse.json([{ dsn: { public: mockDSN } }], {
            status: 200,
          });
        },
      ),
    );

    await action.handler(actionContext);
    expect(actionContext.output).toHaveBeenCalledWith('dsn', mockDSN);
  });

  it('should fetch DSN with apiBaseUrl from config.', async () => {
    expect.assertions(3);

    const action = createSentryFetchDSNAction(
      createScaffolderConfig({
        sentry: {
          apiBaseUrl: 'https://config.sentry.io/api/0',
        },
      }),
    );
    const actionContext = getActionContext();
    const mockDSN = 'https://test@sentry.io/123';

    worker.use(
      http.get(
        `https://config.sentry.io/api/0/projects/${actionContext.input.organizationSlug}/${actionContext.input.projectSlug}/keys/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${actionContext.input.authToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          return HttpResponse.json([{ dsn: { public: mockDSN } }], {
            status: 200,
          });
        },
      ),
    );

    await action.handler(actionContext);
    expect(actionContext.output).toHaveBeenCalledWith('dsn', mockDSN);
  });
});
