/*
 * Copyright 2025 The Backstage Authors
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
import auth from '@backstage/cli-module-auth';
import build from '@backstage/cli-module-build';
import config from '@backstage/cli-module-config';
import github from '@backstage/cli-module-github';
import info from '@backstage/cli-module-info';
import lint from '@backstage/cli-module-lint';
import maintenance from '@backstage/cli-module-maintenance';
import migrate from '@backstage/cli-module-migrate';
import newModule from '@backstage/cli-module-new';
import testJest from '@backstage/cli-module-test-jest';
import translations from '@backstage/cli-module-translations';

/**
 * The default set of CLI modules for the Backstage CLI.
 *
 * @public
 */
export default [
  auth,
  build,
  config,
  github,
  info,
  lint,
  maintenance,
  migrate,
  newModule,
  testJest,
  translations,
];
