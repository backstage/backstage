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

import { ComponentType } from 'react';
import {
  AppTree,
  ComponentRef,
  ComponentsApi,
  createComponentExtension,
} from '@backstage/frontend-plugin-api';

/**
 * Implementation for the {@linkComponentApi}
 *
 * @internal
 */
export class DefaultComponentsApi implements ComponentsApi {
  #components: Map<string, ComponentType<any>>;

  static fromTree(tree: AppTree) {
    const componentEntries = tree.root.edges.attachments
      .get('components')
      ?.reduce((map, e) => {
        const data = e.instance?.getData(
          createComponentExtension.componentDataRef,
        );
        if (data) {
          map.set(data.ref.id, data.impl);
        }
        return map;
      }, new Map<string, ComponentType>());
    return new DefaultComponentsApi(componentEntries ?? new Map());
  }

  constructor(components: Map<string, any>) {
    this.#components = components;
  }

  getComponent<T extends {}>(ref: ComponentRef<T>): ComponentType<T> {
    const impl = this.#components.get(ref.id);
    if (!impl) {
      throw new Error(`No implementation found for component ref ${ref}`);
    }
    return impl;
  }
}
