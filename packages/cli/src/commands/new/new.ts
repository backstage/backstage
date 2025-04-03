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

import { createNewPackage } from '../../lib/new/createNewPackage';

type ArgOptions = {
  option: string[];
  select?: string;
  skipInstall: boolean;
  private?: boolean;
  npmRegistry?: string;
  scope?: string;
  license?: string;
  baseVersion?: string;
};

export default async (opts: ArgOptions) => {
  const {
    option: rawArgOptions,
    select: preselectedTemplateId,
    skipInstall,
    scope,
    private: isPrivate,
    ...otherGlobals
  } = opts;

  const prefilledParams = parseParams(rawArgOptions);

  let pluginInfix: string | undefined = undefined;
  let packagePrefix: string | undefined = undefined;
  if (scope) {
    packagePrefix = scope.includes('/') ? `@${scope}` : `@${scope}/`;
    pluginInfix = scope.includes('backstage') ? 'plugin-' : 'backstage-plugin-';
  }

  if (
    isPrivate === false || // set to false with --no-private flag
    Object.values(otherGlobals).filter(Boolean).length !== 0
  ) {
    console.warn(
      `Global template configuration via CLI flags is deprecated, see https://backstage.io/docs/cli/new for information on how to configure package templating`,
    );
  }

  await createNewPackage({
    prefilledParams,
    preselectedTemplateId,
    configOverrides: {
      license: otherGlobals.license,
      version: otherGlobals.baseVersion,
      private: isPrivate,
      publishRegistry: otherGlobals.npmRegistry,
      packageNamePrefix: packagePrefix,
      packageNamePluginInfix: pluginInfix,
    },
    skipInstall,
  });
};

function parseParams(optionStrings: string[]): Record<string, string> {
  const options: Record<string, string> = {};

  for (const str of optionStrings) {
    const [key] = str.split('=', 1);
    const value = str.slice(key.length + 1);
    if (!key || str[key.length] !== '=') {
      throw new Error(
        `Invalid option '${str}', must be of the format <key>=<value>`,
      );
    }
    options[key] = value;
  }

  return options;
}
