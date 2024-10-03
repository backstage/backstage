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
import { readYamlFile, validateDirectoryAccess } from './fileUtils';
import {
  ScaffolderDryRunOptions,
  ScaffolderDryRunResponse,
} from '@backstage/plugin-scaffolder-react';
import { scaffolderApi } from './scaffolderApi';
import { JsonObject, JsonValue } from '@backstage/types';
import {
  serializeDirectoryContents,
  deserializeDirectoryContents,
} from '@backstage/plugin-scaffolder-node';

export default async function generate(
  templateDirectory: string,
  options: { templatePath: string; url: string; values: string },
) {
  const dryRunOptions: ScaffolderDryRunOptions = await getDryRunOptions(
    templateDirectory,
    options.templatePath,
    options,
  );

  const authToken = process.env.TOKEN;
  const response: ScaffolderDryRunResponse = await scaffolderApi.dryRun(
    options.url,
    dryRunOptions,
    authToken,
  );

  const outputDir: string = 'dry-run-output';

  await deserializeDirectoryContents(
    outputDir,
    response.directoryContents.map(file => ({
      path: file.path,
      content: Buffer.from(file.base64Content, 'base64'),
    })),
  );
  console.log(`Generated project in ${path.resolve(outputDir)}`);
}

async function getDryRunOptions(
  templateDirectory: string,
  templatePath: string,
  options: { url: string; values: string },
): Promise<ScaffolderDryRunOptions> {
  validateDirectoryAccess(templateDirectory);
  const templateJson: JsonValue = await readYamlFile(path.join(templatePath));

  let dryRunData: JsonObject;
  if (options.values?.startsWith('{')) {
    dryRunData = JSON.parse(options.values);
  } else {
    const json = await readYamlFile(options.values);
    if (Array.isArray(json) || typeof json !== 'object' || json === null) {
      throw new Error(
        `Yaml at ${options.values} cannot be parsed into a valid JSON object. Make sure it is formatted correctly.`,
      );
    }
    dryRunData = json;
  }

  const serializedContents = await serializeDirectoryContents(
    templateDirectory,
  );

  const directoryContents = serializedContents.map(file => ({
    path: file.path,
    base64Content: file.content.toString('base64'),
  }));

  return {
    template: templateJson,
    values: dryRunData, // Use dryRunData here
    directoryContents: directoryContents,
  };
}
