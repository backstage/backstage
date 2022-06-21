/*
 * Copyright 2020 The Backstage Authors
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

import { Request } from 'express';
import { BackstageIdentity, IdentityProvider } from '../types';
import { Config } from '@backstage/config';

/**
 * A default identity provider that takes a token from the bearer token with the
 * following payload format:
 *
 * \{
 *   "sub": "user:default/guest"
 * \}
 *
 * @public
 */
export class DefaultIdentityProvider implements IdentityProvider {
  userFromRequest(request: Request): BackstageIdentity {
    const token =
      request?.headers?.authorization?.match(/Bearer\s+(\S+)/i)?.[1];

    if (!token) return {};

    const [_header, rawPayload, _signature] = token.split('.');
    const payload: { sub: string } = JSON.parse(
      Buffer.from(rawPayload, 'base64').toString(),
    );

    return {
      entityRef: payload.sub,
      token,
    };
  }

  static fromConfig(_config: Config): IdentityProvider {
    return new DefaultIdentityProvider();
  }
}
