/*
 * Copyright 2025 The Backstage Authors
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

import { cli } from 'cleye';
import chalk from 'chalk';
import { targetPaths } from '@backstage/cli-common';
import type { CliCommandContext } from '@backstage/cli-node';
import { detectBackstageVersion } from '../lib/version';
import { downloadDocs } from '../lib/download';
import { buildDocTree } from '../lib/buildDocTree';
import { generateIndex } from '../lib/generateIndex';
import { injectIntoFile } from '../lib/inject';
import { ensureGitignore } from '../lib/gitignore';
import type { DocSection } from '../lib/types';

export default async ({ args, info }: CliCommandContext) => {
  const { flags, _: positionals } = cli(
    {
      help: info,
      booleanFlagNegation: true,
      parameters: ['[output-file]'],
      flags: {
        release: {
          type: String,
          description:
            'Backstage release version (auto-detected from backstage.json)',
        },
        docsDir: {
          type: String,
          description: 'Directory for downloaded docs',
          default: '.backstage-docs',
        },
        noDownload: {
          type: Boolean,
          description: 'Skip download, use existing docs directory',
        },
      },
    },
    undefined,
    args,
  );

  // Resolve output file
  const outputFile = positionals[0] ?? 'AGENTS.md';

  // Resolve Backstage version
  let version = flags.release;
  if (!version) {
    const detected = await detectBackstageVersion();
    if (!detected.version) {
      throw new Error(detected.error ?? 'Could not detect Backstage version.');
    }
    console.log(
      `Detected Backstage version ${chalk.cyan(
        detected.version,
      )} from backstage.json`,
    );
    version = detected.version;
  }

  // Normalize and validate docsDir to prevent malformed or dangerous paths
  const docsDir = flags.docsDir!.replace(/^\.\//, '').replace(/\/+$/, '');
  if (
    !docsDir ||
    docsDir === '.' ||
    docsDir === '..' ||
    docsDir.split('/').some(seg => seg === '..')
  ) {
    throw new Error(
      `Invalid --docs-dir value "${flags.docsDir}". Must be a subdirectory name (e.g. ".backstage-docs").`,
    );
  }
  let docsPath: string;

  if (flags.noDownload) {
    docsPath = targetPaths.resolveRoot(docsDir, 'docs');
    const fs = await import('fs-extra');
    if (!(await fs.pathExists(docsPath))) {
      throw new Error(
        `Docs directory not found at ${docsPath}. Run without --no-download first.`,
      );
    }
  } else {
    docsPath = await downloadDocs({ version, docsDir });
  }

  // Build doc tree
  const sections = await buildDocTree(docsPath);
  const totalFiles = countFiles(sections);
  console.log(
    `Found ${chalk.cyan(
      String(totalFiles),
    )} documentation files in ${chalk.cyan(String(sections.length))} sections`,
  );

  // Generate index
  const relativeDocsPath = `./${docsDir}/docs`;
  if (/\|/.test(outputFile) || /\|/.test(docsDir) || /\|/.test(version)) {
    throw new Error(
      'Output file, docs directory, and version must not contain pipe characters (|).',
    );
  }
  const content = generateIndex({
    sections,
    docsPath: relativeDocsPath,
    version,
    outputFile,
  });

  // Inject into target file
  const resolvedOutputPath = targetPaths.resolveRoot(outputFile);
  const result = await injectIntoFile(resolvedOutputPath, content);

  if (result.created) {
    console.log(`Created ${chalk.green(outputFile)} with docs index`);
  } else {
    console.log(`Updated docs index in ${chalk.green(outputFile)}`);
  }

  // Update .gitignore
  const gitignoreUpdated = await ensureGitignore(docsDir);
  if (gitignoreUpdated) {
    console.log(`Added ${chalk.cyan(`${docsDir}/`)} to .gitignore`);
  }

  console.log(
    `\n${chalk.green(
      'Done!',
    )} AI coding agents can now reference your version-specific Backstage docs.`,
  );
};

function countFiles(sections: DocSection[]): number {
  let count = 0;
  for (const s of sections) {
    count += s.files.length;
    count += countFiles(s.subsections);
  }
  return count;
}
