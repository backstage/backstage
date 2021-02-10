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
import { useEffect, useState } from 'react';
import { scaffolderApiRef } from '../../api';
import { ScaffolderTask } from '../../types';
import { useDebounce } from 'react-use';
import { Subscription, useApi } from '@backstage/core';

export type Status = 'open' | 'processing' | 'failed' | 'completed';
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

type ReducerAction =
  | {
      type: 'INIT';
      data: ScaffolderTask;
    }
  | {
      type: 'LOG';
      data: {
        createdAt: string;
        body: { stepId?: string; status?: Status; message: string };
      };
    }
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

    case 'LOG': {
      const stepId = action.data.body.stepId ?? 'global';
      const currentStep = draft.steps?.[stepId];
      const logLine = `${action.data.createdAt} ${action.data.body.message}`;

      draft.log.push(logLine);

      if (
        action.data.body.status &&
        action.data.body.status !== currentStep.status
      ) {
        currentStep.status = action.data.body.status;

        if (currentStep.status === 'processing') {
          currentStep.startedAt = action.data.createdAt;
        }

        if (['cancelled', 'failed', 'completed'].includes(currentStep.status)) {
          currentStep.endedAt = action.data.createdAt;
        }
      }

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
  // const [debouncedState, setDebouncedState] = useState(state);
  // useDebounce(
  //   () => {
  //     setDebouncedState(state);
  //   },
  //   1000,
  //   [state],
  // );
  useEffect(() => {
    let didCancel = false;
    let subscription: Subscription | undefined;

    scaffolderApi.getTask(taskId).then(
      task => {
        if (didCancel) {
          return;
        }
        dispatch({ type: 'INIT', data: task });
        const observable = scaffolderApi.streamLogs({ taskId });
        subscription = observable.subscribe({
          next: event => {
            switch (event.type) {
              case 'log':
                return dispatch({ type: 'LOG', data: event });
              default:
                throw new Error(
                  `Unhandled event type ${event.type} in observer`,
                );
            }
          },
          error: error => dispatch({ type: 'ERROR', data: error }),
          complete: () => dispatch({ type: 'COMPLETED' }),
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
    };
  }, [scaffolderApi, dispatch, taskId]);

  return state;
  // return debouncedState;
};
