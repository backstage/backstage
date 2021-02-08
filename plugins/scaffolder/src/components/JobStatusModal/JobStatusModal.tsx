/*
 * Copyright 2020 Spotify AB
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
import { Button, Observable, Subscription, useApi } from '@backstage/core';
import {
  Button as Action,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
} from '@material-ui/core';

import React, { useCallback, useEffect, useReducer } from 'react';
import { scaffolderApiRef } from '../../api';
import { ScaffolderV2Task } from '../../types';

type Props = {
  task: ScaffolderV2Task | null;
  toCatalogLink?: string;
  open: boolean;
  onModalClose: () => void;
};

type Step = {
  id: string;
  status: 'open' | 'processing' | 'failed' | 'completed';
};

type ReducerState = {
  loading: boolean;
  error?: Error;
  completed: boolean;

  task: ScaffolderV2Task;

  step: [{ [stepId in string]: Step }];
};

type ReducerAction =
  | {
      type: 'INIT';
      data: ScaffolderV2Task;
    }
  | { type: 'EVENT'; data: { body: { stepId: string } } }
  | { type: 'COMPLETED' }
  | { type: 'ERROR'; data: Error };

function reducer(state: ReducerState, action: ReducerAction) {
  const stepId = action.type === 'EVENT' ? action.data.body.stepId : 'global';
  const currentStep = state[stepId] ?? { log: [], status: 'open' };

  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        ...action.data,
      };
    case 'EVENT':
      return {
        ...state,
        [stepId]: {
          ...currentStep,
          log: [...currentStep.log, event],
        },
      };
    case 'COMPLETED':
      return {
        ...state,
        progress: 'done',
      };
    case 'ERROR':
      return {
        error: action.error,
        loading: false,
        completed: false,
      };
    default:
      return state;
  }
}

/*

{}

{
  id: as'das
  spec: {
    steps: [
      { id, log: []}
    ]
  }
}

*/
const useTaskEventStream = (taskId: string) => {
  // fetch task

  const scaffolderApi = useApi(scaffolderApiRef);
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
  });
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
          next: event => dispatch({ type: 'EVENT', data: event }),
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
  });

  return state;

  // subscribe to observable,

  // on observer change update the step logs etc + status

  // return {
  //   steps: {
  //     stepId: {
  //       log: [],
  //       status:
  //     }
  //   }
  // }
};

export const JobStatusModal = ({
  task,
  toCatalogLink,
  open,
  onModalClose,
}: Props) => {
  const model = useTaskEventStream(task?.id!);
  console.warn(model);
  const renderTitle = () => {
    switch (task?.status) {
      case 'completed':
        return 'Successfully created component';
      case 'failed':
        return 'Failed to create component';
      default:
        return 'Create component';
    }
  };
  const onClose = useCallback(() => {
    if (!task) {
      return;
    }
    // Disallow closing modal if the job is in progress.
    if (task.status !== 'processing') {
      onModalClose();
    }
  }, [task, onModalClose]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle id="responsive-dialog-title">{renderTitle()}</DialogTitle>
      <DialogContent>
        {/* {!task ? ( */}
        <LinearProgress />
        {/* ) : ( */}
        {/* (task?.spec.steps ?? []).map(step => ( */}
        {/* <JobStage */}
        {/* log={step.log} */}
        {/* name={step.name} */}
        {/* key={step.name} */}
        {/* startedAt={step.startedAt} */}
        {/* endedAt={step.endedAt} */}
        {/* status={step.status} */}
        {/* /> */}
        {/* )) */}
        {/*   )} */}
      </DialogContent>
      {/* {job?.status && toCatalogLink && (
        <DialogActions>
          <Button to={toCatalogLink}>View in catalog</Button>
        </DialogActions>
      )}
      {job?.status === 'FAILED' && (
        <DialogActions>
          <Action onClick={onClose}>Close</Action>
        </DialogActions>
      )} */}
    </Dialog>
  );
};
