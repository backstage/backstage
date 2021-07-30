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
import { parse } from 'yaml';

type LdapOrgLocation = { type: string; target: string };

type LdapProvider = {
  target: string;
  bind: {
    dn: string;
    secret: string;
  };
  users: { dn: string; options: { filter: string; scope: string } };
  groups: {
    dn: string;
    options: { scope: string; filter: string };
  };
};

export const validateAppConfig = (fileContent: string) => {
  const config = parse(fileContent);

  const ldapOrgLocation: LdapOrgLocation = config.catalog.locations.find(
    (l: LdapOrgLocation) => l.type === 'ldap-org',
  );

  const doesConfigHaveLocationConfig = () => {
    if (!ldapOrgLocation) {
      return false;
    }
    if (!ldapOrgLocation.target.startsWith('ldap')) {
      console.warn(
        "Your LDAP location's target does not communicate over the LDAP protocol.",
      );
    }
    return true;
  };
  const doesConfigHaveProviderConfig = () => {
    if (!config.catalog.processors?.ldapOrg) {
      return false;
    }

    if (!config.catalog.processors.ldapOrg.providers.length) {
      return false;
    }
    if (
      !config.catalog.processors.ldapOrg.providers.find(
        (provider: LdapProvider) => provider.target === ldapOrgLocation.target,
      )
    ) {
      console.warn(
        `No provider found for LDAP target ${ldapOrgLocation.target}. Please check and adjust your app-config.yaml according to the documentation.`,
      );
    }
    return true;
  };

  return doesConfigHaveLocationConfig() && doesConfigHaveProviderConfig();
};
