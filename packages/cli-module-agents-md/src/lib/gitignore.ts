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

import fs from 'fs-extra';
import { targetPaths } from '@backstage/cli-common';

/**
 * Ensure the docs directory is listed in .gitignore.
 * Returns true if .gitignore was modified.
 */
export async function ensureGitignore(docsDir: string): Promise<boolean> {
  const gitignorePath = targetPaths.resolveRoot('.gitignore');
  const normalized = docsDir.replace(/^\.\//, '').replace(/\/+$/, '');
  const entry = `${normalized}/`;

  if (!(await fs.pathExists(gitignorePath))) {
    await fs.writeFile(
      gitignorePath,
      `# Backstage docs for AI agents\n${entry}\n`,
      'utf8',
    );
    return true;
  }

  const content = await fs.readFile(gitignorePath, 'utf8');
  const lines = content.split('\n');

  if (lines.some(line => line.trim() === entry || line.trim() === docsDir)) {
    return false;
  }

  const separator = content.endsWith('\n') ? '' : '\n';
  await fs.writeFile(
    gitignorePath,
    `${content}${separator}# Backstage docs for AI agents\n${entry}\n`,
    'utf8',
  );
  return true;
}
