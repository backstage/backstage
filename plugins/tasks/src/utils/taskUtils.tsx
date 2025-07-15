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
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { CircularProgress } from '@material-ui/core';
import { type JSX } from 'react';
import { type Task } from '@backstage/plugin-tasks-common';
import {
  humanizeDuration,
  formatLastRun,
  formatNextRun,
  formatAbsoluteDateTime,
} from './timeUtils';

export function getWorkerStatusInfo(
  workerStatus?: string,
  task?: Task,
): {
  label: string;
  icon: string;
  colorVariant: 'warning' | 'info' | 'default' | 'error' | 'success';
  tooltip: string;
} {
  switch (workerStatus?.toLowerCase()) {
    case 'initial-wait': {
      const initialDelay = task?.task?.settings?.initialDelayDuration;
      const delayText = initialDelay
        ? ` (${humanizeDuration(initialDelay)})`
        : '';
      return {
        label: `Initial wait${delayText}`,
        icon: '⏳',
        colorVariant: 'warning',
        tooltip:
          'Worker is waiting at service startup before starting to look for work, to give the service time to stabilize. This initial delay helps prevent resource conflicts during system boot.',
      };
    }
    case 'idle':
      return {
        label: 'Worker idle',
        icon: '😴',
        colorVariant: 'default',
        tooltip:
          'Worker is not currently running this task. The task is waiting for its next scheduled execution time.',
      };
    case 'running':
      return {
        label: 'Worker active',
        icon: '⚡',
        colorVariant: 'info',
        tooltip:
          'Worker is currently executing this task. The task will timeout if it exceeds the configured timeout duration.',
      };
    default:
      return {
        label: workerStatus || 'Unknown',
        icon: '❓',
        colorVariant: 'default',
        tooltip: 'Worker status is unknown or not available.',
      };
  }
}

export function getScopeTooltip(scope: string): string {
  if (scope === 'global') {
    return 'Global scope: Runs on one worker node at a time without overlaps. Ensures only one instance of this task runs across all backend instances.';
  }
  return 'Local scope: Runs on each worker node with potential overlaps, similar to setInterval. Multiple instances can run simultaneously across different backend nodes.';
}

export function getCadenceTooltip(cadence: string): string {
  if (cadence === 'manual') {
    return 'Manual scheduling: This task only runs when manually triggered via the API or UI.';
  }
  if (cadence.startsWith('PT') || cadence.startsWith('P')) {
    return `ISO Duration: ${cadence}`;
  }
  if (cadence.includes(' ')) {
    return `Cron Expression: ${cadence}`;
  }
  return 'Custom scheduling configuration for this task.';
}

export function getTimeoutTooltip(timeoutDuration?: string): string {
  if (!timeoutDuration) {
    return 'No timeout configured for this task.';
  }
  return `Timeout: Task will be considered timed out and available for retries after ${humanizeDuration(
    timeoutDuration,
  )} of execution.`;
}

export function getInitialDelayTooltip(initialDelayDuration?: string): string {
  if (!initialDelayDuration) {
    return 'No initial delay configured for this task.';
  }
  return `Initial delay: This task will only start after application has been running for ${humanizeDuration(
    initialDelayDuration,
  )}.`;
}

export function getNextRunTooltip(task: Task): string {
  const isRunning = task.computed.status === 'running';
  const isWaiting = task.computed.workerStatus === 'initial-wait';

  // Running task tooltips
  if (isRunning) {
    if (task.computed.timesOutAt) {
      const timeoutDuration = task.task.settings?.timeoutAfterDuration;
      const durationText = timeoutDuration
        ? ` (after ${humanizeDuration(timeoutDuration)})`
        : '';
      return `Task is currently running and will timeout ${formatNextRun(
        task.computed.timesOutAt,
      )}${durationText}.`;
    }

    if (task.computed.cadence && task.computed.cadence !== 'manual') {
      return 'Task is currently running with no configured timeout.';
    }

    return 'Task is running manually with no timeout.';
  }

  // Manual only tasks
  if (
    !task.computed.nextRunAt &&
    (!task.computed.cadence || task.computed.cadence === 'manual')
  ) {
    return 'This task has no scheduled runs and can only be triggered manually.';
  }

  // Scheduled tasks
  if (task.computed.nextRunAt) {
    const formattedNextRun = formatNextRun(task.computed.nextRunAt);

    if (isWaiting) {
      const initialDelay = task.task?.settings?.initialDelayDuration;
      const delayText = initialDelay
        ? ` of ${humanizeDuration(initialDelay)}`
        : '';
      return `Worker is in initial wait period${delayText}. Task will start ${formattedNextRun}.`;
    }

    return `Task is scheduled to run ${formatAbsoluteDateTime(
      task.computed.nextRunAt,
    )}.`;
  }

  // Fallback for tasks with cadence but no nextRunAt
  if (task.computed.cadence && task.computed.cadence !== 'manual') {
    return `Task runs every ${humanizeDuration(
      task.computed.cadence,
    )}. Next run time not yet calculated.`;
  }

  return 'Task scheduling information not available.';
}

