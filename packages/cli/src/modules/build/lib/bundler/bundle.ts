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
import { createConfig } from './config';
import { BuildOptions } from './types';
import { resolveBundlingPaths, resolveOptionalBundlingPaths } from './paths';
import chalk from 'chalk';
import { createDetectedModulesEntryPoint } from './packageDetection';

// TODO(Rugvip): Limits from CRA, we might want to tweak these though.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

function applyContextToError(error: string, moduleName: string): string {
  return `Failed to compile '${moduleName}':\n  ${error}`;
}

export async function buildBundle(options: BuildOptions) {
  const { statsJsonEnabled, schema: configSchema, rspack } = options;

  const paths = resolveBundlingPaths(options);
  const publicPaths = await resolveOptionalBundlingPaths({
    targetDir: options.targetDir,
    entry: 'src/index-public-experimental',
    dist: 'dist/public',
  });

  const commonConfigOptions = {
    ...options,
    checksEnabled: false,
    isDev: false,
    getFrontendAppConfigs: () => options.frontendAppConfigs,
  };

  const configs: webpack.Configuration[] = [];

  if (options.moduleFederation?.mode === 'remote') {
    // Package detection is disabled for remote bundles
    configs.push(await createConfig(paths, commonConfigOptions));
  } else {
    const detectedModulesEntryPoint = await createDetectedModulesEntryPoint({
      config: options.fullConfig,
      targetPath: paths.targetPath,
    });

    configs.push(
      await createConfig(paths, {
        ...commonConfigOptions,
        additionalEntryPoints: detectedModulesEntryPoint,
        appMode: publicPaths ? 'protected' : 'public',
      }),
    );

    if (publicPaths) {
      console.log(
        chalk.yellow(
          `⚠️  WARNING: The app /public entry point is an experimental feature that may receive immediate breaking changes.`,
        ),
      );
      configs.push(
        await createConfig(publicPaths, {
          ...commonConfigOptions,
          appMode: 'public',
        }),
      );
    }
  }

  const isCi = yn(process.env.CI, { default: false });

  const previousFileSizes = await measureFileSizesBeforeBuild(paths.targetDist);
  const previousAuthSizes = publicPaths
    ? await measureFileSizesBeforeBuild(publicPaths.targetDist)
    : undefined;
  await fs.emptyDir(paths.targetDist);

  if (paths.targetPublic) {
    await fs.copy(paths.targetPublic, paths.targetDist, {
      dereference: true,
      filter: file => file !== paths.targetHtml,
    });

    // If we've got a separate public index entry point, copy public content there too
    if (publicPaths) {
      await fs.copy(paths.targetPublic, publicPaths.targetDist, {
        dereference: true,
        filter: file => file !== paths.targetHtml,
      });
    }
  }

  if (configSchema) {
    await fs.writeJson(
      resolvePath(paths.targetDist, '.config-schema.json'),
      configSchema.serialize(),
      { spaces: 2 },
    );
  }

  if (rspack) {
    console.log(
      chalk.yellow(`⚠️  WARNING: Using experimental RSPack bundler.`),
    );
  }

  const { stats } = await build(configs, isCi, rspack);

  if (!stats) {
    throw new Error('No stats returned');
  }
  const [mainStats, authStats] = stats.stats;

  if (statsJsonEnabled) {
    // No @types/bfj
    await require('bfj').write(
      resolvePath(paths.targetDist, 'bundle-stats.json'),
      mainStats.toJson(),
    );
  }

  printFileSizesAfterBuild(
    mainStats,
    previousFileSizes,
    paths.targetDist,
    WARN_AFTER_BUNDLE_GZIP_SIZE,
    WARN_AFTER_CHUNK_GZIP_SIZE,
  );
  if (publicPaths && previousAuthSizes) {
    printFileSizesAfterBuild(
      authStats,
      previousAuthSizes,
      publicPaths.targetDist,
      WARN_AFTER_BUNDLE_GZIP_SIZE,
      WARN_AFTER_CHUNK_GZIP_SIZE,
    );
  }
}

async function build(
  configs: webpack.Configuration[],
  isCi: boolean,
  rspack?: typeof import('@rspack/core').rspack,
) {
  const bundler = (rspack ?? webpack) as typeof webpack;

  const stats = await new Promise<webpack.MultiStats | undefined>(
    (resolve, reject) => {
      bundler(configs, (err, buildStats) => {
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
