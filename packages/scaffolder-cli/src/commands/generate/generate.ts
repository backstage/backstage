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
import { readYamlFile } from './fileUtils';
import {
  ScaffolderDryRunOptions,
  ScaffolderDryRunResponse,
} from '@backstage/plugin-scaffolder-react';
import { scaffolderApi } from './scaffolderApi';
import { JsonObject } from '@backstage/types';
import {
  serializeDirectoryContents,
  deserializeDirectoryContents,
} from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { isTemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { entitySchemaValidator } from '@backstage/catalog-model';

export default async function generate(
  templateDirectory: string,
  options: { templatePath: string; url: string; values: string },
) {
  const dryRunOptions: ScaffolderDryRunOptions = await getDryRunOptions(
    templateDirectory,
    options.templatePath,
    options,
  );
  const response: ScaffolderDryRunResponse = await scaffolderApi.dryRun(
    options.url,
    dryRunOptions,
  );
  const outputDir: string = '../dry-run-output';
  fs.rmSync(outputDir, { recursive: true, force: true });

  await deserializeDirectoryContents(
    outputDir,
    response.directoryContents.map(file => ({
      path: file.path,
      content: Buffer.from(file.base64Content, 'base64'),
    })),
  );
  console.log(`Generated project in ${path.resolve(outputDir)}`);
}

const validator = entitySchemaValidator();

async function getDryRunOptions(
  templateDirectory: string,
  templatePath: string,
  options: { url: string; values: string },
): Promise<ScaffolderDryRunOptions> {
  const templateJson = await readYamlFile(
    path.join(templateDirectory, templatePath),
  );
  const validatedEntity = validator(templateJson);
  if (!validatedEntity) {
    throw new Error(`Invalid entity at ${templatePath}`);
  }
  const isTemplateEntity = isTemplateEntityV1beta3(validatedEntity);
  if (!isTemplateEntity) {
    throw new Error(`Invalid template entity at ${templatePath}`);
  }
  const templateEntity = validatedEntity as TemplateEntityV1beta3;
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
    template: templateEntity,
    values: dryRunData,
    directoryContents,
  };
}
