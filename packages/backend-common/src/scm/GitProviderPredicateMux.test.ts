/*
 * Copyright 2023 The Backstage Authors
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
import { GitProviderPredicateMux } from './GitProviderPredicateMux';
import { NotAllowedError } from '@backstage/errors';
import { GitProvider } from './types';

describe('GitPredicateMux', () => {
  it('should return the first git provider that matches the predicate', async () => {
    const fooProvider: GitProvider = {
      getGit: jest.fn(),
    };

    const barProvider: GitProvider = {
      getGit: jest.fn(),
    };

    const mux = new GitProviderPredicateMux();
    mux.register({
      predicate: (url: URL) => url.hostname === 'foo',
      gitProvider: fooProvider,
    });

    mux.register({
      predicate: (url: URL) => url.hostname === 'bar',
      gitProvider: barProvider,
    });

    await mux.getGit('http://foo/1');
    expect(fooProvider.getGit).toHaveBeenCalledWith('http://foo/1');

    await mux.getGit('http://bar/1');
    expect(barProvider.getGit).toHaveBeenCalledWith('http://bar/1');
  });

  it('should throw an error if no git provider is found for the url', async () => {
    const mux = new GitProviderPredicateMux();

    await expect(mux.getGit('invalid-url')).rejects.toThrow(NotAllowedError);
  });
});
