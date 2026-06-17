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

import { z as zod } from 'zod/v3';

const remoteUrl = (z: typeof zod) =>
  z.string({
    description: 'A URL to the repository with the provider',
  });

const repoContentsUrl = (z: typeof zod) =>
  z.string({
    description: 'A URL to the root of the repository',
  });

const commitHash = (z: typeof zod) =>
  z.string({
    description: 'The git commit hash of the initial commit',
  });

export { commitHash, remoteUrl, repoContentsUrl };
