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

import { HumanDuration } from '@backstage/types';

export interface Config {
  auth?: {
    providers?: {
      /** @visibility frontend */
      awsalb?: {
        /**
         * The issuer IdP URL that was configured in your ALB; this corresponds
         * to the `iss` claim in your tokens.
         *
         * @example https://example.okta.com/oauth2/default
         */
        issuer: string;
        /**
         * The ARN of the ALB that signs the tokens; this corresponds to the
         * `signer` claim in your tokens.
         *
         * @example arn:aws:elasticloadbalancing:us-east-2:123456789012:loadbalancer/app/my-load-balancer/1234567890123456
         */
        signer?: string;
        /**
         * The AWS region where the ALB is located.
         *
         * @example us-east-2
         */
        region: string;
        signIn?: {
          resolvers: Array<
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
}
