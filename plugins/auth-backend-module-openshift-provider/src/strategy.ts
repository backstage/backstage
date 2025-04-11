/*
 * Copyright 2025 The Backstage Authors
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

import OAuth2Strategy from 'passport-oauth2';
import { z } from 'zod';

// Schema for user.openshift.io/v1,
// see https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html/user_and_group_apis/user-user-openshift-io-v1#user-user-openshift-io-v1
const OpenShiftUser = z.object({
  metadata: z.object({
    name: z.string(),
  }),
});

export interface OpenShiftStrategyOptions
  extends OAuth2Strategy.StrategyOptions {
  userUrl: string;
}

export class OpenShiftStrategy extends OAuth2Strategy {
  userUrl: string;

  constructor(
    options: OpenShiftStrategyOptions,
    verify: OAuth2Strategy.VerifyFunction,
  ) {
    super(options, verify);
    this.userUrl = options.userUrl;
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  userProfile(
    accessToken: string,
    done: (err?: unknown, profile?: any) => void,
  ): void {
    this._oauth2.get(this.userUrl, accessToken, (error, data, _) => {
      if (error !== null && error.statusCode !== 200) {
        done(new Error(`HTTP error! Status: ${error.statusCode}`));
        return;
      }

      if (!data) {
        done(new Error('No data provided!'));
        return;
      }

      if (typeof data !== 'string') {
        done(new Error('Data of type Buffer is not supported!'));
        return;
      }

      const user = OpenShiftUser.parse(JSON.parse(data));
      done(null, { displayName: user.metadata.name });
    });
  }
}
