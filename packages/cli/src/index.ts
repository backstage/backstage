/*
 * Copyright 2024 The Backstage Authors
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

import { CliInitializer } from './wiring/CliInitializer';

(async () => {
  const initializer = new CliInitializer();
  initializer.add(import('@backstage/cli-module-build'));
  initializer.add(import('@backstage/cli-module-config'));
  initializer.add(import('@backstage/cli-module-create-github-app'));
  initializer.add(import('@backstage/cli-module-info'));
  initializer.add(import('@backstage/cli-module-lint'));
  initializer.add(import('@backstage/cli-module-maintenance'));
  initializer.add(import('@backstage/cli-module-migrate'));
  initializer.add(import('@backstage/cli-module-new'));
  initializer.add(import('@backstage/cli-module-test-jest'));
  initializer.add(import('@backstage/cli-module-translations'));
  initializer.add(import('@backstage/cli-module-auth'));
  await initializer.run();
})();
