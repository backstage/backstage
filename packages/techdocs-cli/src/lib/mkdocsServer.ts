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

import { ChildProcess } from 'child_process';
import { run, LogFunc } from './run';

export const runMkdocsServer = async (options: {
  port?: string;
  useDocker?: boolean;
  dockerImage?: string;
  stdoutLogFunc?: LogFunc;
  stderrLogFunc?: LogFunc;
}): Promise<ChildProcess> => {
  const port = options.port ?? '8000';
  const useDocker = options.useDocker ?? true;
  const dockerImage = options.dockerImage ?? 'spotify/techdocs';

  if (useDocker) {
    return await run(
      'docker',
      [
        'run',
        '--rm',
        '-w',
        '/content',
        '-v',
        `${process.cwd()}:/content`,
        '-p',
        `${port}:${port}`,
        dockerImage,
        'serve',
        '--dev-addr',
        `0.0.0.0:${port}`,
      ],
      {
        stdoutLogFunc: options.stdoutLogFunc,
        stderrLogFunc: options.stderrLogFunc,
      },
    );
  }

  return await run('mkdocs', ['serve', '--dev-addr', `127.0.0.1:${port}`], {
    stdoutLogFunc: options.stdoutLogFunc,
    stderrLogFunc: options.stderrLogFunc,
  });
};
