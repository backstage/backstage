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

import { dirname } from 'path';
import { parse } from 'yaml';
import fs from 'fs-extra';

import { paths } from '../paths';
import { Template, TemplateLocation } from './types';

export function verifyTemplate({ id, target }: TemplateLocation): Template {
  if (target.startsWith('http')) {
    throw new Error('Remote templates are not supported yet');
  }
  if (!fs.existsSync(paths.resolveTargetRoot(target))) {
    throw new Error(`Your CLI template does not exist: ${target}`);
  }
  const template = parse(
    fs.readFileSync(paths.resolveTargetRoot(target), 'utf-8'),
  );
  const templatePath = paths.resolveTargetRoot(
    dirname(target),
    template.template,
  );
  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Your CLI template skeleton does not exist: ${templatePath}`,
    );
  }
  if (!template.targetPath) {
    throw new Error(`Your template, ${id}, is missing a targetPath`);
  }
  return { id, templatePath, ...template };
}
