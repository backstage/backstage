/*
 * Copyright 2025 The Backstage Authors
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

import { createServiceRef } from '@backstage/backend-plugin-api';

/**
 * Service for calling distributed actions
 *
 * See {@link ActionsService}
 * and {@link https://backstage.io/docs/backend-system/core-services/actions | the service docs}
 * for more information.
 *
 * @alpha
 */
export const actionsServiceRef = createServiceRef<
  import('./ActionsService').ActionsService
>({
  id: 'alpha.core.actions',
});

/**
 * Service for registering and managing distributed actions.
 *
 * See {@link ActionsRegistryService}
 * and {@link https://backstage.io/docs/backend-system/core-services/actions-registry | the service docs}
 * for more information.
 *
 * @alpha
 */
export const actionsRegistryServiceRef = createServiceRef<
  import('./ActionsRegistryService').ActionsRegistryService
>({
  id: 'alpha.core.actionsRegistry',
});
