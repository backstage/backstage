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
  readTemplateFiles,
  handlers,
  handleAllFiles,
  inquirerPromptFunc,
  makeCheckPromptFunc,
  yesPromptFunc,
} from '../../lib/diff';

const fileHandlers = [
  {
    patterns: ['package.json'],
    handler: handlers.packageJson,
  },
  {
    patterns: ['tsconfig.json'],
    handler: handlers.exactMatch,
  },
  {
    // make sure files in 1st level of src/ and dev/ exist
    patterns: ['.eslintrc.js', /^(src|dev)\/[^/]+$/],
    handler: handlers.exists,
  },
  {
    patterns: ['README.md', /^src\//],
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

  const templateFiles = await readTemplateFiles('default-plugin');
  await handleAllFiles(fileHandlers, templateFiles, promptFunc);
  await finalize();
};
