import { JsonObject } from '@backstage/types';

/*
 * Copyright 2023 The Backstage Authors
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
export type CopierCliFlags = {
  url: string;
  answerFile: string;
  pretend?: boolean;
};

export function prepareArguments(args: CopierCliFlags, values: JsonObject) {
  const preparedArgs = parseArgs(args);
  const prepredValues = Object.entries(values).flatMap(([key, value]) => [
    '--data',
    `${key}=${value}`,
  ]);

  return [...preparedArgs, ...prepredValues];
}

function parseArgs(args: CopierCliFlags): string[] {
  return [
    '--force', // required to run copier in non-interactive mode. For more, see https://copier.readthedocs.io/en/stable/configuring/#force
    ...(args.answerFile ? ['-a', args.answerFile] : []),
    ...(args.pretend ? ['--pretend'] : []),
  ];
}
