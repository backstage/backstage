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
import { PackageGraph } from '@backstage/cli-node';
import { OptionValues } from 'commander';
import { exec } from '../../../../lib/exec';
import {
  CiRunDetails,
  generateCompareSummaryMarkdown,
} from '../../../../lib/openapi/optic/helpers';
import { paths as cliPaths } from '../../../../lib/paths';
import { YAML_SCHEMA_PATH } from '../../../../lib/openapi/constants';

function cleanUpApiName(e: { apiName: string }) {
  e.apiName = e.apiName
    .replace(cliPaths.targetDir, '')
    .replace(YAML_SCHEMA_PATH, '');
}

export async function command(opts: OptionValues) {
  let packages = await PackageGraph.listTargetPackages();

  let since = '';
  if (opts.since) {
    const { stdout: sinceRaw } = await exec('git', ['rev-parse', opts.since]);
    since = sinceRaw.toString().trim();
    const { stdout: changedFilesRaw } = await exec('git', [
      'diff',
      '--name-only',
      since,
    ]);
    const changedFiles = changedFilesRaw.toString().trim();

    const changedOpenApiSpecs = changedFiles
      .split('\n')
      .filter(e => e.endsWith(YAML_SCHEMA_PATH))
      .map(e => cliPaths.resolveTarget(e));

    // filter packages by changedFiles
    packages = packages.filter(pkg =>
      changedOpenApiSpecs.some(e => e.startsWith(`${pkg.dir}/`)),
    );
  }

  const checkablePackages = packages.filter(e => e.packageJson.scripts?.diff);

  try {
    const outputs = {
      completed: [],
      failed: [],
      noop: [],
      warning: [],
      severity: 0,
    } as CiRunDetails;
    for (const pkg of checkablePackages) {
      const sinceCommands = since ? ['--since', since] : [];
      const { stdout } = await exec(
        'yarn',
        ['diff', '--ignore', '--json', ...sinceCommands],
        {
          cwd: pkg.dir,
        },
      );
      const result = JSON.parse(stdout.toString());
      outputs.completed.push(...(result.completed ?? []));
      outputs.failed.push(...(result.failed ?? []));
      outputs.noop.push(...(result.noop ?? []));
    }

    for (const pkg of packages.filter(e => !e.packageJson.scripts?.diff)) {
      outputs.warning?.push({
        apiName: `${pkg.dir}/`,
        warning: 'No diff script found in package.json',
      });
    }

    outputs.completed.forEach(cleanUpApiName);
    outputs.failed.forEach(cleanUpApiName);
    outputs.noop.forEach(cleanUpApiName);
    outputs.warning?.forEach(cleanUpApiName);

    const { stdout: currentSha } = await exec('git', ['rev-parse', 'HEAD']);
    console.log(
      generateCompareSummaryMarkdown(
        { sha: currentSha.toString().trim() },
        outputs,
        { verbose: true },
      ),
    );

    const failed = outputs.failed.length > 0;
    if (failed) {
      throw new Error('Some checks failed');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
