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
import { DatabaseTaskStore } from './DatabaseTaskStore';
import { NotFoundError } from '@backstage/errors';
import { mockServices, TestDatabases } from '@backstage/backend-test-utils';
import { TaskSpec } from '@backstage/plugin-golden-paths-common';

const defaultLogger = mockServices.logger.mock();

const databases = TestDatabases.create({
  ids: ['SQLITE_3'],
});

const createStore = async () => {
  const [[id]] = databases.eachSupportedId();
  const knex = await databases.init(id);

  const manager = mockServices.database.mock({
    async getClient() {
      return knex;
    },
  });

  const store = await DatabaseTaskStore.create({
    database: manager,
    logger: defaultLogger,
  });
  return { store, manager };
};

describe('DatabaseTaskStore', () => {
  it('should create the database store and run migration', async () => {
    const { store, manager } = await createStore();

    expect(store).toBeDefined();

    const client = await manager.getClient();

    expect(await client.schema.hasTable('tasks')).toBeTruthy();
    expect(await client.schema.hasTable('task_steps')).toBeTruthy();
    expect(await client.schema.hasTable('task_statuses')).toBeTruthy();
  });

  it('should list all created tasks', async () => {
    const { store } = await createStore();

    await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    const { tasks } = await store.getTasks({});

    expect(tasks.length).toBe(1);
    expect(tasks[0].createdBy).toBe('me');
    expect(tasks[0].status).toBe('processing');
    expect(tasks[0].id).toBeDefined();
  });

  it('should allow paginating tasks', async () => {
    const { store } = await createStore();

    await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'him',
    });

    const { tasks } = await store.getTasks({
      pagination: { limit: 1, offset: 0 },
    });

    expect(tasks.length).toBe(1);
    expect(tasks[0].createdBy).toBe('me');
    expect(tasks[0].status).toBe('processing');
    expect(tasks[0].id).toBeDefined();

    const { tasks: tasks2 } = await store.getTasks({
      pagination: { limit: 1, offset: 1 },
    });

    expect(tasks2.length).toBe(1);
    expect(tasks2[0].createdBy).toBe('him');
    expect(tasks2[0].status).toBe('processing');
    expect(tasks2[0].id).toBeDefined();
  });

  it('should allow ordering tasks', async () => {
    const { store } = await createStore();

    await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'a',
    });

    await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'b',
    });

    const { tasks } = await store.getTasks({
      order: [{ field: 'created_by', order: 'asc' }],
    });

    expect(tasks.length).toBe(2);
    expect(tasks[0].createdBy).toBe('a');
    expect(tasks[0].status).toBe('processing');
    expect(tasks[0].id).toBeDefined();

    const { tasks: tasks2 } = await store.getTasks({
      order: [{ field: 'created_by', order: 'desc' }],
    });

    expect(tasks2.length).toBe(2);
    expect(tasks2[0].createdBy).toBe('b');
    expect(tasks2[0].status).toBe('processing');
    expect(tasks2[0].id).toBeDefined();
  });

  it('should list filtered created tasks by createdBy', async () => {
    const { store } = await createStore();

    await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'him',
    });

    const { tasks } = await store.getTasks({ createdBy: 'him' });

    expect(tasks.length).toBe(1);
    expect(tasks[0].createdBy).toBe('him');
    expect(tasks[0].status).toBe('processing');
    expect(tasks[0].id).toBeDefined();

    const { tasks: tasks2 } = await store.getTasks({
      filters: { createdBy: 'him' },
    });

    expect(tasks2.length).toBe(1);
    expect(tasks2[0].createdBy).toBe('him');
    expect(tasks2[0].status).toBe('processing');
    expect(tasks2[0].id).toBeDefined();
  });

  it('should list filtered created tasks by status', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'him',
    });

    await store.completeTask(taskId);

    const { tasks, totalTasks } = await store.getTasks({
      status: 'processing',
    });

    expect(tasks.length).toBe(1);
    expect(totalTasks).toBe(1);
    expect(tasks[0].createdBy).toBe('him');
    expect(tasks[0].status).toBe('processing');
    expect(tasks[0].id).toBeDefined();

    const { tasks: tasks2, totalTasks: totalTasks2 } = await store.getTasks({
      filters: { status: ['processing'] },
    });

    expect(tasks2.length).toBe(1);
    expect(totalTasks2).toBe(1);
    expect(tasks2[0].createdBy).toBe('him');
    expect(tasks2[0].status).toBe('processing');
    expect(tasks2[0].id).toBeDefined();
  });

  it('should limit and offset based on parameters', async () => {
    const { store } = await createStore();

    await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'him',
    });

    const { tasks, totalTasks } = await store.getTasks({
      pagination: { limit: 1, offset: 1 },
    });

    expect(tasks.length).toBe(1);
    expect(totalTasks).toBe(2);
    expect(tasks[0].createdBy).toBe('him');
    expect(tasks[0].status).toBe('processing');
    expect(tasks[0].id).toBeDefined();
  });

  it('should insert task with only required parameters', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {
        apiVersion: 'backstage.io/v1beta1',
        steps: [
          {
            template: 'template:development/test-template',
            id: 'test-step',
            name: 'Test Step',
            input: {
              value: '${{ parameters.value}}',
            },
          },
        ],
        parameters: {
          value: 'testParameter',
        },
        goldenPathInfo: {
          entityRef: 'testEntity',
        },
      } as TaskSpec,
      createdBy: 'me',
    });

    const task = await store.getTask(taskId);

    expect(task.createdBy).toBe('me');
    expect(task.status).toBe('processing');
    expect(task.id).toBeDefined();
    expect(task.spec.apiVersion).toBe('backstage.io/v1beta1');
    expect(task.spec.steps.length).toBe(1);
    expect(task.spec.parameters).toBeDefined();
    expect(task.spec.goldenPathInfo).toBeDefined();
  });

  it('should insert task with optional parameters', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {
        apiVersion: 'backstage.io/v1beta1',
        steps: [
          {
            template: 'template:development/test-template',
            id: 'test-step',
            name: 'Test Step',
            input: {
              value: '${{ parameters.value}}',
            },
          },
        ],
        parameters: {
          value: 'testParameter',
        },
        goldenPathInfo: {
          entityRef: 'testEntity',
        },
      } as TaskSpec,
      createdBy: 'me',
      secrets: {
        firstSecret: 'testValue',
        secondSecret: 'testValue',
      },
    });

    const task = await store.getTask(taskId);

    expect(task.createdBy).toBe('me');
    expect(task.status).toBe('processing');
    expect(task.id).toBeDefined();
    expect(task.spec.apiVersion).toBe('backstage.io/v1beta1');
    expect(task.spec.steps.length).toBe(1);
    expect(task.spec.parameters).toBeDefined();
    expect(task.spec.goldenPathInfo).toBeDefined();
    expect(task.secrets).toBeDefined();
  });

  it('should change task status to complete', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    const task = await store.getTask(taskId);

    expect(task.status).toBe('processing');

    await store.completeTask(taskId);

    const completedTask = await store.getTask(taskId);

    expect(completedTask.status).toBe('completed');
  });

  it('should change task status to cancelled', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    const task = await store.getTask(taskId);

    expect(task.status).toBe('processing');

    await store.cancelTask(taskId);

    const completedTask = await store.getTask(taskId);

    expect(completedTask.status).toBe('cancelled');
  });

  it('should list all statuses for task', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.upsertTaskStepStatus({
      taskId,
      templateId: 'firstTemplate',
      status: 'completed',
    });

    await store.upsertTaskStepStatus({
      taskId,
      templateId: 'secondTemplate',
      status: 'processing',
    });

    const taskStatuses = await store.getTaskStatuses(taskId);

    expect(taskStatuses.length).toBe(2);
    expect(taskStatuses[0].task_id).toBe(taskId);
    expect(taskStatuses[0].template_id).toBe('firstTemplate');
    expect(taskStatuses[0].status).toBe('completed');
    expect(taskStatuses[1].task_id).toBe(taskId);
    expect(taskStatuses[1].template_id).toBe('secondTemplate');
    expect(taskStatuses[1].status).toBe('processing');
  });

  it('should insert reference to template', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.insertToTaskSteps({
      taskId,
      templateId: 'firstTemplate',
      stepId: 'uuid',
    });

    const step = await store.getTaskStepId({
      taskId,
      templateId: 'firstTemplate',
    });

    expect(step.stepId).toBe('uuid');
  });

  it('should update reference to template', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.insertToTaskSteps({
      taskId,
      templateId: 'firstTemplate',
      stepId: 'uuid',
    });

    const step = await store.getTaskStepId({
      taskId,
      templateId: 'firstTemplate',
    });

    expect(step.stepId).toBe('uuid');

    await store.updateToTaskSteps({
      taskId,
      templateId: 'firstTemplate',
      stepId: 'newUuid',
    });

    const updatedStep = await store.getTaskStepId({
      taskId,
      templateId: 'firstTemplate',
    });

    expect(updatedStep.stepId).toBe('newUuid');
  });

  it('should detect that there is a reference to template and upsert it', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.insertToTaskSteps({
      taskId,
      templateId: 'firstTemplate',
      stepId: 'uuid',
    });

    const step = await store.getTaskStepId({
      taskId,
      templateId: 'firstTemplate',
    });

    expect(step.stepId).toBe('uuid');

    await store.upsertTaskStep({
      taskId,
      templateId: 'firstTemplate',
      stepId: 'newUuid',
    });

    const updatedStep = await store.getTaskStepId({
      taskId,
      templateId: 'firstTemplate',
    });

    expect(updatedStep.stepId).toBe('newUuid');
  });

  it('should detect that there is no reference to template and insert it', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    const result = store.getTaskStepId({
      taskId,
      templateId: 'firstTemplate',
    });

    await expect(result).rejects.toThrow(
      new NotFoundError(
        `No step reference for task id '${taskId}' and template id 'firstTemplate' found`,
      ),
    );

    await store.upsertTaskStep({
      taskId,
      templateId: 'firstTemplate',
      stepId: 'uuid',
    });

    const updatedStep = await store.getTaskStepId({
      taskId,
      templateId: 'firstTemplate',
    });

    expect(updatedStep.stepId).toBe('uuid');
  });

  it('should get task step', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.insertToTaskSteps({
      taskId,
      templateId: 'firstTemplate',
      stepId: 'uuid',
    });

    const { stepId } = await store.getTaskStepId({
      taskId,
      templateId: 'firstTemplate',
    });

    const step = await store.getTaskStep(stepId);

    expect(step.taskId).toBe(taskId);
    expect(step.templateId).toBe('firstTemplate');
    expect(step.stepId).toBe('uuid');
  });

  it('should throw an error when task step is missing', async () => {
    const { store } = await createStore();

    const stepId = 'wrongUuid';

    const result = store.getTaskStep(stepId);

    await expect(result).rejects.toThrow(
      new NotFoundError(`No step with id '${stepId}' found`),
    );
  });

  it('should get task step ID', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.insertToTaskSteps({
      taskId,
      templateId: 'firstTemplate',
      stepId: 'uuid',
    });

    const { stepId } = await store.getTaskStepId({
      taskId,
      templateId: 'firstTemplate',
    });

    expect(stepId).toBe('uuid');
  });

  it('should throw an error when task step ID is missing', async () => {
    const { store } = await createStore();

    const templateId = 'wrongTemplate';

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    const result = store.getTaskStepId({
      taskId,
      templateId,
    });

    await expect(result).rejects.toThrow(
      new NotFoundError(
        `No step reference for task id '${taskId}' and template id '${templateId}' found`,
      ),
    );
  });

  it('should get task step status', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.upsertTaskStepStatus({
      taskId,
      templateId: 'template',
      status: 'processing',
    });

    const { status } = await store.getTaskStepStatus({
      taskId,
      templateId: 'template',
    });

    expect(status).toBe('processing');
  });

  it('should throw an error when task step status is missing', async () => {
    const { store } = await createStore();

    const templateId = 'wrongTemplate';

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    const result = store.getTaskStepStatus({
      taskId,
      templateId,
    });

    await expect(result).rejects.toThrow(
      new NotFoundError(
        `No status for task id '${taskId}' and template id '${templateId}' found`,
      ),
    );
  });

  it('should insert task step status', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.upsertTaskStepStatus({
      taskId,
      templateId: 'template',
      status: 'processing',
    });

    const { status } = await store.getTaskStepStatus({
      taskId,
      templateId: 'template',
    });

    expect(status).toBe('processing');
  });

  it('should update task step status', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {} as TaskSpec,
      createdBy: 'me',
    });

    await store.upsertTaskStepStatus({
      taskId,
      templateId: 'template',
      status: 'processing',
    });

    await store.upsertTaskStepStatus({
      taskId,
      templateId: 'template',
      status: 'completed',
    });

    const { status } = await store.getTaskStepStatus({
      taskId,
      templateId: 'template',
    });

    expect(status).toBe('completed');
  });

  it('should get task with specified ID', async () => {
    const { store } = await createStore();

    const { taskId } = await store.insertTask({
      spec: {
        apiVersion: 'backstage.io/v1beta1',
        steps: [
          {
            template: 'template:development/test-template',
            id: 'test-step',
            name: 'Test Step',
            input: {
              value: '${{ parameters.value}}',
            },
          },
        ],
        parameters: {
          value: 'testParameter',
        },
        goldenPathInfo: {
          entityRef: 'testEntity',
        },
      } as TaskSpec,
      createdBy: 'me',
      secrets: {
        firstSecret: 'testValue',
        secondSecret: 'testValue',
      },
    });

    const task = await store.getTask(taskId);

    expect(task.createdBy).toBe('me');
    expect(task.status).toBe('processing');
    expect(task.id).toBeDefined();
    expect(task.spec.apiVersion).toBe('backstage.io/v1beta1');
    expect(task.spec.steps.length).toBe(1);
    expect(task.spec.parameters).toBeDefined();
    expect(task.spec.goldenPathInfo).toBeDefined();
    expect(task.secrets).toBeDefined();
  });

  it('should throw an error when task with specified ID is missing', async () => {
    const { store } = await createStore();

    const taskId = 'wrongTaskId';

    const result = store.getTask(taskId);

    await expect(result).rejects.toThrow(
      new NotFoundError(`No task with id '${taskId}' found`),
    );
  });
});
