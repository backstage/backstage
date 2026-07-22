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
  TaskBroker,
  SerializedTask,
  TaskSecrets,
  SerializedTaskStep,
} from './types';
import { Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';
import {
  SerializedTaskEvent,
  SerializedTaskStatus,
  TaskSpec,
  TaskStatus,
} from '@backstage/plugin-golden-paths-common';
import { JsonObject } from '@backstage/types';

export class StorageTaskBroker implements TaskBroker {
  constructor(
    private readonly storage: TaskStore,
    private readonly scaffolderClient: ScaffolderClient,
  ) {}

  async insertTask(options: {
    spec: TaskSpec;
    secrets?: TaskSecrets;
    createdBy: string;
  }): Promise<{ taskId: string }> {
    const { taskId } = await this.storage.insertTask(options);
    return { taskId };
  }

  async getTask(taskId: string): Promise<SerializedTask> {
    return this.storage.getTask(taskId);
  }

  async getTasks(options?: {
    createdBy?: string;
    status?: TaskStatus;
    filters?: {
      createdBy?: string | string[];
      status?: TaskStatus | TaskStatus[];
    };
    pagination?: {
      limit?: number;
      offset?: number;
    };
    order?: { order: 'asc' | 'desc'; field: string }[];
  }): Promise<{ tasks: SerializedTask[]; totalTasks?: number }> {
    if (!this.storage.getTasks) {
      throw new Error(
        'TaskStore does not implement the list method. Please implement the list method to be able to list tasks',
      );
    }
    return await this.storage.getTasks(options ?? {});
  }

  async completeTask(taskId: string): Promise<void> {
    await this.storage.completeTask(taskId);
  }

  async cancelTask(options: {
    taskId: string;
    headers: IncomingHttpHeaders;
  }): Promise<void> {
    const { taskId, headers } = options;
    const taskStatuses = await this.storage.getTaskStatuses(taskId);
    const activeTaskStatus = taskStatuses.filter(
      task => task.status === 'active',
    );
    if (activeTaskStatus.length > 0) {
      const { task_id, template_id } = activeTaskStatus[0];
      const activeTask = await this.storage.getTaskStepId({
        taskId: task_id,
        templateId: template_id,
      });
      await this.scaffolderClient.cancelTask({
        taskId: activeTask.stepId,
        headers: headers,
      });
    }

    await this.storage.cancelTask(taskId);
  }

  async getTaskStatuses(taskId: string): Promise<SerializedTaskStatus[]> {
    const taskStatuses = await this.storage.getTaskStatuses(taskId);

    const serializedStatuses = taskStatuses.map(taskStatus => ({
      taskId: taskStatus.task_id,
      templateId: taskStatus.template_id,
      status: taskStatus.status,
    }));

    return serializedStatuses;
  }

  async getTaskStep(stepId: string): Promise<SerializedTaskStep> {
    return await this.storage.getTaskStep(stepId);
  }

  async upsertTaskStep(
    taskId: string,
    templateId: string,
    body: JsonObject,
    headers: IncomingHttpHeaders,
  ): Promise<void> {
    // Create the scaffolder task with processed inputs
    const stepId = await this.scaffolderClient.createTaskExecution(
      body,
      headers,
    );

    await this.storage.upsertTaskStep({
      taskId,
      templateId,
      stepId,
    });
  }

  async getTaskStepId(options: {
    taskId: string;
    templateId: string;
  }): Promise<string> {
    const taskStep = await this.storage.getTaskStepId({
      taskId: options.taskId,
      templateId: options.templateId,
    });

    return taskStep.stepId;
  }

  async getTaskStepStatus(options: {
    taskId: string;
    templateId: string;
  }): Promise<string> {
    const taskStep = await this.storage.getTaskStepStatus({
      taskId: options.taskId,
      templateId: options.templateId,
    });

    return taskStep.status;
  }

  async upsertTaskStepStatus(options: {
    taskId: string;
    templateId: string;
    status: string;
  }): Promise<string> {
    const taskStep = await this.storage.upsertTaskStepStatus(options);

    return taskStep.status;
  }

  /**
   * Extracts output parameters from task spec, excluding 'links' and 'text' properties
   * If outputParamNames is provided, only those parameters will be included in the result
   * @param taskOutput The output object from the task spec
   * @param outputParamNames Optional list of parameter names to include
   * @returns Object containing only the output parameters (no links or text)
   */
  private extractOutputParameters(
    taskOutput: JsonObject | undefined,
    outputParamNames?: string[],
  ): JsonObject {
    if (!taskOutput) {
      return {};
    }

    // Create a shallow copy of the output object
    const outputCopy = { ...taskOutput };

    // Remove links and text properties as they are not considered output parameters
    delete outputCopy.links;
    delete outputCopy.text;

    // If specific output parameter names are provided, filter to only include those
    if (outputParamNames && outputParamNames.length > 0) {
      const filteredOutput: JsonObject = {};
      for (const paramName of outputParamNames) {
        if (paramName in outputCopy) {
          filteredOutput[paramName] = outputCopy[paramName];
        }
      }
      return filteredOutput;
    }

    return outputCopy;
  }

  async storeTaskStepOutputs(
    taskId: string,
    templateId: string,
    outputs: JsonObject,
  ): Promise<void> {
    // Get the task to retrieve its specification
    const task = await this.storage.getTask(taskId);

    // Find the step configuration for the current template
    const taskStep = task.spec.steps.find(s => {
      // Step ID might be in the format "step-N" if not explicitly provided
      return s.id === templateId;
    });

    // Extract output names if they exist in the step configuration
    const output = (taskStep as any)?.output as Array<{
      name: string;
      description?: string;
      type?: number | string | boolean;
    }>;
    const outputParamNames = output?.map(param => param.name);

    // Extract only the output parameters (exclude links and text, and filter by output if specified)
    const outputParameters = this.extractOutputParameters(
      outputs,
      outputParamNames,
    );

    // Store directly in our database
    await this.storage.upsertTaskStepOutputs({
      taskId,
      templateId,
      outputs: outputParameters,
    });
  }

  async getAllTaskOutputs(options: { taskId: string }): Promise<JsonObject> {
    // Just retrieve directly from our database
    return await this.storage.getAllTaskOutputs({
      taskId: options.taskId,
    });
  }

  getTaskStepEvents(options: {
    stepId: string;
    after?: number;
    headers: IncomingHttpHeaders;
  }): Observable<{ events: SerializedTaskEvent[] }> {
    return new ObservableImpl(observer => {
      const { stepId, headers } = options;

      let after = options.after;
      let cancelled = false;

      (async () => {
        while (!cancelled) {
          const result = await this.scaffolderClient.listEvents({
            taskId: stepId,
            after,
            headers,
          });
          const { events } = result;
          if (events.length) {
            after = events[events.length - 1].id;
            observer.next(result);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      })();

      return () => {
        cancelled = true;
      };
    });
  }
}
