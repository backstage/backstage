/*
 * Copyright 2022 The Backstage Authors
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

import React, { DependencyList } from 'react';
import { useAsync } from 'react-use';
import { Box, LinearProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useApp } from '@backstage/core-plugin-api';

// Matching react-use, only has loading/error/value
type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: true;
      error?: Error | undefined;
      value?: T;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

export type ProgressAsLoading = {
  loading: true;
  progress?: number;
  progressBuffer?: number;
  error?: undefined;
  value?: undefined;
};
export type ProgressAsError = {
  loading?: false | undefined;
  progress?: undefined;
  progressBuffer?: undefined;
  error: Error;
  value?: undefined;
};
export type ProgressAsValue<T> = {
  loading?: false | undefined;
  progress?: undefined;
  progressBuffer?: undefined;
  error?: undefined;
  value: T;
};

/**
 * An AsyncState but with the addition of progress (decimal 0-1) to allow
 * rendering a progress bar while waiting.
 */
export type Progress<T> =
  | ProgressAsLoading
  | ProgressAsError
  | ProgressAsValue<T>;

const sentry = Symbol();

/**
 * Casts an AsyncState or Progress into its non-succeeded sub types
 */
type Unsuccessful<S extends Progress<any> | AsyncState<any>> =
  S extends Progress<any>
    ? ProgressAsLoading | ProgressAsError
    : Omit<AsyncState<any>, 'value'>;

/**
 * Similar to useAsync except it "waits" for a dependent (upstream) async state
 * to finish first, otherwise it forwards the dependent pending state.
 *
 * When/if the dependent state has settled successfully, the callback will be
 * invoked for a new layer of async state with the dependent (upstream) success
 * result as argument.
 */
export function useAsyncChain<S extends Progress<any> | AsyncState<any>, R>(
  parentState: S,
  fn: (value: NonNullable<S['value']>) => Promise<R>,
  deps: DependencyList,
): Unsuccessful<S> | AsyncState<R> {
  const childState = useAsync(
    async () => (!parentState.value ? sentry : fn(parentState.value)),
    [!parentState.error, !parentState.loading, parentState.value, ...deps],
  );

  if (!parentState.value) {
    return parentState as Unsuccessful<S>;
  } else if (childState.value === sentry) {
    return { loading: true };
  }
  return childState as AsyncState<R>;
}

export function renderFallbacks<T>(
  state: Progress<T> | AsyncState<T>,
  success: (value: T) => JSX.Element,
): JSX.Element {
  if (state.loading) {
    return <ViewProgress state={state} />;
  } else if (state.error) {
    return <Alert severity="error">{state.error.stack}</Alert>;
  }

  return success(state.value!);
}

export function ViewProgress({
  state,
}: {
  state: ProgressAsLoading | { loading: boolean };
}) {
  const { Progress } = useApp().getComponents();

  const stateAsProgress = state as ProgressAsLoading;

  if (!stateAsProgress.progress && !stateAsProgress.progressBuffer) {
    return <Progress />;
  }
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress
        variant="buffer"
        value={(stateAsProgress.progress ?? 0) * 100}
        valueBuffer={(stateAsProgress.progressBuffer ?? 0) * 100}
      />
    </Box>
  );
}
