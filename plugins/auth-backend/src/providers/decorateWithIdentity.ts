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

import { BackstageIdentityResponse } from './types';

function parseJwtPayload(token: string) {
  const [_header, payload, _signature] = token.split('.');
  return JSON.parse(Buffer.from(payload, 'base64').toString());
}

/**
 * Parses token and decorates the BackstageIdentityResponse with identity information sourced from the token
 */
export function decorateWithIdentity(
  signInResolverResponse: Omit<BackstageIdentityResponse, 'identity'>,
): BackstageIdentityResponse {
  const { sub, ent } = parseJwtPayload(signInResolverResponse.token);
  return {
    ...signInResolverResponse,
    identity: {
      type: 'user',
      userEntityRef: sub,
      ownershipEntityRefs: ent ?? [],
    },
  };
}
