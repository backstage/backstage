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

import { OpaqueSwappableComponentRef } from '@internal/frontend';
import { swappableComponentsApiRef, useApi } from '../apis';
import { lazy } from 'react';

/** @public */
export type SwappableComponentRef<
  TInnerComponentProps extends {} = {},
  TExternalComponentProps extends {} = TInnerComponentProps,
> = {
  id: string;
  TProps: TInnerComponentProps;
  TExternalProps: TExternalComponentProps;
  $$type: '@backstage/SwappableComponentRef';
};

/**
 * Options for creating an SwappableComponent.
 *
 * @public
 */
export type CreateSwappableComponentOptions<
  TInnerComponentProps extends {},
  TExternalComponentProps extends {} = TInnerComponentProps,
> = {
  id: string;
  loader?:
    | (() => (props: TInnerComponentProps) => JSX.Element | null)
    | (() => Promise<(props: TInnerComponentProps) => JSX.Element | null>);
  transformProps?: (props: TExternalComponentProps) => TInnerComponentProps;
};

const useComponentRefApi = () => {
  try {
    return useApi(swappableComponentsApiRef);
  } catch (e) {
    return undefined;
  }
};

/**
 * Creates a SwappableComponent that can be used to render the component, optionally overridden by the app.
 *
 * @public
 */
export function createSwappableComponent<
  TInnerComponentProps extends {},
  TExternalComponentProps extends {} = TInnerComponentProps,
>(
  options: CreateSwappableComponentOptions<
    TInnerComponentProps,
    TExternalComponentProps
  >,
): {
  (props: TExternalComponentProps): JSX.Element | null;
  ref: SwappableComponentRef<TInnerComponentProps, TExternalComponentProps>;
} {
  const FallbackComponent = (p: JSX.IntrinsicAttributes) => (
    <div data-testid={options.id} {...p} />
  );

  const ref = OpaqueSwappableComponentRef.createInstance('v1', {
    id: options.id,
    TProps: null as unknown as TInnerComponentProps,
    TExternalProps: null as unknown as TExternalComponentProps,
    toString() {
      return `SwappableComponentRef{id=${options.id}}`;
    },
    defaultComponent: lazy(async () => {
      const Component = (await options.loader?.()) ?? FallbackComponent;
      return { default: Component };
    }) as (typeof OpaqueSwappableComponentRef.TInternal)['defaultComponent'],
    transformProps:
      options.transformProps as (typeof OpaqueSwappableComponentRef.TInternal)['transformProps'],
  });

  const ComponentRefImpl = (props: TExternalComponentProps) => {
    const api = useComponentRefApi();

    if (!api) {
      const internalRef = OpaqueSwappableComponentRef.toInternal(ref);
      const Component = internalRef.defaultComponent;
      const innerProps = internalRef.transformProps?.(props) ?? props;
      return <Component {...innerProps} />;
    }

    const Component = api.getComponent<any>(ref);
    return <Component {...props} />;
  };

  Object.assign(ComponentRefImpl, { ref });

  return ComponentRefImpl as {
    (props: TExternalComponentProps): JSX.Element | null;
    ref: SwappableComponentRef<TInnerComponentProps, TExternalComponentProps>;
  };
}
