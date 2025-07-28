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

/** @public */
export type ComponentRef<
  TInnerComponentProps,
  TExternalComponentProps,
  TMode extends 'sync' | 'async',
> = {
  id: string;
  mode: TMode;
  transformProps?: (props: TExternalComponentProps) => TInnerComponentProps;
  defaultComponent?: TMode extends 'async'
    ? (props: TExternalComponentProps) => Promise<JSX.Element>
    : TMode extends 'sync'
    ? (props: TExternalComponentProps) => JSX.Element
    : never;
};

export interface ComponentRefOptions<
  TInnerComponentProps,
  TExternalComponentProps,
  TMode extends 'sync' | 'async',
> {
  id: string;
  mode: TMode;
  defaultComponent?: TMode extends 'async'
    ? (props: TExternalComponentProps) => Promise<JSX.Element>
    : TMode extends 'sync'
    ? (props: TExternalComponentProps) => JSX.Element
    : never;
  transformProps?: (props: TExternalComponentProps) => TInnerComponentProps;
}

/**
 * Creates a new component ref that is synchronous.
 * @public
 */
export function createComponentRef<
  TInnerComponentProps,
  TExternalComponentProps,
>(
  options: ComponentRefOptions<
    TInnerComponentProps,
    TExternalComponentProps,
    'sync'
  >,
): ComponentRef<TInnerComponentProps, TExternalComponentProps, 'sync'>;

/**
 * Creates a new component ref that is asynchronous.
 * @public
 */
export function createComponentRef<
  TInnerComponentProps,
  TExternalComponentProps,
>(
  options: ComponentRefOptions<
    TInnerComponentProps,
    TExternalComponentProps,
    'async'
  >,
): ComponentRef<TInnerComponentProps, TExternalComponentProps, 'async'>;

export function createComponentRef<
  TInnerComponentProps,
  TExternalComponentProps,
  TMode extends 'sync' | 'async',
>(
  options: ComponentRefOptions<
    TInnerComponentProps,
    TExternalComponentProps,
    TMode
  >,
): ComponentRef<TInnerComponentProps, TExternalComponentProps, TMode> {
  const { id, mode, defaultComponent, transformProps } = options;

  return {
    id,
    mode,
    defaultComponent,
    transformProps,
    toString() {
      return `ComponentRef{id=${id}}`;
    },
  } as ComponentRef<TInnerComponentProps, TExternalComponentProps, TMode>;
}
