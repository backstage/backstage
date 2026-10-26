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

import { createSpecializedBackend } from '@backstage/backend-app-api';
import { createBackend, defaultServiceFactories } from './CreateBackend';

jest.mock('@backstage/backend-app-api', () => ({
  ...jest.requireActual('@backstage/backend-app-api'),
  createSpecializedBackend: jest.fn(() => ({})),
}));

describe('createBackend options', () => {
  it('should forward the provided instance ID', () => {
    createBackend({ instanceId: 'my-instance' });

    expect(createSpecializedBackend).toHaveBeenCalledWith({
      defaultServiceFactories,
      instanceId: 'my-instance',
    });
  });
});
