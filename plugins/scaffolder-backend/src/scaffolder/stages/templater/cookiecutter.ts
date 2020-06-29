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
import { JsonValue } from '@backstage/config';
import { runDockerContainer } from './helpers';
import { TemplaterBase, TemplaterRunOptions } from '.';
import path from 'path';
export class CookieCutter implements TemplaterBase {
  private async fetchTemplateCookieCutter(
    directory: string,
  ): Promise<Record<string, JsonValue>> {
    try {
      return await fs.readJSON(`${directory}/cookiecutter.json`);
    } catch (ex) {
      if (ex.code !== 'ENOENT') {
        throw ex;
      }

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

    const templateDir = options.directory;
    const resultDir = await fs.promises.mkdtemp(`${options.directory}-result`);

    await runDockerContainer({
      imageName: 'spotify/backstage-cookiecutter',
      args: [
        'cookiecutter',
        '--no-input',
        '-o',
        '/result',
        '/template',
        '--verbose',
      ],
      templateDir,
      resultDir,
      logStream: options.logStream,
      dockerClient: options.dockerClient,
    });

    return path.resolve(resultDir, options.values.component_id as string);
  }
}
