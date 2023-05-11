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
import { sign } from '@octokit/webhooks-methods';
import { createGithubSignatureValidator } from './createGithubSignatureValidator';

class TestContext implements RequestValidationContext {
  #details?: Partial<RequestRejectionDetails>;

  reject(details?: Partial<RequestRejectionDetails>): void {
    this.#details = details;
  }

  get details() {
    return this.#details;
  }
}

describe('createGithubSignatureValidator', () => {
  const secret = 'valid-secret';
  const configWithoutSecret = new ConfigReader({});
  const configWithSecret = new ConfigReader({
    events: {
      modules: {
        github: {
          webhookSecret: secret,
        },
      },
    },
  });
  const payload = { test: 'payload' };
  const payloadString = JSON.stringify(payload);
  const validSignature = sign({ secret, algorithm: 'sha256' }, payloadString);

  const requestWithSignature = async (signature: string | undefined) => {
    return {
      body: payload,
      headers: {
        'x-hub-signature-256': signature,
      },
    } as RequestDetails;
  };

  it('no secret configured, throw error', async () => {
    expect(() => createGithubSignatureValidator(configWithoutSecret)).toThrow(
      "Missing required config value at 'events.modules.github.webhookSecret'",
    );
  });

  it('secret configured, reject request without signature', async () => {
    const request = await requestWithSignature(undefined);
    const context = new TestContext();

    const validator = createGithubSignatureValidator(configWithSecret);
    await validator(request, context);

    expect(context.details).not.toBeUndefined();
    expect(context.details?.status).toBe(403);
    expect(context.details?.payload).toEqual({ message: 'invalid signature' });
  });

  it('secret configured, reject request with invalid signature', async () => {
    const request = await requestWithSignature('invalid signature');
    const context = new TestContext();

    const validator = createGithubSignatureValidator(configWithSecret);
    await validator(request, context);

    expect(context.details).not.toBeUndefined();
    expect(context.details?.status).toBe(403);
    expect(context.details?.payload).toEqual({ message: 'invalid signature' });
  });

  it('secret configured, accept request with valid signature', async () => {
    const request = await requestWithSignature(await validSignature);
    const context = new TestContext();

    const validator = createGithubSignatureValidator(configWithSecret);
    await validator(request, context);

    expect(context.details).toBeUndefined();
  });
});
