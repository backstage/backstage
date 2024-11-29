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

import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { randomBytes } from 'crypto';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { createSentryCreateProjectAction } from './createProject';
import yaml from 'yaml';
import { examples } from './createProject.examples';

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
    authToken?: string;
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

  it(`should ${examples[0].description}`, async () => {
    expect.assertions(3);

    let input;
    try {
      input = yaml.parse(examples[0].example).steps[1].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const action = createSentryCreateProjectAction(createScaffolderConfig());
    const actionContext = getActionContext();

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${input.organizationSlug}/${input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer b15711beb516e1e910d2ede554dc1bf725654ef3c75e5a9106de9aec13d4gf93`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: 'Scaffolded project B',
          });
          return HttpResponse.json(
            { detail: 'project creation mocked result' },
            { status: 201 },
          );
        },
      ),
    );

    await action.handler({
      ...actionContext,
      input: {
        ...actionContext.input,
        ...input,
      },
    });
  });

  it(`should ${examples[0].description}`, async () => {
    expect.assertions(3);

    let input;
    try {
      input = yaml.parse(examples[0].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const action = createSentryCreateProjectAction(createScaffolderConfig());
    const actionContext = getActionContext();
    actionContext.input = { ...actionContext.input, slug: 'project-slug' };

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${input.organizationSlug}/${input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer a14711beb516e1e910d2ede554dc1bf725654ef3c75e5a9106de9aec13d5df96`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: 'Scaffolded project A',
            slug: 'scaff-proj-a',
          });
          return HttpResponse.json(
            { detail: 'project creation mocked result' },
            { status: 201 },
          );
        },
      ),
    );

    await action.handler({
      ...actionContext,
      input: {
        ...actionContext.input,
        ...input,
      },
    });
  });

  it(`should ${examples[1].description}`, async () => {
    expect.assertions(3);

    let input;
    try {
      input = yaml.parse(examples[1].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

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
        `https://sentry.io/api/0/teams/${input.organizationSlug}/${input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer ${sentryScaffolderConfigToken}`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: 'Scaffolded project A',
          });
          return HttpResponse.json(
            { detail: 'project creation mocked result' },
            { status: 201 },
          );
        },
      ),
    );

    await action.handler({
      ...actionContext,
      input: {
        ...actionContext.input,
        ...input,
      },
    });
  });

  it(`should ${examples[2].description}`, async () => {
    expect.assertions(3);

    let input;
    try {
      input = yaml.parse(examples[2].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    const action = createSentryCreateProjectAction(createScaffolderConfig());
    const actionContext = getActionContext();

    worker.use(
      http.post(
        `https://sentry.io/api/0/teams/${input.organizationSlug}/${input.teamSlug}/projects/`,
        async ({ request }) => {
          expect(request.headers.get('Authorization')).toBe(
            `Bearer c16711beb516e1e910d2ede554dc1bf725654ef3c75e5a9106de9aec13d6gf94`,
          );
          expect(request.headers.get('Content-Type')).toBe(`application/json`);
          await expect(request.json()).resolves.toEqual({
            name: 'A very long name for the scaffolded project C that will generate a slug',
          });
          return HttpResponse.json(
            { detail: 'project creation mocked result' },
            { status: 201 },
          );
        },
      ),
    );

    await action.handler({
      ...actionContext,
      input: {
        ...actionContext.input,
        ...input,
      },
    });
  });
});
