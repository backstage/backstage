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
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { DefaultApiClient, type TypedResponse } from '../schema/openapi';
import { type TasksApi } from './TasksApi';
import { type Task } from '@backstage/plugin-tasks-common';
import {
  TasksApiError,
  TaskNotFoundError,
  TasksForbiddenError,
  TasksServerError,
} from './errors';

// Helper function to handle API responses and errors for JSON responses
async function handleApiResponseWithJson<T>(
  response: TypedResponse<T>,
  errorContext: string,
): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }

  return handleApiError(response, errorContext);
}

// Helper function to handle API responses for void responses (no body)
async function handleApiResponseVoid(
  response: TypedResponse<void>,
  errorContext: string,
): Promise<void> {
  if (response.ok) {
    return;
  }

  await handleApiError(response, errorContext);
}

// Common error handling logic
async function handleApiError(
  response: Response,
  errorContext: string,
): Promise<never> {
  // Handle specific HTTP status codes
  switch (response.status) {
    case 401:
      throw new TasksApiError(
        `Authentication required for ${errorContext}`,
        401,
        'Unauthorized',
      );
    case 403:
      throw new TasksForbiddenError(errorContext);
    case 404:
      throw new TaskNotFoundError(errorContext);
    case 429:
      throw new TasksApiError(
        `Rate limit exceeded for ${errorContext}`,
        429,
        'Too Many Requests',
      );
    case 500:
    case 502:
    case 503:
    case 504:
      throw new TasksServerError(`Service unavailable while ${errorContext}`);
    default:
      // For other errors, try to use ResponseError if available
      try {
        throw await ResponseError.fromResponse(response);
      } catch (error) {
        // Fallback if ResponseError.fromResponse fails
        throw new TasksApiError(
          `Failed to ${errorContext}: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
        );
      }
  }
}

/**
 * The default implementation of the TasksApi.
 * @public
 */
export class DefaultTasksApiClient implements TasksApi {
  private readonly api: DefaultApiClient;

  constructor({
    discoveryApi,
    fetchApi,
  }: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.api = new DefaultApiClient({
      discoveryApi,
      fetchApi: { fetch: fetchApi.fetch },
    });
  }

  async getTasks(): Promise<Task[]> {
    try {
      const response = await this.api.getTasks({});
      const tasks = await handleApiResponseWithJson(
        response,
        'fetch tasks list',
      );

      // Since interfaces are now aligned, we can directly cast
      return tasks as Task[];
    } catch (error: any) {
      // Re-throw known errors as-is
      if (error instanceof TasksApiError || error instanceof ResponseError) {
        throw error;
      }
      // Wrap unexpected errors
      throw new TasksServerError(
        `Unexpected error while fetching tasks: ${
          error.message || String(error)
        }`,
      );
    }
  }

  async getTask(id: string): Promise<Task | undefined> {
    try {
      const response = await this.api.getTask({ path: { id } });
      const task = await handleApiResponseWithJson(
        response,
        `fetch task '${id}'`,
      );

      // Since interfaces are now aligned, we can directly cast
      return task as Task;
    } catch (error: any) {
      // Handle 404 specifically by returning undefined
      if (error instanceof TaskNotFoundError || error.status === 404) {
        return undefined;
      }
      // Re-throw known errors as-is
      if (error instanceof TasksApiError || error instanceof ResponseError) {
        throw error;
      }
      // Wrap unexpected errors
      throw new TasksServerError(
        `Unexpected error while fetching task '${id}': ${
          error.message || String(error)
        }`,
      );
    }
  }

  async triggerTask(id: string): Promise<void> {
    try {
      const response = await this.api.triggerTask({ path: { id } });
      // Fixed: Use void response handler since trigger task returns no body
      await handleApiResponseVoid(response, `trigger task '${id}'`);
    } catch (error: any) {
      // Re-throw known errors as-is
      if (error instanceof TasksApiError || error instanceof ResponseError) {
        throw error;
      }
      // Wrap unexpected errors
      throw new TasksServerError(
        `Unexpected error while triggering task '${id}': ${
          error.message || String(error)
        }`,
      );
    }
  }
}
