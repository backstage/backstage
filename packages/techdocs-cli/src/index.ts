/*
 * Copyright 2020 Spotify AB
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
import program from 'commander';
import { version } from './lib/version';
// import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';
// import HTTPServer from './lib/httpServer';

const run = (workingDirectory: string, name: string, args: string[] = []) => {
  const child = spawn(name, args, {
    cwd: workingDirectory,
    stdio: ['inherit', 'inherit', 'inherit'],
    shell: true,
    env: {
      ...process.env,
      FORCE_COLOR: 'true',
    },
  });

  child.once('error', error => {
    console.error(error);
  });
  child.once('exit', code => {
    console.log('exited!', code);
  });
};

const main = (argv: string[]) => {
  program.name('techdocs-cli').version(version);

  program
    .command('serve')
    .description('Serve a documentation project locally')
    .action(() => {
      // const techdocsPreviewBundlePath = path.join(
      //   __dirname,
      //   '..',
      //   'dist',
      //   'techdocs-preview-bundle',
      // );

      // new HTTPServer(techdocsPreviewBundlePath, 3000).serve();

      run(process.env.PWD!, 'docker', [
        'run',
        '-it',
        '-w',
        '/content',
        '-v',
        '$(pwd):/content',
        '-p',
        '8000:8000',
        'mkdocs:local-dev',
        'serve',
        '-a',
        '0.0.0.0:8000',
      ]);

      const pluginPath = path.join(
        require.resolve('@backstage/plugin-techdocs'),
        '..',
        '..',
      );

      run(
        pluginPath,
        path.join(require.resolve('@backstage/cli'), '../../bin/backstage-cli'),
        ['plugin:serve'],
      );
    });

  program.parse(argv);
};

main(process.argv);
