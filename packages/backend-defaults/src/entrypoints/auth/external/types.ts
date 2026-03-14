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

import { BackstagePrincipalAccessRestrictions } from '@backstage/backend-plugin-api';
import type { Config } from '@backstage/config';

export type AccessRestrictionsMap = Map<
  string, // plugin ID
  BackstagePrincipalAccessRestrictions
>;

/**
 * @public
 * This interface is used to handle external tokens.
 * It is used by the auth service to verify tokens and extract the subject.
 */
export interface ExternalTokenHandler<TContext> {
  type: string;
  initialize(ctx: { options: Config }): TContext;
  /**
   * Verifies the given token and returns the principal information if valid,
   * or `undefined` if the token is not recognized by this handler.
   *
   * The returned `subject` is used as the service principal subject.
   * The optional `tokenClaims` should contain the verified JWT payload claims
   * (e.g. from `jwtVerify`) and will be exposed on the resulting
   * `BackstageServicePrincipal`. Only return claims that have already been
   * validated; do not pass through unverified data.
   */
  verifyToken(
    token: string,
    ctx: TContext,
  ): Promise<
    { subject: string; tokenClaims?: Record<string, unknown> } | undefined
  >;
}
