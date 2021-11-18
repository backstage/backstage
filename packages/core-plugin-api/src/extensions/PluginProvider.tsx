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

import React, { PropsWithChildren, useMemo } from 'react';
import {
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';

export interface PluginInfo {
  pluginId: string;
  extensionName?: string;
}

export type PluginProviderProps = PluginInfo;

const CONTEXT_KEY = 'plugin-context';
type VersionedContextType = { 1: PluginInfo };

const context = createVersionedContext<VersionedContextType>(CONTEXT_KEY);

export function PluginProvider(props: PropsWithChildren<PluginProviderProps>) {
  const { pluginId, extensionName, children } = props;

  const versionedValue = useMemo(
    () => createVersionedValueMap({ 1: { pluginId, extensionName } }),
    [pluginId, extensionName],
  );

  return <context.Provider value={versionedValue} children={children} />;
}

/**
 * Gets information about the plugin the current component is part of.
 * May be `undefined` if the component is mounted outside a plugin scope.
 */
export function usePluginInfo(): PluginInfo | undefined {
  return useVersionedContext<VersionedContextType>(CONTEXT_KEY)?.atVersion(1);
}
