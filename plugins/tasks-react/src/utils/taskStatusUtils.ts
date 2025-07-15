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
import { type Task } from '@backstage/plugin-tasks-common';
import { type TaskStatusItem } from '../components/TaskStatusDisplay';
import { type TaskStatusChipItem } from '../components/TaskStatusChips';

/**
 * Calculate task status counts from an array of tasks
 * @internal
 */
export function calculateTaskStatusCounts(tasks: Task[]): {
  running: number;
  idle: number;
  error: number;
  total: number;
} {
  return tasks.reduce(
    (acc, task) => {
      acc.total++;

      switch (task.computed.status) {
        case 'running':
          acc.running++;
          break;
        case 'idle':
          acc.idle++;
          break;
        case 'error':
        case 'failed':
          acc.error++;
          break;
        default:
          // Handle other statuses as idle for now
          acc.idle++;
          break;
      }

      return acc;
    },
    { running: 0, idle: 0, error: 0, total: 0 },
  );
}

/**
 * Convert task status counts to TaskStatusItem array for TaskStatusDisplay
 * @internal
 */
export function getTaskStatusItems(counts: {
  running: number;
  idle: number;
  error: number;
}): TaskStatusItem[] {
  return [
    {
      count: counts.running,
      label: 'running',
      color: 'primary',
    },
    {
      count: counts.error,
      label: 'with errors',
      color: 'error',
    },
    {
      count: counts.idle,
      label: 'idle',
      color: 'info',
    },
  ];
}

/**
 * Convert task status counts to TaskStatusChipItem array for TaskStatusChips
 * @internal
 */
export function getTaskStatusChipItems(counts: {
  running: number;
  idle: number;
  error: number;
}): TaskStatusChipItem[] {
  return [
    {
      count: counts.running,
      label: 'running',
      color: 'primary',
    },
    {
      count: counts.error,
      label: 'error',
      color: 'secondary',
    },
    {
      count: counts.idle,
      label: 'idle',
      variant: 'outlined',
    },
  ];
}

/**
 * Get summary text for task statistics
 * @internal
 */
export function getTaskSummaryText(counts: {
  total: number;
  running: number;
  error: number;
  pluginCount: number;
}): string {
  const parts = [
    `📊 ${counts.total} tasks across ${counts.pluginCount} plugins`,
  ];

  if (counts.running > 0) {
    parts.push(`🔄 ${counts.running} running`);
  }

  if (counts.error > 0) {
    parts.push(`❌ ${counts.error} with errors`);
  }

  return parts.join(' • ');
}
