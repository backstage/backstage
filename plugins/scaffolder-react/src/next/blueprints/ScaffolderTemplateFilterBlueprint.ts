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
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

/**
 * A predicate that selects templates for display on the Scaffolder templates
 * page.
 *
 * @alpha
 */
export type ScaffolderTemplateFilter = (
  template: TemplateEntityV1beta3,
) => boolean;

/**
 * A React hook that creates a template filter for the current viewer.
 *
 * @alpha
 */
export type ScaffolderTemplateFilterHook = () => ScaffolderTemplateFilter;

const scaffolderTemplateFilterHookRef =
  createExtensionDataRef<ScaffolderTemplateFilterHook>().with({
    id: 'scaffolder.template-filter-hook',
  });

/**
 * Parameters for {@link ScaffolderTemplateFilterBlueprint}.
 *
 * @alpha
 */
export interface ScaffolderTemplateFilterBlueprintParams {
  /**
   * A React hook that returns the filter to apply to templates.
   *
   * The hook is called inside the templates page and may use other hooks and
   * frontend APIs to construct a filter for the current viewer.
   */
  useTemplateFilter: ScaffolderTemplateFilterHook;
}

/**
 * Creates a viewer-aware filter for the Scaffolder templates page.
 *
 * @alpha
 */
export const ScaffolderTemplateFilterBlueprint = createExtensionBlueprint({
  kind: 'scaffolder-template-filter',
  attachTo: {
    id: 'sub-page:scaffolder/templates',
    input: 'templateFilter',
  },
  output: [scaffolderTemplateFilterHookRef],
  dataRefs: {
    useTemplateFilter: scaffolderTemplateFilterHookRef,
  },
  *factory(params: ScaffolderTemplateFilterBlueprintParams) {
    yield scaffolderTemplateFilterHookRef(params.useTemplateFilter);
  },
});
