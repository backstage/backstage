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
  createExtensionDataRef,
  IconComponent,
  RouteRef,
} from '@backstage/frontend-plugin-api';

/**
 * @internal
 *
 * Data ref for legacy nav-item extensions. Kept for backward compatibility with
 * extensions created by older versions of the framework.
 */
export const legacyNavItemTargetDataRef = createExtensionDataRef<{
  title: string;
  icon: IconComponent;
  routeRef: RouteRef<undefined>;
}>().with({ id: 'core.nav-item.target' });
