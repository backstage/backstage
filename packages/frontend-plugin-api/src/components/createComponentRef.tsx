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
  TInnerComponentProps extends {} = {},
  TExternalComponentProps extends {} = TInnerComponentProps,
> = {
  id: string;
  TProps: TInnerComponentProps;
  TExternalProps: TExternalComponentProps;
  $$type: '@backstage/ComponentRef';
};

export type ComponentRefOptions<
  TInnerComponentProps extends {},
  TExternalComponentProps extends {} = TInnerComponentProps,
> = {
  id: string;
  loader?:
    | (() => (props: TInnerComponentProps) => JSX.Element | null)
    | (() => Promise<(props: TInnerComponentProps) => JSX.Element | null>);
  transformProps?: (props: TExternalComponentProps) => TInnerComponentProps;
};

export function createComponentRef<
  TInnerComponentProps extends {},
  TExternalComponentProps extends {} = TInnerComponentProps,
>(
  options: ComponentRefOptions<TInnerComponentProps, TExternalComponentProps>,
): ComponentRef<TInnerComponentProps, TExternalComponentProps> {
  return OpaqueComponentRef.createInstance('v1', {
    id: options.id,
    TProps: null as unknown as TInnerComponentProps,
    TExternalProps: null as unknown as TExternalComponentProps,
    toString() {
      return `ComponentRef{id=${options.id}}`;
    },
    options: {
      loader: options.loader,
      transformProps: options.transformProps,
    } as (typeof OpaqueComponentRef.TInternal)['options'],
  });
}
