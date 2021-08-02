#!/usr/bin/env node
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

import { readFileSync } from 'fs';
import { join } from 'path';
import prompts from 'prompts';

import { addCatalogProcessor } from './addCatalogProcessor';
import { doesCatalogHaveProcessor } from './doesCatalogHaveProcessor';
import { patchAppConfig } from './patchAppConfig';
import { validateAppConfig } from './validateAppConfig';

const main = async () => {
  console.log(`============================================
Welcome to the Backstage Catalog LDAP Module
============================================`);

  const catalogFilePath = join(process.cwd(), 'src', 'plugins', 'catalog.ts');
  const catalogFileContent = readFileSync(catalogFilePath, 'utf-8');

  const appConfigFilePath = join(process.cwd(), '..', '..', 'app-config.yaml');
  const appConfigFileContent = readFileSync(appConfigFilePath, 'utf-8');

  if (!doesCatalogHaveProcessor(catalogFileContent)) {
    const { shouldAddProcessor } = await prompts({
      name: 'shouldAddProcessor',
      message:
        'The LDAP plugin does not appear to be installed in your software catalog. Would you like to add it?',
      type: 'confirm',
      initial: 'yes',
    });
    if (shouldAddProcessor) {
      addCatalogProcessor(catalogFilePath);
    }
  }

  if (!validateAppConfig(appConfigFileContent)) {
    const { shouldPatchAppConfig } = await prompts({
      name: 'shouldPatchAppConfig',
      message:
        'The LDAP plugin does not appear to be set up in your application config. Would you like to add it?',
      type: 'confirm',
      initial: 'yes',
    });

    if (shouldPatchAppConfig) {
      const {
        ldapHostUrl,
        bindDn,
        userBaseDn,
        userFilter,
        groupBaseDn,
        groupFilter,
      } = await prompts([
        {
          name: 'ldapHostUrl',
          type: 'text',
          message:
            'Enter the URL of your LDAP host (usually starts with ldaps://)',
        },
        {
          name: 'bindDn',
          type: 'text',
          message: 'Enter a bind DN to connect to your LDAP service',
        },
        {
          name: 'userBaseDn',
          type: 'text',
          message: 'From what base DN would you like to search for users?',
        },
        {
          name: 'userFilter',
          type: 'text',
          message: 'What filter would you like to use for users?',
        },
        {
          name: 'groupBaseDn',
          type: 'text',
          message: 'From what base DN would you like to search for groups?',
        },
        {
          name: 'groupFilter',
          type: 'text',
          message: 'What filter would you like to use for groups?',
        },
      ]);
      patchAppConfig({
        bindDn,
        ldapHostUrl,
        userBaseDn,
        userFilter,
        groupBaseDn,
        groupFilter,
      })(appConfigFilePath);
    }
  }

  console.log(`✅ Done!
Please remember to pass in your bind DN secret as an environment variable before starting the catalog like so:

  LDAP_SECRET=your-secret yarn start
  
Happy coding! 👋`);
};

main();
