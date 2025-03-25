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

/* eslint-disable @backstage/no-relative-monorepo-imports */

/*
This is a list of all packages used by the template. If dependencies are added or removed,
this list should be updated as well.

There is a release step that ensures that this package is always bumped with every
release, meaning these version will always be up to date.

This does not create an actual dependency on these packages and does not bring in any code.
Relative imports are used rather than package imports to make sure the packages aren't externalized.
Rollup will extract the value of the version field in each package at build time without
leaving any imports in place.
*/

import { version as root } from '../../../../package.json';

import { version as appDefaults } from '../../../app-defaults/package.json';
import { version as backendDefaults } from '../../../backend-defaults/package.json';
import { version as canon } from '../../../canon/package.json';
import { version as catalogClient } from '../../../catalog-client/package.json';
import { version as catalogModel } from '../../../catalog-model/package.json';
import { version as cli } from '../../../cli/package.json';
import { version as config } from '../../../config/package.json';
import { version as coreAppApi } from '../../../core-app-api/package.json';
import { version as coreComponents } from '../../../core-components/package.json';
import { version as corePluginApi } from '../../../core-plugin-api/package.json';
import { version as e2eTestUtils } from '../../../e2e-test-utils/package.json';
import { version as errors } from '../../../errors/package.json';
import { version as integrationReact } from '../../../integration-react/package.json';
import { version as testUtils } from '../../../test-utils/package.json';
import { version as theme } from '../../../theme/package.json';
import { version as repoTools } from '../../../repo-tools/package.json';

import { version as pluginApiDocs } from '../../../../plugins/api-docs/package.json';
import { version as pluginAppBackend } from '../../../../plugins/app-backend/package.json';
import { version as pluginAuthBackend } from '../../../../plugins/auth-backend/package.json';
import { version as pluginAuthBackendModuleGithubProvider } from '../../../../plugins/auth-backend-module-github-provider/package.json';
import { version as pluginAuthBackendModuleGuestProvider } from '../../../../plugins/auth-backend-module-guest-provider/package.json';
import { version as pluginAuthNode } from '../../../../plugins/auth-node/package.json';
import { version as pluginCatalog } from '../../../../plugins/catalog/package.json';
import { version as pluginCatalogCommon } from '../../../../plugins/catalog-common/package.json';
import { version as pluginCatalogReact } from '../../../../plugins/catalog-react/package.json';
import { version as pluginCatalogBackend } from '../../../../plugins/catalog-backend/package.json';
import { version as pluginCatalogBackendModuleLogs } from '../../../../plugins/catalog-backend-module-logs/package.json';
import { version as pluginCatalogBackendModuleScaffolderEntityModel } from '../../../../plugins/catalog-backend-module-scaffolder-entity-model/package.json';
import { version as pluginCatalogGraph } from '../../../../plugins/catalog-graph/package.json';
import { version as pluginCatalogImport } from '../../../../plugins/catalog-import/package.json';
import { version as pluginKubernetes } from '../../../../plugins/kubernetes/package.json';
import { version as pluginKubernetesBackend } from '../../../../plugins/kubernetes-backend/package.json';
import { version as pluginOrg } from '../../../../plugins/org/package.json';
import { version as pluginPermissionBackend } from '../../../../plugins/permission-backend/package.json';
import { version as pluginPermissionBackendModulePolicyAllowAll } from '../../../../plugins/permission-backend-module-policy-allow-all/package.json';
import { version as pluginPermissionCommon } from '../../../../plugins/permission-common/package.json';
import { version as pluginPermissionReact } from '../../../../plugins/permission-react/package.json';
import { version as pluginPermissionNode } from '../../../../plugins/permission-node/package.json';
import { version as pluginProxyBackend } from '../../../../plugins/proxy-backend/package.json';
import { version as pluginScaffolder } from '../../../../plugins/scaffolder/package.json';
import { version as pluginScaffolderBackend } from '../../../../plugins/scaffolder-backend/package.json';
import { version as pluginScaffolderBackendModuleGithub } from '../../../../plugins/scaffolder-backend-module-github/package.json';
import { version as pluginSearch } from '../../../../plugins/search/package.json';
import { version as pluginSearchReact } from '../../../../plugins/search-react/package.json';
import { version as pluginSearchBackend } from '../../../../plugins/search-backend/package.json';
import { version as pluginSearchBackendModuleCatalog } from '../../../../plugins/search-backend-module-catalog/package.json';
import { version as pluginSearchBackendModulePg } from '../../../../plugins/search-backend-module-pg/package.json';
import { version as pluginSearchBackendModuleTechdocs } from '../../../../plugins/search-backend-module-techdocs/package.json';
import { version as pluginSearchBackendNode } from '../../../../plugins/search-backend-node/package.json';
import { version as pluginTechdocs } from '../../../../plugins/techdocs/package.json';
import { version as pluginTechdocsReact } from '../../../../plugins/techdocs-react/package.json';
import { version as pluginTechdocsModuleAddonsContrib } from '../../../../plugins/techdocs-module-addons-contrib/package.json';
import { version as pluginTechdocsBackend } from '../../../../plugins/techdocs-backend/package.json';
import { version as pluginUserSettings } from '../../../../plugins/user-settings/package.json';

