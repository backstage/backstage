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

import { createServiceMock } from '@backstage/backend-test-utils';
import { scaffolderServiceRef, ScaffolderService } from '../scaffolderService';

/**
 * A collection of mock functionality for the scaffolder service.
 *
 * @public
 */
export namespace scaffolderServiceMock {
  /**
   * Creates a scaffolder service whose methods are mock functions, possibly with
   * some of them overloaded by the caller.
   */
  export const mock = createServiceMock<ScaffolderService>(
    scaffolderServiceRef,
    () => ({
      getTemplateParameterSchema: jest.fn(),
      scaffold: jest.fn(),
      getTask: jest.fn(),
      cancelTask: jest.fn(),
      retry: jest.fn(),
      listTasks: jest.fn(),
      listActions: jest.fn(),
      listTemplatingExtensions: jest.fn(),
      getLogs: jest.fn(),
      dryRun: jest.fn(),
      autocomplete: jest.fn(),
    }),
  );
}
