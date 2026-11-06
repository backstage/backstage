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

  it.each([null, 'invalid', 1])(
    'rejects if notification item is not an object: %p',
    async notification => {
      const request = createRequest({ body: { value: [notification] } });

      await target(request, context);

      expect(logger.warn).toHaveBeenCalledWith(
        `Notification value item is not an object: ${JSON.stringify(
          notification,
        )}`,
      );
      expect(databaseClient.getById).not.toHaveBeenCalled();
      expect(context.reject).toHaveBeenCalledWith();
    },
  );

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
      'Notification value item is missing or contains invalid required properties (clientState, subscriptionId).',
    );
    expect(request.body).toEqual({
      value: [{}, { subscriptionId: 'b' }],
    });
    expect(logger.warn).toHaveBeenCalledWith(
      'No valid notification items found among 2 items',
    );
    expect(context.reject).toHaveBeenCalledWith();
  });

  it('rejects notification items when clientState or subscriptionId is not a string', async () => {
    const request = createRequest({
      body: {
        value: [
          { clientState: 1, subscriptionId: 'b' },
          { clientState: 'c', subscriptionId: 2 },
        ],
      },
    });

    await target(request, context);

    expect(logger.warn).toHaveBeenCalledWith(
      'Notification value item is missing or contains invalid required properties (clientState, subscriptionId).',
    );
    expect(databaseClient.getById).not.toHaveBeenCalled();
    expect(request.body).toEqual({
      value: [{ subscriptionId: 'b' }, { subscriptionId: 2 }],
    });
    expect(context.reject).toHaveBeenCalled();
  });

  it('rejects immediately if no subscription record is found', async () => {
    const request = createRequest({
      body: {
        value: [
          { clientState: 'a', subscriptionId: 'b' },
          { clientState: 'c', subscriptionId: 'd' },
        ],
      },
    });
    (databaseClient.getById as jest.Mock).mockResolvedValue(undefined);
    await target(request, context);
    expect(databaseClient.getById).toHaveBeenCalledTimes(1);
    expect(databaseClient.getById).toHaveBeenCalledWith('b');
    expect(logger.warn).toHaveBeenCalledWith(
      'No subscription record found for ID b',
    );
    expect(request.body).toEqual({
      value: [
        expect.objectContaining({ subscriptionId: 'b' }),
        expect.objectContaining({ subscriptionId: 'd' }),
      ],
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
    (hashValidationToken as jest.Mock).mockReturnValue('not-h');
    await target(request, context);
    expect(hashValidationToken).toHaveBeenCalledWith({ token: 'a', salt: 's' });
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
      ({ token: clientState, salt }) => {
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
      ({ token: clientState, salt }) => {
        if (clientState === 'a' && salt === 's') return 'h';
        if (clientState === 'c' && salt === 's2') return 'h2';
        return '';
      },
    );
    await target(request, context);
    expect(hashValidationToken).toHaveBeenNthCalledWith(1, {
      token: 'a',
      salt: 's',
    });
    expect(hashValidationToken).toHaveBeenNthCalledWith(2, {
      token: 'c',
      salt: 's2',
    });
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

  it('verifies repeated credentials once per subscription and removes every clientState', async () => {
    const request = createRequest({
      body: {
        value: [
          { clientState: 'a', subscriptionId: 'b', resource: '/users/1' },
          { clientState: 'x', subscriptionId: 'd', resource: '/users/2' },
          { clientState: 'a', subscriptionId: 'b', resource: '/users/3' },
          { clientState: 'x', subscriptionId: 'd', resource: '/users/4' },
        ],
      },
    });
    (databaseClient.getById as jest.Mock).mockResolvedValue({
      token_hash: 'h',
      token_salt: 's',
    });
    jest.mocked(hashValidationToken).mockReturnValue('h');

    await target(request, context);

    expect(databaseClient.getById).toHaveBeenCalledTimes(2);
    expect(databaseClient.getById).toHaveBeenNthCalledWith(1, 'b');
    expect(databaseClient.getById).toHaveBeenNthCalledWith(2, 'd');
    expect(hashValidationToken).toHaveBeenCalledTimes(4);
    expect(hashValidationToken).toHaveBeenCalledWith({ token: 'a', salt: 's' });
    expect(hashValidationToken).toHaveBeenCalledWith({ token: 'x', salt: 's' });
    expect(request.body).toEqual({
      value: [
        { subscriptionId: 'b', resource: '/users/1' },
        { subscriptionId: 'd', resource: '/users/2' },
        { subscriptionId: 'b', resource: '/users/3' },
        { subscriptionId: 'd', resource: '/users/4' },
      ],
    });
    expect(logger.debug).toHaveBeenCalledWith(
      'All 4 notification items are valid',
    );
    expect(context.reject).not.toHaveBeenCalled();
  });

  it.each([
    ['valid', 'invalid', 'valid', 'invalid'],
    ['invalid', 'valid', 'invalid', 'valid'],
  ])(
    'checks differing client states separately: %j',
    async (...clientStates) => {
      const request = createRequest({
        body: {
          value: clientStates.map(clientState => ({
            subscriptionId: 'b',
            clientState,
          })),
        },
      });
      (databaseClient.getById as jest.Mock).mockResolvedValue({
        token_hash: 'h',
        token_salt: 's',
      });
      jest
        .mocked(hashValidationToken)
        .mockImplementation(({ token }) => (token === 'valid' ? 'h' : 'not-h'));

      await target(request, context);

      expect(databaseClient.getById).toHaveBeenCalledTimes(1);
      expect(hashValidationToken).toHaveBeenCalledTimes(4);
      expect(
        jest
          .mocked(hashValidationToken)
          .mock.calls.filter(([state]) => state.token === 'valid'),
      ).toHaveLength(2);
      expect(
        jest
          .mocked(hashValidationToken)
          .mock.calls.filter(([state]) => state.token === 'invalid'),
      ).toHaveLength(2);
      expect(request.body).toEqual({
        value: clientStates.map(() => ({ subscriptionId: 'b' })),
      });
      expect(logger.warn).toHaveBeenCalledWith(
        'Only 2 valid notification items found among 4 items',
      );
      expect(context.reject).toHaveBeenCalledWith();
    },
  );

  it('does not reuse successful verification across requests', async () => {
    (databaseClient.getById as jest.Mock).mockResolvedValue({
      token_hash: 'h',
      token_salt: 's',
    });
    jest
      .mocked(hashValidationToken)
      .mockReturnValueOnce('h')
      .mockReturnValueOnce('not-h');

    const makeRequest = () =>
      createRequest({
        body: { value: [{ subscriptionId: 'b', clientState: 'a' }] },
      });

    await target(makeRequest(), context);
    expect(context.reject).not.toHaveBeenCalled();

    await target(makeRequest(), context);

    expect(databaseClient.getById).toHaveBeenCalledTimes(2);
    expect(hashValidationToken).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenCalledWith(
      'Invalid clientState for notification item.',
    );
    expect(context.reject).toHaveBeenCalledWith();
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
    (hashValidationToken as jest.Mock).mockReturnValue('not-h');
    await target(request, context);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'No valid notification items found among 2 items',
      ),
    );
    expect(context.reject).toHaveBeenCalledWith();
  });
});
