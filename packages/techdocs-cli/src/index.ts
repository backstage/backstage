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
import { spawn, ChildProcess } from 'child_process';
import program from 'commander';
import { version } from '../package.json';
import path from 'path';
import HTTPServer from './lib/httpServer';
import openBrowser from 'react-dev-utils/openBrowser';

const run = (name: string, args: string[] = []): ChildProcess => {
  const [stdin, stdout, stderr] = [
    'inherit' as const,
    'pipe' as const,
    'inherit' as const,
  ];

  const childProcess = spawn(name, args, {
    stdio: [stdin, stdout, stderr],
    shell: true,
    env: {
      ...process.env,
      FORCE_COLOR: 'true',
    },
  });

  childProcess.once('error', error => {
    console.error(error);
    childProcess.kill();
  });

  childProcess.once('exit', () => {
    process.exit(0);
  });

  return childProcess;
};

const runMkdocsServer = (options?: {
  devAddr: string;
}): Promise<ChildProcess> => {
  const devAddr = options?.devAddr ?? '0.0.0.0:8000';

  return new Promise(resolve => {
    const childProcess = run('docker', [
      'run',
      '-it',
      '-w',
      '/content',
      '-v',
      `${process.cwd()}:/content`,
      '-p',
      '8000:8000',
      'spotify/techdocs',
      'serve',
      '-a',
      devAddr,
    ]);

    childProcess.stdout?.on('data', rawData => {
      const data = rawData.toString().split('\n')[0];
      console.log('[mkdocs] ', data);

      if (data.includes(`Serving on http://${devAddr}`)) {
        resolve(childProcess);
      }
    });
  });
};

const main = (argv: string[]) => {
  program.name('techdocs-cli').version(version);

  program
    .command('serve:mkdocs')
    .description('Serve a documentation project locally')
    .action(() => {
      runMkdocsServer().then(() => {
        openBrowser('http://localhost:8000');
      });
    });

  program
    .command('serve')
    .description('Serve a documentation project locally')
    .action(() => {
      // Mkdocs server
      const mkdocsServer = runMkdocsServer();

      // Local Backstage Preview
      const techdocsPreviewBundlePath = path.join(
        /* eslint-disable-next-line no-restricted-syntax */
        __dirname,
        '..',
        'dist',
        'techdocs-preview-bundle',
      );

      const httpServer = new HTTPServer(techdocsPreviewBundlePath, 3000)
        .serve()
        .catch(err => {
          console.error(err);
          mkdocsServer.then(childProcess => childProcess.kill());
        });

      Promise.all([mkdocsServer, httpServer]).then(() => {
        openBrowser('http://localhost:3000/docs/local-dev/');
      });
    });

  program.parse(argv);
};

main(process.argv);
