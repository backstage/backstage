/*
 * Copyright 2025 The Backstage Authors
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

/**
 * @public
 */
export class TasksApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
  ) {
    super(message);
    this.name = 'TasksApiError';
  }
}
/**
 * @public
 */
export class TaskNotFoundError extends TasksApiError {
  constructor(taskId: string) {
    super(`Task '${taskId}' not found`, 404, 'Not Found');
    this.name = 'TaskNotFoundError';
  }
}

/**
 * @public
 */
export class TasksForbiddenError extends TasksApiError {
  constructor(action: string, taskId?: string) {
    const message = taskId
      ? `Access forbidden: Cannot ${action} task '${taskId}'`
      : `Access forbidden: Cannot ${action} tasks`;
    super(message, 403, 'Forbidden');
    this.name = 'TasksForbiddenError';
  }
}

/**
 * @public
 */
export class TasksServerError extends TasksApiError {
  constructor(message: string) {
    super(`Server error: ${message}`, 500, 'Internal Server Error');
    this.name = 'TasksServerError';
  }
}
