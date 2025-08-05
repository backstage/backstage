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
import { componentsApiRef, useApi } from '../apis';
import { lazy, Suspense } from 'react';

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

const useComponentRefApi = () => {
  try {
    return useApi(componentsApiRef);
  } catch (e) {
    return undefined;
  }
};

function makeComponentFromRef<
  InternalComponentProps extends {},
  ExternalComponentProps extends {},
>({
  ref,
}: {
  ref: ComponentRef<InternalComponentProps, ExternalComponentProps>;
}): (props: ExternalComponentProps) => JSX.Element {
  const internalRef = OpaqueComponentRef.toInternal(ref);
  const FallbackComponent = (p: JSX.IntrinsicAttributes) => (
    <div data-testid={ref.id} {...p} />
  );

  const ComponentRefImpl = (props: ExternalComponentProps) => {
    const api = useComponentRefApi();
    const ComponentOrPromise =
      api?.getComponent<any>(ref)?.() ??
      internalRef.loader?.() ??
      FallbackComponent;

    const innerProps = internalRef.transformProps?.(props) ?? props;

    if ('then' in ComponentOrPromise) {
      const DefaultImplementation = lazy(() =>
        ComponentOrPromise.then(c => {
          return { default: c };
        }),
      );

      return (
        <Suspense>
          <DefaultImplementation {...innerProps} />
        </Suspense>
      );
    }

    return <ComponentOrPromise {...innerProps} />;
  };

  return ComponentRefImpl;
}

export function createAdaptableComponent<
  TInnerComponentProps extends {},
  TExternalComponentProps extends {} = TInnerComponentProps,
>(
  options: ComponentRefOptions<TInnerComponentProps, TExternalComponentProps>,
): ((props: TExternalComponentProps) => JSX.Element) & {
  ref: ComponentRef<TInnerComponentProps, TExternalComponentProps>;
} {
  const ref = OpaqueComponentRef.createInstance('v1', {
    id: options.id,
    TProps: null as unknown as TInnerComponentProps,
    TExternalProps: null as unknown as TExternalComponentProps,
    toString() {
      return `ComponentRef{id=${options.id}}`;
    },
    loader: options.loader as (typeof OpaqueComponentRef.TInternal)['loader'],
    transformProps:
      options.transformProps as (typeof OpaqueComponentRef.TInternal)['transformProps'],
  });

  const component = makeComponentFromRef({ ref });
  Object.assign(component, { ref });

  return component as {
    ref: ComponentRef<TInnerComponentProps, TExternalComponentProps>;
  } & ((props: object) => JSX.Element);
}
