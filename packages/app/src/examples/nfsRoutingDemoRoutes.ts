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

import { createRouteRef } from '@backstage/frontend-plugin-api';

export const V6_PAGE_PATH = '/nfs-routing-demo';
export const TANSTACK_PAGE_PATH = '/nfs-routing-demo-tanstack';
export const V7_PAGE_PATH = '/nfs-routing-demo-v7';

export const nfsRoutingDemoRouteRef = createRouteRef();
export const nfsRoutingDemoTanstackRouteRef = createRouteRef();
export const nfsRoutingDemoV7RouteRef = createRouteRef();
export const nestedV6RouteRef = createRouteRef();
export const deepLinkRouteRef = createRouteRef();
export const tanstackV6GuestRouteRef = createRouteRef();
export const v7V6GuestRouteRef = createRouteRef();
