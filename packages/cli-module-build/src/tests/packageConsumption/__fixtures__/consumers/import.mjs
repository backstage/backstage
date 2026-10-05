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

import { readValue, readAsyncValue } from '@backstage-test/compat-common';
import { readAlphaValue } from '@backstage-test/compat-common/alpha';

console.log(
  JSON.stringify({
    value: readValue(),
    alphaValue: readAlphaValue(),
    asyncValue: await readAsyncValue(),
    entries: [
      '@backstage-test/compat-common',
      '@backstage-test/compat-common/alpha',
    ].map(name => import.meta.resolve(name)),
  }),
);
