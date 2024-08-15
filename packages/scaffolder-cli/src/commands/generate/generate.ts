/*
 * Copyright 2020 The Backstage Authors
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

import path from 'path';
import {
  readDirectoryContents,
  readJsonFile,
  readYamlFile,
  validateDirectoryAccess,
  writeDryRunFiles,
} from './fileUtils';
import {
  ScaffolderDryRunOptions,
  ScaffolderDryRunResponse,
} from '@backstage/plugin-scaffolder-react';
import { scaffolderApi } from './scaffolderApi';
import { JsonObject, JsonValue } from '@backstage/types';

export default async function generate(templateDirectory: string) {
  const dryRunOptions: ScaffolderDryRunOptions = await getDryRunOptions(
    templateDirectory,
  );
  const response: ScaffolderDryRunResponse = await scaffolderApi.dryRun(
    dryRunOptions,
  );
  console.log(response);
  writeDryRunFiles(response.directoryContents, templateDirectory);
}

async function getDryRunOptions(
  templateDirectory: string,
): Promise<ScaffolderDryRunOptions> {
  validateDirectoryAccess(templateDirectory);
  const templateJson: JsonValue = await readYamlFile(
    path.join(templateDirectory, 'template.yaml'),
  );
  const dryRunData: JsonObject = await readJsonFile(
    path.join(templateDirectory, 'dry-run-data.json'),
  );
  const directoryContents = readDirectoryContents(templateDirectory);

  return {
    template: templateJson,
    values: dryRunData,
    directoryContents: directoryContents,
  };
}
