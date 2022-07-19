/*
 * Copyright 2021 The Backstage Authors
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

import { TypeOf } from 'zod';
import { ProxiedSession, proxiedSessionSchema } from './types';

describe('types', () => {
  const responseData: ProxiedSession = {
    providerInfo: {
      stuff: 1,
    },
    profile: {
      email: 'e',
      displayName: 'd',
      picture: 'p',
    },
    backstageIdentity: {
      token: 't',
      identity: {
        type: 'user',
        userEntityRef: 'k:ns/ue',
        ownershipEntityRefs: ['k:ns/oe'],
      },
    },
  };

  it('has a compatible schema type', () => {
    function f(_b: TypeOf<typeof proxiedSessionSchema>) {}
    f(responseData); // no tsc errors
    expect(proxiedSessionSchema.parse(responseData)).toEqual(responseData);
  });
});
