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
import { useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { useApi } from '@backstage/core-plugin-api';
import {
  TaskStream,
  ScaffolderStep,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import {
  ScaffolderTaskStatus,
  ScaffolderTaskOutput,
  ScaffolderTask,
} from '@backstage/plugin-scaffolder-common';
import { goldenPathsApiRef } from '@backstage/plugin-golden-paths-react';
import { SerializedTaskEvent } from '@backstage/plugin-golden-paths-common';
import { isError, toString } from 'lodash';

import { useGoldenPathTaskContext } from '../../../useGoldenPathTaskContext';

type ReducerLogEntry = {
  createdAt: string;
  body: {
    stepId?: string;
    status?: ScaffolderTaskStatus;
    message: string;
    output?: ScaffolderTaskOutput;
    error?: Error;
    recoverStrategy?: string;
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
      draft.loading = false;
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
      if (isError(action.data.body.error)) {
        draft.error = action.data.body.error;
      }

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
export const useTemplateEventStream = (stepIndex: number): TaskStream => {
  const {
    value: {
      goldenPathTask: {
        id: taskId,
        spec: { steps: goldenPathSteps },
      },
      setTemplateStepId,
      fetchGoldenPathStatuses,
    },
  } = useGoldenPathTaskContext();
  const scaffolderApi = useApi(scaffolderApiRef);
  const goldenPathsApi = useApi(goldenPathsApiRef);
  const [state, dispatch] = useImmerReducer<TaskStream, ReducerAction>(
    reducer,
    {
      cancelled: false,
      loading: true,
      completed: false,
      stepLogs: {} as { [stepId in string]: string[] },
      steps: {} as { [stepId in string]: ScaffolderStep },
    },
  );

  useEffect(() => {
    let didCancel = false;
    let logPusher: NodeJS.Timeout | undefined;
    let isTaskRecoverable = false;
    let reader: ReadableStreamDefaultReader<Uint8Array>;

    const startStreamLogProcess = async () => {
      try {
        if (didCancel) {
          return;
        }

        const { id: stepId } = await goldenPathsApi.getTemplateStepId({
          taskId,
          templateId: goldenPathSteps[stepIndex].id,
        });
        setTemplateStepId(stepId);

        const templateTask = await scaffolderApi.getTask(stepId);

        isTaskRecoverable =
          templateTask.spec.EXPERIMENTAL_recovery?.EXPERIMENTAL_strategy ===
          'startOver';

        dispatch({ type: 'INIT', data: templateTask });
        fetchGoldenPathStatuses();

        const eventStream = await goldenPathsApi.getTemplateEventStream({
          taskId,
          stepId,
        });
        reader = eventStream.getReader();

        const collectedLogEvents = new Array<SerializedTaskEvent>();

        const emitLogs = () => {
          if (collectedLogEvents.length) {
            const logs = collectedLogEvents.splice(
              0,
              collectedLogEvents.length,
            );
            dispatch({ type: 'LOGS', data: logs });
          }
        };

        logPusher = setInterval(emitLogs, 500);

        reader
          .read()
          .then(function processText({ done, value }): Promise<null> | null {
            if (done) {
              return null;
            }

            const text = new TextDecoder().decode(value, { stream: true });
            const taskEvents: SerializedTaskEvent[] = text
              .split('\n')
              .filter(Boolean)
              .filter(v => v.includes('data:'))
              .map(x => JSON.parse(x.split('data: ')[1]));

            try {
              taskEvents.map(event => {
                switch (event.type) {
                  case 'log':
                    if (event.body.message.includes('Error: ')) {
                      dispatch({
                        type: 'ERROR',
                        data: new Error(
                          event.body.message.split('\n')[0].split('Error: ')[1],
                        ),
                      });
                    }
                    return collectedLogEvents.push(event);
                  case 'cancelled':
                    dispatch({ type: 'CANCELLED' });
                    return undefined;
                  case 'completion':
                    emitLogs();
                    dispatch({ type: 'COMPLETED', data: event });
                    fetchGoldenPathStatuses();
                    return undefined;
                  case 'recovered':
                    dispatch({ type: 'RECOVERED', data: event });
                    return undefined;
                  default:
                    throw new Error(
                      `Unhandled event type ${event.type} in event stream`,
                    );
                }
              });
            } catch (error) {
              dispatch({ type: 'ERROR', data: new Error(toString(error)) });
            }

            return reader.read().then(processText);
          });
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'ERROR', data: new Error(toString(error)) });
        }
      }
    };

    startStreamLogProcess();

    return () => {
      if (!isTaskRecoverable) {
        didCancel = true;

        if (reader) {
          reader.cancel();
        }

        if (logPusher) {
          clearInterval(logPusher);
        }
      }
    };
  }, [
    scaffolderApi,
    dispatch,
    goldenPathsApi,
    stepIndex,
    goldenPathSteps,
    taskId,
    setTemplateStepId,
    fetchGoldenPathStatuses,
  ]);

  return state;
};
