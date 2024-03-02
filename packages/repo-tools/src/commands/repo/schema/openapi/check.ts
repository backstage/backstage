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

export async function command(opts: OptionValues) {
  let packages = await PackageGraph.listTargetPackages();
  if (opts.since) {
    const graph = PackageGraph.fromPackages(packages);
    const changedPackages = await graph.listChangedPackages({
      ref: opts.since,
      analyzeLockfile: true,
    });
    const withDevDependents = graph.collectPackageNames(
      changedPackages.map(pkg => pkg.name),
      pkg => pkg.localDevDependents.keys(),
    );
    packages = Array.from(withDevDependents).map(name => graph.get(name)!);
  }

  const checkablePackages = packages.filter(
    e => e.packageJson.scripts?.['check:api'],
  );
  try {
    const outputs = {
      completed: [],
      failed: [],
      noop: [],
      severity: 0,
    } as CiRunDetails;
    for (const pkg of checkablePackages) {
      const { stdout } = await exec(
        'yarn',
        ['check:api', '--ignore', '--json'],
        {
          cwd: pkg.dir,
        },
      );
      const result = JSON.parse(stdout.toString());
      outputs.completed.push(...(result.completed ?? []));
      outputs.failed.push(...(result.failed ?? []));
      outputs.noop.push(...(result.noop ?? []));
    }

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
