/*
 * Copyright 2022 The Backstage Authors
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

import { Config } from '@backstage/config';
import {
  RequestDetails,
  RequestValidationContext,
  RequestValidator,
} from '@backstage/plugin-events-node';

/**
 * Validates a configured secret token against the token received with the `x-gitlab-token` header.
 *
 * See https://docs.gitlab.com/ee/user/project/integrations/webhooks.html#validate-payloads-by-using-a-secret-token
 * for more details.
 *
 * @param config - root config
 * @public
 */
export function createGitlabTokenValidator(config: Config): RequestValidator {
  const secret = config.getString('events.modules.gitlab.webhookSecret');

  return async (
    request: RequestDetails,
    context: RequestValidationContext,
  ): Promise<void> => {
    const token = request.headers['x-gitlab-token'] as string | undefined;

    if (secret !== token) {
      context.reject({
        status: 403,
        payload: { message: 'invalid token' },
      });
    }
  };
}
