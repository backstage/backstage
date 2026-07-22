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
import { JsonObject } from '@backstage/types';
import { StorageTaskBroker } from './StorageTaskBroker';
import { ScaffolderClient } from '../../client/ScaffolderClient';
import { SerializedTask, TaskStore } from './types';

describe('StorageTaskBroker outputs handling', () => {
  let storage: jest.Mocked<TaskStore>;
  let scaffolderClient: jest.Mocked<ScaffolderClient>;
  let broker: StorageTaskBroker;

  // Test task with outputs and parameters
  const mockTask: SerializedTask = {
    id: 'task1',
    spec: {
      templateInfo: {
        entityRef: 'template:default/test-template',
        baseUrl: 'http://example.com',
      },
      parameters: {
        name: 'Test Name',
        description: 'Test Description',
        user: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
      steps: [
        {
          id: 'step1',
          name: 'First Step',
          template: 'template:default/first-template',
          input: {
            name: 'First Step',
            description: 'This is the first step',
          },
        },
        {
          id: 'step2',
          name: 'Second Step',
          template: 'template:default/second-template',
          input: {
            name: '${{ parameters.name }}',
            description: '${{ parameters.description }}',
            previousOutput: '${{ outputs.first_output }}',
          },
        },
        {
          id: 'step3',
          name: 'Third Step',
          template: 'template:default/third-template',
          input: {
            name: 'Step with nested param',
            fullName:
              '${{ parameters.user.firstName }} ${{ parameters.user.lastName }}',
            previousOutput: '${{ outputs.second_output }}',
          },
          output: [
            { name: 'third_output', description: 'Output from third step' },
          ],
        },
      ],
      owner: 'user:default/owner',
      type: 'goldenpath',
    } as any, // Cast to any to bypass type issues in test
    status: 'processing', // Use any valid status
    createdBy: 'user:default/creator',
    createdAt: '2025-10-09T00:00:00Z',
  };

  // Mock outputs from previous steps
  const mockOutputs: JsonObject = {
    first_output: 'Output from first step',
    second_output: 'Output from second step',
    third_output: 'Output from third step',
    unused_output: 'This output is not referenced anywhere',
  };

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
      storeTaskStepOutputs: jest.fn(),
      getAllTaskOutputs: jest.fn(),
      upsertTaskStepOutputs: jest.fn(),
    } as any;

    scaffolderClient = {
      cancelTask: jest.fn(),
      createTaskExecution: jest.fn(),
      listEvents: jest.fn(),
    } as any;

    broker = new StorageTaskBroker(storage, scaffolderClient);

    // Setup default mocks
    storage.getTask.mockResolvedValue(mockTask);
    storage.getAllTaskOutputs.mockResolvedValue(mockOutputs);
  });

  describe('storeTaskStepOutputs', () => {
    it('should filter outputs based on output', async () => {
      // Mock outputs to be stored
      const outputsToStore = {
        third_output: 'Output from third step',
        extra_output: 'This should be filtered out',
        links: [{ url: 'http://example.com', title: 'Example' }],
        text: 'This is additional text info',
      };

      // Call the method with step3 that has output defined
      await broker.storeTaskStepOutputs('task1', 'step3', outputsToStore);

      // Verify the outputs were filtered according to output
      expect(storage.upsertTaskStepOutputs).toHaveBeenCalledWith({
        taskId: 'task1',
        templateId: 'step3',
        outputs: {
          third_output: 'Output from third step',
        },
      });

      // Verify links and text were not included
      const calledOutputs = (storage.upsertTaskStepOutputs as jest.Mock).mock
        .calls[0][0].outputs;
      expect(calledOutputs).not.toHaveProperty('links');
      expect(calledOutputs).not.toHaveProperty('text');
      expect(calledOutputs).not.toHaveProperty('extra_output');
    });

    it('should store all outputs except links and text when no output defined', async () => {
      // Mock outputs to be stored
      const outputsToStore = {
        first_output: 'Output from first step',
        second_output: 'Output from second step',
        links: [{ url: 'http://example.com', title: 'Example' }],
        text: 'This is additional text info',
      };

      // Call the method with step1 that has no output defined
      await broker.storeTaskStepOutputs('task1', 'step1', outputsToStore);

      // Verify all outputs except links and text were stored
      expect(storage.upsertTaskStepOutputs).toHaveBeenCalledWith({
        taskId: 'task1',
        templateId: 'step1',
        outputs: {
          first_output: 'Output from first step',
          second_output: 'Output from second step',
        },
      });

      // Verify links and text were not included
      const calledOutputs = (storage.upsertTaskStepOutputs as jest.Mock).mock
        .calls[0][0].outputs;
      expect(calledOutputs).not.toHaveProperty('links');
      expect(calledOutputs).not.toHaveProperty('text');
    });
  });

  describe('upsertTaskStep', () => {
    it('should create task execution and upsert step', async () => {
      // Mock body
      const body: JsonObject = {
        name: 'Test Name',
        description: 'Test Description',
      };

      // Setup mock
      scaffolderClient.createTaskExecution.mockResolvedValue('new-step-id');

      // Call the method
      await broker.upsertTaskStep('task1', 'step2', body, {} as any);

      // Verify the task execution was created
      expect(scaffolderClient.createTaskExecution).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
      );

      // Verify the step was upserted with the correct ID
      expect(storage.upsertTaskStep).toHaveBeenCalledWith({
        taskId: 'task1',
        templateId: 'step2',
        stepId: 'new-step-id',
      });
    });
  });
});
