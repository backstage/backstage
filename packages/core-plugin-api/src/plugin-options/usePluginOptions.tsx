/*
 * Copyright 2020 The Backstage Authors
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
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';
import { BackstagePlugin } from '../plugin';
import React, { ReactNode } from 'react';

const contextKey: string = 'plugin-context';

/**
 * Properties for the PluginProvider component.
 *
 * @alpha
 */
export interface PluginOptionsProviderProps {
  children: ReactNode;
  plugin?: BackstagePlugin;
}

/**
 * Contains the plugin configuration.
 *
 * @alpha
 */
export const PluginProvider = (
  props: PluginOptionsProviderProps,
): JSX.Element => {
  const { children, plugin } = props;

  const { Provider } = createVersionedContext<{
    1: { plugin: BackstagePlugin | undefined };
  }>(contextKey);

  return (
    <Provider
      value={createVersionedValueMap({
        1: {
          plugin,
        },
      })}
    >
      {children}
    </Provider>
  );
};

/**
 * Grab the current entity from the context, throws if the entity has not yet been loaded
 * or is not available.
 *
 * @alpha
 */
export function usePluginOptions<
  TPluginOptions extends {} = {},
>(): TPluginOptions {
  const versionedHolder = useVersionedContext<{ 1: TPluginOptions }>(
    contextKey,
  );

  if (!versionedHolder) {
    throw new Error('Plugin Options context is not available');
  }

  const value = versionedHolder.atVersion(1);
  if (!value) {
    throw new Error('Plugin Options v1 is not available');
  }

  return (
    value as unknown as {
      plugin: {
        getPluginOptions(): {};
      };
    }
  ).plugin.getPluginOptions() as TPluginOptions;
}
