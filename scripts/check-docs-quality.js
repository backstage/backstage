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
const { spawnSync } = require('child_process');
const { resolve: resolvePath, join: joinPath } = require('path');
const fs = require('fs').promises;

const IGNORED = [
  /^ADOPTERS\.md$/,
  /^OWNERS\.md$/,
  /^.*[/\\]CHANGELOG\.md$/,
  /^.*[/\\]([^\/]+-)?api-report\.md$/,
  /^docs[/\\]releases[/\\].*-changelog\.md$/,
  /^docs[/\\]reference[/\\]/,
];

const rootDir = resolvePath(__dirname, '..');

// Manual listing to avoid dependency install for listing files in CI
async function listFiles(dir = '') {
  const files = await fs.readdir(dir || rootDir);
  const paths = await Promise.all(
    files
      .filter(file => file !== 'node_modules')
      .map(async file => {
        const path = joinPath(dir, file);

        if (IGNORED.some(pattern => pattern.test(path))) {
          return [];
        }
        if ((await fs.stat(path)).isDirectory()) {
          return listFiles(path);
        }
        if (!path.endsWith('.md')) {
          return [];
        }
        return path;
      }),
  );
  return paths.flat();
}

// Proceed with the script only if Vale linter is installed. Limit the friction and surprises
// caused by the script. In CI, we want to ensure vale linter is run.
async function exitIfMissingVale() {
  try {
    // eslint-disable-next-line @backstage/no-undeclared-imports
    await require('command-exists')('vale');
  } catch (e) {
    if (process.env.CI) {
      console.log(
        `Language linter (vale) was not found. Please install vale linter (https://docs.errata.ai/vale/install).\n`,
      );
      process.exit(1);
    }
    console.log(`Language linter (vale) generated errors. Please check the errors and review any markdown files that you changed.
  Possibly update .github/vale/Vocab/Backstage/accept.txt to add new valid words.\n`);
    process.exit(0);
  }
}

async function runVale(files) {
  const result = spawnSync(
    'vale',
    ['--config', resolvePath(rootDir, '.vale.ini'), ...files],
    {
      stdio: 'inherit',
    },
  );

  if (result.status !== 0) {
    // TODO(Rugvip): This logic was here before but seems a bit odd, could use some verification on windows.
    // If it contains system level error. In this case vale does not exist.
    if (process.platform !== 'win32' || result.error) {
      console.log(`Language linter (vale) generated errors. Please check the errors and review any markdown files that you changed.
  Possibly update .github/vale/Vocab/Backstage/accept.txt to add new valid words.\n`);
    }
    return false;
  }

  return true;
}

async function main() {
  const files = await listFiles();

  if (process.argv.includes('--ci-args')) {
    process.stdout.write(
      // Workaround for not being able to pass arguments to the vale action
      JSON.stringify([...files]),
    );
    return;
  }

  await exitIfMissingVale();

  const success = await runVale(files);
  if (!success) {
    process.exit(2);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
