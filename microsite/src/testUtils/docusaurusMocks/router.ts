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

import { mock } from 'node:test';

// Stand-in for `@docusaurus/router` in component tests. Tests set `location`
// and inspect `push` and `replace` through this shared object.
export const routerMock = {
  location: { pathname: '/', search: '', hash: '' },
  push: mock.fn<(location: unknown) => void>(),
  replace: mock.fn<(location: unknown) => void>(),
  reset(location = { pathname: '/', search: '', hash: '' }) {
    routerMock.location = location;
    routerMock.push.mock.resetCalls();
    routerMock.replace.mock.resetCalls();
  },
};

export function useLocation() {
  return routerMock.location;
}

export function useHistory() {
  return { push: routerMock.push, replace: routerMock.replace };
}
