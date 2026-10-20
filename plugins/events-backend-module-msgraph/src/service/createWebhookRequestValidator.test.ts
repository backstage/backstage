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
import { mockServices } from '@backstage/backend-test-utils';
import type {
  ParsedQueryString,
  RequestDetails,
  RequestValidationContext,
  RequestValidator,
} from '@backstage/plugin-events-node';
import type { MicrosoftGraphSubscriptionsDatabaseClient } from '../database/databaseClient';
import { createWebhookRequestValidator } from './createWebhookRequestValidator';
import { hashValidationToken } from './validationToken';

jest.mock('./validationToken');

function createRequest({
  query,
  body,
}: {
  query?: ParsedQueryString;
  body?: unknown;
}): RequestDetails {
  return {
    query: query ?? {},
    body: body ?? {},
    headers: {},
    raw: {
      body: Buffer.from(''),
      encoding: 'utf8',
    },
  };
}

describe('createWebhookRequestValidator', () => {
  let logger: ReturnType<typeof mockServices.logger.mock>;

  let databaseClient: MicrosoftGraphSubscriptionsDatabaseClient;
  let context: RequestValidationContext;
  let target: RequestValidator;

  beforeEach(() => {
    jest.clearAllMocks();

    logger = mockServices.logger.mock({
      child: jest.fn().mockImplementation(() => logger),
    });

    databaseClient = {
      getById: jest.fn(),
    } as unknown as MicrosoftGraphSubscriptionsDatabaseClient;
    context = {
      reject: jest.fn(),
    };
    target = createWebhookRequestValidator(logger, databaseClient);
  });

  it('responds to validationToken with decoded token and text/plain', async () => {
    const request = createRequest({
      // no explicit URL encoding here - validator implementation relies on Express to decode the query string
      query: { validationToken: 'foo bar' },
    });
    await target(request, context);
    expect(logger.info).toHaveBeenCalledWith(
      'Received validation request from MS Graph.',
    );
    expect(logger.debug).toHaveBeenCalledWith(
      'Responding with URL-decoded token through context.reject.',
    );
    expect(context.reject).toHaveBeenCalledWith({
      status: 200,
      payload: 'foo bar',
      contentType: 'text/plain',
    });
  });

  it('rejects if body does not have value payload', async () => {
    const request = createRequest({ body: { notValue: 1 } });
    await target(request, context);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Received invalid webhook request'),
    );
    expect(context.reject).toHaveBeenCalledWith();
  });

  it('rejects if value is not an array', async () => {
    const request = createRequest({ body: { value: 123 } });
    await target(request, context);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Received invalid notification collection'),
    );
    expect(context.reject).toHaveBeenCalledWith();
  });

  it('warns and continues if notification item missing clientState or subscriptionId', async () => {
    const request = createRequest({
      body: { value: [{ clientState: 'a' }, { subscriptionId: 'b' }] },
    });
    // (databaseClient.getById as jest.Mock).mockResolvedValue({
    //   token_hash: 'h',
    //   token_salt: 's',
    // });
    await target(request, context);
    expect(logger.warn).toHaveBeenCalledWith(
      'Notification value item is missing required properties (clientState, subscriptionId).',
    );
    expect(request.body).toEqual({
      value: [{}, { subscriptionId: 'b' }],
    });
    expect(logger.warn).toHaveBeenCalledWith(
      'No valid notification items found among 2 items',
    );
    expect(context.reject).toHaveBeenCalledWith();
  });

  it('warns if no subscription record found', async () => {
    const request = createRequest({
      body: { value: [{ clientState: 'a', subscriptionId: 'b' }] },
    });
    (databaseClient.getById as jest.Mock).mockResolvedValue(undefined);
    await target(request, context);
    expect(logger.warn).toHaveBeenCalledWith(
      'No subscription record found for ID b',
    );
    expect(request.body).toEqual({
      value: [{ subscriptionId: 'b' }],
    });
    expect(context.reject).toHaveBeenCalledWith();
  });

  it('warns if clientState hash does not match', async () => {
    const request = createRequest({
      body: { value: [{ clientState: 'a', subscriptionId: 'b' }] },
    });
    (databaseClient.getById as jest.Mock).mockResolvedValue({
      token_hash: 'h',
      token_salt: 's',
    });
    (hashValidationToken as jest.Mock).mockResolvedValue('not-h');
    await target(request, context);
    expect(hashValidationToken).toHaveBeenCalledWith('a', 's');
    expect(logger.warn).toHaveBeenCalledWith(
      'Invalid clientState for notification item.',
    );
    expect(request.body).toEqual({
      value: [{ subscriptionId: 'b' }],
    });
    expect(context.reject).toHaveBeenCalledWith();
  });

  it('rejects if at least one notification item is invalid', async () => {
    const request = createRequest({
      body: {
        value: [
          { clientState: 'a', subscriptionId: 'b' },
          { clientState: 'c', subscriptionId: 'd' },
        ],
      },
    });
    (databaseClient.getById as jest.Mock).mockImplementation((id: string) => {
      if (id === 'b') return { token_hash: 'h', token_salt: 's' };
      if (id === 'd') return { token_hash: 'h2', token_salt: 's2' };
      return undefined;
    });
    (hashValidationToken as jest.Mock).mockImplementation(
      async (clientState, salt) => {
        if (clientState === 'a' && salt === 's') return 'h';
        if (clientState === 'c' && salt === 's2') return 'not-h2';
        return '';
      },
    );
    await target(request, context);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Only 1 valid notification items found among 2 items',
      ),
    );
    expect(context.reject).toHaveBeenCalled();
  });

  it('accepts and removes clientState from all valid notification items', async () => {
    const request = createRequest({
      body: {
        value: [
          { clientState: 'a', subscriptionId: 'b', resource: '/users/1' },
          { clientState: 'c', subscriptionId: 'd', resource: '/users/2' },
        ],
      },
    });
    (databaseClient.getById as jest.Mock).mockImplementation((id: string) => {
      if (id === 'b') return { token_hash: 'h', token_salt: 's' };
      if (id === 'd') return { token_hash: 'h2', token_salt: 's2' };
      return undefined;
    });
    (hashValidationToken as jest.Mock).mockImplementation(
      async (clientState, salt) => {
        if (clientState === 'a' && salt === 's') return 'h';
        if (clientState === 'c' && salt === 's2') return 'h2';
        return '';
      },
    );
    await target(request, context);
    expect(hashValidationToken).toHaveBeenNthCalledWith(1, 'a', 's');
    expect(hashValidationToken).toHaveBeenNthCalledWith(2, 'c', 's2');
    expect(request.body).toEqual({
      value: [
        { subscriptionId: 'b', resource: '/users/1' },
        { subscriptionId: 'd', resource: '/users/2' },
      ],
    });
    expect(logger.debug).toHaveBeenCalledWith(
      'All 2 notification items are valid',
    );
    expect(context.reject).not.toHaveBeenCalled();
  });

  it('rejects if no valid notification items', async () => {
    const request = createRequest({
      body: {
        value: [
          { clientState: 'a', subscriptionId: 'b' },
          { clientState: 'c', subscriptionId: 'd' },
        ],
      },
    });
    (databaseClient.getById as jest.Mock).mockResolvedValue({
      token_hash: 'h',
      token_salt: 's',
    });
    (hashValidationToken as jest.Mock).mockResolvedValue('not-h');
    await target(request, context);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'No valid notification items found among 2 items',
      ),
    );
    expect(context.reject).toHaveBeenCalledWith();
  });
});
