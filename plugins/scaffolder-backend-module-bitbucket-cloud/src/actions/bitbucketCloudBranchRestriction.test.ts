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

import { getBitbucketClient } from './helpers';
import { Bitbucket } from 'bitbucket';

jest.mock('bitbucket', () => ({
  Bitbucket: jest.fn(),
}));

describe('bitbucketCloud:branchRestriction:create', () => {
  it('getBitbucketClient should return the correct headers with username and password', () => {
    expect.assertions(1);
    const username = 'username';
    const password = 'password';
    getBitbucketClient({ username: username, appPassword: password });
    expect(Bitbucket).toHaveBeenCalledWith({
      auth: {
        username: username,
        password: password,
      },
    });
  });

  it('getBitbucketClient should throw if only one of username or password is provided', () => {
    expect.assertions(2);
    const username = 'username';
    const password = 'password';

    expect(() => getBitbucketClient({ username })).toThrow(Error);
    expect(() => getBitbucketClient({ appPassword: password })).toThrow(Error);
  });
});
