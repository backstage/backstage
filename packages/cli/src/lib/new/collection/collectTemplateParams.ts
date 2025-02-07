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

import { getCodeownersFilePath } from '../../codeowners';
import { paths } from '../../paths';
import { NewConfig } from '../config/types';
import { promptOptions } from './prompts';
import { Template } from '../types';
import { Options } from '../utils';

type CollectTemplateParamsOptions = {
  config: NewConfig;
  template: Template;
  globals: Record<string, string | number | boolean>;
  prefilledParams: Record<string, string | number | boolean>;
};

const defaultParams = {
  id: '',
  owner: '',
  license: 'Apache-2.0',
  scope: '',
  moduleId: '',
  baseVersion: '0.1.0',
  private: true,
};

export async function collectTemplateParams(
  options: CollectTemplateParamsOptions,
): Promise<Options> {
  const { config, template, globals, prefilledParams } = options;

  const codeOwnersFilePath = await getCodeownersFilePath(paths.targetRoot);

  const prompts = template.prompts ?? [];

  const prefilledAnswers = Object.fromEntries(
    prompts.flatMap(prompt => {
      const id = typeof prompt === 'string' ? prompt : prompt.id;
      const answer = prefilledParams[id];
      return answer ? [[id, answer]] : [];
    }),
  );

  const promptAnswers = await promptOptions({
    prompts:
      prompts.filter(
        prompt =>
          !Object.hasOwn(
            prefilledAnswers,
            typeof prompt === 'string' ? prompt : prompt.id,
          ),
      ) ?? [],
    globals: config.globals,
    codeOwnersFilePath,
  });

  return {
    ...defaultParams,
    ...globals,
    ...prefilledAnswers,
    ...promptAnswers,
    targetPath: template.targetPath,
  };
}
