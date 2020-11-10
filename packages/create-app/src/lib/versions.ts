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

/* eslint-disable import/no-extraneous-dependencies,monorepo/no-internal-import */

/*
This is a list of all packages used by the template. If dependencies are added or removed,
this list should be updated as well.

The list, and the accompanying devDependencies entries, are here to ensure correct versioning
and bumping of this package. Without this list the version would not be bumped unless we
manually trigger a release.

This does not create an actual dependency on these packages and does not bring in any code.
Rollup will extract the value of the version field in each package at build time without
leaving any imports in place.
*/

import { version as backendCommon } from '@backstage/backend-common/package.json';
import { version as catalogModel } from '@backstage/catalog-model/package.json';
import { version as cli } from '@backstage/cli/package.json';
import { version as config } from '@backstage/config/package.json';
import { version as core } from '@backstage/core/package.json';
import { version as pluginApiDocs } from '@backstage/plugin-api-docs/package.json';
import { version as pluginAuthBackend } from '@backstage/plugin-auth-backend/package.json';
import { version as pluginCatalog } from '@backstage/plugin-catalog/package.json';
import { version as pluginCatalogBackend } from '@backstage/plugin-catalog-backend/package.json';
import { version as pluginCircleci } from '@backstage/plugin-circleci/package.json';
import { version as pluginExplore } from '@backstage/plugin-explore/package.json';
import { version as pluginGithubActions } from '@backstage/plugin-github-actions/package.json';
import { version as pluginLighthouse } from '@backstage/plugin-lighthouse/package.json';
import { version as pluginProxyBackend } from '@backstage/plugin-proxy-backend/package.json';
import { version as pluginRegisterComponent } from '@backstage/plugin-register-component/package.json';
import { version as pluginRollbarBackend } from '@backstage/plugin-rollbar-backend/package.json';
import { version as pluginScaffolder } from '@backstage/plugin-scaffolder/package.json';
import { version as pluginScaffolderBackend } from '@backstage/plugin-scaffolder-backend/package.json';
import { version as pluginTechRadar } from '@backstage/plugin-tech-radar/package.json';
import { version as pluginTechdocs } from '@backstage/plugin-techdocs/package.json';
import { version as pluginTechdocsBackend } from '@backstage/plugin-techdocs-backend/package.json';
import { version as pluginUserSettings } from '@backstage/plugin-user-settings/package.json';
import { version as testUtils } from '@backstage/test-utils/package.json';
import { version as theme } from '@backstage/theme/package.json';

export const packageVersions = {
  '@backstage/backend-common': backendCommon,
  '@backstage/catalog-model': catalogModel,
  '@backstage/cli': cli,
  '@backstage/config': config,
  '@backstage/core': core,
  '@backstage/plugin-api-docs': pluginApiDocs,
  '@backstage/plugin-auth-backend': pluginAuthBackend,
  '@backstage/plugin-catalog': pluginCatalog,
  '@backstage/plugin-catalog-backend': pluginCatalogBackend,
  '@backstage/plugin-circleci': pluginCircleci,
  '@backstage/plugin-explore': pluginExplore,
  '@backstage/plugin-github-actions': pluginGithubActions,
  '@backstage/plugin-lighthouse': pluginLighthouse,
  '@backstage/plugin-proxy-backend': pluginProxyBackend,
  '@backstage/plugin-register-component': pluginRegisterComponent,
  '@backstage/plugin-rollbar-backend': pluginRollbarBackend,
  '@backstage/plugin-scaffolder': pluginScaffolder,
  '@backstage/plugin-scaffolder-backend': pluginScaffolderBackend,
  '@backstage/plugin-tech-radar': pluginTechRadar,
  '@backstage/plugin-techdocs': pluginTechdocs,
  '@backstage/plugin-techdocs-backend': pluginTechdocsBackend,
  '@backstage/plugin-user-settings': pluginUserSettings,
  '@backstage/test-utils': testUtils,
  '@backstage/theme': theme,
};