export const packageVersions = {
  root,
  '@backstage/app-defaults': appDefaults,
  '@backstage/backend-defaults': backendDefaults,
  '@backstage/catalog-client': catalogClient,
  '@backstage/catalog-model': catalogModel,
  '@backstage/cli': cli,
  '@backstage/canon': canon,
  '@backstage/config': config,
  '@backstage/core-app-api': coreAppApi,
  '@backstage/core-components': coreComponents,
  '@backstage/core-plugin-api': corePluginApi,
  '@backstage/e2e-test-utils': e2eTestUtils,
  '@backstage/errors': errors,
  '@backstage/integration-react': integrationReact,
  '@backstage/repo-tools': repoTools,
  '@backstage/plugin-api-docs': pluginApiDocs,
  '@backstage/plugin-app-backend': pluginAppBackend,
  '@backstage/plugin-auth-backend': pluginAuthBackend,
  '@backstage/plugin-auth-backend-module-github-provider':
    pluginAuthBackendModuleGithubProvider,
  '@backstage/plugin-auth-backend-module-guest-provider':
    pluginAuthBackendModuleGuestProvider,
  '@backstage/plugin-auth-node': pluginAuthNode,
  '@backstage/plugin-catalog': pluginCatalog,
  '@backstage/plugin-catalog-common': pluginCatalogCommon,
  '@backstage/plugin-catalog-react': pluginCatalogReact,
  '@backstage/plugin-catalog-backend': pluginCatalogBackend,
  '@backstage/plugin-catalog-backend-module-logs':
    pluginCatalogBackendModuleLogs,
  '@backstage/plugin-catalog-backend-module-scaffolder-entity-model':
    pluginCatalogBackendModuleScaffolderEntityModel,
  '@backstage/plugin-catalog-graph': pluginCatalogGraph,
  '@backstage/plugin-catalog-import': pluginCatalogImport,
  '@backstage/plugin-kubernetes': pluginKubernetes,
  '@backstage/plugin-kubernetes-backend': pluginKubernetesBackend,
  '@backstage/plugin-org': pluginOrg,
  '@backstage/plugin-permission-backend': pluginPermissionBackend,
  '@backstage/plugin-permission-backend-module-allow-all-policy':
    pluginPermissionBackendModulePolicyAllowAll,
  '@backstage/plugin-permission-common': pluginPermissionCommon,
  '@backstage/plugin-permission-node': pluginPermissionNode,
  '@backstage/plugin-permission-react': pluginPermissionReact,
  '@backstage/plugin-proxy-backend': pluginProxyBackend,
  '@backstage/plugin-scaffolder': pluginScaffolder,
  '@backstage/plugin-scaffolder-backend': pluginScaffolderBackend,
  '@backstage/plugin-scaffolder-backend-module-github':
    pluginScaffolderBackendModuleGithub,
  '@backstage/plugin-search': pluginSearch,
  '@backstage/plugin-search-react': pluginSearchReact,
  '@backstage/plugin-search-backend': pluginSearchBackend,
  '@backstage/plugin-search-backend-module-catalog':
    pluginSearchBackendModuleCatalog,
  '@backstage/plugin-search-backend-module-pg': pluginSearchBackendModulePg,
  '@backstage/plugin-search-backend-module-techdocs':
    pluginSearchBackendModuleTechdocs,
  '@backstage/plugin-search-backend-node': pluginSearchBackendNode,
  '@backstage/plugin-techdocs': pluginTechdocs,
  '@backstage/plugin-techdocs-react': pluginTechdocsReact,
  '@backstage/plugin-techdocs-module-addons-contrib':
    pluginTechdocsModuleAddonsContrib,
  '@backstage/plugin-techdocs-backend': pluginTechdocsBackend,
  '@backstage/plugin-user-settings': pluginUserSettings,
  '@backstage/test-utils': testUtils,
  '@backstage/theme': theme,
};
