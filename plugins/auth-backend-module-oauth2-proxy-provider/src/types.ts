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

import { IncomingHttpHeaders } from 'http';

/**
 * JWT header extraction result, containing the raw value and the parsed JWT
 * payload.
 *
 * @public
 */
export type OAuth2ProxyResult<JWTPayload = {}> = {
  /**
   * The parsed payload of the `accessToken`. The token is only parsed, not verified.
   *
   * @deprecated Access through the `headers` instead. This will be removed in a future release.
   */
  fullProfile: JWTPayload;

  /**
   * The token received via the X-OAUTH2-PROXY-ID-TOKEN header. Will be an empty string
   * if the header is not set. Note the this is typically an OpenID Connect token.
   *
   * @deprecated Access through the `headers` instead. This will be removed in a future release.
   */
  accessToken: string;

  /**
   * The headers of the incoming request from the OAuth2 proxy. This will include
   * both the headers set by the client as well as the ones added by the OAuth2 proxy.
   * You should only trust the headers that are injected by the OAuth2 proxy.
   *
   * Useful headers to use to complete the sign-in are for example `x-forwarded-user`
   * and `x-forwarded-email`. See the OAuth2 proxy documentation for more information
   * about the available headers and how to enable them. In particular it is possible
   * to forward access and identity tokens, which can be user for additional verification
   * and lookups.
   */
  headers: IncomingHttpHeaders;

  /**
   * Provides convenient access to the request headers.
   *
   * This call is simply forwarded to `req.get(name)`.
   */
  getHeader(name: string): string | undefined;
};
