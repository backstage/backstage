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

import { registerMswTestHooks } from './msw';
import { CreateMockDirectoryOptions } from './filesystem';
import { isDockerDisabledForTests as _isDockerDisabledForTests } from './util';

/**
 * @public
 * @deprecated Use `CreateMockDirectoryOptions` from `@backstage/backend-test-utils` instead.
 */
export type MockDirectoryOptions = CreateMockDirectoryOptions;

/**
 * @public
 * @deprecated Use `registerMswTestHooks` from `@backstage/backend-test-utils` instead.
 */
export function setupRequestMockHandlers(worker: {
  listen: (t: any) => void;
  close: () => void;
  resetHandlers: () => void;
}): void {
  registerMswTestHooks(worker);
}

/**
 * @public
 * @deprecated This is an internal function and will no longer be exported from this package.
 */
export function isDockerDisabledForTests(): boolean {
  return _isDockerDisabledForTests();
}
