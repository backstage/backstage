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
import { useApi } from '@backstage/core-plugin-api';
import { useCallback, useState, useEffect } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { tasksApiRef } from '../apis';
import { type Task } from '@backstage/plugin-tasks-common';
import { type TaskTriggerResult } from './types';

/**
 * @public
 */
export interface UseTaskReturn {
  task: Task | undefined;
  loading: boolean;
  error: Error | undefined;
  refreshTask: () => void;
  triggerTask: () => Promise<TaskTriggerResult>;
  isTriggering: boolean;
}

/**
 * @public
 */
export interface UseTaskOptions {
  /** The ID of the task to retrieve */
  taskId: string;
  /** Whether to automatically refresh the task periodically */
  autoRefresh?: boolean;
  /** Auto refresh interval in milliseconds (default: 30000ms = 30s) */
  autoRefreshInterval?: number;
}

/**
 * @public
 */
export function useTask(options: UseTaskOptions): UseTaskReturn {
  const { taskId, autoRefresh = false, autoRefreshInterval = 30000 } = options;
  const tasksApi = useApi(tasksApiRef);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isTriggering, setIsTriggering] = useState(false);

  const {
    value: task,
    loading,
    error,
  } = useAsync(async () => {
    if (!taskId) {
      return undefined;
    }
    return await tasksApi.getTask(taskId);
  }, [taskId, refreshKey]);

  const refreshTask = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const triggerTask = useCallback(async (): Promise<TaskTriggerResult> => {
    if (!taskId) {
      return { success: false, error: 'No task ID provided' };
    }

    setIsTriggering(true);

    try {
      await tasksApi.triggerTask(taskId);
      // Refresh task after a short delay to see updated status
      setTimeout(() => {
        refreshTask();
      }, 1000);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: errorMessage };
    } finally {
      setIsTriggering(false);
    }
  }, [taskId, tasksApi, refreshTask]);

  // Auto refresh functionality
  useEffect(() => {
    if (!autoRefresh || !taskId) {
      return undefined;
    }

    const interval = setInterval(() => {
      refreshTask();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, autoRefreshInterval, taskId, refreshTask]);

  return {
    task,
    loading,
    error,
    refreshTask,
    triggerTask,
    isTriggering,
  };
}
