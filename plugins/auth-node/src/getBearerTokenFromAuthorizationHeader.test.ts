/*
 * Copyright 2022 The Backstage Authors
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

import { getBearerTokenFromAuthorizationHeader } from './getBearerTokenFromAuthorizationHeader';

describe('getBearerToken', () => {
  it('should return undefined on bad input', async () => {
    expect(getBearerTokenFromAuthorizationHeader(undefined)).toBeUndefined();
    expect(getBearerTokenFromAuthorizationHeader(7)).toBeUndefined();
    expect(
      getBearerTokenFromAuthorizationHeader('Bearer \n token'),
    ).toBeUndefined();
    expect(
      getBearerTokenFromAuthorizationHeader('Bearer token '),
    ).toBeUndefined();
  });

  it('should return undefined on malformed input', async () => {
    const token = getBearerTokenFromAuthorizationHeader('malformed');
    expect(token).toBeUndefined();
  });

  it('should return undefined on unexpected scheme', async () => {
    const token = getBearerTokenFromAuthorizationHeader('Basic token');
    expect(token).toBeUndefined();
  });

  it('should return Bearer token', async () => {
    const token = getBearerTokenFromAuthorizationHeader('Bearer token');
    expect(token).toEqual('token');
  });

  it('should return Bearer token despite unconventional case', async () => {
    const token = getBearerTokenFromAuthorizationHeader('bEARER token');
    expect(token).toEqual('token');
  });
});
