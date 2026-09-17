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
import { createAzureDevOpsWebhookValidator } from './createAzureDevOpsWebhookValidator';

class TestContext implements RequestValidationContext {
  #details?: Partial<RequestRejectionDetails>;

  reject(details?: Partial<RequestRejectionDetails>): void {
    this.#details = details;
  }

  get details() {
    return this.#details;
  }
}

describe('createAzureDevOpsWebhookValidator', () => {
  const secret = 'my-webhook-secret';
  const configWithoutSecret = new ConfigReader({});
  const configWithSecret = new ConfigReader({
    events: {
      modules: {
        azureDevOps: {
          webhookSecret: secret,
        },
      },
    },
  });

  const requestWithHeader = (headerSecret: string | undefined) => {
    return {
      body: { eventType: 'workitem.updated' },
      headers: {
        'x-ado-webhook-secret': headerSecret,
      },
      raw: {
        body: Buffer.from('{}'),
        encoding: 'utf-8',
      },
    } as RequestDetails;
  };

  it('should return undefined if no secret is configured', () => {
    expect(createAzureDevOpsWebhookValidator(configWithoutSecret)).toEqual(
      undefined,
    );
  });

  it('secret configured, accept request with matching header', async () => {
    const request = requestWithHeader(secret);
    const context = new TestContext();

    const validator = createAzureDevOpsWebhookValidator(configWithSecret);
    await validator!(request, context);

    expect(context.details).toBeUndefined();
  });

  it('secret configured, reject request with wrong header', async () => {
    const request = requestWithHeader('wrong-secret');
    const context = new TestContext();

    const validator = createAzureDevOpsWebhookValidator(configWithSecret);
    await validator!(request, context);

    expect(context.details).not.toBeUndefined();
    expect(context.details?.status).toBe(403);
    expect(context.details?.payload).toEqual({
      message: 'invalid webhook secret',
    });
  });

  it('secret configured, reject request without header', async () => {
    const request = requestWithHeader(undefined);
    const context = new TestContext();

    const validator = createAzureDevOpsWebhookValidator(configWithSecret);
    await validator!(request, context);

    expect(context.details).not.toBeUndefined();
    expect(context.details?.status).toBe(403);
    expect(context.details?.payload).toEqual({
      message: 'invalid webhook secret',
    });
  });
});
