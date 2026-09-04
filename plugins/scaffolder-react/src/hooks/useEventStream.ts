/*
 * Copyright 2021 The Backstage Authors
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
import { useImmerReducer } from 'use-immer';
import { useEffect } from 'react';

import { useApi } from '@backstage/core-plugin-api';
import { Subscription } from '@backstage/types';
import {
  ScaffolderTaskStatus,
  ScaffolderTaskOutput,
  ScaffolderTask,
  LogEvent,
} from '@backstage/plugin-scaffolder-common';
import { scaffolderApiRef } from '../api';

/**
 * The status of the step being processed
 *
 * @public
 */
export type ScaffolderStep = {
  id: string;
  status: ScaffolderTaskStatus;
  endedAt?: string;
  startedAt?: string;
};

/**
 * A task event from the event stream
 *
 * @public
 */
export type TaskStream = {
  cancelled: boolean;
  loading: boolean;
  error?: Error;
  stepLogs: { [stepId in string]: string[] };
  completed: boolean;
  task?: ScaffolderTask;
  steps: { [stepId in string]: ScaffolderStep };
  output?: ScaffolderTaskOutput;
};

type ReducerLogEntry = {
  createdAt: string;
  body: {
    stepId?: string;
    status?: ScaffolderTaskStatus;
    message: string;
    output?: ScaffolderTaskOutput;
    error?: Error;
    recoverStrategy?: 'none' | 'startOver';
  };
};

type ReducerAction =
  | { type: 'INIT'; data: ScaffolderTask }
  | { type: 'CANCELLED' }
  | { type: 'RECOVERED'; data: ReducerLogEntry }
  | { type: 'LOGS'; data: ReducerLogEntry[] }
  | { type: 'COMPLETED'; data: ReducerLogEntry }
  | { type: 'ERROR'; data: Error };

function reducer(draft: TaskStream, action: ReducerAction) {
  switch (action.type) {
    case 'INIT': {
      draft.steps = action.data.spec.steps.reduce((current, next) => {
        current[next.id] = { status: 'open', id: next.id };
        return current;
      }, {} as { [stepId in string]: ScaffolderStep });
      draft.stepLogs = action.data.spec.steps.reduce((current, next) => {
        current[next.id] = [];
        return current;
      }, {} as { [stepId in string]: string[] });
      draft.error = undefined;
      draft.completed = false;
      draft.task = action.data;
      return;
    }

    case 'LOGS': {
      const entries = action.data;
      const logLines = [];

      // only set loading as false once we have logs,
      // otherwise things flicker from pending to loaded.
      if (draft.loading && entries.length > 0) {
        draft.loading = false;
      }

      for (const entry of entries) {
        const logLine = `${entry.createdAt} ${entry.body.message}`;
        logLines.push(logLine);

        if (!entry.body.stepId || !draft.steps?.[entry.body.stepId]) {
          continue;
        }

        const currentStepLog = draft.stepLogs?.[entry.body.stepId];
        const currentStep = draft.steps?.[entry.body.stepId];

        if (currentStep) {
          if (entry.body.status && entry.body.status !== currentStep.status) {
            currentStep.status = entry.body.status;

            if (currentStep.status === 'processing') {
              currentStep.startedAt = entry.createdAt;
            }

            if (
              ['cancelled', 'completed', 'failed'].includes(currentStep.status)
            ) {
              currentStep.endedAt = entry.createdAt;
            }
          }
        }

        currentStepLog?.push(logLine);
      }

      return;
    }

    case 'COMPLETED': {
      draft.completed = true;
      draft.output = action.data.body.output;
      draft.error = action.data.body.error;

      return;
    }

    case 'CANCELLED': {
      draft.cancelled = true;
      return;
    }

    case 'RECOVERED': {
      draft.cancelled = false;
      draft.completed = false;
      draft.output = undefined;
      draft.error = undefined;

      for (const stepId in draft.steps) {
        if (draft.steps.hasOwnProperty(stepId)) {
          draft.steps[stepId].startedAt = undefined;
          draft.steps[stepId].endedAt = undefined;
          draft.steps[stepId].status = 'open';
        }
      }
      return;
    }

    case 'ERROR': {
      draft.error = action.data;
      draft.loading = false;
      draft.completed = true;
      return;
    }

    default:
      return;
  }
}

