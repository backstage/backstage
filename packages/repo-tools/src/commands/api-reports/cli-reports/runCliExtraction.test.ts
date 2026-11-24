/*
 * Copyright 2026 The Backstage Authors
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

import { parseHelpPage } from './runCliExtraction';

it('includes groups and commands when extracting help pages', () => {
  expect(
    parseHelpPage(`example-cli

USAGE:
  example-cli [flags...]
  example-cli <command>

GROUPS:
  repo        build, clean, lint, start, test, …
  package     example/

COMMANDS:
  info        Show information
  help        Display help for command

FLAGS:
  -h, --help  Show help
`),
  ).toEqual({
    usage: 'example-cli [flags...]',
    commands: ['help', 'info', 'package', 'repo'],
    options: ['-h, --help'],
    commandArguments: [],
  });
});
