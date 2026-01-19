/*
 * Copyright 2024 The Backstage Authors
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

import { PluginWrapperApi } from '@backstage/frontend-plugin-api/alpha';
import { ComponentType, ReactNode, useEffect, useMemo, useState } from 'react';

type WrapperInput = {
  loader: () => Promise<{ component: ComponentType<{ children: ReactNode }> }>;
  pluginId: string;
};

/**
 * Default implementation of PluginWrapperApi.
 *
 * @internal
 */
export class DefaultPluginWrapperApi implements PluginWrapperApi {
  constructor(
    private readonly pluginWrappers: Map<
      string,
      ComponentType<{ children: ReactNode }>
    >,
  ) {}

  getPluginWrapper(
    pluginId: string,
  ): ComponentType<{ children: ReactNode }> | undefined {
    return this.pluginWrappers.get(pluginId);
  }

  static fromWrappers(wrappers: Array<WrapperInput>): DefaultPluginWrapperApi {
    const loadersByPlugin = new Map<
      string,
      Array<
        () => Promise<{ component: ComponentType<{ children: ReactNode }> }>
      >
    >();

    for (const wrapper of wrappers) {
      let loaders = loadersByPlugin.get(wrapper.pluginId);
      if (!loaders) {
        loaders = [];
        loadersByPlugin.set(wrapper.pluginId, loaders);
      }
      loaders.push(wrapper.loader);
    }

    const composedWrappers = new Map<
      string,
      ComponentType<{ children: ReactNode }>
    >();

    for (const [pluginId, loaders] of loadersByPlugin) {
      if (loaders.length === 0) {
        continue;
      }

      const ComposedWrapper = (props: { children: ReactNode }) => {
        const [loadedWrappers, setLoadedWrappers] = useState<
          Array<ComponentType<{ children: ReactNode }>> | undefined
        >(undefined);
        const [error, setError] = useState<Error | undefined>(undefined);

        useEffect(() => {
          Promise.all(loaders.map(loader => loader()))
            .then(results => {
              setLoadedWrappers(results.map(r => r.component));
            })
            .catch(setError);
        }, []);

        if (error) {
          throw error;
        }

        return useMemo(() => {
          if (!loadedWrappers) {
            return null;
          }

          let current = props.children;

          for (const Wrapper of loadedWrappers) {
            current = <Wrapper>{current}</Wrapper>;
          }

          return current;
        }, [loadedWrappers, props.children]);
      };

      composedWrappers.set(pluginId, ComposedWrapper);
    }

    return new DefaultPluginWrapperApi(composedWrappers);
  }
}
