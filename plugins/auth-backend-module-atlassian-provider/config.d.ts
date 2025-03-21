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

import { HumanDuration } from '@backstage/types';

export interface Config {
  auth?: {
    providers?: {
      /** @visibility frontend */
      atlassian?: {
        [authEnv: string]: {
          clientId: string;
          /**
           * @visibility secret
           */
          clientSecret: string;
          audience?: string;
          callbackUrl?: string;
          additionalScopes?: string | string[];
          signIn?: {
            resolvers: Array<
              | { resolver: 'usernameMatchingUserEntityName' }
              | {
                  resolver: 'emailLocalPartMatchingUserEntityName';
                  allowedDomains?: string[];
                }
              | { resolver: 'emailMatchingUserEntityProfileEmail' }
            >;
          };
          sessionDuration?: HumanDuration | string;
        };
      };
    };
  };
}
