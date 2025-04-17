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

import {
  collectPortableTemplateInput,
  loadPortableTemplate,
  loadPortableTemplateConfig,
  selectTemplateInteractively,
} from './preparation';
import { executePortableTemplate } from './execution';
import { PortableTemplateConfig, PortableTemplateParams } from './types';

export type CreateNewPackageOptions = {
  preselectedTemplateId?: string;
  configOverrides: Partial<PortableTemplateConfig>;
  prefilledParams: PortableTemplateParams;
  skipInstall?: boolean;
};

export async function createNewPackage(options: CreateNewPackageOptions) {
  const config = await loadPortableTemplateConfig({
    overrides: options.configOverrides,
  });

  const selectedTemplate = await selectTemplateInteractively(
    config,
    options.preselectedTemplateId,
  );
  const template = await loadPortableTemplate(selectedTemplate);

  const input = await collectPortableTemplateInput({
    config,
    template,
    prefilledParams: options.prefilledParams,
  });

  await executePortableTemplate({
    config,
    template,
    input,
    skipInstall: options.skipInstall,
  });
}
