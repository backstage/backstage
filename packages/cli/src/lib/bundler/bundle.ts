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

import yn from 'yn';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import webpack from 'webpack';
import {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} from 'react-dev-utils/FileSizeReporter';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import { createConfig, resolveBaseUrl } from './config';
import { BuildOptions } from './types';
import { resolveBundlingPaths } from './paths';
import chalk from 'chalk';

// TODO(Rugvip): Limits from CRA, we might want to tweak these though.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

function applyContextToError(error: string, moduleName: string): string {
  return `Failed to compile '${moduleName}':\n  ${error}`;
}

export async function buildBundle(options: BuildOptions) {
  const { statsJsonEnabled, schema: configSchema } = options;

  const paths = resolveBundlingPaths(options);
  const config = await createConfig(paths, {
    ...options,
    checksEnabled: false,
    isDev: false,
    baseUrl: resolveBaseUrl(options.frontendConfig),
  });

  const isCi = yn(process.env.CI, { default: false });

  const previousFileSizes = await measureFileSizesBeforeBuild(paths.targetDist);
  await fs.emptyDir(paths.targetDist);

  if (paths.targetPublic) {
    await fs.copy(paths.targetPublic, paths.targetDist, {
      dereference: true,
      filter: file => file !== paths.targetHtml,
    });
  }

  if (configSchema) {
    await fs.writeJson(
      resolvePath(paths.targetDist, '.config-schema.json'),
      configSchema.serialize(),
      { spaces: 2 },
    );
  }

  const { stats } = await build(config, isCi);

  if (!stats) {
    throw new Error('No stats returned');
  }

  if (statsJsonEnabled) {
    // No @types/bfj
    await require('bfj').write(
      resolvePath(paths.targetDist, 'bundle-stats.json'),
      stats.toJson(),
    );
  }

  printFileSizesAfterBuild(
    stats,
    previousFileSizes,
    paths.targetDist,
    WARN_AFTER_BUNDLE_GZIP_SIZE,
    WARN_AFTER_CHUNK_GZIP_SIZE,
  );
}

async function build(config: webpack.Configuration, isCi: boolean) {
  const stats = await new Promise<webpack.Stats | undefined>(
    (resolve, reject) => {
      webpack(config, (err, buildStats) => {
        if (err) {
          if (err.message) {
            const { errors } = formatWebpackMessages({
              errors: [err.message],
              warnings: new Array<string>(),
              _showErrors: true,
              _showWarnings: true,
            });

            throw new Error(errors[0]);
          } else {
            reject(err);
          }
        } else {
          resolve(buildStats);
        }
      });
    },
  );

  if (!stats) {
    throw new Error('Failed to compile: No stats provided');
  }

  const serializedStats = stats.toJson({
    all: false,
    warnings: true,
    errors: true,
  });
  const { errors, warnings } = formatWebpackMessages({
    errors: serializedStats.errors,
    warnings: serializedStats.warnings,
  });

  if (errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    const errorWithContext = applyContextToError(
      errors[0],
      serializedStats.errors?.[0]?.moduleName ?? '',
    );
    throw new Error(errorWithContext);
  }
  if (isCi && warnings.length) {
    const warningsWithContext = warnings.map((warning, i) => {
      return applyContextToError(
        warning,
        serializedStats.warnings?.[i]?.moduleName ?? '',
      );
    });
    console.log(
      chalk.yellow(
        '\nTreating warnings as errors because process.env.CI = true.\n',
      ),
    );
    throw new Error(warningsWithContext.join('\n\n'));
  }

  return { stats };
}
