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

import {
  SwappableComponentRef,
  SwappableComponentsApi,
} from '@backstage/frontend-plugin-api';
import { SwappableComponentBlueprint } from '@backstage/plugin-app-react';
import { OpaqueSwappableComponentRef } from '@internal/frontend';

import { lazy } from 'react';

/**
 * Implementation for the {@link SwappableComponentsApi}
 *
 * @internal
 */
export class DefaultSwappableComponentsApi implements SwappableComponentsApi {
  #components: Map<string, ((props: object) => JSX.Element | null) | undefined>;

  static fromComponents(
    components: Array<typeof SwappableComponentBlueprint.dataRefs.component.T>,
  ) {
    return new DefaultSwappableComponentsApi(
      new Map(
        components.map(entry => {
          return [
            entry.ref.id,
            entry.loader
              ? lazy(async () => ({
                  default: await entry.loader!(),
                }))
              : undefined,
          ];
        }),
      ),
    );
  }

  /**
   * One resolved component per ref, so repeated lookups return the same
   * element type. Callers render the result directly, and React tears a
   * subtree down and rebuilds it whenever an element type changes identity —
   * handing back a fresh function would remount everything the swapped
   * component wraps, page content and its state included, on every render of
   * the caller.
   */
  #resolved = new WeakMap<
    SwappableComponentRef<any>,
    (props: object) => JSX.Element | null
  >();

  constructor(components: Map<string, any>) {
    this.#components = components;
  }

  getComponent(
    ref: SwappableComponentRef<any>,
  ): (props: object) => JSX.Element | null {
    const existing = this.#resolved.get(ref);
    if (existing) {
      return existing;
    }

    const OverrideComponent = this.#components.get(ref.id);
    const { defaultComponent: DefaultComponent, transformProps } =
      OpaqueSwappableComponentRef.toInternal(ref);

    const SwappableComponent = (props: object) => {
      const innerProps = transformProps?.(props) ?? props;

      if (OverrideComponent) {
        return <OverrideComponent {...innerProps} />;
      }

      return <DefaultComponent {...innerProps} />;
    };

    this.#resolved.set(ref, SwappableComponent);
    return SwappableComponent;
  }
}
