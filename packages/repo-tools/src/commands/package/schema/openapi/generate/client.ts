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
  const resolvedQueryClientDirectory = cliPaths.resolveTargetRoot(
    outputPath,
    OUTPUT_PATH,
  );
  await fs.mkdirp(resolvedQueryClientDirectory);

  await fs.writeFile(
    resolve(resolvedQueryClientDirectory, '.openapi-generator-ignore'),
    OPENAPI_IGNORE_FILES.join('\n'),
  );

  const additionalPropertiesList = additionalProperties
    ? Object.entries(additionalProperties)
        .map(([key, value]) => `${key}=${value}`)
        .join(',')
    : undefined;

  const additionalOptions = [];
  if (additionalPropertiesList) {
    additionalOptions.push(
      `--additional-properties=${additionalPropertiesList}`,
    );
  }
  console.log(additionalOptions);
  const { stdout } = await exec(
    'node',
    [
      resolvePackagePath('@openapitools/openapi-generator-cli', 'main.js'),
      'generate',
      '-i',
      resolvedOpenapiPath,
      '-o',
      resolvedQueryClientDirectory,
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
  fs.writeFileSync('test.txt', stdout);

  await exec(
    `yarn backstage-cli package lint --fix ${resolvedQueryClientDirectory}`,
  );

  const prettier = cliPaths.resolveTargetRoot('node_modules/.bin/prettier');
  if (prettier) {
    await exec(`${prettier} --write ${resolvedQueryClientDirectory}`);
  }

  fs.removeSync(
    resolve(resolvedQueryClientDirectory, '.openapi-generator-ignore'),
  );

  fs.rmSync(resolve(resolvedQueryClientDirectory, '.openapi-generator'), {
    recursive: true,
    force: true,
  });
}

async function generateReactQueryClient({
  client: { outputPackage, additionalProperties },
  reactQuery,
}: {
  client: { outputPackage: string; additionalProperties: string };
  reactQuery: {
    outputPackage: string;
    apiRefNamespace: string | undefined;
    clientImport: string | undefined;
  };
}) {
  console.log(reactQuery);
  await runOpenApiGeneratorCommand({
    outputPath: reactQuery.outputPackage,
    templateName: 'typescript-backstage-react-query',
    additionalProperties: {
      clientImport:
        outputPackage === reactQuery.outputPackage
          ? '.'
          : // OpenAPI generator doesn't support '@'
            `@${reactQuery.clientImport}`,
      apiRefNamespace: reactQuery.apiRefNamespace || 'core',
      ...additionalProperties,
    },
  });
}

async function generate(outputDirectory: string) {
  await runOpenApiGeneratorCommand({
    outputPath: outputDirectory,
    templateName: 'typescript-backstage',
  });
}

export async function command({
  outputPackage,
  reactQuery: {
    enabled: enableReactQuery,
    outputPackage: queryOutputPackage,
    apiRefNamespace,
    clientImport,
  },
}: {
  outputPackage: string;
  reactQuery: {
    outputPackage?: string;
    enabled: boolean;
    clientImport?: string;
    apiRefNamespace?: string;
  };
}): Promise<void> {
  try {
    await generate(outputPackage);
    if (enableReactQuery) {
      await generateReactQueryClient({
        client: {
          outputPackage,
        },
        reactQuery: {
          outputPackage: queryOutputPackage || outputPackage,
          apiRefNamespace,
          clientImport,
        },
      });
    }
    console.log(
      chalk.green(`Generated client in ${outputPackage}/${OUTPUT_PATH}`),
    );
  } catch (err) {
    console.log();
    console.log(chalk.red(`Client generation failed:`));
    console.log(err);

    process.exit(1);
  }
}
