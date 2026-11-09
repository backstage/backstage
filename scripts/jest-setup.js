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

// The first render of a page in each test file is far slower in CI than
// locally, especially in the full coverage run, which can exceed the default
// 1s timeout of findBy* queries and waitFor. Give async utilities more room
// in CI, while staying below Jest's default 5s test timeout so that a failing
// query still reports the rendered DOM.
if (process.env.CI && typeof window !== 'undefined') {
  // eslint-disable-next-line @backstage/no-undeclared-imports
  require('@testing-library/react').configure({ asyncUtilTimeout: 3000 });
}
