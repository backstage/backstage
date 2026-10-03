/*
 * Copyright 2026 The Backstage Authors
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
import { createHmac } from 'node:crypto';
import { createGiteaSignatureValidator } from './createGiteaSignatureValidator';

class TestContext implements RequestValidationContext {
  #details?: Partial<RequestRejectionDetails>;

  reject(details?: Partial<RequestRejectionDetails>): void {
    this.#details = details;
  }

  get details() {
    return this.#details;
  }
}

describe('createGiteaSignatureValidator', () => {
  const secret = 'valid-secret';
  const configWithoutSecret = new ConfigReader({});
  const configWithSecret = new ConfigReader({
    events: {
      modules: {
        gitea: {
          webhookSecret: secret,
        },
      },
    },
  });
  const payloadString = '{"test": "payload", "score": 5.0}';
  const payload = JSON.parse(payloadString);
  const payloadBuffer = Buffer.from(payloadString);
  const validSignature = createHmac('sha256', secret)
    .update(payloadBuffer)
    .digest('hex');

  const requestWithSignature = (signature: string | undefined) => {
    return {
      body: payload,
      headers: {
        'x-gitea-signature': signature,
      },
      raw: {
        body: payloadBuffer,
        encoding: 'utf-8',
      },
    } as RequestDetails;
  };

  it('should return undefined if no secret is configured', async () => {
    expect(createGiteaSignatureValidator(configWithoutSecret)).toEqual(
      undefined,
    );
  });

  it('secret configured, reject request without signature', async () => {
    const request = requestWithSignature(undefined);
    const context = new TestContext();

    const validator = createGiteaSignatureValidator(configWithSecret);
    await validator!(request, context);

    expect(context.details).not.toBeUndefined();
    expect(context.details?.status).toBe(403);
    expect(context.details?.payload).toEqual({ message: 'invalid signature' });
  });

  it('secret configured, reject request with invalid signature', async () => {
    const request = requestWithSignature('invalid signature');
    const context = new TestContext();

    const validator = createGiteaSignatureValidator(configWithSecret);
    await validator!(request, context);

    expect(context.details).not.toBeUndefined();
    expect(context.details?.status).toBe(403);
    expect(context.details?.payload).toEqual({ message: 'invalid signature' });
  });

  it('secret configured, reject request signed with wrong secret', async () => {
    const wrongSignature = createHmac('sha256', 'wrong-secret')
      .update(payloadBuffer)
      .digest('hex');
    const request = requestWithSignature(wrongSignature);
    const context = new TestContext();

    const validator = createGiteaSignatureValidator(configWithSecret);
    await validator!(request, context);

    expect(context.details).not.toBeUndefined();
    expect(context.details?.status).toBe(403);
    expect(context.details?.payload).toEqual({ message: 'invalid signature' });
  });

  it('secret configured, accept request with valid signature', async () => {
    const request = requestWithSignature(validSignature);
    const context = new TestContext();

    const validator = createGiteaSignatureValidator(configWithSecret);
    await validator!(request, context);

    expect(context.details).toBeUndefined();
  });
});
