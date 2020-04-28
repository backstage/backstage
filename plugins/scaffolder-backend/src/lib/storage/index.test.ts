/*
 * Copyright 2020 Spotify AB
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
import { StorageBase, createStorage } from '.';

describe('Storage Interface Test', () => {
  const mockStore = new (class MockStorage implements StorageBase {
    list = jest.fn();
    prepare = jest.fn();
    reindex = jest.fn();

    public reset = () => {
      this.list.mockReset();
      this.prepare.mockReset();
      this.reindex.mockReset();
    };
  })();

  afterEach(() => mockStore.reset());

  it('should call list of the set repo when calling list', async () => {
    const store = createStorage({ store: mockStore });
    await store.list();

    expect(mockStore.list).toHaveBeenCalled();
  });

  it('should reindex on the repo when calling reindex', async () => {
    const store = createStorage({ store: mockStore });

    await store.reindex();

    expect(mockStore.reindex).toHaveBeenCalled();
  });

  it('should call prepare with the correct id when calling prepare', async () => {
    const store = createStorage({ store: mockStore });

    await store.prepare('testid');

    expect(mockStore.prepare).toHaveBeenCalledWith('testid');
  });
});
