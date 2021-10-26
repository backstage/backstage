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

import { createApiRef } from '@backstage/core-plugin-api';
import { flyteidl } from '@flyteorg/flyteidl/gen/pb-js/flyteidl';

export const flyteApiRef = createApiRef<FlyteApi>({
  id: 'plugin.flyte',
  description: 'Used by the Flyte plugin to make requests',
});

export type FlyteApi = {
  listProjects(): Promise<flyteidl.admin.Projects>;
  listWorkflows(
    project: string,
    domain: string,
  ): Promise<flyteidl.admin.NamedEntityIdentifierList>;
};
