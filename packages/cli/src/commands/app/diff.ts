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

import { Command } from 'commander';
import {
  diffTemplateFiles,
  handlers,
  handleAllFiles,
  inquirerPromptFunc,
  makeCheckPromptFunc,
  yesPromptFunc,
} from '../../lib/diff';
import { version } from '../../lib/version';

const fileHandlers = [
  {
    patterns: ['packages/app/package.json'],
    handler: handlers.appPackageJson,
  },
  {
    patterns: [/tsconfig\.json$/],
    handler: handlers.exactMatch,
  },
  {
    patterns: [
      /README\.md$/,
      /\.eslintrc\.js$/,
      // make sure files in 1st level of src/ and dev/ exist
      /^packages\/app\/(src|dev)\/[^/]+$/,
    ],
    handler: handlers.exists,
  },
  {
    patterns: [
      'lerna.json',
      /^src\//,
      /^patches\//,
      /^packages\/app\/public\//,
      /^packages\/app\/cypress/,
      // Let plugin:diff take care of the plugins
      /^plugins/,
      /package\.json$/,
    ],
    handler: handlers.skip,
  },
];

export default async (cmd: Command) => {
  let promptFunc = inquirerPromptFunc;
  let finalize = () => {};

  if (cmd.check) {
    [promptFunc, finalize] = makeCheckPromptFunc();
  } else if (cmd.yes) {
    promptFunc = yesPromptFunc;
  }

  const templateFiles = await diffTemplateFiles('default-app', { version });
  await handleAllFiles(fileHandlers, templateFiles, promptFunc);
  await finalize();
};
