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
import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { tasksApiRef } from '../apis';
import { type TaskTriggerResult } from './types';
import { type Task } from '@backstage/plugin-tasks-common';

/**
 * @public
 */
export interface TasksByPlugin {
  [pluginId: string]: Task[];
}

/**
 * @public
 */
export interface UseTasksReturn {
  tasks: Task[];
  tasksByPlugin: TasksByPlugin;
  loading: boolean;
  error: Error | undefined;
  refreshTasks: () => void;
  backgroundRefresh: () => void;
  triggerTask: (taskId: string) => Promise<TaskTriggerResult>;
  triggeringTasks: Set<string>;
  isBackgroundRefreshing: boolean;
}

/**
 * Optimized hook for task management with memoization
 * Prevents unnecessary re-renders by memoizing derived values
 * Supports background refresh to avoid UI flashing
 *
 * @public
 */
export function useTasks(): UseTasksReturn {
  const tasksApi = useApi(tasksApiRef);
  const [refreshKey, setRefreshKey] = useState(0);
  const [triggeringTasks, setTriggeringTasks] = useState<Set<string>>(
    new Set(),
  );
  const [isBackgroundRefreshing, setIsBackgroundRefreshing] = useState(false);

  // Keep track of whether this is the initial load
  const hasInitiallyLoaded = useRef(false);

  // Keep previous tasks for comparison
  const previousTasks = useRef<Task[]>([]);
  const [stableTasks, setStableTasks] = useState<Task[]>([]);

  // Simple deep comparison for task data
  const areTasksEqual = useCallback((task1: Task, task2: Task): boolean => {
    return (
      task1.id === task2.id &&
      task1.computed.status === task2.computed.status &&
      task1.computed.nextRunAt === task2.computed.nextRunAt &&
      task1.computed.lastRunEndedAt === task2.computed.lastRunEndedAt &&
      task1.computed.lastRunError === task2.computed.lastRunError &&
      task1.computed.workerStatus === task2.computed.workerStatus
    );
  }, []);

  const {
    value: rawTasks = [],
    loading,
    error,
  } = useAsync(async () => {
    const result = await tasksApi.getTasks();
    hasInitiallyLoaded.current = true;
    return result;
  }, [refreshKey]);

  // Update stable tasks only if data actually changed
  useEffect(() => {
    // Simple array comparison - check if arrays have same length and same task IDs
    const hasChanged =
      rawTasks.length !== previousTasks.current.length ||
      rawTasks.some(
        (task, index) =>
          !previousTasks.current[index] ||
          !areTasksEqual(task, previousTasks.current[index]),
      );

    if (hasChanged) {
      previousTasks.current = rawTasks;
      setStableTasks(rawTasks);
    }
  }, [rawTasks, areTasksEqual]);

  const refreshTasks = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Background refresh that doesn't trigger loading states
  const backgroundRefresh = useCallback(() => {
    if (!hasInitiallyLoaded.current) {
      // If we haven't loaded initially, use regular refresh
      refreshTasks();
      return;
    }

    setIsBackgroundRefreshing(true);
    // Only update the refresh key to trigger useAsync - single API call
    setRefreshKey(prev => prev + 1);

    // Small delay to prevent too rapid refresh indicators
    setTimeout(() => {
      setIsBackgroundRefreshing(false);
    }, 500);
  }, [refreshTasks]);

  const triggerTask = useCallback(
    async (taskId: string): Promise<TaskTriggerResult> => {
      setTriggeringTasks(prev => new Set(prev).add(taskId));

      try {
        await tasksApi.triggerTask(taskId);
        // Use background refresh after triggering to avoid flash
        setTimeout(() => {
          backgroundRefresh();
        }, 1000);

        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        return { success: false, error: errorMessage };
      } finally {
        setTriggeringTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
      }
    },
    [tasksApi, backgroundRefresh],
  );

  // Memoized grouping of tasks by plugin to prevent recalculation on every render
  const tasksByPlugin: TasksByPlugin = useMemo(() => {
    return stableTasks.reduce((acc: TasksByPlugin, task: Task) => {
      if (!acc[task.pluginId]) {
        acc[task.pluginId] = [];
      }
      acc[task.pluginId].push(task);
      return acc;
    }, {});
  }, [stableTasks]);

  return {
    tasks: stableTasks,
    tasksByPlugin,
    loading: loading && !hasInitiallyLoaded.current, // Only show loading on initial load
    error,
    refreshTasks,
    backgroundRefresh,
    triggerTask,
    triggeringTasks,
    isBackgroundRefreshing,
  };
}
