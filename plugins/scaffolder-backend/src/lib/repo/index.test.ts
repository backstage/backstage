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
import { RepositoryBase, Repository } from '.';

describe('Repository Interface Test', () => {
  const mockRepo = new (class MockRepository implements RepositoryBase {
    list = jest.fn();
    prepare = jest.fn();
    reindex = jest.fn();

    public reset = () => {
      this.list.mockReset();
      this.prepare.mockReset();
      this.reindex.mockReset();
    };
  })();

  afterEach(() => mockRepo.reset());

  it('should call list of the set repo when calling list', async () => {
    Repository.setRepository(mockRepo);

    await Repository.list();

    expect(mockRepo.list).toHaveBeenCalled();
  });

  it('should reindex on the repo when calling reindex', async () => {
    Repository.setRepository(mockRepo);

    await Repository.reindex();

    expect(mockRepo.reindex).toHaveBeenCalled();
  });

  it('should call prepare with the correct id when calling prepare', async () => {
    Repository.setRepository(mockRepo);

    await Repository.prepare('testid');

    expect(mockRepo.prepare).toHaveBeenCalledWith('testid');
  });
});
