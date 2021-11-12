/*
 * Copyright 2021 The Backstage Authors
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

import { paths } from '../../../lib/paths';
import { getCodeownersFilePath, parseOwnerIds } from '../../../lib/codeowners';
import { createFactory } from '../types';

type Options = {
  id: string;
  owner?: string;
  codeOwnersPath?: string;
};

export const frontendPlugin = createFactory<Options>({
  name: 'plugin',
  description: 'A new frontend plugin',
  optionsDiscovery: async () => ({
    codeOwnersPath: await getCodeownersFilePath(paths.targetRoot),
  }),
  optionsPrompts: [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an ID for the plugin [required]',
      validate: (value: string) => {
        if (!value) {
          return 'Please enter an ID for the plugin';
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
          return 'Plugin IDs must be lowercase and contain only letters, digits, and dashes.';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'owner',
      message: 'Enter an owner of the plugin to add to CODEOWNERS [optional]',
      when: opts => Boolean(opts.codeOwnersPath),
      validate: (value: string) => {
        if (!value) {
          return true;
        }

        const ownerIds = parseOwnerIds(value);
        if (!ownerIds) {
          return 'The owner must be a space separated list of team names (e.g. @org/team-name), usernames (e.g. @username), or the email addresses (e.g. user@example.com).';
        }

        return true;
      },
    },
  ],
  async create(options: Options) {
    console.log(
      `Creating ${this.name} with options ${JSON.stringify(options)}`,
    );
  },
});
