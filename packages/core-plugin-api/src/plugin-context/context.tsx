/*
 * Copyright 2022 The Backstage Authors
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
} from '@backstage/version-bridge';
import React, { PropsWithChildren, useContext } from 'react';

import { PluginContext } from './types';

const PluginReactContext =
  createVersionedContext<{ 1: PluginContext[] }>('plugin-context');

/**
 * A hook that gets the plugin context stack in the React component tree.
 *
 * @public
 */
export const usePluginContextStack = (): PluginContext[] | undefined => {
  const ctx = useContext(PluginReactContext);

  if (ctx === undefined) {
    return undefined;
  }

  const theValue = ctx.atVersion(1);
  if (theValue === undefined) {
    throw new Error('No context found for version 1.');
  }

  return theValue;
};

/**
 * Provides components in the child react tree with plugin information.
 *
 * @alpha
 */
export const PluginContextProvider = (
  props: PropsWithChildren<PluginContext>,
) => {
  const { componentName, plugin, routeRef, children } = props;

  const parent = usePluginContextStack();
  const value: PluginContext[] = [
    ...(parent ?? []),
    { componentName, plugin, routeRef },
  ];

  const versionedValue = createVersionedValueMap({ 1: value });
  return (
    <PluginReactContext.Provider value={versionedValue}>
      {children}
    </PluginReactContext.Provider>
  );
};
