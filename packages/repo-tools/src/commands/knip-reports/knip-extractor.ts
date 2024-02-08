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
import { paths as cliPaths } from '../../lib/paths';
import pLimit from 'p-limit';
import os from 'os';
import { relative as relativePath, resolve as resolvePath } from 'path';
import fs from 'fs-extra';
import { createBinRunner } from '../util';

// Ignore this due to Knip error: Error: ENAMETOOLONG: name too long, scandir
const ignoredPackages = ['packages/techdocs-cli-embedded-app'];

interface KnipExtractionOptions {
  packageDirs: string[];
  isLocalBuild: boolean;
}

interface KnipConfigOptions {
  packageDir: string;
}

interface KnipPackageOptions {
  packageDir: string;
  knipDir: string;
  isLocalBuild: boolean;
}

function logKnipReportInstructions() {
  console.log('');
  console.log(
    '*************************************************************************************',
  );
  console.log(
    '* You have uncommitted changes to the knip reports of a package.                    *',
  );
  console.log(
    '* To solve this, run `yarn build:knip-reports` and commit all md file changes.      *',
  );
  console.log(
    '*************************************************************************************',
  );
  console.log('');
}

async function generateKnipConfig({ packageDir }: KnipConfigOptions) {
  const knipConfig = {
    entry: [
      'dev/index.{ts,tsx}',
      'src/index.{ts,tsx}',
      'src/alpha.{ts,tsx}',
      'src/routes.ts',
      'src/run.ts',
    ],
    jest: {
      entry: ['src/setupTests.ts', '**/*.test.{ts,tsx}'],
    },
    storybook: { entry: 'src/components/**/*.stories.tsx' },
    ignore: [
      '.eslintrc.js',
      'config.d.ts',
      'knexfile.js',
      'node_modules/**',
      'dist/**',
      '{fixtures,migrations,templates}/**',
    ],
    ignoreDependencies: [
      '@backstage/cli', // everything depends on this for its package.json commands
    ],
  };
  await fs.writeFile(
    `${packageDir}/knip.json`,
    JSON.stringify(knipConfig, null, 2),
  );
}

function cleanKnipConfig({ packageDir }: KnipConfigOptions) {
  if (fs.existsSync(`${packageDir}/knip.json`)) {
    fs.rmSync(`${packageDir}/knip.json`);
  }
}

async function handlePackage({
  packageDir,
  knipDir,
  isLocalBuild,
}: KnipPackageOptions) {
  console.log(`## Processing ${packageDir}`);
  if (ignoredPackages.includes(packageDir)) {
    console.log(`Skipping ${packageDir}`);
    return;
  }
  const fullDir = cliPaths.resolveTargetRoot(packageDir);
  const reportPath = resolvePath(fullDir, 'knip-report.md');
  const run = createBinRunner(fullDir, '');

  await generateKnipConfig({ packageDir: fullDir });

  const report = await run(
    `${knipDir}/knip.js`,
    `--directory ${fullDir}`, // Run in the package directory
    '--config knip.json',
    '--no-exit-code', // Removing this will end the process in case there are findings by knip
    '--no-progress', // Remove unnecessary debugging from output
    // TODO: Add more checks when dependencies start to look ok, see https://knip.dev/reference/cli#--include
    '--include dependencies,unlisted',
    '--reporter markdown',
  );

  cleanKnipConfig({ packageDir: fullDir });

  const existingReport = await fs.readFile(reportPath, 'utf8').catch(error => {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  });

  if (existingReport !== report) {
    if (isLocalBuild) {
      console.warn(`Knip report changed for ${packageDir}`);
      await fs.writeFile(reportPath, report);
    } else {
      logKnipReportInstructions();

      if (existingReport) {
        console.log('');
        console.log(
          `The conflicting file is ${relativePath(
            cliPaths.targetRoot,
            reportPath,
          )}, expecting the following content:`,
        );
        console.log('');

        console.log(report);

        logKnipReportInstructions();
      }
      throw new Error(`Knip report changed for ${packageDir}, `);
    }
  }
}

export async function runKnipReports({
  packageDirs,
  isLocalBuild,
}: KnipExtractionOptions) {
  const knipDir = cliPaths.resolveTargetRoot('./node_modules/knip/bin/');
  const limiter = pLimit(os.cpus().length);

  try {
    await Promise.all(
      packageDirs.map(packageDir =>
        limiter(async () =>
          handlePackage({ packageDir, knipDir, isLocalBuild }),
        ),
      ),
    );
  } catch (e) {
    console.log(
      `Error occurred during knip reporting: ${e}, cleaning knip configs`,
    );
    packageDirs.map(packageDir => {
      const fullDir = cliPaths.resolveTargetRoot(packageDir);
      cleanKnipConfig({ packageDir: fullDir });
    });
  }
}
