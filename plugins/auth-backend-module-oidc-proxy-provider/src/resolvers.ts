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

import {
  createSignInResolverFactory,
  SignInInfo,
} from '@backstage/plugin-auth-node';
import { OidcProxyResult } from './types';

/**
 * Available sign-in resolvers for the auth provider.
 *
 * @public
 */
export namespace oidcProxySignInResolvers {
  /**
   * Looks up the user by matching id token email claim to the
   * `openid.net/email` annotation of the backstage entity.
   *
   * Note, email addresses may be reused by different identities over time
   * within the scope of an issuer per the oidc specification.  Disable this
   * resolver if identities must be guaranteed unique over time.
   */
  export const emailMatchingUserEntityAnnotation = createSignInResolverFactory({
    create() {
      return async (info: SignInInfo<OidcProxyResult>, ctx) => {
        const email = info.result.idToken.email;

        if (!email) {
          throw new Error(
            'could not sign in: oidc-proxy provider: missing email claim from id token',
          );
        }

        return ctx.signInWithCatalogUser({
          annotations: {
            'openid.net/email': email,
          },
        });
      };
    },
  });

  /**
   * Looks up the user by matching the id token iss + sub to the
   * `openid.net/iss` and `openid.net/sub` annotations of the backstage entity.
   *
   * Note, this resolver method is the only method guaranteed by the oidc spec
   * to result in a unique resolution of an id token to a backstage entity over
   * time.  Email addresses may be reused within the scope of an issuer, subject
   * identifier may not be reused.
   */
  export const idMatchingUserEntityAnnotation = createSignInResolverFactory({
    create() {
      return async (info: SignInInfo<OidcProxyResult>, ctx) => {
        const iss = info.result.idToken.iss;
        const sub = info.result.idToken.sub;

        if (!iss) {
          throw new Error(
            'could not sign in: oidc-proxy provider: missing iss claim from id token',
          );
        }
        if (!sub) {
          throw new Error(
            'could not sign in: oidc-proxy provider: missing sub claim from id token',
          );
        }

        return ctx.signInWithCatalogUser({
          annotations: {
            'openid.net/iss': iss,
            'openid.net/sub': sub,
          },
        });
      };
    },
  });
}
