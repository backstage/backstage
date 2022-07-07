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

import { AuthenticationMiddlewareProvider } from '.';
import { JsonValue } from '@backstage/types';

/**
 * An authentication middleware that parses a jwt token in the authorization header
 * and returns the identity. If it can't find the token, or fails to parse it, it will
 * return undefined.
 *
 * @public
 */
export const unverifiedJWTMiddlewareProvider: AuthenticationMiddlewareProvider =
  async req => {
    if (!req.headers?.authorization) {
      return undefined;
    }

    try {
      if (!req.headers.authorization.startsWith('Bearer ')) {
        return undefined;
      }
      const token = req.headers.authorization.replace(/^Bearer /, '');

      const [_header, rawPayload, _signature] = token.split('.');
      if (!rawPayload.match(/^\S+$/)) {
        return undefined;
      }

      const payload: JsonValue = JSON.parse(
        Buffer.from(rawPayload, 'base64').toString(),
      );

      if (
        typeof payload !== 'object' ||
        payload === null ||
        Array.isArray(payload)
      ) {
        return undefined;
      }

      const sub = payload.sub;
      if (typeof sub !== 'string') {
        return undefined;
      }

      const ent = payload.ent as Array<string>;

      return {
        token,
        identity: {
          userEntityRef: sub,
          ownershipEntityRefs: ent,
          type: 'user',
        },
      };
    } catch (e) {
      return undefined;
    }
  };
