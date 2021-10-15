/*
 * Copyright 2021 The Backstage Authors
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

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import { BackstagePlugin } from '../plugin';

export interface PluginInfo {
  plugin: BackstagePlugin<any, any>;
  extensionName?: string;
  routeRef?: string;
}

export type PluginProviderProps = PluginInfo;

const context = createContext<PluginInfo | undefined>(undefined);

export function PluginProvider(props: PropsWithChildren<PluginProviderProps>) {
  const { plugin, extensionName, routeRef, children } = props;

  const value = useMemo(
    (): PluginInfo => ({ plugin, extensionName, routeRef }),
    [plugin, extensionName, routeRef],
  );

  return <context.Provider value={value} children={children} />;
}

export function usePlugin(): PluginInfo | undefined {
  return useContext(context);
}
