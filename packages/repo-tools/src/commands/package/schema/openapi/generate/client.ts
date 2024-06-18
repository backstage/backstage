/*
 * Copyright 2023 The Backstage Authors
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

import chalk from 'chalk';
import { resolve } from 'path';
import {
  OPENAPI_IGNORE_FILES,
  OUTPUT_PATH,
} from '../../../../../lib/openapi/constants';
import { paths as cliPaths } from '../../../../../lib/paths';
import fs from 'fs-extra';
import { exec } from '../../../../../lib/exec';
import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { getPathToCurrentOpenApiSpec } from '../../../../../lib/openapi/helpers';

async function runOpenApiGeneratorCommand({
  outputPath,
  templateName,
  additionalProperties,
}: {
  outputPath: string;
  templateName: string;
  additionalProperties?: Record<string, string | undefined>;
}) {
  const resolvedOpenapiPath = await getPathToCurrentOpenApiSpec();
  const resolvedOutputPath = cliPaths.resolveTargetRoot(
    outputPath,
    OUTPUT_PATH,
  );
  await fs.mkdirp(resolvedOutputPath);

  await fs.writeFile(
    resolve(resolvedOutputPath, '.openapi-generator-ignore'),
    OPENAPI_IGNORE_FILES.join('\n'),
  );

  const additionalPropertiesList = additionalProperties
    ? Object.entries(additionalProperties)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join(',')
    : undefined;

  const additionalOptions = [];
  if (additionalPropertiesList) {
    additionalOptions.push(
      `--additional-properties=${additionalPropertiesList}`,
    );
  }
  await exec(
    'node',
    [
      resolvePackagePath('@openapitools/openapi-generator-cli', 'main.js'),
      'generate',
      '-i',
      resolvedOpenapiPath,
      '-o',
      resolvedOutputPath,
      '-g',
      'typescript',
      '-c',
      resolvePackagePath(
        '@backstage/repo-tools',
        `templates/${templateName}.yaml`,
      ),
      '--generator-key',
      'v3.0',
      ...additionalOptions,
    ],
    {
      maxBuffer: Number.MAX_VALUE,
      cwd: resolvePackagePath('@backstage/repo-tools'),
      env: {
        ...process.env,
      },
    },
  );

  await exec(`yarn backstage-cli package lint --fix ${resolvedOutputPath}`);

  const prettier = cliPaths.resolveTargetRoot('node_modules/.bin/prettier');
  if (prettier) {
    await exec(`${prettier} --write ${resolvedOutputPath}`);
  }

  fs.removeSync(resolve(resolvedOutputPath, '.openapi-generator-ignore'));

  fs.rmSync(resolve(resolvedOutputPath, '.openapi-generator'), {
    recursive: true,
    force: true,
  });
}

async function generateReactQueryClient({
  client: { outputPackage },
  reactQuery,
}: {
  client: { outputPackage: string };
  reactQuery: {
    outputPackage: string;
    apiRefNamespace: string | undefined;
    apiRefName: string | undefined;
    apiRefImport: string | undefined;
    clientImport: string | undefined;
  };
}) {
  await runOpenApiGeneratorCommand({
    outputPath: reactQuery.outputPackage,
    templateName: 'typescript-backstage-react-query',
    additionalProperties: {
      clientImport:
        outputPackage === reactQuery.outputPackage
          ? '.'
          : reactQuery.clientImport,
      apiRefNamespace: reactQuery.apiRefNamespace || 'core',
      apiRefName: reactQuery.apiRefName,
      apiRefImport: reactQuery.apiRefImport,
    },
  });
}

async function generate(outputDirectory: string, additionalProperties: string) {
  await runOpenApiGeneratorCommand({
    outputPath: outputDirectory,
    templateName: 'typescript-backstage',
    additionalProperties: additionalProperties
      .split(',')
      .reduce((acc: object, prop) => {
        const [key, value] = prop.split('=');
        return { ...acc, [key]: value };
      }, {}),
  });
}

export async function command({
  client: { outputPackage, additionalProperties },
  reactQuery: {
    enabled: enableReactQuery,
    outputPackage: queryOutputPackage,
    apiRefNamespace,
    apiRefName,
    apiRefImport,
    clientImport,
  },
}: {
  client: { outputPackage: string; additionalProperties: string };
  reactQuery: {
    outputPackage?: string;
    enabled: boolean;
    clientImport?: string;
    apiRefNamespace?: string;
    apiRefName?: string;
    apiRefImport?: string;
  };
}): Promise<void> {
  if (apiRefNamespace && apiRefName) {
    throw new Error('You can only specify one of apiRefNamespace or apiRef');
  }

  try {
    await generate(outputPackage, additionalProperties);

    console.log(
      chalk.green(`Generated client in ${outputPackage}/${OUTPUT_PATH}`),
    );
    if (enableReactQuery) {
      await generateReactQueryClient({
        client: {
          outputPackage,
        },
        reactQuery: {
          outputPackage: queryOutputPackage || outputPackage,
          apiRefNamespace,
          apiRefName,
          apiRefImport,
          clientImport,
        },
      });
      console.log(
        chalk.green(
          `Generated react query client in ${
            queryOutputPackage || outputPackage
          }/${OUTPUT_PATH}`,
        ),
      );
    }
  } catch (err) {
    console.log();
    console.log(chalk.red(`Client generation failed:`));
    console.log(err);

    process.exit(1);
  }
}
