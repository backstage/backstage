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

import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import { TemplateGroupFilter } from '@backstage/plugin-scaffolder-react';

/**
 * Creates DataRef for Scaffolder Group Filter Extensions
 * @alpha
 */
export const scaffolderGroupFilterDataRef =
  createExtensionDataRef<TemplateGroupFilter>().with({
    id: 'scaffolder.group-filter',
  });

/**
 * Creates Scaffolder Group Filter Extensions
 * @alpha
 */
export const ScaffolderGroupFilterBlueprint = createExtensionBlueprint({
  kind: 'scaffolder-filter',
  attachTo: { id: 'sub-page:scaffolder/templates', input: 'groups' },
  output: [scaffolderGroupFilterDataRef],
  factory(params: { group: TemplateGroupFilter }) {
    return [scaffolderGroupFilterDataRef(params.group)];
  },
});
