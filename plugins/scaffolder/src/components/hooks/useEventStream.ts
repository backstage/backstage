/*
 * Copyright 2021 Spotify AB
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
import { scaffolderApiRef, LogEvent } from '../../api';
import { ScaffolderTask, Status } from '../../types';
import { Subscription, useApi } from '@backstage/core';

type Step = {
  id: string;
  status: Status;
  endedAt?: string;
  startedAt?: string;
};

export type TaskStream = {
  loading: boolean;
  error?: Error;
  log: string[];
  completed: boolean;
  task?: ScaffolderTask;
  steps: { [stepId in string]: Step };
};

type ReducerLogEntry = {
  createdAt: string;
  body: { stepId?: string; status?: Status; message: string };
};

type ReducerAction =
  | { type: 'INIT'; data: ScaffolderTask }
  | { type: 'LOGS'; data: ReducerLogEntry[] }
  | { type: 'COMPLETED' }
  | { type: 'ERROR'; data: Error };

function reducer(draft: TaskStream, action: ReducerAction) {
  switch (action.type) {
    case 'INIT': {
      draft.steps = action.data.spec.steps.reduce((current, next) => {
        current[next.id] = { status: 'open', id: next.id };
        return current;
      }, {} as { [stepId in string]: Step });
      draft.loading = false;
      draft.error = undefined;
      draft.completed = false;
      draft.task = action.data;
      draft.log = [];
      return;
    }

    case 'LOGS': {
      const entries = action.data;
      const logLines = [];
      for (const entry of entries) {
        const logLine = `${entry.createdAt} ${entry.body.message}`;
        logLines.push(logLine);

        if (!entry.body.stepId || !draft.steps?.[entry.body.stepId]) {
          continue;
        }

        const currentStep = draft.steps?.[entry.body.stepId];

        if (entry.body.status && entry.body.status !== currentStep.status) {
          currentStep.status = entry.body.status;

          if (currentStep.status === 'processing') {
            currentStep.startedAt = entry.createdAt;
          }

          if (
            ['cancelled', 'failed', 'completed'].includes(currentStep.status)
          ) {
            currentStep.endedAt = entry.createdAt;
          }
        }
      }

      draft.log.push(...logLines);
      return;
    }

    case 'COMPLETED': {
      draft.completed = true;
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

export const useTaskEventStream = (taskId: string): TaskStream => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const [state, dispatch] = useImmerReducer(reducer, {
    loading: true,
    completed: false,
    log: [],
    steps: {} as { [stepId in string]: Step },
  });

  useEffect(() => {
    let didCancel = false;
    let subscription: Subscription | undefined;
    let logPusher: NodeJS.Timeout | undefined;

    scaffolderApi.getTask(taskId).then(
      task => {
        if (didCancel) {
          return;
        }
        dispatch({ type: 'INIT', data: task });
        const observable = scaffolderApi.streamLogs({ taskId });

        const collectedLogEvents = new Array<LogEvent>();

        function emitLogs() {
          if (collectedLogEvents.length) {
            const logs = collectedLogEvents.splice(
              0,
              collectedLogEvents.length,
            );
            dispatch({ type: 'LOGS', data: logs });
          }
        }

        logPusher = setInterval(emitLogs, 500);

        subscription = observable.subscribe({
          next: event => {
            switch (event.type) {
              case 'log':
                return collectedLogEvents.push(event);
              default:
                throw new Error(
                  `Unhandled event type ${event.type} in observer`,
                );
            }
          },
          error: error => {
            emitLogs();
            dispatch({ type: 'ERROR', data: error });
          },
          complete: () => {
            emitLogs();
            dispatch({ type: 'COMPLETED' });
          },
        });
      },
      error => {
        if (!didCancel) {
          dispatch({ type: 'ERROR', data: error });
        }
      },
    );

    return () => {
      didCancel = true;
      if (subscription) {
        subscription.unsubscribe();
      }
      if (logPusher) {
        clearInterval(logPusher);
      }
    };
  }, [scaffolderApi, dispatch, taskId]);

  return state;
};
