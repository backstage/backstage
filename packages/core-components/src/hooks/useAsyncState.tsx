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

import React, { ComponentType, DependencyList, isValidElement } from 'react';
import { Alert } from '@material-ui/lab';
import { useApp } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';

export interface AsyncState<T> {
  loading?: boolean | undefined;
  error?: Error | undefined;
  value?: T | undefined;
}

export interface AsyncFallbackOptions {
  progress?: JSX.Element | ComponentType<{}>;
  error?: JSX.Element | ComponentType<{ error: Error }>;
}

const DefaultErrorComponent: ComponentType<{ error: Error }> = ({ error }) => (
  <Alert severity="error">{error.message}</Alert>
);

export type AsyncFallbackResult<T> =
  | { fallback: undefined; value: T }
  | {
      fallback: JSX.Element;
      value: undefined;
    };

/**
 * Extract either a fallback component (progress or error) or the synchronous
 * _value_ from an _async value_ such as one returned from `useAsync` (in the
 * `react-use` package).
 *
 * An optional second argument can provide the fallback `progress` and/or
 * `error` component. They will default to what's configured for Backstage, but
 * can be either a JSX.Element or a React Component. The `error` component can
 * have an `error` prop.
 *
 * **Note: You probably want to use useAsyncDefaults() instead**
 *
 * @example
 *   const users = useAsync(
 *     () => fetchUsersFromBackend(),
 *     []
 *   );
 *   const state = useAsyncState(users);
 *   return state.fallback ?? <UserList users={state.value} />;
 *
 * @returns
 *   An object with either a property `fallback` being a JSX.Element to render,
 *   or a `value` property.
 */
export function useAsyncState<T>(
  state: AsyncState<T>,
  opts: AsyncFallbackOptions = {},
): AsyncFallbackResult<T> {
  const { Progress } = useApp().getComponents();

  const {
    progress: ProgressComponent = Progress,
    error: ErrorComponent = DefaultErrorComponent,
  } = opts;

  if (state.loading) {
    return {
      fallback: renderComponentOrElement(ProgressComponent, {}),
      value: undefined,
    };
  } else if (state.error) {
    return {
      fallback: renderComponentOrElement(ErrorComponent, {
        error: state.error,
      }),
      value: undefined,
    };
  }

  return { fallback: undefined, value: state.value! };
}

/**
 * Similar to `useAsync` from `react-use`, this function takes the same first
 * two arguments, and an optional object which is the same as to
 * `useAsyncState`.
 *
 * It returns the same as `useAsyncState`, and object with a `value` or
 * `fallback` property, which can act as a type guard. If the `fallback`
 * property is set, it should be rendered, otherwise `value` contains the
 * synchronous value.
 */
export function useAsyncDefaults<T>(
  fn: (...args: []) => Promise<T>,
  deps: DependencyList = [],
  opts: AsyncFallbackOptions = {},
): AsyncFallbackResult<T> {
  const asyncValue = useAsync(fn, deps);
  return useAsyncState(asyncValue, opts);
}

function renderComponentOrElement<P extends {}>(
  componentOrElement: JSX.Element | ComponentType<P>,
  props: P,
): JSX.Element {
  const ComponentAsComponent = componentOrElement as ComponentType<P>;

  return isValidElement(componentOrElement) ? (
    componentOrElement
  ) : (
    <ComponentAsComponent {...props} />
  );
}
