/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { railsArgumentResolver } from './railsArgumentResolver';
import { sep as separatorPath } from 'path';
import os from 'os';

describe('railsArgumentResolver', () => {
  describe('when provide the parameter', () => {
    const root = os.platform() === 'win32' ? 'C:\\' : '/';
    test.each([
      [{}, []],
      [{ minimal: true }, ['--minimal']],
      [{ api: true }, ['--api']],
      [{ skipBundle: true }, ['--skip-bundle']],
      [{ skipWebpackInstall: true }, ['--skip-webpack-install']],
      [{ webpacker: 'vue' }, ['--webpack', 'vue']],
      [{ database: 'postgresql' }, ['--database', 'postgresql']],
      [{ railsVersion: 'dev' }, ['--dev']],
      [
        { template: `.${separatorPath}rails.rb` },
        ['--template', `${root}${separatorPath}rails.rb`],
      ],
    ])(
      'should include the argument to execution %p ->  %p',
      (passedArguments: object, expected: Array<string>) => {
        // that step is to ensure the validation between the TemplaterValues and the resolver
        const values = {
          owner: 'r',
          storePath: '',
          railsArguments: passedArguments,
        };

        const { railsArguments } = values;

        const argumentsToRun = railsArgumentResolver(root, railsArguments);

        expect(argumentsToRun).toEqual(expected);
      },
    );
  });
});
