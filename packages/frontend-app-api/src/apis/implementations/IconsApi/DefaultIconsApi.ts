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
  IconComponent,
  IconElement,
  IconsApi,
} from '@backstage/frontend-plugin-api';
import { createElement, isValidElement } from 'react';

/**
 * Implementation for the {@link IconsApi}
 *
 * @internal
 */
export class DefaultIconsApi implements IconsApi {
  #icons: Map<string, IconElement>;
  #components = new Map<string, IconComponent>();

  constructor(icons: { [key in string]: IconComponent | IconElement }) {
    const deprecatedKeys: string[] = [];

    this.#icons = new Map(
      Object.entries(icons).map(([key, value]) => {
        if (value === null || isValidElement(value)) {
          return [key, value];
        }
        deprecatedKeys.push(key);
        return [key, createElement(value as IconComponent)];
      }),
    );

    if (deprecatedKeys.length > 0) {
      const keys = deprecatedKeys.join(', ');
      // eslint-disable-next-line no-console
      console.warn(
        `The following icons were registered as IconComponent, which is deprecated. Use IconElement instead by passing <MyIcon /> rather than MyIcon: ${keys}`,
      );
    }
  }

  icon(key: string): IconElement | undefined {
    return this.#icons.get(key);
  }

  getIcon(key: string): IconComponent | undefined {
    let component = this.#components.get(key);
    if (component) {
      return component;
    }
    const el = this.#icons.get(key);
    if (el === undefined) {
      return undefined;
    }
    component = () => el;
    this.#components.set(key, component);
    return component;
  }

  listIconKeys(): string[] {
    return Array.from(this.#icons.keys());
  }
}
