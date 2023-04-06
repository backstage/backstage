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

import { ConfigReader } from '@backstage/config';
import {
  RequestDetails,
  RequestRejectionDetails,
  RequestValidationContext,
} from '@backstage/plugin-events-node';
import { createGitlabTokenValidator } from './createGitlabTokenValidator';

class TestContext implements RequestValidationContext {
  #details?: Partial<RequestRejectionDetails>;

  reject(details?: Partial<RequestRejectionDetails>): void {
    this.#details = details;
  }

  get details() {
    return this.#details;
  }
}

describe('createGitlabTokenValidator', () => {
  const validToken = 'valid-token';
  const configWithoutSecret = new ConfigReader({});
  const configWithSecret = new ConfigReader({
    events: {
      modules: {
        gitlab: {
          webhookSecret: validToken,
        },
      },
    },
  });

  const requestWithToken = (token: string | undefined) => {
    return {
      body: undefined,
      headers: {
        'x-gitlab-token': token,
      },
    } as RequestDetails;
  };

  it('no secret configured, throw error', async () => {
    expect(() => createGitlabTokenValidator(configWithoutSecret)).toThrow(
      "Missing required config value at 'events.modules.gitlab.webhookSecret'",
    );
  });

  it('secret configured, reject request without token', async () => {
    const request = requestWithToken(undefined);
    const context = new TestContext();

    const validator = createGitlabTokenValidator(configWithSecret);
    await validator(request, context);

    expect(context.details).not.toBeUndefined();
    expect(context.details?.status).toBe(403);
    expect(context.details?.payload).toEqual({ message: 'invalid token' });
  });

  it('secret configured, reject request with invalid token', async () => {
    const request = requestWithToken('invalid-token');
    const context = new TestContext();

    const validator = createGitlabTokenValidator(configWithSecret);
    await validator(request, context);

    expect(context.details).not.toBeUndefined();
    expect(context.details?.status).toBe(403);
    expect(context.details?.payload).toEqual({ message: 'invalid token' });
  });

  it('secret configured, accept request with valid token', async () => {
    const request = requestWithToken(validToken);
    const context = new TestContext();

    const validator = createGitlabTokenValidator(configWithSecret);
    await validator(request, context);

    expect(context.details).toBeUndefined();
  });
});
