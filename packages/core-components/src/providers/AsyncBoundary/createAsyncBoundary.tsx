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

import React, {
  ComponentType,
  createContext,
  PropsWithChildren,
  useContext,
} from 'react';
import { Alert } from '@material-ui/lab';
import { useApp } from '@backstage/core-plugin-api';

export interface AsyncState<T> {
  value: T | undefined;
  loading: boolean;
  error: Error | undefined;
}

export interface AsyncBoundaryProps<T> {
  asyncValue: AsyncState<T>;
  progress?: React.ReactNode;
  error?: ComponentType<{ error: Error }>;
}

export interface AsyncBoundaryResult<T> {
  AsyncBoundary: ComponentType<PropsWithChildren<AsyncBoundaryProps<T>>>;
  useAsyncValue: () => T;
}

const DefaultErrorComponent: ComponentType<{ error: Error }> = ({ error }) => (
  <Alert severity="error">{error.message}</Alert>
);

/**
 * Creates an async boundary provider and hook given a certain type
 */
export function createAsyncBoundary<T>(): AsyncBoundaryResult<T> {
  const context = createContext<T>(undefined as any);

  function AsyncBoundary(props: PropsWithChildren<AsyncBoundaryProps<T>>) {
    const { Progress } = useApp().getComponents();

    const {
      children,
      asyncValue,
      error: ErrorComponent = DefaultErrorComponent,
      progress = <Progress />,
    } = props;

    if (asyncValue.loading) {
      return <>{progress}</>;
    } else if (asyncValue.error) {
      return <ErrorComponent error={asyncValue.error} />;
    }

    return <context.Provider value={asyncValue.value!} children={children} />;
  }

  function useAsyncValue(): T {
    return useContext(context);
  }

  return { AsyncBoundary, useAsyncValue };
}
