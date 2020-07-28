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
import { runDockerContainer } from './helpers';
import { TemplaterBase, TemplaterRunOptions } from '.';
import path from 'path';
import { TemplaterRunResult } from './types';
import * as yaml from 'yaml';

export class CreateReactAppTemplater implements TemplaterBase {
  public async run(options: TemplaterRunOptions): Promise<TemplaterRunResult> {
    const {
      component_id: componentName,
      use_typescript: withTypescript,
      description,
      owner,
    } = options.values;

    const resultDir = await fs.promises.mkdtemp(`${options.directory}-result`);

    await runDockerContainer({
      imageName: 'node:lts-alpine',
      args: [
        'create-react-app',
        componentName as string,
        withTypescript ? ' --template typescript' : '',
      ],
      templateDir: options.directory,
      resultDir,
      logStream: options.logStream,
      dockerClient: options.dockerClient,
      createOptions: {
        Entrypoint: ['npx'],
        WorkingDir: '/result',
      },
    });

    // Need to also make a component-info.yaml to store the data about the service.
    const componentInfo = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: componentName,
        description,
      },
      spec: {
        type: 'website',
        lifecycle: 'experimental',
        owner,
      },
    };

    const finalDir = path.resolve(
      resultDir,
      options.values.component_id as string,
    );

    await fs.promises.writeFile(
      `${finalDir}/component-info.yaml`,
      yaml.stringify(componentInfo),
    );

    return {
      resultDir: finalDir,
    };
  }
}