/**
 * A hook to stream the logs of a task being processed
 *
 * @public
 */
export const useTaskEventStream = (taskId: string): TaskStream => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const [state, dispatch] = useImmerReducer(reducer, {
    cancelled: false,
    loading: true,
    completed: false,
    stepLogs: {} as { [stepId in string]: string[] },
    steps: {} as { [stepId in string]: ScaffolderStep },
  });

  useEffect(() => {
    let didCancel = false;
    let subscription: Subscription | undefined;
    let logPusher: NodeJS.Timeout | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let retryCount = 1;
    let isTaskRecoverable = false;
    let lastSeenEventId: number | undefined;
    let isStreamComplete = false;
    let hasInitialized = false;
    let startGeneration = 0;

    const cleanUpStream = () => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = undefined;
      }
      if (logPusher) {
        clearInterval(logPusher);
        logPusher = undefined;
      }
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = undefined;
      }
    };

    function reconnectStream() {
      const generation = ++startGeneration;
      cleanUpStream();
      subscribeToStream(generation);
    }

    function subscribeToStream(generation: number) {
      const observable = scaffolderApi.streamLogs({
        isTaskRecoverable,
        taskId,
        after: lastSeenEventId,
      });

      const collectedLogEvents = new Array<LogEvent>();

      function emitLogs() {
        if (collectedLogEvents.length) {
          const logs = collectedLogEvents.splice(0, collectedLogEvents.length);
          dispatch({ type: 'LOGS', data: logs });
        }
      }

      logPusher = setInterval(emitLogs, 500);

      subscription = observable.subscribe({
        next: event => {
          retryCount = 1;
          if (event.id !== undefined) {
            lastSeenEventId = event.id;
          }
          switch (event.type) {
            case 'log':
              return collectedLogEvents.push(event);
            case 'cancelled':
              isStreamComplete = true;
              dispatch({ type: 'CANCELLED' });
              return undefined;
            case 'completion':
              isStreamComplete = true;
              emitLogs();
              dispatch({ type: 'COMPLETED', data: event });
              return undefined;
            case 'recovered':
              dispatch({ type: 'RECOVERED', data: event });
              return undefined;
            default:
              throw new Error(`Unhandled event type ${event.type} in observer`);
          }
        },
        error: error => {
          emitLogs();
          cleanUpStream();

          if (generation !== startGeneration || didCancel) return;

          const maxRetries = 3;

          if (!error.message) {
            error.message = `We cannot connect at the moment, trying again in some seconds... Retrying (${
              retryCount > maxRetries ? maxRetries : retryCount
            }/${maxRetries} retries)`;
          }

          retryTimer = setTimeout(() => {
            retryTimer = undefined;
            retryCount += 1;
            reconnectStream();
          }, 15000);

          dispatch({ type: 'ERROR', data: error });
        },
      });
    }

    const startStreamLogProcess = () => {
      const generation = ++startGeneration;
      cleanUpStream();

      return scaffolderApi.getTask(taskId).then(
        task => {
          if (didCancel || generation !== startGeneration) {
            return;
          }
          isTaskRecoverable =
            task.spec.EXPERIMENTAL_recovery?.EXPERIMENTAL_strategy ===
            'startOver';

          hasInitialized = true;
          dispatch({ type: 'INIT', data: task });
          subscribeToStream(generation);
        },
        error => {
          if (!didCancel && generation === startGeneration) {
            dispatch({ type: 'ERROR', data: error });
          }
        },
      );
    };
    void startStreamLogProcess();

    const onVisibilityChange = () => {
      if (didCancel || isStreamComplete) return;
      if (document.hidden) {
        cleanUpStream();
      } else if (hasInitialized) {
        reconnectStream();
      } else {
        void startStreamLogProcess();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (!isTaskRecoverable) {
        didCancel = true;
        cleanUpStream();
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [scaffolderApi, dispatch, taskId]);

  return state;
};
