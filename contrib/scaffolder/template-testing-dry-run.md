```js
/*
 * Copyright 2022 The Backstage Authors
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

/**
 * A CLI that helps you test Backstage software templates
 *
 * @packageDocumentation
 */

import { dirname, join, relative } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { ensureDir } from 'fs-extra';
import { program } from 'commander';
import ora from 'ora';
import readdir from 'recursive-readdir';
import { parse } from 'yaml';
import { version } from '../../../package.json';
import type { ScaffolderDryRunResponse } from '@backstage/plugin-scaffolder';

const loadDirectoryContents = async (template_path: string) => {
  const spinner = ora('Loading template').start();
  const files = await await readdir(template_path, ['.git']);
  const contents = await Promise.all(
    files.map(async p => {
      return {
        path: relative(template_path, p),
        base64Content: (await readFile(p)).toString('base64'),
      };
    }),
  );
  spinner.succeed();
  return contents;
};

const writeResultContents = async (
  root: string,
  directoryContents: ScaffolderDryRunResponse['directoryContents'],
) => {
  const directories = new Set(
    directoryContents.map(({ path }) => dirname(join(root, path))),
  );
  await Promise.all(Array.from(directories).map(d => ensureDir(d)));
  await Promise.all(
    directoryContents.map(async ({ path, base64Content, executable }) =>
      writeFile(join(root, path), Buffer.from(base64Content, 'base64'), {
        mode: executable ? 0o755 : 0o644,
      }),
    ),
  );
};

const api = async (
  bodyObj: Record<string, any>,
  { baseURL, token }: { baseURL: string; token: string | false },
) => {
  const body = gzipSync(JSON.stringify(bodyObj));
  return fetch(new URL('/api/scaffolder/v2/dry-run', baseURL), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json',
      'Content-Encoding': 'gzip',
    },
    body,
  });
};

const handle = async (
  baseURL: string,
  template_path: string,
  data: string,
  target: string,
  { token }: { token: string | false },
) => {
  const directoryContents = await loadDirectoryContents(template_path);
  const values = parse(await readFile(data, 'utf-8'));
  const secrets = {};
  const template = parse(
    await readFile(`${template_path}/template.yaml`, 'utf-8'),
  );
  const response = await api(
    {
      directoryContents,
      values,
      secrets,
      template,
    },
    { baseURL, token },
  );
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType?.startsWith('application/json')) {
      const responseData = await response.json();
      if (responseData.error) {
        throw responseData.error;
      }
      if (responseData.errors) {
        throw responseData.errors;
      }
      throw responseData;
    }
    throw await response.text();
  }
  const { log, directoryContents: resultContents } =
    (await response.json()) as ScaffolderDryRunResponse;
  for (const logEntry of log) {
    console.log(logEntry.body.message);
  }
  await writeResultContents(target, resultContents);
};

const main = async (argv: string[]) => {
  program
    .name('backstage-scaffolder')
    .version(version)
    .description('Creates a dry-run output of a given template')
    .option('-t, --token <value>', 'JWT to use for auth')
    .argument('url', 'URL of your Backstage instance')
    .argument('template-path', 'Source directory of template')
    .argument('data-path', 'YAML file with input to render')
    .argument('target', 'Output directory')
    .action(handle);

  await program.parseAsync(argv);
  process.exit();
};

process.on('unhandledRejection', rejection => {
  console.error(rejection);
  process.exit(1);
});

main(process.argv);
```
