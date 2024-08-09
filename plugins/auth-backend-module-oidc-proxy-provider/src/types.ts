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

import { JsonValue } from '@backstage/types';

/**
 * IDTokenInfo represents the claims extracted from the oidc id token extracted
 * from the http request header provided by the external auth proxy.
 *
 * @public
 */
export type IDTokenInfo = {
  /**
   * iss represents the issuer url of the identity provider that issued the id
   * token.  The id token may be validated by obtaining the public key set from
   * the jwks_uri value of the discovery document located at the url
   * <iss>/.well-known/openid-configuration
   *
   * The combination of iss + sub uniquely identifies an identity over time.
   */
  iss: string;
  /**
   * sub represents the subject of the id token.  The subject is guaranteed to
   * be unique within the scope of an issuer as per the oidc spec.
   */
  sub: string;
  /**
   * aud represents the intended audience of the id token.
   */
  aud: string | string[];
  /**
   * email represents the email address claim of the id token.
   */
  email: string;
  /**
   * Additional claims from the id token.
   */
  [key: string]: JsonValue;
};

/**
 * OidcProxyResult represents the result of the initial auth challenge. This
 * result is provided as input to the auth callbacks.
 *
 * @public
 */
export type OidcProxyResult = {
  /**
   * idToken represents the claims extracted from the id token present in the
   * configured http request header, or the default x-oidc-id-token header if
   * unconfigured.
   */
  idToken: IDTokenInfo;
};
