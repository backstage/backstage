/*
 * Copyright 2023 The Backstage Authors
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

import { OpaqueComponentRef } from '@internal/frontend';

/** @public */
export type ComponentRef<
  TInnerComponentProps = {},
  TExternalComponentProps = TInnerComponentProps,
> = {
  id: string;
  TProps: TInnerComponentProps;
  TExternalProps: TExternalComponentProps;
  $$type: '@backstage/ComponentRef';
};

export interface ComponentRefOptions<
  TInnerComponentProps extends object,
  TExternalComponentProps extends object,
  TMode extends 'sync' | 'async',
> {
  id: string;
  mode: TMode;
  defaultComponent?: TMode extends 'async'
    ? () => Promise<(props: TInnerComponentProps) => JSX.Element>
    : TMode extends 'sync'
    ? (props: TInnerComponentProps) => JSX.Element
    : never;
  transformProps?: (props: TExternalComponentProps) => TInnerComponentProps;
}

/**
 * Creates a new component ref that is synchronous.
 * @public
 */
export function createComponentRef<
  TInnerComponentProps extends object,
  TExternalComponentProps extends object = TInnerComponentProps,
>(
  options: ComponentRefOptions<
    TInnerComponentProps,
    TExternalComponentProps,
    'sync'
  >,
): ComponentRef<TInnerComponentProps, TExternalComponentProps>;

/**
 * Creates a new component ref that is asynchronous.
 * @public
 */
export function createComponentRef<
  TInnerComponentProps extends object,
  TExternalComponentProps extends object = TInnerComponentProps,
>(
  options: ComponentRefOptions<
    TInnerComponentProps,
    TExternalComponentProps,
    'async'
  >,
): ComponentRef<TInnerComponentProps, TExternalComponentProps>;

export function createComponentRef<
  TInnerComponentProps extends object,
  TExternalComponentProps extends object,
>(
  options: ComponentRefOptions<
    TInnerComponentProps,
    TExternalComponentProps,
    'async' | 'sync'
  >,
): ComponentRef<TInnerComponentProps, TExternalComponentProps> {
  return OpaqueComponentRef.createInstance('v1', {
    id: options.id,
    TProps: {} as TInnerComponentProps,
    TExternalProps: {} as TExternalComponentProps,
    toString() {
      return `ComponentRef{id=${options.id}}`;
    },
    options: {
      mode: options.mode,
      defaultComponent: options.defaultComponent,
      transformProps: options.transformProps,
    },
  });
}
