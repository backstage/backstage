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
import {
  DefaultTemplateActionRegistry,
  TemplateActionRegistry,
} from '../actions';
import { ScmIntegrations } from '@backstage/integration';
import { JsonArray, JsonObject } from '@backstage/types';
import { ConfigReader } from '@backstage/config';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import {
  createTemplateAction,
  TaskBroker,
  TaskContext,
  TaskSecrets,
} from '@backstage/plugin-scaffolder-node';
import { UserEntity } from '@backstage/catalog-model';
import {
  AuthorizeResult,
  type PermissionCondition,
  type PermissionCriteria,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import { RESOURCE_TYPE_SCAFFOLDER_ACTION } from '@backstage/plugin-scaffolder-common/alpha';
import {
  createMockDirectory,
  mockCredentials,
  mockServices,
} from '@backstage/backend-test-utils';
import {
  actionsRegistryServiceMock,
  metricsServiceMock,
} from '@backstage/backend-test-utils/alpha';
import { collectTemplateCapabilities } from '../../util/templating';
import { TaskWorker } from './TaskWorker';

describe('NunjucksWorkflowRunner', () => {
  let actionRegistry: TemplateActionRegistry;
  let runner: NunjucksWorkflowRunner;
  let fakeActionHandler: jest.Mock;
  let fakeTaskLog: jest.Mock;
  let stripAnsi: typeof import('strip-ansi').default;

  const logger = mockServices.logger.mock();
  const mockDir = createMockDirectory();

  const mockedPermissionApi: jest.Mocked<PermissionEvaluator> = {
    authorizeConditional: jest.fn(),
  } as unknown as jest.Mocked<PermissionEvaluator>;

  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      scaffolder: {
        defaultEnvironment: {
          parameters: {
            region: 'us-east-1',
          },
          secrets: {
            AWS_ACCESS_KEY: 'test-secret-value',
          },
        },
      },
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
    {
      apiVersion = 'scaffolder.backstage.io/v1beta3',
      output = {},
      parameters = {},
      ...spec
    }: Partial<TaskSpec>,
    secrets?: TaskSecrets,
    isDryRun?: boolean,
  ): TaskContext => ({
    spec: {
      apiVersion,
      output,
      parameters,
      ...spec,
    } as TaskSpec,
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

  beforeEach(async () => {
    mockDir.clear();

    // This one is ESM-only
    stripAnsi = await import('strip-ansi').then(m => m.default);

    actionRegistry = new DefaultTemplateActionRegistry(
      actionsRegistryServiceMock(),
      mockServices.logger.mock(),
    );
    fakeActionHandler = jest.fn();
    fakeTaskLog = jest.fn();

    actionRegistry.register(
      createTemplateAction({
        id: 'jest-mock-action',
        description: 'Mock action for testing',
        handler: fakeActionHandler,
      }),
    );

    actionRegistry.register(
      createTemplateAction({
        id: 'jest-validated-action',
        description: 'Mock action for testing',
        supportsDryRun: true,
        handler: fakeActionHandler,
        schema: {
          input: {
            foo: z => z.number(),
          },
        },
      }),
    );

    actionRegistry.register(
      createTemplateAction({
        id: 'jest-zod-validated-action',
        description: 'Mock ac',
        supportsDryRun: true,
        schema: {
          input: {
            foo: zod => zod.number(),
          },
          output: {
            test: zod => zod.string(),
          },
        },
        handler: fakeActionHandler,
      }),
    );

    actionRegistry.register(
      createTemplateAction({
        id: 'output-action',
        description: 'Mock action for testing',
        handler: async ctx => {
          ctx.output('mock', 'backstage');
          ctx.output('shouldRun', true);
        },
      }),
    );

    actionRegistry.register(
      createTemplateAction({
        id: 'checkpoints-action',
        description: 'Mock action with checkpoints',
        schema: {
          output: z =>
            z.object({
              key1: z.string(),
              key2: z.string(),
              key3: z.string(),
              key4: z.string(),
              key5: z.string(),
            }),
        },
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

          // @ts-expect-error - not valid output type
          ctx.output('key4', key4);
          // @ts-expect-error - not valid output type
          ctx.output('key5', key5);
        },
      }),
    );

    mockedPermissionApi.authorizeConditional.mockResolvedValue([
      { result: AuthorizeResult.ALLOW },
    ]);

    const config = new ConfigReader({
      scaffolder: {
        defaultEnvironment: {
          parameters: {
            region: 'us-east-1',
          },
          secrets: {
            AWS_ACCESS_KEY: 'test-secret-value',
          },
        },
      },
    });

    runner = new NunjucksWorkflowRunner({
      actionRegistry,
      integrations,
      workingDirectory: mockDir.path,
      logger,
      permissions: mockedPermissionApi,
      config,
      metrics: metricsServiceMock.mock(),
      templateCapabilities: collectTemplateCapabilities({
        filters: {
          toSecretKeyedObject: input => ({
            [String(input).toUpperCase()]: 'public',
          }),
        },
      }),
    });
  });

  afterEach(() => {
    mockDir.clear();

    jest.resetAllMocks();
  });

  it('should throw an error if the action does not exist', async () => {
    const task = createMockTaskWithSpec({
      steps: [{ id: 'test', name: 'name', action: 'does-not-exist' }],
    });

    await expect(runner.execute(task)).rejects.toThrow(
      /Template action with ID 'does-not-exist' is not registered/,
    );
  });

  describe('validation', () => {
    it('should throw an error if the action has a schema and the input does not match', async () => {
      const task = createMockTaskWithSpec({
        steps: [{ id: 'test', name: 'name', action: 'jest-validated-action' }],
      });

      await expect(runner.execute(task)).rejects.toThrow(
        /Invalid input passed to action jest-validated-action, instance requires property "foo"/,
      );
    });

    it('should throw an error if the action has a zod schema and the input does not match', async () => {
      const task = createMockTaskWithSpec({
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

    it('should pass step info through', async () => {
      const task = createMockTaskWithSpec({
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

      expect(fakeActionHandler.mock.calls[0][0].step.id).toEqual('test');
      expect(fakeActionHandler.mock.calls[0][0].step.name).toEqual('name');
    });
  });

  describe('conditionals', () => {
    it('should execute steps conditionally', async () => {
      const task = createMockTaskWithSpec({
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
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBe('backstage');
    });

    it('should skips steps conditionally', async () => {
      const task = createMockTaskWithSpec({
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
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBeUndefined();
    });

    it('should skips steps using the negating equals operator', async () => {
      const task = createMockTaskWithSpec({
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
      });

      const { output } = await runner.execute(task);

      expect(output.result).toBeUndefined();
    });
    describe('should apply boolean step conditions', () => {
      it('executes when true', async () => {
        const task = createMockTaskWithSpec({
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
        });

        const { output } = await runner.execute(task);
        expect(output.result).toBe('backstage');
      });
      it('skips when false', async () => {
        const task = createMockTaskWithSpec({
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
        });

        const { output } = await runner.execute(task);
        expect(output.result).toBeUndefined();
      });
    });
  });

  describe('conditional output items', () => {
    it('should include output links without an if condition', async () => {
      const task = createMockTaskWithSpec({
        steps: [{ id: 'test', name: 'test', action: 'jest-mock-action' }],
        output: {
          links: [{ title: 'Always', url: 'https://example.com' }],
        },
      });

      const { output } = await runner.execute(task);
      expect(output.links).toEqual([
        { title: 'Always', url: 'https://example.com' },
      ]);
    });

    it('should filter out output links where if is false', async () => {
      const task = createMockTaskWithSpec({
        steps: [{ id: 'test', name: 'test', action: 'jest-mock-action' }],
        output: {
          links: [
            { title: 'Always', url: 'https://example.com' },
            { if: false, title: 'Hidden', url: 'https://hidden.com' },
          ],
        },
      });

      const { output } = await runner.execute(task);
      expect(output.links).toEqual([
        { title: 'Always', url: 'https://example.com' },
      ]);
    });

    it('should include output links where if is true', async () => {
      const task = createMockTaskWithSpec({
        steps: [{ id: 'test', name: 'test', action: 'jest-mock-action' }],
        output: {
          links: [{ if: true, title: 'Visible', url: 'https://visible.com' }],
        },
      });

      const { output } = await runner.execute(task);
      expect(output.links).toEqual([
        { title: 'Visible', url: 'https://visible.com' },
      ]);
    });

    it('should filter output links based on templated if condition', async () => {
      const task = createMockTaskWithSpec({
        steps: [{ id: 'test', name: 'test', action: 'output-action' }],
        output: {
          links: [
            {
              if: '${{ parameters.enableCI === "Yes" }}',
              title: 'CI',
              url: 'https://ci.example.com',
            },
            {
              if: '${{ parameters.enableCI === "Yes" }}',
              title: 'CI Docs',
              url: 'https://ci.example.com/docs',
            },
          ],
        },
        parameters: { enableCI: 'No' },
      });

      const { output } = await runner.execute(task);
      expect(output.links).toEqual([]);
    });

    it('should include output links when templated if condition is truthy', async () => {
      const task = createMockTaskWithSpec({
        steps: [{ id: 'test', name: 'test', action: 'output-action' }],
        output: {
          links: [
            {
              if: '${{ parameters.enableCI === "Yes" }}',
              title: 'CI',
              url: 'https://ci.example.com',
            },
          ],
        },
        parameters: { enableCI: 'Yes' },
      });

      const { output } = await runner.execute(task);
      expect(output.links).toEqual([
        { title: 'CI', url: 'https://ci.example.com' },
      ]);
    });

    it('should filter output text items based on if condition', async () => {
      const task = createMockTaskWithSpec({
        steps: [{ id: 'test', name: 'test', action: 'jest-mock-action' }],
        output: {
          text: [
            { title: 'Always', content: 'visible' },
            { if: false, title: 'Hidden', content: 'hidden' },
            {
              if: '${{ parameters.show }}',
              title: 'Conditional',
              content: 'conditional',
            },
          ],
        },
        parameters: { show: true },
      });

      const { output } = await runner.execute(task);
      expect(output.text).toEqual([
        { title: 'Always', content: 'visible' },
        { title: 'Conditional', content: 'conditional' },
      ]);
    });

    it('should strip the if field from output items that pass the condition', async () => {
      const task = createMockTaskWithSpec({
        steps: [{ id: 'test', name: 'test', action: 'jest-mock-action' }],
        output: {
          links: [{ if: true, title: 'Link', url: 'https://example.com' }],
          text: [{ if: true, title: 'Text', content: 'content' }],
        },
      });

      const { output } = await runner.execute(task);
      expect((output.links as JsonArray)[0]).not.toHaveProperty('if');
      expect((output.text as JsonArray)[0]).not.toHaveProperty('if');
    });
  });

  describe('templating', () => {
    const createDeferred = () => {
      let resolve!: () => void;
      const promise = new Promise<void>(promiseResolve => {
        resolve = promiseResolve;
      });
      return { promise, resolve };
    };

    const registerCheckpointAction = (
      id: string,
      fn: () => Promise<string>,
      afterCheckpoint?: () => void,
    ) => {
      actionRegistry.register(
        createTemplateAction({
          id,
          handler: async ctx => {
            await ctx.checkpoint({ key: 'key', fn });
            afterCheckpoint?.();
          },
        }),
      );
    };

    const createCheckpointTask = (
      action: string,
      updateCheckpoint: jest.Mock,
      serializeWorkspace?: jest.Mock,
    ) => ({
      ...createMockTaskWithSpec({
        steps: [{ id: 'test', name: 'name', action }],
      }),
      updateCheckpoint,
      ...(serializeWorkspace && { serializeWorkspace }),
    });

    it('should template the input to an action', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-mock-action',
            input: {
              foo: '${{parameters.input | lower }}',
              region: '${{environment.parameters.region}}',
              identifier:
                '${{ parameters.identifier | replace(r/^([a-z]+)([0-9]+)$/, "$2-$1") }}',
            },
          },
        ],
        parameters: {
          input: 'BACKSTAGE',
          identifier: 'backstage123',
        },
      });

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            foo: 'backstage',
            region: 'us-east-1',
            identifier: '123-backstage',
          },
        }),
      );
    });

    it('should not try and parse something that is not parsable', async () => {
      jest.spyOn(logger, 'error');
      const task = createMockTaskWithSpec({
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
        parameters: {
          input: 'BACKSTAGE',
        },
      });

      await runner.execute(task);

      expect(logger.error).not.toHaveBeenCalled();
    });

    it('should preserve native input value types', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-mock-action',
            input: {
              number: '${{parameters.number}}',
              string: '${{parameters.string}}',
              boolean: '${{parameters.boolean}}',
              nullValue: '${{parameters.nullValue}}',
              array: '${{parameters.array}}',
            },
          },
        ],
        parameters: {
          number: 0,
          string: '1',
          boolean: true,
          nullValue: null,
          array: ['one', 'two'],
        },
      });

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            number: 0,
            string: '1',
            boolean: true,
            nullValue: null,
            array: ['one', 'two'],
          },
        }),
      );
    });

    it('should template complex values into the action', async () => {
      const task = createMockTaskWithSpec({
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
        parameters: {
          complex: { bar: 'BACKSTAGE' },
        },
      });

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({ input: { foo: { bar: 'BACKSTAGE' } } }),
      );
    });

    it('should preserve immutable structured values from Nunjitsu', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-mock-action',
            input: {
              object: '${{ parameters.object }}',
              array: '${{ parameters.array }}',
            },
          },
        ],
        parameters: {
          object: { items: [{ name: 'one' }] },
          array: [{ name: 'two' }],
        },
      });

      await runner.execute(task);

      const { input } = fakeActionHandler.mock.calls[0][0];
      expect(input).toEqual({
        object: { items: [{ name: 'one' }] },
        array: [{ name: 'two' }],
      });
      expect(Object.getPrototypeOf(input.object)).toBeNull();
      expect(Object.isFrozen(input.object)).toBe(true);
      expect(Object.isFrozen(input.object.items)).toBe(true);
      expect(Object.getPrototypeOf(input.object.items[0])).toBeNull();
      expect(Object.isFrozen(input.array)).toBe(true);
      expect(Object.getPrototypeOf(input.array[0])).toBeNull();
    });

    it('supports really complex structures', async () => {
      const task = createMockTaskWithSpec({
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

    it('waits for successful checkpoint state to be persisted', async () => {
      let actionContinued = false;
      registerCheckpointAction(
        'checkpoint-persistence-action',
        async () => 'value',
        () => {
          actionContinued = true;
        },
      );

      const updateStarted = createDeferred();
      const pendingUpdate = createDeferred();
      const task = createCheckpointTask(
        'checkpoint-persistence-action',
        jest.fn(() => {
          updateStarted.resolve();
          return pendingUpdate.promise;
        }),
      );

      const execution = runner.execute(task);
      await updateStarted.promise;
      await new Promise(resolve => setImmediate(resolve));

      expect(actionContinued).toBe(false);

      pendingUpdate.resolve();
      await execution;
      expect(actionContinued).toBe(true);
    });

    it('does not record callback failure when successful persistence fails', async () => {
      registerCheckpointAction(
        'checkpoint-persistence-rejection-action',
        async () => 'value',
      );

      const persistenceError = new Error('checkpoint persistence failed');
      const updateCheckpoint = jest.fn().mockRejectedValue(persistenceError);
      const task = createCheckpointTask(
        'checkpoint-persistence-rejection-action',
        updateCheckpoint,
      );

      await expect(runner.execute(task)).rejects.toMatchObject({
        name: 'Error',
        message: 'checkpoint persistence failed',
      });
      expect(updateCheckpoint).toHaveBeenCalledTimes(1);
      expect(updateCheckpoint).toHaveBeenCalledWith({
        key: 'v1.task.checkpoint.test.key',
        status: 'success',
        value: 'value',
      });
    });

    it('restores successful checkpoints with falsy values', async () => {
      const checkpointCallback = jest.fn(async () => 'rerun');
      const restoredValues: unknown[] = [];
      actionRegistry.register(
        createTemplateAction({
          id: 'falsy-checkpoint-action',
          handler: async ctx => {
            for (const key of ['false', 'zero', 'empty']) {
              restoredValues.push(
                await ctx.checkpoint({ key, fn: checkpointCallback }),
              );
            }
          },
        }),
      );

      const updateCheckpoint = jest.fn();
      const task = {
        ...createMockTaskWithSpec({
          steps: [
            { id: 'test', name: 'name', action: 'falsy-checkpoint-action' },
          ],
        }),
        getTaskState: async () => ({
          state: {
            checkpoints: {
              'v1.task.checkpoint.test.false': {
                status: 'success',
                value: false,
              },
              'v1.task.checkpoint.test.zero': {
                status: 'success',
                value: 0,
              },
              'v1.task.checkpoint.test.empty': {
                status: 'success',
                value: '',
              },
            },
          },
        }),
        updateCheckpoint,
      };

      await runner.execute(task);

      expect(restoredValues).toEqual([false, 0, '']);
      expect(checkpointCallback).not.toHaveBeenCalled();
      expect(updateCheckpoint).not.toHaveBeenCalled();
    });

    it('waits for failed checkpoint state to be persisted', async () => {
      const checkpointError = new Error('checkpoint failed');
      registerCheckpointAction(
        'failed-checkpoint-persistence-action',
        async () => {
          throw checkpointError;
        },
      );

      const updateStarted = createDeferred();
      const pendingUpdate = createDeferred();
      const serializeWorkspace = jest.fn();
      const task = createCheckpointTask(
        'failed-checkpoint-persistence-action',
        jest.fn(() => {
          updateStarted.resolve();
          return pendingUpdate.promise;
        }),
        serializeWorkspace,
      );

      const execution = runner.execute(task).then(
        () => ({ error: undefined }),
        error => ({ error }),
      );

      await updateStarted.promise;
      expect(serializeWorkspace).not.toHaveBeenCalled();

      pendingUpdate.resolve();
      await expect(execution).resolves.toEqual({ error: checkpointError });
      expect(serializeWorkspace).toHaveBeenCalled();
    });

    it('redacts secrets from persisted checkpoint failures', async () => {
      actionRegistry.register(
        createTemplateAction({
          id: 'failed-secret-checkpoint-action',
          handler: async ctx => {
            await ctx.checkpoint({
              key: 'key',
              fn: async () => {
                throw new Error(
                  `checkpoint failed ${ctx.input.raw} ${ctx.input.transformed}`,
                );
              },
            });
          },
        }),
      );

      const secret = 'checkpoint-secret';
      const transformedSecret = secret.toUpperCase();
      const updateCheckpoint = jest.fn();
      const task = {
        ...createMockTaskWithSpec(
          {
            steps: [
              {
                id: 'test',
                name: 'name',
                action: 'failed-secret-checkpoint-action',
                input: {
                  raw: '${{ secrets.secret }}',
                  transformed: '${{ secrets.secret | upper }}',
                },
              },
            ],
          },
          { secret },
        ),
        updateCheckpoint,
      };

      await expect(runner.execute(task)).rejects.toThrow('checkpoint failed');
      expect(updateCheckpoint).toHaveBeenCalledTimes(1);
      const checkpoint = updateCheckpoint.mock.calls[0][0];
      expect(checkpoint).toMatchObject({
        key: 'v1.task.checkpoint.test.key',
        status: 'failed',
      });
      expect(checkpoint.reason).toContain('checkpoint failed');
      expect(checkpoint.reason).toContain('***');
      expect(checkpoint.reason).not.toContain(secret);
      expect(checkpoint.reason).not.toContain(transformedSecret);
    });

    it('reports checkpoint and persistence failure without attaching nested errors', async () => {
      const checkpointError = new Error('checkpoint failed');
      registerCheckpointAction(
        'failed-checkpoint-persistence-rejection-action',
        async () => {
          throw checkpointError;
        },
      );

      const persistenceError = new Error('checkpoint persistence failed');
      const task = createCheckpointTask(
        'failed-checkpoint-persistence-rejection-action',
        jest.fn().mockRejectedValue(persistenceError),
      );

      const error = await runner.execute(task).catch(cause => cause);
      expect(error).toMatchObject({
        name: 'AggregateError',
        message:
          "Checkpoint 'key' failed and its failure state could not be persisted",
      });
      expect(error).not.toBeInstanceOf(AggregateError);
      expect(error).not.toHaveProperty('errors');
    });

    it('should template the output from simple actions', async () => {
      const task = createMockTaskWithSpec({
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
      });

      const { output } = await runner.execute(task);

      expect(output.foo).toEqual('BACKSTAGE');
    });

    it('should include task ID in the templated context', async () => {
      const task = createMockTaskWithSpec({
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
    it('should redact secrets from action errors', async () => {
      actionRegistry.register({
        id: 'fail-with-secret',
        description: 'Mock action for testing',
        handler: async ctx => {
          const error = new Error(`Failed to read ${ctx.input.url}`);
          error.name = `ReadError:${ctx.input.url}`;
          throw Object.freeze(error);
        },
      });

      const secret = 'my-secret-value';
      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'fail-with-secret',
              input: {
                url: 'https://${{ secrets.secret }}@example.com',
              },
            },
          ],
        },
        { secret },
      );

      let thrownError: Error | undefined;
      try {
        await runner.execute(task);
      } catch (error) {
        thrownError = error as Error;
      }

      expect(thrownError?.name).toBe('ReadError:***');
      expect(thrownError?.message).toBe('Failed to read ***');
      const failedLog = fakeTaskLog.mock.calls.find(
        ([, metadata]) => metadata?.status === 'failed',
      );
      expect(stripAnsi(failedLog?.[0])).toContain(
        'ReadError:***: Failed to read ***',
      );
      expect(stripAnsi(failedLog?.[0])).not.toContain(secret);
    });

    it('should safely handle action errors with throwing getters', async () => {
      actionRegistry.register({
        id: 'fail-with-throwing-getter',
        description: 'Mock action for testing',
        handler: async ctx => {
          const error = new Error('Action failed');
          Object.defineProperty(error, 'name', {
            get(): string {
              throw new Error(`Failed to read ${ctx.input.url}`);
            },
          });
          throw error;
        },
      });

      const secret = 'my-secret-value';
      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'fail-with-throwing-getter',
              input: {
                url: 'https://${{ secrets.secret }}@example.com',
              },
            },
          ],
        },
        { secret },
      );

      let thrownError: Error | undefined;
      try {
        await runner.execute(task);
      } catch (error) {
        thrownError = error as Error;
      }

      expect(thrownError).toMatchObject({
        name: 'Error',
        message: 'Task failed',
      });
      const failedLog = fakeTaskLog.mock.calls.find(
        ([, metadata]) => metadata?.status === 'failed',
      );
      expect(stripAnsi(failedLog?.[0])).toContain('Error: Task failed');
      expect(JSON.stringify(fakeTaskLog.mock.calls)).not.toContain(secret);
    });

    it('should preserve non-secret action error details', async () => {
      actionRegistry.register({
        id: 'fail-without-secret',
        description: 'Mock action for testing',
        handler: async ctx => {
          throw new Error(`Failed to read ${ctx.input.url}`);
        },
      });

      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'fail-without-secret',
            input: {
              url: 'https://example.com',
            },
          },
        ],
      });

      let thrownError: Error | undefined;
      try {
        await runner.execute(task);
      } catch (error) {
        thrownError = error as Error;
      }

      expect(thrownError?.message).toBe('Failed to read https://example.com');
      const failedLog = fakeTaskLog.mock.calls.find(
        ([, metadata]) => metadata?.status === 'failed',
      );
      expect(stripAnsi(failedLog?.[0])).toContain(
        'Error: Failed to read https://example.com',
      );
    });

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
    it('should redact task and environment secrets that share a key', async () => {
      actionRegistry.register({
        id: 'log-task-secret',
        description: 'Mock action for testing',
        handler: async ctx => {
          ctx.logger.info(ctx.secrets?.AWS_ACCESS_KEY ?? 'missing');
        },
      });

      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-task-secret',
            },
          ],
        },
        { AWS_ACCESS_KEY: 'task-secret-value' },
      );

      await runner.execute(task);

      expectTaskLog('info: ***');
    });

    it('should redact secrets transformed through each', async () => {
      actionRegistry.register({
        id: 'log-each-secret',
        description: 'Mock action for testing',
        handler: async ctx => {
          ctx.logger.info(ctx.input.secret);
        },
      });

      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              each: ['${{ secrets.token | upper }}'],
              action: 'log-each-secret',
              input: {
                secret: '${{ each.value | replace("A", "Z") }}',
              },
            },
          ],
        },
        { token: 'task-a-secret' },
      );

      await runner.execute(task);

      expectTaskLog('info: ***');
      expect(JSON.stringify(fakeTaskLog.mock.calls)).not.toContain(
        'TASK-A-SECRET',
      );
      expect(JSON.stringify(fakeTaskLog.mock.calls)).not.toContain(
        'TZSK-Z-SECRET',
      );
    });

    it('should redact transformed secrets in skipped each iterations', async () => {
      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              each: ['${{ secrets.token | upper }}'],
              if: '${{ false }}',
              action: 'jest-mock-action',
            },
          ],
        },
        { token: 'skip-secret' },
      );

      await runner.execute(task);

      expectTaskLog('info: Skipping step each: {"key":"0","value":"***"}');
      expect(JSON.stringify(fakeTaskLog.mock.calls)).not.toContain(
        'SKIP-SECRET',
      );
    });

    it('should redact secret-derived each keys', async () => {
      runner = new NunjucksWorkflowRunner({
        actionRegistry,
        integrations,
        workingDirectory: mockDir.path,
        logger,
        permissions: mockedPermissionApi,
        config: new ConfigReader({}),
        metrics: metricsServiceMock.mock(),
        templateCapabilities: {
          filters: {
            keyedBy: value => ({ [String(value).toUpperCase()]: 'value' }),
          },
        },
      });

      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              each: '${{ secrets.token | keyedBy }}',
              action: 'jest-mock-action',
            },
          ],
        },
        { token: 'key-secret' },
      );

      await runner.execute(task);

      expectTaskLog('info: Running step each: {"key":"***","value":"value"}');
      expect(JSON.stringify(fakeTaskLog.mock.calls)).not.toContain(
        'KEY-SECRET',
      );
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redact secrets that are passed in the environment', async () => {
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
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-secret',
              input: {
                secret: '${{ environment.secrets.AWS_ACCESS_KEY }}',
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

    // eslint-disable-next-line jest/expect-expect
    it('should redact secrets that have been transformed with a replace filter', async () => {
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
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-secret',
              input: {
                secret: "${{ secrets.backstageToken | replace('.', '_DOT_') }}",
              },
            },
          ],
        },
        { backstageToken: 'header.payload.signature' },
      );

      await runner.execute(task);

      expectTaskLog('info: ***');
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redact secrets transformed with the upper filter', async () => {
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
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-secret',
              input: {
                secret: '${{ secrets.mySecret | upper }}',
              },
            },
          ],
        },
        { mySecret: 'super-secret-token' },
      );

      await runner.execute(task);

      expectTaskLog('info: ***');
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redact secrets embedded in a larger string with other text', async () => {
      actionRegistry.register({
        id: 'log-secret',
        description: 'Mock action for testing',
        supportsDryRun: true,
        handler: async ctx => {
          ctx.logger.info(ctx.input.message);
        },
        schema: {
          input: {
            type: 'object',
            required: ['message'],
            properties: {
              message: {
                type: 'string',
              },
            },
          },
        },
      });

      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-secret',
              input: {
                message:
                  "scaffold-init:${{ secrets.backstageToken | replace('.', '_DOT_') }}",
              },
            },
          ],
        },
        { backstageToken: 'header.payload.signature' },
      );

      await runner.execute(task);

      expectTaskLog('info: ***');
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redact environment secrets that have been transformed', async () => {
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
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-secret',
              input: {
                secret: '${{ environment.secrets.AWS_ACCESS_KEY | upper }}',
              },
            },
          ],
        },
        {},
      );

      await runner.execute(task);

      expectTaskLog('info: ***');
    });

    it('should not redact non-secret values in rendered input', async () => {
      actionRegistry.register({
        id: 'log-secret',
        description: 'Mock action for testing',
        supportsDryRun: true,
        handler: async ctx => {
          ctx.logger.info(ctx.input.name);
        },
        schema: {
          input: {
            type: 'object',
            required: ['name'],
            properties: {
              name: {
                type: 'string',
              },
            },
          },
        },
      });

      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'log-secret',
            input: {
              name: '${{ parameters.serviceName }}',
            },
          },
        ],
        parameters: { serviceName: 'my-service' },
      });

      await runner.execute(task);

      expectTaskLog('info: my-service');
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redact secrets in deeply nested input objects', async () => {
      actionRegistry.register({
        id: 'log-secret',
        description: 'Mock action for testing',
        supportsDryRun: true,
        handler: async ctx => {
          ctx.logger.info(ctx.input.nested.deep.secret);
        },
        schema: {
          input: {
            type: 'object',
            required: ['nested'],
            properties: {
              nested: {
                type: 'object',
                properties: {
                  deep: {
                    type: 'object',
                    properties: {
                      secret: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-secret',
              input: {
                nested: {
                  deep: {
                    secret: "${{ secrets.token | replace('.', '-') }}",
                  },
                },
              },
            },
          ],
        },
        { token: 'aaa.bbb.ccc' },
      );

      await runner.execute(task);

      expectTaskLog('info: ***');
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redact secrets in arrays within input', async () => {
      actionRegistry.register({
        id: 'log-secret',
        description: 'Mock action for testing',
        supportsDryRun: true,
        handler: async ctx => {
          ctx.logger.info(ctx.input.items[0]);
        },
        schema: {
          input: {
            type: 'object',
            required: ['items'],
            properties: {
              items: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
      });

      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-secret',
              input: {
                items: ['${{ secrets.token | upper }}', 'not-a-secret'],
              },
            },
          ],
        },
        { token: 'my-secret' },
      );

      await runner.execute(task);

      expectTaskLog('info: ***');
    });

    // eslint-disable-next-line jest/expect-expect
    it('should redact multiple different transformed secrets in the same step', async () => {
      actionRegistry.register({
        id: 'log-secret',
        description: 'Mock action for testing',
        supportsDryRun: true,
        handler: async ctx => {
          ctx.logger.info(`${ctx.input.a} ${ctx.input.b}`);
        },
        schema: {
          input: {
            type: 'object',
            required: ['a', 'b'],
            properties: {
              a: { type: 'string' },
              b: { type: 'string' },
            },
          },
        },
      });

      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-secret',
              input: {
                a: '${{ secrets.s1 | upper }}',
                b: "${{ secrets.s2 | replace('.', '_') }}",
              },
            },
          ],
        },
        { s1: 'first-secret', s2: 'second.secret' },
      );

      await runner.execute(task);

      expectTaskLog('info: *** ***');
    });

    it('should still pass the correct transformed value to the action input', async () => {
      actionRegistry.register({
        id: 'log-secret',
        description: 'Mock action for testing',
        supportsDryRun: true,
        handler: fakeActionHandler,
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
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'log-secret',
              input: {
                secret: "${{ secrets.backstageToken | replace('.', '_DOT_') }}",
              },
            },
          ],
        },
        { backstageToken: 'header.payload.signature' },
      );

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { secret: 'header_DOT_payload_DOT_signature' },
        }),
      );
    });
  });

  describe('each', () => {
    it('should run a step repeatedly - flat values', async () => {
      const colors = ['blue', 'green', 'red'];
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            each: '${{parameters.colors}}',
            action: 'jest-mock-action',
            input: { color: '${{each.value}}' },
          },
        ],
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

    it('should run a step repeatedly - flat values with secrets', async () => {
      const secrets = {
        s1: 'secret-value1',
        s2: 'secret-value2',
        s3: 'secret-value3',
      };
      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              each: [
                '${{ secrets.s1 }}',
                '${{ secrets.s2 }}',
                '${{ secrets.s3 }}',
              ],
              action: 'jest-mock-action',
              input: { secret: '${{each.value}}' },
            },
          ],
        },
        secrets,
      );
      await runner.execute(task);

      Object.values(secrets).forEach((secret, idx) => {
        expectTaskLog(
          `info: Running step each: {"key":"${idx}","value":"***"}`,
        );
        expect(fakeActionHandler).toHaveBeenCalledWith(
          expect.objectContaining({ input: { secret } }),
        );
      });
    });

    it('should redact transformed secrets used in each values', async () => {
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
              secret: { type: 'string' },
            },
          },
        },
      });

      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            each: ['${{ environment.secrets.AWS_ACCESS_KEY | upper }}'],
            action: 'log-secret',
            input: { secret: '${{ each.value }}' },
          },
          {
            id: 'skipped',
            name: 'skipped',
            each: ['${{ environment.secrets.AWS_ACCESS_KEY | upper }}'],
            if: '${{ false }}',
            action: 'log-secret',
            input: { secret: '${{ each.value }}' },
          },
          {
            id: 'transformed-again',
            name: 'transformed again',
            each: ['${{ environment.secrets.AWS_ACCESS_KEY | upper }}'],
            action: 'log-secret',
            input: {
              secret: '${{ each.value | replace("SECRET", "CREDENTIAL") }}',
            },
          },
          {
            id: 'mixed-values',
            name: 'mixed values',
            each: [
              '${{ environment.secrets.AWS_ACCESS_KEY | replace("-", "_") }}',
              'public-iteration',
            ],
            action: 'log-secret',
            input: { secret: '${{ each.value }}' },
          },
          {
            id: 'secret-key',
            name: 'secret key',
            each: '${{ environment.secrets.AWS_ACCESS_KEY | toSecretKeyedObject }}',
            action: 'log-secret',
            input: { secret: '${{ each.key }}' },
          },
          {
            id: 'skipped-secret-key',
            name: 'skipped secret key',
            each: '${{ environment.secrets.AWS_ACCESS_KEY | toSecretKeyedObject }}',
            if: '${{ false }}',
            action: 'log-secret',
            input: { secret: '${{ each.key }}' },
          },
        ],
      });

      await runner.execute(task);

      expectTaskLog('info: Running step each: {"key":"0","value":"***"}');
      expectTaskLog('info: Skipping step each: {"key":"0","value":"***"}');
      expectTaskLog(
        'info: Running step each: {"key":"1","value":"public-iteration"}',
      );
      expectTaskLog('info: public-iteration');
      expectTaskLog('info: Running step each: {"key":"***","value":"public"}');
      expectTaskLog('info: Skipping step each: {"key":"***","value":"public"}');
      expectTaskLog('info: ***');
      expect(
        fakeTaskLog.mock.calls.map(args => stripAnsi(args[0])).join('\n'),
      ).not.toContain('TEST-SECRET-VALUE');
      expect(
        fakeTaskLog.mock.calls.map(args => stripAnsi(args[0])).join('\n'),
      ).not.toContain('TEST-CREDENTIAL-VALUE');
      expect(
        fakeTaskLog.mock.calls.map(args => stripAnsi(args[0])).join('\n'),
      ).not.toContain('test_secret_value');
    });

    it('should run a step repeatedly - object list', async () => {
      const task = createMockTaskWithSpec({
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

    it('should run a step repeatedly - object list with secrets', async () => {
      const secrets = {
        s1: 'secret-value1',
        s2: 'secret-value2',
      };
      const names = ['Service1', 'Service2'];
      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              each: [
                { name: names[0], token: '${{ secrets.s1 }}' },
                { name: names[1], token: '${{ secrets.s2 }}' },
              ],
              action: 'jest-mock-action',
              input: {
                name: '${{each.value.name}}',
                token: '${{each.value.token}}',
              },
            },
          ],
        },
        secrets,
      );
      await runner.execute(task);

      Object.values(secrets).forEach((secret, idx) => {
        expectTaskLog(
          `info: Running step each: {"key":"${idx}","value":"[object Object]"}`,
        );
        expect(fakeActionHandler).toHaveBeenCalledWith(
          expect.objectContaining({
            input: { name: names[idx], token: secret },
          }),
        );
      });
    });

    it('should run a step repeatedly - object', async () => {
      const settings = {
        color: 'blue',
        transparent: 'yes',
      };
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            each: '${{parameters.settings}}',
            action: 'jest-mock-action',
            input: { key: '${{each.key}}', value: '${{each.value}}' },
          },
        ],
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

    it('should run a step repeatedly - only iterations where the "if" condition is truthy', async () => {
      const truthyConditions = [true, 1, 'a', {}];
      const falsyConditions = [false, 0, null, ''];
      const conditions = [...truthyConditions, ...falsyConditions];
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            each: '${{parameters.conditions}}',
            action: 'jest-mock-action',
            input: { condition: '${{each.value}}' },
            if: '${{each.value}}',
          },
        ],
        parameters: {
          conditions,
        },
      });
      await runner.execute(task);

      truthyConditions.forEach((condition, idx) => {
        expectTaskLog(
          `info: Running step each: {"key":"${idx}","value":"${condition}"}`,
        );
        expect(fakeActionHandler).toHaveBeenCalledWith(
          expect.objectContaining({ input: { condition } }),
        );
      });

      falsyConditions.forEach((condition, idx) => {
        expectTaskLog(
          `info: Skipping step each: {"key":"${
            idx + truthyConditions.length
          }","value":"${condition}"}`,
        );
        expect(fakeActionHandler).not.toHaveBeenCalledWith(
          expect.objectContaining({ input: { condition } }),
        );
      });

      expect(fakeActionHandler).toHaveBeenCalledTimes(truthyConditions.length);
    });

    it('should run a step repeatedly with validation of single-expression value', async () => {
      const numbers = [5, 7, 9];
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            each: '${{parameters.numbers}}',
            action: 'jest-validated-action',
            input: { foo: '${{each.value}}' },
          },
        ],
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
        steps: [
          {
            id: 'test',
            name: 'name',
            each: '${{parameters.data}}',
            action: 'jest-validated-action',
            input: { foo: '${{each.value.foo}}' },
          },
        ],
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

    it('should reject non-collection each values', async () => {
      for (const value of ['single', '', 1, 0, true, false, null]) {
        const task = createMockTaskWithSpec({
          steps: [
            {
              id: 'test',
              name: 'name',
              each: '${{ parameters.data }}',
              action: 'jest-mock-action',
            },
          ],
          parameters: { data: value },
        });

        await expect(runner.execute(task)).rejects.toThrow(
          'must resolve to an array or object',
        );
      }

      expect(fakeActionHandler).not.toHaveBeenCalled();
    });

    it('should reject literal falsy each values', async () => {
      for (const each of [0, false]) {
        const task = createMockTaskWithSpec({
          steps: [
            {
              id: 'test',
              name: 'name',
              // Deliberately bypass the static constraint to test malformed input at runtime
              each: each as unknown as string,
              action: 'jest-mock-action',
            },
          ],
        });

        await expect(runner.execute(task)).rejects.toThrow(
          'must resolve to an array or object',
        );
      }

      expect(fakeActionHandler).not.toHaveBeenCalled();
    });

    it('should validate each parameter renders to a valid value', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            each: '${{parameters.data}}',
            action: 'jest-validated-action',
            input: { foo: '${{each.value}}' },
          },
        ],
      });
      await expect(runner.execute(task)).rejects.toThrow(
        'Invalid value on action jest-validated-action.each parameter, "${{parameters.data}}" cannot be resolved to a value',
      );
      expect(fakeActionHandler).not.toHaveBeenCalled();
    });
  });

  describe('secrets', () => {
    it('should pass through the secrets to the context', async () => {
      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-mock-action',
              input: {},
            },
          ],
        },
        { foo: 'bar' },
      );

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          secrets: { foo: 'bar' },
        }),
      );
    });

    it('should be able to template secrets into the input of an action', async () => {
      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-mock-action',
              input: {
                b: '${{ secrets.foo }}',
                aws_key: '${{ environment.secrets.AWS_ACCESS_KEY }}',
              },
            },
          ],
        },
        { foo: 'bar' },
      );

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { b: 'bar', aws_key: 'test-secret-value' },
        }),
      );
    });

    it('should separate task secrets from environment secrets', async () => {
      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-mock-action',
              input: {
                b: '${{ secrets.foo }}',
                aws_key: '${{ secrets.AWS_ACCESS_KEY }}',
                env_aws_key: '${{ environment.secrets.AWS_ACCESS_KEY }}',
              },
            },
          ],
        },
        { foo: 'bar', AWS_ACCESS_KEY: 'another-value-from-task' },
      );

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            b: 'bar',
            aws_key: 'another-value-from-task',
            env_aws_key: 'test-secret-value',
          },
        }),
      );
    });

    it('does not allow templating of secrets as an output', async () => {
      const task = createMockTaskWithSpec(
        {
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
            c: '${{ environment.secrets.AWS_ACCESS_KEY }}',
          },
        },
        { foo: 'bar' },
      );

      const executedTask = await runner.execute(task);

      expect(executedTask.output.b).toBeUndefined();
      expect(executedTask.output.c).toBeUndefined();
    });
  });

  describe('user', () => {
    it('allows access to the user entity at the templating level', async () => {
      const task = createMockTaskWithSpec({
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
          templateInfo: {
            entityRef: 'dryRun-Entity',
            entity: { metadata: { name: 'test-template' } },
          },
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

    it('should have step info in action context during dry run', async () => {
      const task = createMockTaskWithSpec(
        {
          templateInfo: {
            entityRef: 'dryRun-Entity',
            entity: { metadata: { name: 'test-template' } },
          },
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
      expect(fakeActionHandler.mock.calls[0][0].step.id).toEqual('test');
      expect(fakeActionHandler.mock.calls[0][0].step.name).toEqual('name');
    });

    it('should strip environment secrets but pass user-supplied task secrets to action inputs during dry-run', async () => {
      const dryRunHandler = jest.fn();
      actionRegistry.register(
        createTemplateAction({
          id: 'jest-dryrun-action',
          description: 'Mock action with dry-run support',
          supportsDryRun: true,
          handler: dryRunHandler,
        }),
      );

      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-dryrun-action',
              input: {
                envSecret: '${{ environment.secrets.AWS_ACCESS_KEY }}',
                taskSecret: '${{ secrets.mySecret }}',
              },
            },
          ],
        },
        { mySecret: 'task-secret-value', backstageToken: token },
        true,
      );

      await runner.execute(task);

      const handlerCall = dryRunHandler.mock.calls[0][0];
      expect(handlerCall.input.envSecret).toBeUndefined();
      expect(handlerCall.input.taskSecret).toEqual('task-secret-value');
    });
  });

  describe('permissions', () => {
    it('should throw an error if an actions is not authorized', async () => {
      mockedPermissionApi.authorizeConditional.mockResolvedValueOnce([
        { result: AuthorizeResult.DENY },
      ]);

      const task = createMockTaskWithSpec({
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

    it('does not expose rendered secrets when action authorization is denied', async () => {
      mockedPermissionApi.authorizeConditional.mockResolvedValueOnce([
        { result: AuthorizeResult.DENY },
      ]);

      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-mock-action',
              input: {
                token: '${{ secrets.token }}',
              },
            },
          ],
        },
        { token: 'sensitive-token-value' },
      );

      let thrownError: Error | undefined;
      try {
        await runner.execute(task);
      } catch (error) {
        thrownError = error as Error;
      }

      expect(thrownError).toBeInstanceOf(Error);
      expect(thrownError?.message).toContain(
        'Unauthorized action: jest-mock-action',
      );
      expect(thrownError?.message).not.toContain('sensitive-token-value');
      expect(
        fakeTaskLog.mock.calls.map(([message]) => message).join('\n'),
      ).not.toContain('sensitive-token-value');
      expect(fakeActionHandler).not.toHaveBeenCalled();
    });

    it('does not expose environment secrets when action authorization is denied', async () => {
      mockedPermissionApi.authorizeConditional.mockResolvedValueOnce([
        { result: AuthorizeResult.DENY },
      ]);

      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'name',
            action: 'jest-mock-action',
            input: {
              token: '${{ environment.secrets.AWS_ACCESS_KEY }}',
            },
          },
        ],
      });

      let thrownError: Error | undefined;
      try {
        await runner.execute(task);
      } catch (error) {
        thrownError = error as Error;
      }

      expect(thrownError).toBeInstanceOf(Error);
      expect(thrownError?.message).toContain(
        'Unauthorized action: jest-mock-action',
      );
      expect(thrownError?.message).not.toContain('test-secret-value');
      expect(JSON.stringify(fakeTaskLog.mock.calls)).not.toContain(
        'test-secret-value',
      );
      expect(fakeActionHandler).not.toHaveBeenCalled();
    });

    it('does not expose secret-derived each keys when action authorization is denied', async () => {
      mockedPermissionApi.authorizeConditional.mockResolvedValueOnce([
        { result: AuthorizeResult.DENY },
      ]);

      const worker = await TaskWorker.create({
        taskBroker: {} as TaskBroker,
        actionRegistry,
        integrations,
        workingDirectory: mockDir.path,
        logger,
        permissions: mockedPermissionApi,
        metrics: metricsServiceMock.mock(),
        additionalTemplateFilters: {
          keyedObject(input) {
            return typeof input === 'string' ? { [input]: 'value' } : {};
          },
        },
      });
      const complete = jest.fn().mockResolvedValue(undefined);
      const task = {
        ...createMockTaskWithSpec(
          {
            steps: [
              {
                id: 'test',
                name: 'name',
                action: 'jest-mock-action',
                each: '${{ secrets.iterationKey | keyedObject }}',
              },
            ],
          },
          { iterationKey: 'sensitive-iteration-key' },
        ),
        complete,
      };

      await worker.runOneTask(task);

      expect(JSON.stringify(fakeTaskLog.mock.calls)).not.toContain(
        'sensitive-iteration-key',
      );
      expect(JSON.stringify(complete.mock.calls)).not.toContain(
        'sensitive-iteration-key',
      );
      expect(fakeTaskLog).toHaveBeenCalledWith(
        expect.stringContaining('Unauthorized action: jest-mock-action'),
        { stepId: 'test', status: 'failed' },
      );
      expect(complete).toHaveBeenCalledWith('failed', {
        error: {
          name: 'NotAllowedError',
          message:
            'Unauthorized action: jest-mock-action. The action is not allowed.',
        },
      });
      expect(fakeActionHandler).not.toHaveBeenCalled();
    });

    it('passes rendered secrets to authorized action inputs', async () => {
      const task = createMockTaskWithSpec(
        {
          steps: [
            {
              id: 'test',
              name: 'name',
              action: 'jest-mock-action',
              input: {
                token: '${{ secrets.token }}',
              },
            },
          ],
        },
        { token: 'sensitive-token-value' },
      );

      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { token: 'sensitive-token-value' },
        }),
      );
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
        'Unauthorized action: jest-validated-action. The action is not allowed.',
      );
      expect(fakeActionHandler).toHaveBeenCalled();
      expect(mockedPermissionApi.authorizeConditional).toHaveBeenCalledTimes(1);
    });

    it.each([
      ['path', 'example/team', false],
      ['path', 'ExAmPlE/TeAm', false],
      ['path', 42, false],
      ['path', '42', false],
      ['path', 'example/other', true],
      ['[path]', 'ExAmPlE/TeAm', false],
      ['[path]', 42, false],
      ['["path"]', 'ExAmPlE/TeAm', false],
      ['["path"]', '42', false],
      ["['path']", 'ExAmPlE/TeAm', false],
      ["['path']", 42, false],
      ['path', 'ExAmPlE/TeAm', false, 'custom:gitlab:group:access'],
      ['path', 42, false, 'custom:gitlab:group:access'],
      ['path', 'ExAmPlE/TeAm', false, 'github:group:access'],
      ['path', 42, false, 'github:group:access'],
      ['path', 'ExAmPlE/TeAm', false, 'bitbucketCloud:group:access'],
      ['path', '42', false, 'bitbucketCloud:group:access'],
      ['path', 'ExAmPlE/TeAm', true, 'publish:github:pull-request'],
      ['path', 42, true, 'publish:github:pull-request'],
    ])(
      'matches %s input values for %s',
      async (key, path, allowed, actionId = 'gitlab:group:access') => {
        actionRegistry.register(
          createTemplateAction({
            id: actionId,
            schema: {
              input: {
                path: z => z.union([z.string(), z.number()]),
              },
            },
            handler: fakeActionHandler,
          }),
        );

        mockedPermissionApi.authorizeConditional.mockResolvedValueOnce([
          {
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'scaffolder',
            resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
            conditions: {
              not: {
                allOf: [
                  {
                    resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
                    rule: 'HAS_ACTION_ID',
                    params: { actionId },
                  },
                  {
                    resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
                    rule: 'HAS_STRING_PROPERTY',
                    params: {
                      key,
                      value: 'example/team',
                    },
                  },
                ],
              },
            },
          },
        ]);

        const task = createMockTaskWithSpec({
          steps: [
            {
              id: 'test',
              name: 'Grant GitLab group access',
              action: actionId,
              input: { path },
            },
          ],
        });

        const result = runner.execute(task).then(
          () => true,
          error => {
            if (error?.name !== 'NotAllowedError') {
              throw error;
            }

            return false;
          },
        );

        await expect(result).resolves.toBe(allowed);
        expect(fakeActionHandler).toHaveBeenCalledTimes(Number(allowed));
      },
    );

    it('accepts numeric group identifiers under compatible policies', async () => {
      actionRegistry.register(
        createTemplateAction({
          id: 'gitlab:group:access',
          schema: {
            input: {
              path: z => z.number(),
            },
          },
          handler: fakeActionHandler,
        }),
      );

      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'test',
            name: 'Grant GitLab group access',
            action: 'gitlab:group:access',
            input: { path: 42 },
          },
        ],
      });

      await runner.execute(task);

      for (const conditions of [
        {
          anyOf: [
            {
              resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
              rule: 'HAS_NUMBER_PROPERTY',
              params: { key: 'path', value: 42 },
            },
            {
              resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
              rule: 'HAS_STRING_PROPERTY',
              params: { key: 'path', value: 'example/other' },
            },
          ],
        },
        {
          anyOf: [
            {
              allOf: [
                {
                  resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
                  rule: 'HAS_ACTION_ID',
                  params: { actionId: 'other-action' },
                },
                {
                  resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
                  rule: 'HAS_STRING_PROPERTY',
                  params: {
                    key: 'path',
                    value: 'example/team',
                  },
                },
              ],
            },
            {
              resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
              rule: 'HAS_ACTION_ID',
              params: { actionId: 'gitlab:group:access' },
            },
          ],
        },
      ] satisfies Array<PermissionCriteria<PermissionCondition>>) {
        mockedPermissionApi.authorizeConditional.mockResolvedValueOnce([
          {
            result: AuthorizeResult.CONDITIONAL,
            pluginId: 'scaffolder',
            resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
            conditions,
          },
        ]);

        await runner.execute(task);
      }

      expect(fakeActionHandler).toHaveBeenCalledTimes(3);
      expect(fakeActionHandler).toHaveBeenCalledWith(
        expect.objectContaining({ input: { path: 42 } }),
      );
    });
  });

  describe('step status check functions (always/failure)', () => {
    let failingHandler: jest.Mock;
    let cleanupHandler: jest.Mock;

    beforeEach(() => {
      failingHandler = jest.fn().mockRejectedValue(new Error('step failed'));
      cleanupHandler = jest.fn();

      actionRegistry.register(
        createTemplateAction({
          id: 'failing-action',
          description: 'Action that always fails',
          handler: failingHandler,
        }),
      );

      actionRegistry.register(
        createTemplateAction({
          id: 'cleanup-action',
          description: 'Cleanup action',
          handler: cleanupHandler,
        }),
      );
    });

    it('should run step with if: ${{ always() }} even when a previous step failed', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'Failing step',
            action: 'failing-action',
          },
          {
            id: 'step2',
            name: 'Always runs',
            action: 'cleanup-action',
            if: '${{ always() }}',
          },
        ],
      });

      await expect(runner.execute(task)).rejects.toThrow('step failed');
      expect(cleanupHandler).toHaveBeenCalledTimes(1);
    });

    it('should run step with if: ${{ failure() }} only when a previous step failed', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'Failing step',
            action: 'failing-action',
          },
          {
            id: 'step2',
            name: 'Runs on failure',
            action: 'cleanup-action',
            if: '${{ failure() }}',
          },
        ],
      });

      await expect(runner.execute(task)).rejects.toThrow('step failed');
      expect(cleanupHandler).toHaveBeenCalledTimes(1);
    });

    it('should not run step with if: ${{ failure() }} when no step has failed', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'Succeeding step',
            action: 'jest-mock-action',
          },
          {
            id: 'step2',
            name: 'Only on failure',
            action: 'cleanup-action',
            if: '${{ failure() }}',
          },
        ],
      });

      await runner.execute(task);
      expect(fakeActionHandler).toHaveBeenCalledTimes(1);
      expect(cleanupHandler).not.toHaveBeenCalled();
    });

    it('should not run step with if: ${{ true }} after a previous step failed', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'Failing step',
            action: 'failing-action',
          },
          {
            id: 'step2',
            name: 'Truthy but not a status check',
            action: 'cleanup-action',
            if: '${{ true }}',
          },
        ],
      });

      await expect(runner.execute(task)).rejects.toThrow('step failed');
      expect(cleanupHandler).not.toHaveBeenCalled();
    });

    it('should still throw the original error after running ${{ always() }} steps', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'Failing step',
            action: 'failing-action',
          },
          {
            id: 'step2',
            name: 'Always step',
            action: 'cleanup-action',
            if: '${{ always() }}',
          },
          {
            id: 'step3',
            name: 'Should be skipped',
            action: 'jest-mock-action',
          },
        ],
      });

      await expect(runner.execute(task)).rejects.toThrow('step failed');
      expect(cleanupHandler).toHaveBeenCalledTimes(1);
      // step3 should not run because it has no status check function
      expect(fakeActionHandler).not.toHaveBeenCalled();
    });

    it('should continue running always() steps even if a cleanup step also fails', async () => {
      const failingCleanup = jest
        .fn()
        .mockRejectedValue(new Error('cleanup failed'));
      actionRegistry.register(
        createTemplateAction({
          id: 'failing-cleanup',
          description: 'Failing cleanup',
          handler: failingCleanup,
        }),
      );

      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'Failing step',
            action: 'failing-action',
          },
          {
            id: 'step2',
            name: 'Failing cleanup',
            action: 'failing-cleanup',
            if: '${{ always() }}',
          },
          {
            id: 'step3',
            name: 'Another cleanup',
            action: 'cleanup-action',
            if: '${{ always() }}',
          },
        ],
      });

      // Should throw the first error (from step1)
      await expect(runner.execute(task)).rejects.toThrow('step failed');
      expect(failingCleanup).toHaveBeenCalledTimes(1);
      expect(cleanupHandler).toHaveBeenCalledTimes(1);
    });

    it('should log all errors when multiple cleanup steps fail', async () => {
      const secondCleanupError = new Error('second cleanup failed');
      const thirdCleanupError = new Error('third cleanup failed');

      const failingCleanup2 = jest.fn().mockRejectedValue(secondCleanupError);
      const failingCleanup3 = jest.fn().mockRejectedValue(thirdCleanupError);

      actionRegistry.register(
        createTemplateAction({
          id: 'failing-cleanup-2',
          description: 'Second failing cleanup',
          handler: failingCleanup2,
        }),
      );

      actionRegistry.register(
        createTemplateAction({
          id: 'failing-cleanup-3',
          description: 'Third failing cleanup',
          handler: failingCleanup3,
        }),
      );

      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'Failing step',
            action: 'failing-action',
          },
          {
            id: 'step2',
            name: 'First cleanup',
            action: 'failing-cleanup-2',
            if: '${{ always() }}',
          },
          {
            id: 'step3',
            name: 'Second cleanup',
            action: 'failing-cleanup-3',
            if: '${{ always() }}',
          },
        ],
      });

      // Should throw the first error (from step1)
      await expect(runner.execute(task)).rejects.toThrow('step failed');

      // All cleanup handlers should have been called
      expect(failingCleanup2).toHaveBeenCalledTimes(1);
      expect(failingCleanup3).toHaveBeenCalledTimes(1);

      // Subsequent errors should be logged
      expect(logger.error).toHaveBeenCalledWith(
        'Additional error in step step2 (First cleanup): second cleanup failed',
        secondCleanupError,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Additional error in step step3 (Second cleanup): third cleanup failed',
        thirdCleanupError,
      );

      // Summary warning should be logged
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'Task failed with 3 errors. First error from step step1. Additional failures in: step2 (First cleanup), step3 (Second cleanup)',
        ),
      );

      // Task logs should contain additional error information
      expect(fakeTaskLog).toHaveBeenCalledWith(
        expect.stringContaining('Additional error occurred'),
        { stepId: 'step2', status: 'failed' },
      );
      expect(fakeTaskLog).toHaveBeenCalledWith(
        expect.stringContaining('Additional error occurred'),
        { stepId: 'step3', status: 'failed' },
      );
    });

    it('should support failure() and always() together across multiple steps', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'First step',
            action: 'jest-mock-action',
          },
          {
            id: 'step2',
            name: 'Should skip with template failure',
            action: 'cleanup-action',
            if: '${{ failure() }}',
          },
          {
            id: 'step3',
            name: 'Should run with template always',
            action: 'cleanup-action',
            if: '${{ always() }}',
          },
          {
            id: 'step4',
            name: 'Failing step',
            action: 'failing-action',
          },
          {
            id: 'step5',
            name: 'Should run with template failure after error',
            action: 'cleanup-action',
            if: '${{ failure() }}',
          },
          {
            id: 'step6',
            name: 'Should run with template always after error',
            action: 'cleanup-action',
            if: '${{ always() }}',
          },
        ],
      });

      await expect(runner.execute(task)).rejects.toThrow('step failed');

      // Verify execution order and counts
      expect(fakeActionHandler).toHaveBeenCalledTimes(1); // step1
      expect(cleanupHandler).toHaveBeenCalledTimes(3); // step3, step5, step6

      // Verify the correct steps ran in the right order
      const taskLogCalls = fakeTaskLog.mock.calls.map(args =>
        stripAnsi(args[0]),
      );

      // step1 should run
      expect(taskLogCalls).toContain('Beginning step First step');
      expect(taskLogCalls).toContain('Finished step First step');

      // step2 should be skipped (no failure yet)
      expect(taskLogCalls).toContain(
        'Skipping step step2 because its if condition was false',
      );

      // step3 should run (always)
      expect(taskLogCalls).toContain(
        'Beginning step Should run with template always',
      );
      expect(taskLogCalls).toContain(
        'Finished step Should run with template always',
      );

      // step4 should fail
      expect(taskLogCalls).toContain('Beginning step Failing step');

      // step5 should run (failure condition met)
      expect(taskLogCalls).toContain(
        'Beginning step Should run with template failure after error',
      );
      expect(taskLogCalls).toContain(
        'Finished step Should run with template failure after error',
      );

      // step6 should run (always)
      expect(taskLogCalls).toContain(
        'Beginning step Should run with template always after error',
      );
      expect(taskLogCalls).toContain(
        'Finished step Should run with template always after error',
      );
    });
  });

  describe('task recovery - step resumption', () => {
    // Recovery behavior (persistence + resumption) is gated behind
    // `scaffolder.taskRecovery.enabled`, so these tests use a runner with
    // recovery turned on.
    let recoveryRunner: NunjucksWorkflowRunner;

    beforeEach(() => {
      recoveryRunner = new NunjucksWorkflowRunner({
        actionRegistry,
        integrations,
        workingDirectory: mockDir.path,
        logger,
        permissions: mockedPermissionApi,
        config: new ConfigReader({
          scaffolder: { taskRecovery: { enabled: true } },
        }),
        metrics: metricsServiceMock.mock(),
      });
    });

    it('skips completed steps and restores their outputs', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'completed step',
            action: 'jest-mock-action',
            input: {},
          },
          {
            id: 'step2',
            name: 'pending step',
            action: 'jest-mock-action',
            input: {},
          },
        ],
        output: { fromStep1: '${{ steps.step1.output.mock }}' },
      });
      task.getTaskState = jest.fn().mockResolvedValue({
        state: {
          steps: {
            step1: { status: 'completed', output: { mock: 'recovered-value' } },
          },
        },
      });
      task.updateStepState = jest.fn();

      const result = await recoveryRunner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledTimes(1);
      expect(result.output.fromStep1).toBe('recovered-value');
      expect(task.updateStepState).toHaveBeenCalledTimes(1);
      expect(task.updateStepState).toHaveBeenCalledWith({
        stepId: 'step2',
        status: 'completed',
        output: expect.any(Object),
      });
    });

    it('runs all steps when no prior state exists', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          { id: 'step1', name: 'first', action: 'jest-mock-action', input: {} },
          {
            id: 'step2',
            name: 'second',
            action: 'jest-mock-action',
            input: {},
          },
        ],
      });
      task.getTaskState = jest.fn().mockResolvedValue(undefined);
      task.updateStepState = jest.fn();

      await recoveryRunner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledTimes(2);
      expect(task.updateStepState).toHaveBeenCalledTimes(2);
    });

    it('saves each completed step state', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          { id: 'step1', name: 'first', action: 'output-action', input: {} },
        ],
      });
      task.updateStepState = jest.fn();

      await recoveryRunner.execute(task);

      expect(task.updateStepState).toHaveBeenCalledWith({
        stepId: 'step1',
        status: 'completed',
        output: expect.objectContaining({ mock: 'backstage' }),
      });
    });

    it('serializes the workspace before marking a step completed', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          { id: 'step1', name: 'first', action: 'output-action', input: {} },
        ],
      });
      const callOrder: string[] = [];
      task.serializeWorkspace = jest.fn(async () => {
        callOrder.push('serializeWorkspace');
      });
      task.updateStepState = jest.fn(async () => {
        callOrder.push('updateStepState');
      });

      await recoveryRunner.execute(task);

      expect(callOrder).toEqual(['serializeWorkspace', 'updateStepState']);
    });

    it('does not mark a step completed when workspace serialization fails', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          { id: 'step1', name: 'first', action: 'output-action', input: {} },
        ],
      });
      task.serializeWorkspace = jest
        .fn()
        .mockRejectedValue(new Error('workspace persistence failed'));
      task.updateStepState = jest.fn();

      await expect(recoveryRunner.execute(task)).rejects.toThrow(
        'workspace persistence failed',
      );
      expect(task.serializeWorkspace).toHaveBeenCalledTimes(1);
      expect(task.updateStepState).not.toHaveBeenCalled();
    });

    it('retries the step that was in progress when execution stopped', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'completed',
            action: 'jest-mock-action',
            input: {},
          },
          {
            id: 'step2',
            name: 'was in progress',
            action: 'jest-mock-action',
            input: {},
          },
        ],
      });
      task.getTaskState = jest.fn().mockResolvedValue({
        state: {
          steps: {
            step1: { status: 'completed', output: { done: true } },
          },
        },
      });

      await recoveryRunner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledTimes(1);
    });

    it('logs the number of restored steps', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'completed step',
            action: 'jest-mock-action',
            input: {},
          },
        ],
      });
      task.getTaskState = jest.fn().mockResolvedValue({
        state: {
          steps: {
            step1: { status: 'completed', output: { mock: 'value' } },
          },
        },
      });
      task.emitLog = jest.fn();

      await recoveryRunner.execute(task);

      expect(task.emitLog).toHaveBeenCalledWith(
        expect.stringContaining('1 step(s) already completed'),
      );
    });

    it('emits a completed status event for skipped steps so the UI stays consistent', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          {
            id: 'step1',
            name: 'completed step',
            action: 'jest-mock-action',
            input: {},
          },
          {
            id: 'step2',
            name: 'pending step',
            action: 'jest-mock-action',
            input: {},
          },
        ],
      });
      task.getTaskState = jest.fn().mockResolvedValue({
        state: {
          steps: {
            step1: { status: 'completed', output: { mock: 'value' } },
          },
        },
      });
      task.emitLog = jest.fn();

      await recoveryRunner.execute(task);

      expect(task.emitLog).toHaveBeenCalledWith(expect.any(String), {
        stepId: 'step1',
        status: 'completed',
      });
    });

    it('does not persist step state when recovery is disabled', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          { id: 'step1', name: 'first', action: 'jest-mock-action', input: {} },
        ],
      });
      task.updateStepState = jest.fn();

      // The default `runner` is configured without task recovery enabled.
      await runner.execute(task);

      expect(fakeActionHandler).toHaveBeenCalledTimes(1);
      expect(task.updateStepState).not.toHaveBeenCalled();
    });

    it('ignores saved step state and re-runs all steps when recovery is disabled', async () => {
      const task = createMockTaskWithSpec({
        steps: [
          { id: 'step1', name: 'first', action: 'jest-mock-action', input: {} },
          {
            id: 'step2',
            name: 'second',
            action: 'jest-mock-action',
            input: {},
          },
        ],
      });
      task.getTaskState = jest.fn().mockResolvedValue({
        state: {
          steps: {
            step1: { status: 'completed', output: { mock: 'value' } },
          },
        },
      });

      await runner.execute(task);

      // Both steps run again; the persisted completed state is ignored so no
      // step is skipped.
      expect(fakeActionHandler).toHaveBeenCalledTimes(2);
    });
  });
});
