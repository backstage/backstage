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
import { type LayoutOptions } from '../..';

/**
 * The data reference for defining a layout in the scaffolder frontend.
 *
 * @alpha
 */
export const scaffolderLayoutRef = createExtensionDataRef<LayoutOptions>().with(
  {
    id: 'scaffolder.layout-option',
  },
);

/**
 * The parameters for defining a layout in the scaffolder frontend.
 *
 * @alpha
 */
export interface ScaffolderLayoutBlueprintParams {
  layout: LayoutOptions;
}

/**
 * The blueprint for defining a layout in the scaffolder frontend.
 *
 * @alpha
 */
export const scaffolderLayoutBlueprint = createExtensionBlueprint({
  kind: 'scaffolder-layout',
  attachTo: { id: 'sub-page:scaffolder/templates', input: 'layouts' },
  output: [scaffolderLayoutRef],
  dataRefs: {
    layout: scaffolderLayoutRef,
  },
  factory: (params: ScaffolderLayoutBlueprintParams) => {
    return [scaffolderLayoutRef(params.layout)];
  },
});
