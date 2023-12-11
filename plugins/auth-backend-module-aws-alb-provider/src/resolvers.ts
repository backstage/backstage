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
  SignInInfo,
} from '@backstage/plugin-auth-node';
import { AwsAlbResult } from './types';
/**
 * Available sign-in resolvers for the Google auth provider.
 *
 * @public
 */
export namespace awsAlbSignInResolvers {
  export const emailMatchingUserEntityProfileEmail =
    createSignInResolverFactory({
      create() {
        return async (info: SignInInfo<AwsAlbResult>, ctx) => {
          if (!info.result.fullProfile.emails) {
            throw new Error(
              'Login failed, user profile does not contain an email',
            );
          }
          return ctx.signInWithCatalogUser({
            filter: {
              kind: ['User'],
              'spec.profile.email': info.result.fullProfile.emails[0].value,
            },
          });
        };
      },
    });
}
