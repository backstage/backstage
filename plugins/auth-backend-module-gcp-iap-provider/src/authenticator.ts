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

import { AuthenticationError } from '@backstage/errors';
import { createProxyAuthenticator } from '@backstage/plugin-auth-node';
import { createTokenValidator } from './helpers';
import { GcpIapResult } from './types';

/**
 * The header name used by the IAP.
 */
const DEFAULT_IAP_JWT_HEADER = 'x-goog-iap-jwt-assertion';

/** @public */
export const gcpIapAuthenticator = createProxyAuthenticator({
  defaultProfileTransform: async (result: GcpIapResult) => {
    return { profile: { email: result.iapToken.email } };
  },
  initialize({ config }) {
    const audience = config.getString('audience');
    const jwtHeader =
      config.getOptionalString('jwtHeader') ?? DEFAULT_IAP_JWT_HEADER;

    const tokenValidator = createTokenValidator(audience);

    return { jwtHeader, tokenValidator };
  },
  async authenticate({ req }, { jwtHeader, tokenValidator }) {
    const token = req.header(jwtHeader);

    if (!token || typeof token !== 'string') {
      throw new AuthenticationError('Missing Google IAP header');
    }

    const iapToken = await tokenValidator(token);

    return {
      result: { iapToken },
      providerInfo: { iapToken },
    };
  },
});