// Simplified pill utilities for two-pill layout
export function getLastRunPill(
  task: Task,
  theme: any,
): {
  label: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  icon: JSX.Element;
} {
  const isRunning = task.computed.status === 'running';

  // If currently running, show running status
  if (isRunning) {
    return {
      label: 'Running',
      color: theme.palette.info.main,
      backgroundColor: `${theme.palette.info.main}08`,
      borderColor: theme.palette.info.main,
      icon: (
        <CircularProgress
          style={{ color: theme.palette.info.main }}
          size={12}
          variant="indeterminate"
        />
      ),
    };
  }

  // Show last run status if available
  const lastRunTime = task.computed.lastRunEndedAt;
  if (lastRunTime) {
    const lastRunFormatted = formatLastRun(new Date(lastRunTime));

    if (task.computed.lastRunError) {
      return {
        label: `Failed ${lastRunFormatted}`,
        color: theme.palette.error.main,
        backgroundColor: `${theme.palette.error.main}08`,
        borderColor: theme.palette.error.main,
        icon: <ErrorOutlineIcon style={{ color: theme.palette.error.main }} />,
      };
    }

    return {
      label: `Success ${lastRunFormatted}`,
      color: theme.palette.success.main,
      backgroundColor: `${theme.palette.success.main}08`,
      borderColor: theme.palette.success.main,
      icon: (
        <CheckCircleOutlineIcon style={{ color: theme.palette.success.main }} />
      ),
    };
  }

  // Never run yet
  return {
    label: 'Never run',
    color: theme.palette.text.secondary,
    backgroundColor: `${theme.palette.text.secondary}08`,
    borderColor: theme.palette.text.secondary,
    icon: <CancelIcon style={{ color: theme.palette.text.secondary }} />,
  };
}

export function getNextRunPill(
  task: Task,
  theme: any,
): {
  label: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  icon: JSX.Element;
} {
  const isRunning = task.computed.status === 'running';

  // If running and has timeout, show timeout
  if (isRunning && task.computed.timesOutAt) {
    const formattedTimeout = formatNextRun(task.computed.timesOutAt);
    return {
      label: `Times out ${formattedTimeout}`,
      color: theme.palette.warning.main,
      backgroundColor: `${theme.palette.warning.main}08`,
      borderColor: theme.palette.warning.main,
      icon: <AccessTimeIcon style={{ color: theme.palette.warning.main }} />,
    };
  }

  // If running but no timeout, and task has cadence, show "No timeout"
  if (
    isRunning &&
    task.computed.cadence &&
    task.computed.cadence !== 'manual'
  ) {
    return {
      label: 'No timeout',
      color: theme.palette.info.main,
      backgroundColor: `${theme.palette.info.main}08`,
      borderColor: theme.palette.info.main,
      icon: <AccessTimeIcon style={{ color: theme.palette.info.main }} />,
    };
  }

  const formattedNextRun = formatNextRun(task.computed.nextRunAt);

  // Check if task has no schedule (manual only)
  if (
    !task.computed.nextRunAt &&
    (!task.computed.cadence || task.computed.cadence === 'manual')
  ) {
    return {
      label: 'Manual only',
      color: theme.palette.text.secondary,
      backgroundColor: `${theme.palette.text.secondary}08`,
      borderColor: theme.palette.text.secondary,
      icon: <AccessTimeIcon style={{ color: theme.palette.text.secondary }} />,
    };
  }

  // Show next run if available
  if (task.computed.nextRunAt) {
    return {
      label: `Next ${formattedNextRun}`,
      color: theme.palette.info.main,
      backgroundColor: `${theme.palette.info.main}08`,
      borderColor: theme.palette.info.main,
      icon: <AccessTimeIcon style={{ color: theme.palette.info.main }} />,
    };
  }

  // Fallback: if no nextRunAt but has cadence, show the cadence info
  if (task.computed.cadence && task.computed.cadence !== 'manual') {
    return {
      label: humanizeDuration(task.computed.cadence),
      color: theme.palette.info.main,
      backgroundColor: `${theme.palette.info.main}08`,
      borderColor: theme.palette.info.main,
      icon: <AccessTimeIcon style={{ color: theme.palette.info.main }} />,
    };
  }

  // Final fallback
  return {
    label: 'Manual only',
    color: theme.palette.text.secondary,
    backgroundColor: `${theme.palette.text.secondary}08`,
    borderColor: theme.palette.text.secondary,
    icon: <AccessTimeIcon style={{ color: theme.palette.text.secondary }} />,
  };
}
