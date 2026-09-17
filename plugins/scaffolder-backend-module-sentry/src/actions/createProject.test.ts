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
import { createSentryCreateProjectAction } from './createProject';

describe('sentry:project:create action', () => {
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
    teamSlug: string;
    name: string;
    slug?: string;
    platform?: string;
    authToken?: string;
    apiBaseUrl?: string;
  }> =>
    createMockActionContext({
      workspacePath: './dev/proj',
      logger: jest.createMockFromModule('winston'),
      input: {
        organizationSlug: 'org',
        teamSlug: 'team',
        name: 'test project',
        authToken: randomBytes(5).toString('hex'),
      },
    });

  it('should request sentry project create with specified parameters.', async () => {
    expect.assertions(3);

    const action = createSentryCreateProjectAction(createScaffolderConfig());
    const actionContext = getActionContext();

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${actionContext.input.authToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: actionContext.input.name,
          });
          return HttpResponse.json(
            { detail: 'project creation mocked result' },
            { status: 201 },
          );
        },
      ),
    );

    await action.handler(actionContext);
  });

  it('should request sentry project create with added optional specified project slug', async () => {
    expect.assertions(3);

    const action = createSentryCreateProjectAction(createScaffolderConfig());
    const actionContext = getActionContext();
    actionContext.input = { ...actionContext.input, slug: 'project-slug' };

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${actionContext.input.authToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: actionContext.input.name,
            slug: actionContext.input.slug,
          });
          return HttpResponse.json(
            { detail: 'project creation mocked result' },
            { status: 201 },
          );
        },
      ),
    );

    await action.handler(actionContext);
  });

  it('should request sentry project create with added optional specified platform', async () => {
    expect.assertions(3);

    const action = createSentryCreateProjectAction(createScaffolderConfig());
    const actionContext = getActionContext();
    actionContext.input = { ...actionContext.input, platform: 'platform-slug' };

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${actionContext.input.authToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: actionContext.input.name,
            slug: actionContext.input.slug,
            platform: actionContext.input.platform,
          });
          return HttpResponse.json(
            { detail: 'project creation mocked result' },
            { status: 201 },
          );
        },
      ),
    );

    await action.handler(actionContext);
  });

  it('should take Sentry auth token from scaffolder config when input authToken is missing.', async () => {
    expect.assertions(3);

    const sentryScaffolderConfigToken = randomBytes(5).toString('hex');
    const action = createSentryCreateProjectAction(
      createScaffolderConfig({
        sentry: {
          token: sentryScaffolderConfigToken,
        },
      }),
    );
    const actionContext = getActionContext();
    actionContext.input.authToken = undefined;

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${sentryScaffolderConfigToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: actionContext.input.name,
          });
          return HttpResponse.json(
            { detail: 'project creation mocked result' },
            { status: 201 },
          );
        },
      ),
    );

    await action.handler(actionContext);
  });

  it('should throw InputError when auth token is missing from input parameters and scaffolder config.', async () => {
    const action = createSentryCreateProjectAction(createScaffolderConfig());
    const actionContext = getActionContext();
    actionContext.input.authToken = undefined;

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${actionContext.input.authToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: actionContext.input.name,
          });
          return HttpResponse.json(
            { detail: 'project creation mocked result' },
            { status: 201 },
          );
        },
      ),
    );

    await expect(() => action.handler(actionContext)).rejects.toThrow(
      new InputError('No valid sentry token given'),
    );
  });

  it('should throw InputError when sentry API returns unexpected content-type.', async () => {
    const action = createSentryCreateProjectAction(createScaffolderConfig());
    const actionContext = getActionContext();

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        async () => {
          return HttpResponse.text('TOP_SECRET_RESPONSE', { status: 201 });
        },
      ),
    );

    await expect(() => action.handler(actionContext)).rejects.toThrow(
      new InputError('Unexpected Sentry response content type'),
    );
  });

  it('should throw InputError when sentry API returns unexpected status code.', async () => {
    const action = createSentryCreateProjectAction(createScaffolderConfig());
    const actionContext = getActionContext();

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        async () => {
          return HttpResponse.json({ detail: 'OUCH' }, { status: 400 });
        },
      ),
    );

    await expect(() => action.handler(actionContext)).rejects.toThrow(
      new InputError('Sentry API request failed with status 400'),
    );
  });

  it('should not expose an invalid JSON response body.', async () => {
    const action = createSentryCreateProjectAction(createScaffolderConfig());
    const actionContext = getActionContext();

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        async () => {
          return new HttpResponse('TOP_SECRET_RESPONSE', {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
        },
      ),
    );

    await expect(() => action.handler(actionContext)).rejects.toThrow(
      new InputError('Invalid JSON response from Sentry'),
    );
  });

  it('should reject redirects without requesting the redirect target.', async () => {
    const action = createSentryCreateProjectAction(createScaffolderConfig());
    const actionContext = getActionContext();
    const redirectTarget = jest.fn(async () => {
      return HttpResponse.json({ id: 'mock-id' }, { status: 201 });
    });

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        ({ request }) => {
          expect(request.redirect).toBe('error');
          return HttpResponse.redirect(
            'https://sentry.io/api/0/redirect-target/',
            302,
          );
        },
      ),
      http.get('https://sentry.io/api/0/redirect-target/', redirectTarget),
    );

    await expect(() => action.handler(actionContext)).rejects.toThrow(
      new InputError('Failed to request Sentry API'),
    );
    expect(redirectTarget).not.toHaveBeenCalled();
  });

  it('should accept a normalized action apiBaseUrl that matches the configured URL.', async () => {
    expect.assertions(3);

    const sentryScaffolderConfigToken = randomBytes(5).toString('hex');
    const action = createSentryCreateProjectAction(
      createScaffolderConfig({
        sentry: {
          token: sentryScaffolderConfigToken,
          apiBaseUrl: 'https://custom.sentry.io/api/0',
        },
      }),
    );
    const actionContext = getActionContext();
    actionContext.input = {
      ...actionContext.input,
      authToken: undefined,
      apiBaseUrl: 'https://custom.sentry.io/api/0/',
    };

    worker.use(
      http.post(
        `https://custom.sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${sentryScaffolderConfigToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: actionContext.input.name,
          });
          return HttpResponse.json({ id: 'mock-id' }, { status: 201 });
        },
      ),
    );

    await action.handler(actionContext);
  });

  it('should reject an action apiBaseUrl that does not safely match the configured URL.', async () => {
    const action = createSentryCreateProjectAction(
      createScaffolderConfig({
        sentry: {
          apiBaseUrl: 'https://config.sentry.io/api/0',
        },
      }),
    );
    const actionContext = getActionContext();
    actionContext.input = {
      ...actionContext.input,
      apiBaseUrl: 'https://config.sentry.io.evil/api/0',
    };
    const requestHandler = jest.fn(async () => {
      return HttpResponse.json({ id: 'mock-id' }, { status: 201 });
    });

    worker.use(
      http.post(
        `https://config.sentry.io.evil/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        requestHandler,
      ),
    );

    await expect(() => action.handler(actionContext)).rejects.toThrow(
      new InputError('apiBaseUrl must match the effective Sentry API base URL'),
    );
    expect(requestHandler).not.toHaveBeenCalled();
  });

  it('should create a Sentry project with apiBaseUrl from config.', async () => {
    expect.assertions(3);

    const action = createSentryCreateProjectAction(
      createScaffolderConfig({
        sentry: {
          apiBaseUrl: 'https://config.sentry.io/api/0',
        },
      }),
    );
    const actionContext = getActionContext();

    worker.use(
      http.post(
        `https://config.sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${actionContext.input.authToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: actionContext.input.name,
          });
          return HttpResponse.json({ id: 'mock-id' }, { status: 201 });
        },
      ),
    );

    await action.handler(actionContext);
  });

  it('should use the auth token and apiBaseUrl from config together.', async () => {
    expect.assertions(3);

    const sentryScaffolderConfigToken = randomBytes(5).toString('hex');
    const action = createSentryCreateProjectAction(
      createScaffolderConfig({
        sentry: {
          token: sentryScaffolderConfigToken,
          apiBaseUrl: 'https://config.sentry.io/api/0',
        },
      }),
    );
    const actionContext = getActionContext();
    actionContext.input.authToken = undefined;

    worker.use(
      http.post(
        `https://config.sentry.io/api/0/teams/${actionContext.input.organizationSlug}/${actionContext.input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${sentryScaffolderConfigToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: actionContext.input.name,
          });
          return HttpResponse.json({ id: 'mock-id' }, { status: 201 });
        },
      ),
    );

    await action.handler(actionContext);
  });
});
