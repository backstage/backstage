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

import React from 'react';
import {
  RouteRef as LegacyRouteRef,
  SubRouteRef as LegacySubRouteRef,
} from '@backstage/core-plugin-api';
import { RouteRef as NewRouteRef } from '@backstage/frontend-plugin-api';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';
import { PropsWithChildren } from 'react';

type BindingsContextState = {
  bindings: [LegacyRouteRef | LegacySubRouteRef, NewRouteRef][];
};

const RouteRefBindingsContext = createVersionedContext<{
  1: BindingsContextState;
}>('route-ref-bindings');

export const RouteRefBindingsProvider = (
  props: PropsWithChildren<BindingsContextState>,
) => {
  const bindings = createVersionedValueMap({ 1: { bindings: props.bindings } });

  return (
    <RouteRefBindingsContext.Provider value={bindings}>
      {props.children}
    </RouteRefBindingsContext.Provider>
  );
};
