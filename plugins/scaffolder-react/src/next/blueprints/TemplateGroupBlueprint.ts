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
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import { TemplateGroupFilter } from '@backstage/plugin-scaffolder-react';

const templateGroupDataRef = createExtensionDataRef<TemplateGroupFilter>().with(
  {
    id: 'scaffolder.template-group-filter',
  },
);

/**
 * @alpha
 * Creates extensions that allow for template grouping within the Scaffolder
 */
export const TemplateGroupBlueprint = createExtensionBlueprint({
  kind: 'scaffolder-template-group-filter',
  attachTo: { id: 'page:scaffolder', input: 'groups' },
  dataRefs: {
    templateGroup: templateGroupDataRef,
  },
  output: [templateGroupDataRef],
  *factory(params: TemplateGroupFilter) {
    yield templateGroupDataRef(params);
  },
});
