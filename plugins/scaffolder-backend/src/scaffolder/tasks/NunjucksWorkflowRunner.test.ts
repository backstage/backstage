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

import { NunjucksWorkflowRunner } from './NunjucksWorkflowRunner';
import { TemplateActionRegistry } from '../actions';
import { ScmIntegrations } from '@backstage/integration';
import { JsonObject } from '@backstage/types';
import { ConfigReader } from '@backstage/config';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import {
  createTemplateAction,
  TaskSecrets,
  TemplateAction,
  TaskContext,
} from '@backstage/plugin-scaffolder-node';
import { UserEntity } from '@backstage/catalog-model';
import { z } from 'zod';
import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import { RESOURCE_TYPE_SCAFFOLDER_ACTION } from '@backstage/plugin-scaffolder-common/alpha';
import {
  createMockDirectory,
  mockCredentials,
  mockServices,
} from '@backstage/backend-test-utils';
import stripAnsi from 'strip-ansi';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import { LoggerService } from '@backstage/backend-plugin-api';

describe('NunjucksWorkflowRunner', () => {
  let logger: LoggerService;
  let actionRegistry = new TemplateActionRegistry();
  let runner: NunjucksWorkflowRunner;
  let fakeActionHandler: jest.Mock;
  let fakeTaskLog: jest.Mock;

  const mockDir = createMockDirectory();

  const mockedPermissionApi: jest.Mocked<PermissionEvaluator> = {
    authorizeConditional: jest.fn(),
  } as unknown as jest.Mocked<PermissionEvaluator>;

  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );

  const credentials = mockCredentials.user();

  const token = mockCredentials.service.token({
    onBehalfOf: credentials,
    targetPluginId: 'catalog',
  });

  const createMockTaskWithSpec = (
    spec: TaskSpec,
    secrets?: TaskSecrets,
    isDryRun?: boolean,
  ): TaskContext => ({
    spec,
    secrets,
    isDryRun,
    complete: async () => {},
    done: false,
    emitLog: fakeTaskLog,
    cancelSignal: new AbortController().signal,
    getWorkspaceName: () => Promise.resolve('test-workspace'),
    getInitiatorCredentials: () => Promise.resolve(credentials),
  });

  function expectTaskLog(message: string) {
    expect(fakeTaskLog.mock.calls.map(args => stripAnsi(args[0]))).toContain(
      message,
    );
  }

  beforeEach(() => {
    mockDir.clear();

    jest.resetAllMocks();
    logger = mockServices.logger.mock();
    actionRegistry = new TemplateActionRegistry();
    fakeActionHandler = jest.fn();
    fakeTaskLog = jest.fn();

    actionRegistry.register({
      id: 'jest-mock-action',
      description: 'Mock action for testing',
      handler: fakeActionHandler,
    });

    actionRegistry.register({
      id: 'jest-validated-action',
      description: 'Mock action for testing',
      supportsDryRun: true,
      handler: fakeActionHandler,
      schema: {
        input: {
          type: 'object',
          required: ['foo'],
          properties: {
            foo: {
              type: 'number',
            },
          },
        },
      },
    });

    actionRegistry.register(
      createTemplateAction({
        id: 'jest-zod-validated-action',
        description: 'Mock action for testing',
        handler: fakeActionHandler,
        supportsDryRun: true,
        schema: {
          input: z.object({
            foo: z.number(),
          }),
        },
      }) as TemplateAction,
    );

    actionRegistry.register({
      id: 'output-action',
      description: 'Mock action for testing',
      handler: async ctx => {
        ctx.output('mock', 'backstage');
        ctx.output('shouldRun', true);
      },
    });

    actionRegistry.register({
      id: 'checkpoints-action',
      description: 'Mock action with checkpoints',
      handler: async ctx => {
        const key1 = await ctx.checkpoint({
          key: 'key1',
          fn: async () => 'updated',
        });
        const key2 = await ctx.checkpoint({
          key: 'key2',
          fn: async () => 'updated',
        });
        const key3 = await ctx.checkpoint({
          key: 'key3',
          fn: async () => 'updated',
        });

        const key4 = await ctx.checkpoint({
          key: 'key4',
          fn: () => {},
        });

        const key5 = await ctx.checkpoint({
          key: 'key5',
          fn: async () => {},
        });

        ctx.output('key1', key1);
        ctx.output('key2', key2);
        ctx.output('key3', key3);

        // @ts-expect-error - this is void return
        ctx.output('key4', key4);
        // @ts-expect-error - this is void return
        ctx.output('key5', key5);
      },
    });

    mockedPermissionApi.authorizeConditional.mockResolvedValue([
      { result: AuthorizeResult.ALLOW },
    ]);

    runner = new NunjucksWorkflowRunner({
      actionRegistry,
      integrations,
      workingDirectory: mockDir.path,
      logger: loggerToWinstonLogger(logger),
      permissions: mockedPermissionApi,
    });
  });

  it('should throw an error if the action does not exist', async () => {
    const task = createMockTaskWithSpec({
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      parameters: {},
      output: {},
      steps: [{ id: 'test', name: 'name', action: 'does-not-exist' }],
    });

    await expect(runner.execute(task)).rejects.toThrow(
      /Template action with ID 'does-not-exist' is not registered/,
    );
  });

  describe('validation', () => {
    it('should throw an error if the action has a schema and the input does not match', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        output: {},
        steps: [{ id: 'test', name: 'name', action: 'jest-validated-action' }],
      });

      await expect(runner.execute(task)).rejects.toThrow(
        /Invalid input passed to action jest-validated-action, instance requires property "foo"/,
      );
    });

    it('should throw an error if the action has a zod schema and the input does not match', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        output: {},
        steps: [
          { id: 'test', name: 'name', action: 'jest-zod-validated-action' },
        ],
      });

      await expect(runner.execute(task)).rejects.toThrow(
        /Invalid input passed to action jest-zod-validated-action, instance requires property \"foo\"/,
      );
    });

    it('should run the action when the zod validation passes', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        output: {},
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-zod-validated-action',
            input: { foo: 1 },
          },
        ],
      });

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledTimes(1);
    });

    it('should run the action when the validation passes', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        output: {},
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-validated-action',
            input: { foo: 1 },
          },
        ],
      });

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledTimes(1);
    });

    it('should pass metadata through', async () => {
      const entityRef = `template:default/templateName`;

      const userEntity: UserEntity = {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'User',
        metadata: {
          name: 'user',
        },
        spec: {
          profile: {
            displayName: 'Bogdan Nechyporenko',
            email: 'bnechyporenko@company.com',
          },
        },
      };

      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        output: {},
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-validated-action',
            input: { foo: 1 },
          },
        ],
        templateInfo: { entityRef },
        user: {
          entity: userEntity,
        },
      });

      await runner.execute(task);

      expect(fakeActionHandler.mock.calls[0][0].templateInfo).toEqual({
        entityRef,
      });

      expect(fakeActionHandler.mock.calls[0][0].user).toEqual({
        entity: userEntity,
      });
    });

    it('should pass token through', async () => {
      const task = createMockTaskWithSpec(
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          parameters: {},
          output: {},
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-validated-action',
              input: { foo: 1 },
            },
          ],
        },
        {
          backstageToken: token,
          initiatorCredentials: JSON.stringify(credentials),
        },
      );

      await runner.execute(task);

      expect(fakeActionHandler.mock.calls[0][0].secrets).toEqual(
        expect.objectContaining({ backstageToken: token }),
      );
    });
  });

  describe('conditionals', () => {
    it('should execute steps conditionally', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          { id: 'test', name: 'test', action: 'output-action' },
          {
            id: 'conditional',
            name: 'conditional',
            action: 'output-action',
            if: '${{ steps.test.output.shouldRun }}',
          },
        ],
        output: {
          result: '${{ steps.conditional.output.mock }}',
        },
        parameters: {},
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBe('backstage');
    });

    it('should skips steps conditionally', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          { id: 'test', name: 'test', action: 'output-action' },
          {
            id: 'conditional',
            name: 'conditional',
            action: 'output-action',
            if: '${{ not steps.test.output.shouldRun}}',
          },
        ],
        output: {
          result: '${{ steps.conditional.output.mock }}',
        },
        parameters: {},
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBeUndefined();
    });

    it('should skips steps using the negating equals operator', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          { id: 'test', name: 'test', action: 'output-action' },
          {
            id: 'conditional',
            name: 'conditional',
            action: 'output-action',
            if: '${{ steps.test.output.mock !== "backstage"}}',
          },
        ],
        output: {
          result: '${{ steps.conditional.output.mock }}',
        },
        parameters: {},
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBeUndefined();
    });
    describe('should apply boolean step conditions', () => {
      it('executes when true', async () => {
        const task = createMockTaskWithSpec({
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [
            {
              id: 'conditional',
              name: 'conditional',
              action: 'output-action',
              if: true,
            },
          ],
          output: {
            result: '${{ steps.conditional.output.mock }}',
          },
          parameters: {},
        });

        const { output } = await runner.execute(task);
        expect(output.result).toBe('backstage');
      });
      it('skips when false', async () => {
        const task = createMockTaskWithSpec({
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [
            {
              id: 'conditional',
              name: 'conditional',
              action: 'output-action',
              if: false,
            },
          ],
          output: {
            result: '${{ steps.conditional.output.mock }}',
          },
          parameters: {},
        });

        const { output } = await runner.execute(task);
        expect(output.result).toBeUndefined();
      });
    });
  });

  describe('templating', () => {
    it('should template the input to an action', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-mock-action',
            input: {
              foo: '${{parameters.input | lower }}',
            },
          },
        ],
        output: {},
        parameters: {
          input: 'BACKSTAGE',
        },
      });

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({ input: { foo: 'backstage' } }),
      );
    });

    it('should not try and parse something that is not parsable', async () => {
      jest.spyOn(logger, 'error');
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-mock-action',
            input: {
              foo: 'bob',
            },
          },
        ],
        output: {},
        parameters: {
          input: 'BACKSTAGE',
        },
      });

      await runner.execute(task);

      expect(logger.error).not.toHaveBeenCalled();
    });

    it('should keep the original types for the input and not parse things that are not meant to be parsed', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-mock-action',
            input: {
              number: '${{parameters.number}}',
              string: '${{parameters.string}}',
            },
          },
        ],
        output: {},
        parameters: {
          number: 0,
          string: '1',
        },
      });

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({ input: { number: 0, string: '1' } }),
      );
    });

    it('should template complex values into the action', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-mock-action',
            input: {
              foo: '${{parameters.complex}}',
            },
          },
        ],
        output: {},
        parameters: {
          complex: { bar: 'BACKSTAGE' },
        },
      });

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({ input: { foo: { bar: 'BACKSTAGE' } } }),
      );
    });

    it('supports really complex structures', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-mock-action',
            input: {
              foo: '${{parameters.complex.baz.something}}',
            },
          },
        ],
        output: {},
        parameters: {
          complex: {
            bar: 'BACKSTAGE',
            baz: { something: 'nested', here: 'yas' },
          },
        },
      });

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({ input: { foo: 'nested' } }),
      );
    });

    it('supports numbers as first class too', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-mock-action',
            input: {
              foo: '${{parameters.complex.baz.number}}',
            },
          },
        ],
        output: {},
        parameters: {
          complex: {
            bar: 'BACKSTAGE',
            baz: { number: 1 },
          },
        },
      });

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({ input: { foo: 1 } }),
      );
    });

    it('should deal with checkpoints', async () => {
      const task = {
        ...createMockTaskWithSpec({
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          parameters: {},
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'checkpoints-action',
              input: { foo: 1 },
            },
          ],
          output: {
            key1: '${{steps.test.output.key1}}',
            key2: '${{steps.test.output.key2}}',
            key3: '${{steps.test.output.key3}}',
            key4: '${{steps.test.output.key4}}',
            key5: '${{steps.test.output.key5}}',
            key6: '${{steps.test.output.key6}}',
          },
        }),
        getTaskState: (): Promise<
          | {
              state: JsonObject;
            }
          | undefined
        > => {
          return Promise.resolve({
            state: {
              checkpoints: {
                ['v1.task.checkpoint.test.key1']: {
                  status: 'success',
                  value: 'initial',
                },
                ['v1.task.checkpoint.test2.key2']: {
                  status: 'failed',
                  reason: 'fatal error',
                },
              },
            },
          });
        },
      };
      const result = await runner.execute(task);

      expect(result.output.key1).toEqual('initial');
      expect(result.output.key2).toEqual('updated');
      expect(result.output.key3).toEqual('updated');
      expect(result.output.key4).toEqual(undefined);
      expect(result.output.key5).toEqual(undefined);
    });

    it('should template the output from simple actions', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'output-action',
            input: {},
          },
        ],
        output: {
          foo: '${{steps.test.output.mock | upper}}',
        },
        parameters: {},
      });

      const { output } = await runner.execute(task);

      expect(output.foo).toEqual('BACKSTAGE');
    });

    it('should include task ID in the templated context', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-mock-action',
            input: {
              values: {
                taskId: '${{context.task.id}}',
              },
            },
          },
        ],
        output: {},
        parameters: {},
      });

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { values: { taskId: 'test-workspace' } },
        }),
      );
    });
  });

  describe('redactions', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should redact secrets that are passed with the task', async () => {
      actionRegistry.register({
        id: 'log-secret',
        description: 'Mock action for testing',
        supportsDryRun: true,
        handler: async ctx => {
          ctx.logger.info(ctx.input.secret);
        },
        schema: {
          input: {
            type: 'object',
            required: ['secret'],
            properties: {
              secret: {
                type: 'string',
              },
            },
          },
        },
      });

      const task = createMockTaskWithSpec(
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          parameters: {},
          output: {},
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-secret',
              input: {
                secret: '${{ secrets.secret }}',
              },
            },
          ],
        },
        { secret: 'my-secret-value' },
      );

      await runner.execute(task);

      expectTaskLog('info: ***');
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redact meta fields properly', async () => {
      actionRegistry.register({
        id: 'log-secret',
        description: 'Mock action for testing',
        supportsDryRun: true,
        handler: async ctx => {
          ctx.logger.child({ thing: ctx.input.secret }).info(ctx.input.secret);
        },
        schema: {
          input: {
            type: 'object',
            required: ['secret'],
            properties: {
              secret: {
                type: 'string',
              },
            },
          },
        },
      });

      const task = createMockTaskWithSpec(
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          parameters: {},
          output: {},
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-secret',
              input: {
                secret: '${{ secrets.secret }}',
              },
            },
          ],
        },
        { secret: 'my-secret-value' },
      );

      await runner.execute(task);

      expectTaskLog('info: *** {"thing":"***"}');
    });
  });

  describe('each', () => {
    it('should run a step repeatedly - flat values', async () => {
      const colors = ['blue', 'green', 'red'];
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            each: '${{parameters.colors}}',
            action: 'jest-mock-action',
            input: { color: '${{each.value}}' },
          },
        ],
        output: {},
        parameters: {
          colors,
        },
      });
      await runner.execute(task);

      colors.forEach((color, idx) => {
        expectTaskLog(
          `info: Running step each: {"key":"${idx}","value":"${color}"}`,
        );
        expect(fakeActionHandler).toHaveBeenCalledWith(
          expect.objectContaining({ input: { color } }),
        );
      });
    });

    it('should run a step repeatedly - object list', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            each: '${{parameters.settings}}',
            action: 'jest-mock-action',
            input: {
              key: '${{each.key}}',
              value: '${{each.value}}',
            },
          },
        ],
        output: {},
        parameters: {
          settings: [{ color: 'blue' }],
        },
      });
      await runner.execute(task);

      expectTaskLog(
        'info: Running step each: {"key":"0","value":"[object Object]"}',
      );
      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { key: '0', value: { color: 'blue' } },
        }),
      );
    });

    it('should run a step repeatedly - object', async () => {
      const settings = {
        color: 'blue',
        transparent: 'yes',
      };
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            each: '${{parameters.settings}}',
            action: 'jest-mock-action',
            input: { key: '${{each.key}}', value: '${{each.value}}' },
          },
        ],
        output: {},
        parameters: {
          settings,
        },
      });
      await runner.execute(task);

      for (const [key, value] of Object.entries(settings)) {
        expectTaskLog(
          `info: Running step each: {"key":"${key}","value":"${value}"}`,
        );
        expect(fakeActionHandler).toHaveBeenCalledWith(
          expect.objectContaining({
            input: { key, value },
          }),
        );
      }
    });

    it('should run a step repeatedly with validation of single-expression value', async () => {
      const numbers = [5, 7, 9];
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            each: '${{parameters.numbers}}',
            action: 'jest-validated-action',
            input: { foo: '${{each.value}}' },
          },
        ],
        output: {},
        parameters: {
          numbers,
        },
      });
      await runner.execute(task);

      numbers.forEach((foo, idx) => {
        expectTaskLog(
          `info: Running step each: {"key":"${idx}","value":"${foo}"}`,
        );
        expect(fakeActionHandler).toHaveBeenCalledWith(
          expect.objectContaining({
            input: { foo },
          }),
        );
      });
    });

    it('should validate each action iteration', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            each: '${{parameters.data}}',
            action: 'jest-validated-action',
            input: { foo: '${{each.value.foo}}' },
          },
        ],
        output: {},
        parameters: {
          data: [
            {
              foo: 0,
            },
            {},
          ],
        },
      });
      await expect(runner.execute(task)).rejects.toThrow(
        'Invalid input passed to action jest-validated-action[1], instance requires property "foo"',
      );
      expect(fakeActionHandler).not.toHaveBeenCalled();
    });
  });

  describe('secrets', () => {
    it('should pass through the secrets to the context', async () => {
      const task = createMockTaskWithSpec(
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-mock-action',
              input: {},
            },
          ],
          output: {},
          parameters: {},
        },
        { foo: 'bar' },
      );

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({ secrets: { foo: 'bar' } }),
      );
    });

    it('should be able to template secrets into the input of an action', async () => {
      const task = createMockTaskWithSpec(
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-mock-action',
              input: {
                b: '${{ secrets.foo }}',
              },
            },
          ],
          output: {},
          parameters: {},
        },
        { foo: 'bar' },
      );

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({ input: { b: 'bar' } }),
      );
    });

    it('does not allow templating of secrets as an output', async () => {
      const task = createMockTaskWithSpec(
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-mock-action',
              input: {
                b: '${{ secrets.foo }}',
              },
            },
          ],
          output: {
            b: '${{ secrets.foo }}',
          },
          parameters: {},
        },
        { foo: 'bar' },
      );

      const executedTask = await runner.execute(task);

      expect(executedTask.output.b).toBeUndefined();
    });
  });

  describe('user', () => {
    it('allows access to the user entity at the templating level', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'output-action',
            input: {},
          },
        ],
        user: {
          entity: { metadata: { name: 'bob' } } as UserEntity,
          ref: 'user:default/guest',
        },
        output: {
          foo: '${{ user.entity.metadata.name }} ${{ user.ref }}',
        },
        parameters: {
          repoUrl: 'github.com?repo=repo&owner=owner',
        },
      });

      const { output } = await runner.execute(task);

      expect(output.foo).toEqual('bob user:default/guest');
    });
  });

  describe('filters', () => {
    it('provides the parseRepoUrl filter', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'output-action',
            input: {},
          },
        ],
        output: {
          foo: '${{ parameters.repoUrl | parseRepoUrl }}',
        },
        parameters: {
          repoUrl: 'github.com?repo=repo&owner=owner',
        },
      });

      const { output } = await runner.execute(task);

      expect(output.foo).toEqual({
        host: 'github.com',
        owner: 'owner',
        repo: 'repo',
      });
    });

    describe('parseEntityRef', () => {
      it('parses entity ref', async () => {
        const task = createMockTaskWithSpec({
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'output-action',
              input: {},
            },
          ],
          output: {
            foo: '${{ parameters.entity | parseEntityRef }}',
          },
          parameters: {
            entity: 'component:default/ben',
          },
        });

        const { output } = await runner.execute(task);

        expect(output.foo).toEqual({
          kind: 'component',
          namespace: 'default',
          name: 'ben',
        });
      });

      it('provides default kind for parsing entity ref', async () => {
        const task = createMockTaskWithSpec({
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'output-action',
              input: {},
            },
          ],
          output: {
            foo: `\${{ parameters.entity | parseEntityRef({ defaultKind:"user" }) }}`,
          },
          parameters: {
            entity: 'ben',
          },
        });

        const { output } = await runner.execute(task);

        expect(output.foo).toEqual({
          kind: 'user',
          namespace: 'default',
          name: 'ben',
        });
      });

      it('provides default namespace for parsing entity ref', async () => {
        const task = createMockTaskWithSpec({
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'output-action',
              input: {},
            },
          ],
          output: {
            foo: `\${{ parameters.entity | parseEntityRef({ defaultNamespace:"namespace-b" }) }}`,
          },
          parameters: {
            entity: 'user:ben',
          },
        });

        const { output } = await runner.execute(task);

        expect(output.foo).toEqual({
          kind: 'user',
          namespace: 'namespace-b',
          name: 'ben',
        });
      });

      it('provides default kind and namespace for parsing entity ref', async () => {
        const task = createMockTaskWithSpec({
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'output-action',
              input: {},
            },
          ],
          output: {
            foo: `\${{ parameters.entity | parseEntityRef({ defaultKind:"user", defaultNamespace:"namespace-b" }) }}`,
          },
          parameters: {
            entity: 'ben',
          },
        });

        const { output } = await runner.execute(task);

        expect(output.foo).toEqual({
          kind: 'user',
          namespace: 'namespace-b',
          name: 'ben',
        });
      });

      it.each(['undefined', 'null', 'None', 'group', 0, '{}', '[]'])(
        'ignores invalid context "%s" for parsing entity refF',
        async kind => {
          const task = createMockTaskWithSpec({
            apiVersion: 'scaffolder.backstage.io/v1beta3',
            steps: [
              {
                id: 'test',
                name: 'name',
                action: 'output-action',
                input: {},
              },
            ],
            output: {
              foo: `\${{ parameters.entity | parseEntityRef(${kind}) }}`,
            },
            parameters: {
              entity: 'user:default/ben',
            },
          });

          const { output } = await runner.execute(task);

          expect(output.foo).toEqual({
            kind: 'user',
            namespace: 'default',
            name: 'ben',
          });
        },
      );

      it('fails when unable to parse entity ref', async () => {
        const task = createMockTaskWithSpec({
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'output-action',
              input: {},
            },
          ],
          output: {
            foo: `\${{ parameters.entity | parseEntityRef({ defaultNamespace:"namespace-b" }) }}`,
          },
          parameters: {
            entity: 'ben',
          },
        });

        const { output } = await runner.execute(task);

        expect(output.foo).toEqual(
          `\${{ parameters.entity | parseEntityRef({ defaultNamespace:"namespace-b" }) }}`,
        );
      });
    });

    it('provides the pick filter', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'output-action',
            input: {},
          },
        ],
        output: {
          foo: '${{ parameters.entity | parseEntityRef | pick("kind") }}',
        },
        parameters: {
          entity: 'component:default/ben',
        },
      });

      const { output } = await runner.execute(task);

      expect(output.foo).toEqual('component');
    });

    it('should allow deep nesting of picked objects', async () => {
      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'output-action',
            input: {},
          },
        ],
        output: {
          foo: '${{ parameters.entity | pick("something.deeply.nested") }}',
        },
        parameters: {
          entity: {
            something: {
              deeply: {
                nested: 'component',
              },
            },
          },
        },
      });

      const { output } = await runner.execute(task);

      expect(output.foo).toEqual('component');
    });
  });

  describe('dry run', () => {
    it('sets isDryRun flag correctly', async () => {
      const task = createMockTaskWithSpec(
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          parameters: {},
          output: {},
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-validated-action',
              input: { foo: 1 },
            },
          ],
        },
        {
          backstageToken: token,
        },
        true,
      );

      await runner.execute(task);

      expect(fakeActionHandler.mock.calls[0][0].isDryRun).toEqual(true);
    });

    it('should have metadata in action context during dry run', async () => {
      const task = createMockTaskWithSpec(
        {
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          templateInfo: {
            entityRef: 'dryRun-Entity',
            entity: { metadata: { name: 'test-template' } },
          },
          parameters: {},
          output: {},
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-validated-action',
              input: { foo: 1 },
            },
          ],
        },
        {
          backstageToken: token,
        },
        true,
      );

      await runner.execute(task);

      expect(fakeActionHandler.mock.calls[0][0].isDryRun).toEqual(true);
      expect(
        fakeActionHandler.mock.calls[0][0].templateInfo.entity.metadata.name,
      ).toEqual('test-template');
    });
  });

  describe('permissions', () => {
    it('should throw an error if an actions is not authorized', async () => {
      mockedPermissionApi.authorizeConditional.mockResolvedValueOnce([
        { result: AuthorizeResult.DENY },
      ]);

      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        output: {},
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-validated-action',
            input: { foo: 1 },
          },
        ],
      });

      await expect(runner.execute(task)).rejects.toThrow(
        /Unauthorized action: jest-validated-action. The action is not allowed/,
      );
      expect(fakeActionHandler).not.toHaveBeenCalled();
    });

    it(`shouldn't execute actions who aren't authorized`, async () => {
      mockedPermissionApi.authorizeConditional.mockResolvedValueOnce([
        {
          result: AuthorizeResult.CONDITIONAL,
          pluginId: 'scaffolder',
          resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
          conditions: {
            anyOf: [
              {
                resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
                rule: 'HAS_NUMBER_PROPERTY',
                params: {
                  key: 'foo',
                  value: 1,
                },
              },
            ],
          },
        },
      ]);

      const task = createMockTaskWithSpec({
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: {},
        output: {},
        steps: [
          {
            id: 'test1',
            name: 'valid action',
            action: 'jest-validated-action',
            input: { foo: 1 },
          },
          {
            id: 'test2',
            name: 'invalid action',
            action: 'jest-validated-action',
            input: { foo: 2 },
          },
        ],
      });

      await expect(runner.execute(task)).rejects.toThrow(
        `Unauthorized action: jest-validated-action. The action is not allowed. Input: ${JSON.stringify(
          { foo: 2 },
          null,
          2,
        )}`,
      );
      expect(fakeActionHandler).toHaveBeenCalled();
      expect(mockedPermissionApi.authorizeConditional).toHaveBeenCalledTimes(1);
    });
  });
});
