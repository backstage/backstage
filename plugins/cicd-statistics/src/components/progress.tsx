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

import React, { CSSProperties, DependencyList } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { Box, LinearProgress } from '@material-ui/core';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot, { TimelineDotProps } from '@material-ui/lab/TimelineDot';
import Alert from '@material-ui/lab/Alert';
import { useApp } from '@backstage/core-plugin-api';

const stepProgressStyle: CSSProperties = {
  marginTop: 6,
};

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

export interface ProgressStep extends ProgessAsSingle {
  title: string;
}
export interface ProgessAsSteps {
  steps: Array<ProgressStep>;
}
export interface ProgessAsSingle<T = number> {
  progress?: T;
  progressBuffer?: T;
}

export type ProgessState<T = number> =
  | ProgessAsSingle<T>
  | (T extends number ? ProgessAsSteps : { steps?: undefined });

export type ProgressAsLoading = ProgessState & {
  loading: true;
  error?: undefined;
  value?: undefined;
};
export type ProgressAsError = ProgessState<undefined> & {
  loading?: false | undefined;
  error: Error;
  value?: undefined;
};
export type ProgressAsValue<T> = ProgessState<undefined> & {
  loading?: false | undefined;
  error?: undefined;
  value: T;
};

/**
 * An AsyncState but with the addition of progress (decimal 0-1) to allow
 * rendering a progress bar while waiting.
 */
export type ProgressType<T> =
  | ProgressAsLoading
  | ProgressAsError
  | ProgressAsValue<T>;

const sentry = Symbol();

/**
 * Casts an AsyncState or Progress into its non-succeeded sub types
 */
type Unsuccessful<S extends ProgressType<any> | AsyncState<any>> =
  S extends ProgressType<any>
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
export function useAsyncChain<S extends ProgressType<any> | AsyncState<any>, R>(
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
  state: ProgressType<T> | AsyncState<T>,
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

  const stateAsSingleProgress = state as ProgessAsSingle;
  const stateAsStepProgress = state as ProgessAsSteps;

  if (
    !stateAsSingleProgress.progress &&
    !stateAsSingleProgress.progressBuffer &&
    !stateAsStepProgress.steps
  ) {
    // Simple spinner
    return <Progress />;
  } else if (stateAsSingleProgress.progress !== undefined) {
    // Simple _single_ progress
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="buffer"
          value={(stateAsSingleProgress.progress ?? 0) * 100}
          valueBuffer={(stateAsSingleProgress.progressBuffer ?? 0) * 100}
        />
      </Box>
    );
  }

  // Multi-step progresses

  return (
    <Box sx={{ width: '100%' }}>
      <Timeline>
        {stateAsStepProgress.steps.map((step, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent>{step.title}</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={getDotColor(step)} />
              {index < stateAsStepProgress.steps.length - 1 ? (
                <TimelineConnector />
              ) : null}
            </TimelineSeparator>
            <TimelineContent>
              {!step.progress && !step.progressBuffer ? null : (
                <LinearProgress
                  style={stepProgressStyle}
                  variant="buffer"
                  value={(step.progress ?? 0) * 100}
                  valueBuffer={(step.progressBuffer ?? 0) * 100}
                />
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}

function getDotColor(step: ProgressStep): TimelineDotProps['color'] {
  const progress = step.progress ?? 0;

  if (progress >= 1) {
    return 'primary';
  } else if (progress > 0) {
    return 'secondary';
  }
  return 'grey';
}
