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

import mockFs from 'mock-fs';
import * as winston from 'winston';
import { createTemplateAction, TemplateActionRegistry } from '../actions';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { HandlebarsWorkflowRunner } from './HandlebarsWorkflowRunner';
import { TaskContext, TaskSpec } from './types';
import { RepoSpec } from '../actions/builtin/publish/util';

describe('LegacyWorkflowRunner', () => {
  let runner: HandlebarsWorkflowRunner;
  const logger = getVoidLogger();
  let actionRegistry = new TemplateActionRegistry();

  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );

  const createMockTaskWithSpec = (spec: TaskSpec): TaskContext => ({
    spec,
    complete: async () => {},
    done: false,
    emitLog: async () => {},
    getWorkspaceName: () => Promise.resolve('test-workspace'),
  });

  beforeEach(() => {
    winston.format.simple(); // put logform the require cache before mocking fs
    mockFs({
      '/tmp': mockFs.directory(),
    });

    actionRegistry = new TemplateActionRegistry();
    actionRegistry.register({
      id: 'test-action',
      handler: async ctx => {
        ctx.output('testOutput', 'mockOutputData');
        ctx.output('badOutput', false);
      },
    });

    runner = new HandlebarsWorkflowRunner({
      actionRegistry,
      integrations,
      workingDirectory: '/tmp',
      logger,
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should fail when the action does not exist', async () => {
    const task = createMockTaskWithSpec({
      apiVersion: 'backstage.io/v1beta2',
      steps: [{ id: 'test', name: 'test', action: 'not-found-action' }],
      output: {
        result: '{{ steps.test.output.testOutput }}',
      },
      values: {},
    });

    await expect(() => runner.execute(task)).rejects.toThrow(
      /Template action with ID 'not-found-action' is not registered/,
    );
  });

  describe('templating', () => {
    it('should template the output', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'backstage.io/v1beta2',
        steps: [{ id: 'test', name: 'test', action: 'test-action' }],
        output: {
          result: '{{ steps.test.output.testOutput }}',
        },
        values: {},
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBe('mockOutputData');
    });

    it('should template the input', async () => {
      const inputAction = createTemplateAction<{
        name: string;
      }>({
        id: 'test-input',
        schema: {
          input: {
            type: 'object',
            required: ['name'],
            properties: {
              name: {
                title: 'name',
                description: 'Enter name',
                type: 'string',
              },
            },
          },
        },
        async handler(ctx) {
          if (ctx.input.name !== 'mockOutputData') {
            throw new Error(
              `expected name to be "mockOutputData" got ${ctx.input.name}`,
            );
          }
        },
      });
      actionRegistry.register(inputAction);

      const task = createMockTaskWithSpec({
        apiVersion: 'backstage.io/v1beta2',
        steps: [
          { id: 'test', name: 'test', action: 'test-action' },
          {
            id: 'test-input',
            name: 'test-input',
            action: 'test-input',
            input: {
              name: '{{ steps.test.output.testOutput }}',
            },
          },
        ],
        output: {
          result: '{{ steps.test.output.testOutput }}',
        },
        values: {},
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBe('mockOutputData');
    });
  });

  describe('conditionals', () => {
    it('should execute steps conditionally', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'backstage.io/v1beta2',
        steps: [
          { id: 'test', name: 'test', action: 'test-action' },
          {
            id: 'conditional',
            name: 'conditional',
            action: 'test-action',
            if: '{{ steps.test.output.testOutput }}',
          },
        ],
        output: {
          result: '{{ steps.conditional.output.testOutput }}',
        },
        values: {},
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBe('mockOutputData');
    });

    it('should execute steps conditionally with eq helper', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'backstage.io/v1beta2',
        steps: [
          { id: 'test', name: 'test', action: 'test-action' },
          {
            id: 'conditional',
            name: 'conditional',
            action: 'test-action',
            if: '{{ eq steps.test.output.testOutput "mockOutputData" }}',
          },
        ],
        output: {
          result: '{{ steps.conditional.output.testOutput }}',
        },
        values: {},
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBe('mockOutputData');
    });

    it('should skip test conditionally', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'backstage.io/v1beta2',
        steps: [
          { id: 'test', name: 'test', action: 'test-action' },
          {
            id: 'conditional',
            name: 'conditional',
            action: 'test-action',
            if: '{{ steps.test.output.badOutput }}',
          },
        ],
        output: {
          result: '{{ steps.conditional.output.testOutput }}',
        },
        values: {},
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBeUndefined();
    });
  });

  describe('parsing', () => {
    it('should parse strings as objects if possible', async () => {
      const inputAction = createTemplateAction<{
        address: { line1: string };
        list: string[];
        address2: string;
      }>({
        id: 'test-input',
        schema: {
          input: {
            type: 'object',
            required: ['address'],
            properties: {
              address: {
                title: 'address',
                description: 'Enter name',
                type: 'object',
                properties: {
                  line1: {
                    type: 'string',
                  },
                },
              },
              address2: {
                type: 'string',
              },
              list: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
        async handler(ctx) {
          if (ctx.input.list.length !== 1) {
            throw new Error(
              `expected list to have length "1" got ${ctx.input.list.length}`,
            );
          }
          if (ctx.input.address.line1 !== 'line 1') {
            throw new Error(
              `expected address.line1 to be "line 1" got ${ctx.input.address.line1}`,
            );
          }

          if (ctx.input.address2 !== '{"not valid"}') {
            throw new Error(
              `expected address2 to be "{"not valid"}" got ${ctx.input.address2}`,
            );
          }
          ctx.output('address', ctx.input.address.line1);
        },
      });
      actionRegistry.register(inputAction);

      const task = createMockTaskWithSpec({
        apiVersion: 'backstage.io/v1beta2',
        steps: [
          {
            id: 'test-input',
            name: 'test-input',
            action: 'test-input',
            input: {
              address: JSON.stringify({ line1: 'line 1' }),
              list: JSON.stringify(['hey!']),
              address2: '{"not valid"}',
            },
          },
        ],
        output: {
          result: '{{ steps.test-input.output.address }}',
        },
        values: {},
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBe('line 1');
    });

    it('should provide a parseRepoUrl helper', async () => {
      const inputAction = createTemplateAction<{
        destination: RepoSpec;
      }>({
        id: 'test-input',
        schema: {
          input: {
            type: 'object',
            required: ['destination'],
            properties: {
              destination: {
                title: 'destination',
                type: 'object',
                properties: {
                  repo: {
                    type: 'string',
                  },
                  host: {
                    type: 'string',
                  },
                  owner: {
                    type: 'string',
                  },
                  organization: {
                    type: 'string',
                  },
                  workspace: {
                    type: 'string',
                  },
                  project: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        async handler(ctx) {
          ctx.output('host', ctx.input.destination.host);
          ctx.output('repo', ctx.input.destination.repo);

          if (ctx.input.destination.owner) {
            ctx.output('owner', ctx.input.destination.owner);
          }

          if (ctx.input.destination.host !== 'github.com') {
            throw new Error(
              `expected host to be "github.com" got ${ctx.input.destination.host}`,
            );
          }

          if (ctx.input.destination.repo !== 'repo') {
            throw new Error(
              `expected repo to be "repo" got ${ctx.input.destination.repo}`,
            );
          }

          if (
            ctx.input.destination.owner &&
            ctx.input.destination.owner !== 'owner'
          ) {
            throw new Error(
              `expected repo to be "owner" got ${ctx.input.destination.owner}`,
            );
          }
        },
      });
      actionRegistry.register(inputAction);

      const task = createMockTaskWithSpec({
        apiVersion: 'backstage.io/v1beta2',
        steps: [
          {
            id: 'test-input',
            name: 'test-input',
            action: 'test-input',
            input: {
              destination: '{{ parseRepoUrl parameters.repoUrl }}',
            },
          },
        ],
        output: {
          host: '{{ steps.test-input.output.host }}',
          repo: '{{ steps.test-input.output.repo }}',
          owner: '{{ steps.test-input.output.owner }}',
        },
        values: {
          repoUrl: 'github.com?repo=repo&owner=owner',
        },
      });

      const { output } = await runner.execute(task);

      expect(output.host).toBe('github.com');
      expect(output.repo).toBe('repo');
      expect(output.owner).toBe('owner');
    });
  });
});
