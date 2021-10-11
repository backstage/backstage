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
import os from 'os';
import { getVoidLogger } from '@backstage/backend-common';
import { DefaultWorkflowRunner } from './DefaultWorkflowRunner';
import { TemplateActionRegistry } from '../actions';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { Task, TaskSpec } from './types';

describe('DefaultWorkflowRunner', () => {
  const workingDirectory = os.tmpdir();
  const logger = getVoidLogger();
  let actionRegistry = new TemplateActionRegistry();
  let runner: DefaultWorkflowRunner;
  let fakeActionHandler: jest.Mock;

  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );

  const createMockTaskWithSpec = (spec: TaskSpec): Task => ({
    spec,
    complete: async () => {},
    done: false,
    emitLog: async () => {},
    getWorkspaceName: () => Promise.resolve('test-workspace'),
  });

  beforeEach(() => {
    jest.resetAllMocks();
    actionRegistry = new TemplateActionRegistry();
    fakeActionHandler = jest.fn();

    actionRegistry.register({
      id: 'jest-mock-action',
      description: 'Mock action for testing',
      handler: fakeActionHandler,
    });

    actionRegistry.register({
      id: 'jest-validated-action',
      description: 'Mock action for testing',
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

    actionRegistry.register({
      id: 'output-action',
      description: 'Mock action for testing',
      handler: async ctx => {
        ctx.output('mock', 'backstage');
        ctx.output('shouldRun', true);
      },
    });

    runner = new DefaultWorkflowRunner({
      actionRegistry,
      integrations,
      workingDirectory,
      logger,
    });
  });

  it('should throw an error if the action does not exist', async () => {
    const task = createMockTaskWithSpec({
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      parameters: {},
      output: {},
      steps: [{ id: 'test', name: 'name', action: 'does-not-exist' }],
    });

    await expect(runner.execute(task)).rejects.toThrowError(
      "Template action with ID 'does-not-exist' is not registered.",
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

      await expect(runner.execute(task)).rejects.toThrowError(
        /Invalid input passed to action jest-validated-action, instance requires property \"foo\"/,
      );
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

    it('should keep the original types for the input and not parse things that arent meant to be parsed', async () => {
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
  });
});
