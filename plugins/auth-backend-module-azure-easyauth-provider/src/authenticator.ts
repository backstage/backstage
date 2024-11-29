/*
 * Copyright 2024 The Backstage Authors
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

import { AuthenticationError } from '@backstage/errors';
import { createProxyAuthenticator } from '@backstage/plugin-auth-node';
import { AzureEasyAuthResult } from './types';
import { Request } from 'express';
import { Profile } from 'passport';
import { decodeJwt } from 'jose';

export const ID_TOKEN_HEADER = 'x-ms-token-aad-id-token';
export const ACCESS_TOKEN_HEADER = 'x-ms-token-aad-access-token';

/** @public */
export const azureEasyAuthAuthenticator = createProxyAuthenticator({
  defaultProfileTransform: async (result: AzureEasyAuthResult) => {
    return {
      profile: {
        displayName: result.fullProfile.displayName,
        email: result.fullProfile.emails?.[0].value,
        picture: result.fullProfile.photos?.[0].value,
      },
    };
  },
  initialize() {},
  async authenticate({ req }) {
    const result = await getResult(req);
    return {
      result,
      providerInfo: {
        accessToken: result.accessToken,
      },
    };
  },
});

async function getResult(req: Request): Promise<AzureEasyAuthResult> {
  const idToken = req.header(ID_TOKEN_HEADER);
  const accessToken = req.header(ACCESS_TOKEN_HEADER);
  if (idToken === undefined) {
    throw new AuthenticationError(`Missing ${ID_TOKEN_HEADER} header`);
  }

  return {
    fullProfile: idTokenToProfile(idToken),
    accessToken: accessToken,
  };
}

function idTokenToProfile(idToken: string) {
  const claims = decodeJwt(idToken);

  if (claims.ver !== '2.0') {
    throw new Error('id_token is not version 2.0 ');
  }

  return {
    id: claims.oid,
    displayName: claims.name,
    provider: 'easyauth',
    emails: [{ value: claims.email }],
    username: claims.preferred_username,
  } as Profile;
}
