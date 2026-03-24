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

import { scaffolderServiceMock } from './scaffolderServiceMock';

describe('scaffolderServiceMock', () => {
  it('creates a mock with all methods as jest.fn()', () => {
    const mock = scaffolderServiceMock.mock();

    expect(mock.getTask).toHaveBeenCalledTimes(0);
  });

  it('supports overriding individual methods', async () => {
    const mock = scaffolderServiceMock.mock({
      getTask: jest.fn().mockResolvedValue({ id: 'task-1' }),
    });

    await expect(
      mock.getTask({ taskId: 'task-1' }, { credentials: expect.anything() }),
    ).resolves.toEqual(expect.objectContaining({ id: 'task-1' }));
  });
});
