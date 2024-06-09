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
import { createTokenValidator } from './helpers';
import { OidcProxyResult } from './types';

/**
 * DEFAULT_OIDC_ID_TOKEN_HEADER represents the default http request header used
 * when an alternative header has not been explicitly configured.
 */
const DEFAULT_OIDC_ID_TOKEN_HEADER = 'x-oidc-id-token';

/** @public */
export const oidcProxyAuthenticator = createProxyAuthenticator({
  defaultProfileTransform: async (result: OidcProxyResult) => {
    return { profile: { email: result.idToken.email } };
  },
  initialize({ config }) {
    const iss = config.getString('issuer');
    const aud = config.getString('audience');
    const oidcIdTokenHeader =
      config.getOptionalString('oidcIdTokenHeader') ??
      DEFAULT_OIDC_ID_TOKEN_HEADER;

    const tokenValidator = createTokenValidator(iss, aud);

    return { oidcIdTokenHeader, tokenValidator };
  },
  async authenticate({ req }, { oidcIdTokenHeader, tokenValidator }) {
    const token = req.header(oidcIdTokenHeader);

    if (!token || typeof token !== 'string') {
      throw new AuthenticationError(
        `could not authenticate: missing header ${oidcIdTokenHeader}`,
      );
    }

    const idToken = await tokenValidator(token);

    return {
      result: { idToken },
      providerInfo: { idToken },
    };
  },
});
