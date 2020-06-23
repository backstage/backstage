import { TemplaterBase, TemplaterRunOptions } from '.';

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
import fs from 'fs-extra';
import Docker from 'dockerode';
import { JsonValue } from '@backstage/config';
import { PassThrough } from 'stream';
export class CookieCutter implements TemplaterBase {
  private docker: Docker;
  constructor() {
    this.docker = new Docker();
  }

  private async fetchTemplateCookieCutter(
    directory: string,
  ): Promise<Record<string, JsonValue>> {
    try {
      return await fs.readJSON(`${directory}/cookiecutter.json`);
    } catch (ex) {
      return {};
    }
  }

  public async run(options: TemplaterRunOptions): Promise<string> {
    // First lets grab the default cookiecutter.json file
    const cookieCutterJson = await this.fetchTemplateCookieCutter(
      options.directory,
    );

    const cookieInfo = {
      ...cookieCutterJson,
      ...options.values,
    };

    await fs.writeJSON(`${options.directory}/cookiecutter.json`, cookieInfo);

    const realTemplatePath = await fs.promises.realpath(options.directory);
    const outDir = `${realTemplatePath}/result`;

    const [
      { Error: dockerError, StatusCode: containerStatusCode },
    ] = await this.docker.run(
      'backstage/cookiecutter',
      ['cookiecutter', '--no-input', '-o', '/result', '/template'],
      options.logStream ?? new PassThrough(),
      {
        Volumes: { '/result': {}, '/template': {} },
        HostConfig: {
          Binds: [`${outDir}:/result`, `${realTemplatePath}:/template`],
        },
      },
    );

    if (dockerError) {
      throw new Error(
        `Docker failed to run with the following error message: ${dockerError}`,
      );
    }

    if (containerStatusCode !== 0) {
      throw new Error(
        `Docker container returned a non-zero exit code (${containerStatusCode})`,
      );
    }

    return outDir;
  }
}
