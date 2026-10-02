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
import { createTransport } from 'nodemailer';
import { createAzureTransport } from './azure';

const mockPollUntilDone = jest.fn();
const mockBeginSend = jest.fn();

jest.mock('@azure/communication-email', () => ({
  EmailClient: jest.fn(() => ({ beginSend: mockBeginSend })),
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(transport => transport),
}));

describe('createAzureTransport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBeginSend.mockResolvedValue({ pollUntilDone: mockPollUntilDone });
    mockPollUntilDone.mockResolvedValue({ id: 'message-id' });
  });

  it('uses the normalized message envelope', async () => {
    await createAzureTransport(
      new ConfigReader({
        endpoint: 'https://example.com',
        accessKey: 'secret',
        senderAddress: 'fallback@example.com',
      }),
    );
    const callback = jest.fn();
    const message = {
      getEnvelope: () => ({
        from: 'sender@example.com',
        to: ['recipient@example.com'],
      }),
      getHeader: () => 'Subject',
    };

    const { send } = (createTransport as jest.Mock).mock.calls[0][0];
    await send(
      {
        data: {
          envelope: {
            from: { name: 'Sender', address: 'sender@example.com' },
            to: [{ name: 'Recipient', address: 'recipient@example.com' }],
          },
          text: 'Hello',
        },
        message,
      },
      callback,
    );

    expect(mockBeginSend).toHaveBeenCalledWith({
      senderAddress: 'sender@example.com',
      recipients: { to: [{ address: 'recipient@example.com' }] },
      content: {
        subject: 'Subject',
        html: undefined,
        plainText: 'Hello',
      },
    });
    expect(callback).toHaveBeenCalledWith(null, { id: 'message-id' });
  });
});
