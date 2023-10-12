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

import React, { ReactNode } from 'react';
import { AnalyticsContext } from '@backstage/core-plugin-api';
import { BackstagePlugin } from '../wiring';
import { RouteRef } from '../routing';
import { ErrorBoundary } from './ErrorBoundary';
import { toInternalRouteRef } from '../routing/RouteRef';

/** @public */
export interface ExtensionBoundaryProps {
  id: string;
  source?: BackstagePlugin;
  routeRef?: RouteRef;
  children: ReactNode;
}

/** @public */
export function ExtensionBoundary(props: ExtensionBoundaryProps) {
  const { id, source, routeRef, children } = props;

  const attributes = {
    extension: id,
    pluginId: source?.id,
    routeRef: routeRef
      ? toInternalRouteRef(routeRef).getDescription()
      : undefined,
  };

  return (
    <ErrorBoundary plugin={source}>
      <AnalyticsContext attributes={attributes}>{children}</AnalyticsContext>
    </ErrorBoundary>
  );
}
