/*
 * Copyright 2025 The Backstage Authors
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
import { lazy, Suspense } from 'react';
import { ComponentRef } from './createComponentRef';
import { OpaqueComponentRef } from '@internal/frontend';

export function makeComponentFromRef<
  InternalComponentProps extends {},
  ExternalComponentProps extends {},
>({
  ref,
}: {
  ref: ComponentRef<InternalComponentProps, ExternalComponentProps>;
}): (props: ExternalComponentProps) => JSX.Element {
  const { options } = OpaqueComponentRef.toInternal(ref);
  const FallbackComponent = (p: JSX.IntrinsicAttributes) => (
    <div data-testid={ref.id} {...p} />
  );

  const ComponentRefImpl = (props: ExternalComponentProps) => {
    const innerProps = options.transformProps?.(props) ?? props;

    const ComponentOrPromise = options.loader?.() ?? FallbackComponent;

    if ('then' in ComponentOrPromise) {
      const DefaultImplementation = lazy(() =>
        ComponentOrPromise.then(c => {
          return { default: c };
        }),
      );

      return (
        // todo: is this necessary? can we remove this?
        <Suspense>
          <DefaultImplementation {...innerProps} />
        </Suspense>
      );
    }

    return <ComponentOrPromise {...innerProps} />;
  };

  return ComponentRefImpl;
}
