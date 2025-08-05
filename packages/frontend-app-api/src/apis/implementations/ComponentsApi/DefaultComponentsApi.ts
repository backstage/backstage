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
  ComponentRef,
  ComponentsApi,
  AdaptableComponentBlueprint,
} from '@backstage/frontend-plugin-api';

/**
 * Implementation for the {@linkComponentApi}
 *
 * @internal
 */
export class DefaultComponentsApi implements ComponentsApi {
  #components: Map<
    string,
    | (() => (props: object) => JSX.Element | null)
    | (() => Promise<(props: object) => JSX.Element | null>)
    | undefined
  >;

  static fromComponents(
    components: Array<typeof AdaptableComponentBlueprint.dataRefs.component.T>,
  ) {
    return new DefaultComponentsApi(
      new Map(components.map(entry => [entry.ref.id, entry.loader])),
    );
  }

  constructor(components: Map<string, any>) {
    this.#components = components;
  }

  getComponent(
    ref: ComponentRef<any>,
  ):
    | (() => (props: object) => JSX.Element | null)
    | (() => Promise<(props: object) => JSX.Element | null>)
    | undefined {
    const impl = this.#components.get(ref.id);
    return impl;
  }
}
