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

import packageDocs from '@backstage/cli-module-package-docs';
import packageManagerPatch from '@backstage/cli-module-package-manager-patch';
import repoChecks from '@backstage/cli-module-repo-checks';
import reportApi from '@backstage/cli-module-report-api';
import reportKnip from '@backstage/cli-module-report-knip';
import schemaOpenapi from '@backstage/cli-module-schema-openapi';

/**
 * The default set of CLI modules for the Backstage repo tools CLI.
 *
 * @public
 */
export default [
  reportApi,
  reportKnip,
  schemaOpenapi,
  repoChecks,
  packageManagerPatch,
  packageDocs,
];
