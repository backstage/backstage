/*
 * Copyright 2026 The Backstage Authors
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
  createRouteRef,
  createSubRouteRef,
} from '@backstage/frontend-plugin-api';

/** Route to the OpenTelemetry sub-page of DevTools. */
export const openTelemetryRouteRef = createRouteRef();

/** Route to the Metrics tab of the OpenTelemetry sub-page. */
export const openTelemetryMetricsRouteRef = createSubRouteRef({
  parent: openTelemetryRouteRef,
  path: '/metrics',
});

/** Route to the Traces tab of the OpenTelemetry sub-page. */
export const openTelemetryTracesRouteRef = createSubRouteRef({
  parent: openTelemetryRouteRef,
  path: '/traces',
});
