/*
 * Copyright 2026 The Backstage Authors
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
import { IncomingHttpHeaders } from 'node:http';
import { ScaffolderClient } from '../../client/ScaffolderClient';
import {
  TaskStore,
  SerializedTask,
  TaskSecrets,
  SerializedTaskStep,
} from './types';
import {
  SerializedTaskEvent,
  TaskSpec,
} from '@backstage/plugin-golden-paths-common';
import { JsonObject } from '@backstage/types';
import { StorageTaskBroker } from './StorageTaskBroker';

describe('StorageTaskBroker', () => {
  let storage: jest.Mocked<TaskStore>;
  let scaffolderClient: jest.Mocked<ScaffolderClient>;
  let broker: StorageTaskBroker;

  beforeEach(() => {
    storage = {
      insertTask: jest.fn(),
      getTask: jest.fn(),
      getTasks: jest.fn(),
      completeTask: jest.fn(),
      cancelTask: jest.fn(),
      getTaskStatuses: jest.fn(),
      getTaskStep: jest.fn(),
      upsertTaskStep: jest.fn(),
      getTaskStepId: jest.fn(),
      getTaskStepStatus: jest.fn(),
      upsertTaskStepStatus: jest.fn(),
      getAllTaskOutputs: jest.fn(),
      storeTaskStepOutputs: jest.fn(),
    } as any;

    scaffolderClient = {
      cancelTask: jest.fn(),
      createTaskExecution: jest.fn(),
      listEvents: jest.fn(),
    } as any;

    broker = new StorageTaskBroker(storage, scaffolderClient);
  });

  it('should insert a task', async () => {
    const options = {
      spec: {} as TaskSpec,
      secrets: {} as TaskSecrets,
      createdBy: 'user',
    };
    storage.insertTask.mockResolvedValue({ taskId: 'task1' });

    const result = await broker.insertTask(options);

    expect(result).toEqual({ taskId: 'task1' });
    expect(storage.insertTask).toHaveBeenCalledWith(options);
  });

  it('should get a task', async () => {
    const taskId = 'task1';
    const task = {} as SerializedTask;
    storage.getTask.mockResolvedValue(task);

    const result = await broker.getTask(taskId);

    expect(result).toBe(task);
    expect(storage.getTask).toHaveBeenCalledWith(taskId);
  });

  it('should get tasks', async () => {
    const options = { createdBy: 'user' };
    const tasks = [{}, {}] as SerializedTask[];
    storage.getTasks.mockResolvedValue({ tasks });

    const result = await broker.getTasks(options);

    expect(result).toEqual({ tasks });
    expect(storage.getTasks).toHaveBeenCalledWith(options);
  });

  it('should complete a task', async () => {
    const taskId = 'task1';

    await broker.completeTask(taskId);

    expect(storage.completeTask).toHaveBeenCalledWith(taskId);
  });

  it('should cancel a task', async () => {
    const options = { taskId: 'task1', headers: {} as IncomingHttpHeaders };
    const taskStatuses = [
      { task_id: 'task1', template_id: 'template1', status: 'active' },
    ];
    storage.getTaskStatuses.mockResolvedValue(taskStatuses);
    storage.getTaskStepId.mockResolvedValue({ stepId: 'step1' });

    await broker.cancelTask(options);

    expect(scaffolderClient.cancelTask).toHaveBeenCalledWith({
      taskId: 'step1',
      headers: options.headers,
    });
    expect(storage.cancelTask).toHaveBeenCalledWith(options.taskId);
  });

  it('should get task statuses', async () => {
    const taskId = 'task1';
    const taskStatuses = [
      { task_id: 'task1', template_id: 'template1', status: 'active' },
    ];
    storage.getTaskStatuses.mockResolvedValue(taskStatuses);

    const result = await broker.getTaskStatuses(taskId);

    expect(result).toEqual([
      { taskId: 'task1', templateId: 'template1', status: 'active' },
    ]);
    expect(storage.getTaskStatuses).toHaveBeenCalledWith(taskId);
  });

  it('should get a task step', async () => {
    const stepId = 'step1';
    const taskStep = {} as SerializedTaskStep;
    storage.getTaskStep.mockResolvedValue(taskStep);

    const result = await broker.getTaskStep(stepId);

    expect(result).toBe(taskStep);
    expect(storage.getTaskStep).toHaveBeenCalledWith(stepId);
  });

  it('should upsert a task step', async () => {
    const taskId = 'task1';
    const templateId = 'template1';
    const body = {} as JsonObject;
    const headers = {} as IncomingHttpHeaders;
    scaffolderClient.createTaskExecution.mockResolvedValue('step1');

    // Mock the task and outputs
    const mockTask: any = {
      id: 'task1',
      spec: {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        parameters: { name: 'Test' },
        steps: [],
      },
      status: 'processing',
      createdBy: 'user:default/creator',
      createdAt: '2025-10-09T00:00:00Z',
    };
    storage.getTask.mockResolvedValue(mockTask);
    storage.getAllTaskOutputs.mockResolvedValue({});

    await broker.upsertTaskStep(taskId, templateId, body, headers);

    expect(scaffolderClient.createTaskExecution).toHaveBeenCalledWith(
      body,
      headers,
    );
    expect(storage.upsertTaskStep).toHaveBeenCalledWith({
      taskId,
      templateId,
      stepId: 'step1',
    });
  });

  it('should get a task step id', async () => {
    const options = { taskId: 'task1', templateId: 'template1' };
    storage.getTaskStepId.mockResolvedValue({ stepId: 'step1' });

    const result = await broker.getTaskStepId(options);

    expect(result).toBe('step1');
    expect(storage.getTaskStepId).toHaveBeenCalledWith(options);
  });

  it('should get a task step status', async () => {
    const options = { taskId: 'task1', templateId: 'template1' };
    storage.getTaskStepStatus.mockResolvedValue({ status: 'active' });

    const result = await broker.getTaskStepStatus(options);

    expect(result).toBe('active');
    expect(storage.getTaskStepStatus).toHaveBeenCalledWith(options);
  });

  it('should insert a task step status', async () => {
    const options = {
      taskId: 'task1',
      templateId: 'template1',
      status: 'active',
    };
    storage.upsertTaskStepStatus.mockResolvedValue({ status: 'active' });

    const result = await broker.upsertTaskStepStatus(options);

    expect(result).toBe('active');
    expect(storage.upsertTaskStepStatus).toHaveBeenCalledWith(options);
  });

  it('should get task step events', async () => {
    const options = { stepId: 'step1', headers: {} as IncomingHttpHeaders };
    const events = [
      {
        id: 1,
        taskId: 'taskId',
        body: {},
        type: 'completion',
        createdAt: '2025-02-21',
      },
    ] as SerializedTaskEvent[];
    scaffolderClient.listEvents.mockResolvedValue({ events });

    const observable = broker.getTaskStepEvents(options);

    const observer = {
      next: jest.fn(),
      error: jest.fn(),
      complete: jest.fn(),
    };

    const subscription = observable.subscribe(observer);

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(observer.next).toHaveBeenCalledWith({ events });
    subscription.unsubscribe();
  });

  describe('output and parameter reference processing', () => {
    const mockTask: SerializedTask = {
      id: 'task1',
      spec: {
        parameters: {
          name: 'Test Name',
          description: 'Test Description',
          user: { firstName: 'John', lastName: 'Doe' },
        },
        steps: [
          {
            id: 'step1',
            name: 'First Step',
            input: { name: 'First Step' },
          },
          {
            id: 'step2',
            name: 'Second Step',
            input: {
              name: '${{ parameters.name }}',
              description: '${{ parameters.description }}',
              previousOutput: '${{ outputs.first_output }}',
            },
          },
          {
            id: 'step3',
            name: 'Third Step',
            input: {
              fullName:
                '${{ parameters.user.firstName }} ${{ parameters.user.lastName }}',
              previousOutput: '${{ outputs.second_output }}',
            },
            output: [
              { name: 'third_output', description: 'Output from third step' },
            ],
          },
        ],
      } as any,
      status: 'processing' as any,
      createdBy: 'user:default/creator',
      createdAt: '2025-10-09T00:00:00Z',
    };

    const mockOutputs: JsonObject = {
      first_output: 'Output from first step',
      second_output: 'Output from second step',
    };

    beforeEach(() => {
      storage.getTask.mockResolvedValue(mockTask);
      storage.getAllTaskOutputs.mockResolvedValue(mockOutputs);
    });

    // Add a placeholder test to avoid "beforeEach() may not be used in a describe block containing no tests" error
    it('should be properly configured for parameter reference tests', () => {
      expect(mockTask).toBeDefined();
      expect(mockOutputs).toBeDefined();
    });
  });
});
