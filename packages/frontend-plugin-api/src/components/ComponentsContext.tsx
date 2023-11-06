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

import { ComponentRef } from '@backstage/frontend-plugin-api';
import {
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';
import React from 'react';
import { ComponentType, PropsWithChildren } from 'react';

/** @public */
export type ComponentsContextValue = Record<string, ComponentType<any>>;

const ComponentsContext = createVersionedContext<{ 1: ComponentsContextValue }>(
  'components-context',
);

/** @public */
export function ComponentsProvider(
  props: PropsWithChildren<{ value: ComponentsContextValue }>,
) {
  const { value, children } = props;
  return (
    <ComponentsContext.Provider value={createVersionedValueMap({ 1: value })}>
      {children}
    </ComponentsContext.Provider>
  );
}

/** @public */
export function useComponent<
  P extends {},
  T extends ComponentRef<ComponentType<P>>,
>(ref: T): T['T'] {
  const components = useVersionedContext<{ 1: ComponentsContextValue }>(
    'components-context',
  );
  const component = components?.atVersion(1)?.[ref.id];
  if (!component) {
    throw new Error(`No implementation available for ${ref.id}`);
  }
  return component;
}
