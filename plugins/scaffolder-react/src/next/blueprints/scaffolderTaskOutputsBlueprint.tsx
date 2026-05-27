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
import { ComponentType } from 'react';
import { ScaffolderTaskOutput } from '@backstage/plugin-scaffolder-common';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';

/**
 * @alpha
 */
export type ScaffolderTemplateOutputsComponent = ComponentType<{
  output?: ScaffolderTaskOutput;
}>;

/**
 * @alpha
 */
export const scaffolderTemplateOutputsComponentRef =
  createExtensionDataRef<ScaffolderTemplateOutputsComponent>().with({
    id: 'scaffolder.template-outputs-component',
  });

/**
 * @alpha
 */
export interface ScaffolderTemplateOutputsBlueprintParams {
  component: ScaffolderTemplateOutputsComponent;
}

/**
 * @alpha
 */
export const scaffolderTemplateOutputsBlueprint = createExtensionBlueprint({
  kind: 'scaffolder-template-outputs',
  attachTo: {
    id: 'sub-page:scaffolder/tasks',
    input: 'templateOutputsComponents',
  },
  output: [scaffolderTemplateOutputsComponentRef],
  dataRefs: {
    component: scaffolderTemplateOutputsComponentRef,
  },
  factory: (params: ScaffolderTemplateOutputsBlueprintParams) => {
    return [scaffolderTemplateOutputsComponentRef(params.component)];
  },
});
