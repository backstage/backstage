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

import {
  createSignInResolverFactory,
  GetSignInResolver,
  SignInInfo,
} from '@backstage/plugin-auth-node';
import { GcpIapResult } from './types';

export type GCPIapSignInResolver = GetSignInResolver<
  typeof gcpIapSignInResolvers
>;

/**
 * Available sign-in resolvers for the Google auth provider.
 *
 * @public
 */
export namespace gcpIapSignInResolvers {
  /**
   * Looks up the user by matching their email to the `google.com/email` annotation.
   */
  export const emailMatchingUserEntityAnnotation = createSignInResolverFactory({
    create() {
      return async (info: SignInInfo<GcpIapResult>, ctx) => {
        const email = info.result.iapToken.email;

        if (!email) {
          throw new Error('Google IAP sign-in result is missing email');
        }

        return ctx.signInWithCatalogUser({
          annotations: {
            'google.com/email': email,
          },
        });
      };
    },
  });

  /**
   * Looks up the user by matching their user ID to the `google.com/user-id` annotation.
   */
  export const idMatchingUserEntityAnnotation = createSignInResolverFactory({
    create() {
      return async (info: SignInInfo<GcpIapResult>, ctx) => {
        const userId = info.result.iapToken.sub.split(':')[1];

        return ctx.signInWithCatalogUser({
          annotations: {
            'google.com/user-id': userId,
          },
        });
      };
    },
  });
}
