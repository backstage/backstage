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
import { WebClient } from '@slack/web-api';
import { replaceSlackUserIds } from './util';

describe('replaceSlackUserIds', () => {
  let mockSlackClient: jest.Mocked<WebClient>;

  beforeEach(() => {
    mockSlackClient = {
      users: {
        info: jest.fn().mockImplementation(() => Promise.resolve({ ok: true })),
      },
    } as unknown as jest.Mocked<WebClient>;
  });

  it('should return original text when no Slack user IDs are present', async () => {
    const text = 'Hello world!';
    const result = await replaceSlackUserIds(text, mockSlackClient);
    expect(result).toBe(text);
    expect(mockSlackClient.users.info).not.toHaveBeenCalled();
  });

  it('should replace single Slack user ID with display name', async () => {
    const text = 'Hello <@U12345678>!';
    (mockSlackClient.users.info as jest.Mock).mockResolvedValueOnce({
      ok: true,
      user: {
        profile: {
          display_name: 'John Doe',
        },
      },
    });

    const result = await replaceSlackUserIds(text, mockSlackClient);
    expect(result).toBe('Hello John Doe!');
    expect(mockSlackClient.users.info).toHaveBeenCalledWith({
      user: 'U12345678',
    });
  });

  it('should replace multiple unique Slack user IDs with display names', async () => {
    const text = 'Hello <@U12345678> and <@U87654321>!';
    (mockSlackClient.users.info as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        user: {
          profile: {
            display_name: 'John Doe',
          },
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        user: {
          profile: {
            display_name: 'Jane Smith',
          },
        },
      });

    const result = await replaceSlackUserIds(text, mockSlackClient);
    expect(result).toBe('Hello John Doe and Jane Smith!');
    expect(mockSlackClient.users.info).toHaveBeenCalledTimes(2);
  });

  it('should handle duplicate Slack user IDs efficiently', async () => {
    const text = 'Hello <@U12345678> and <@U12345678>!';
    (mockSlackClient.users.info as jest.Mock).mockResolvedValueOnce({
      ok: true,
      user: {
        profile: {
          display_name: 'John Doe',
        },
      },
    });

    const result = await replaceSlackUserIds(text, mockSlackClient);
    expect(result).toBe('Hello John Doe and John Doe!');
    expect(mockSlackClient.users.info).toHaveBeenCalledTimes(1);
  });

  it('should fallback to user ID when user info fetch fails', async () => {
    const text = 'Hello <@U12345678>!';
    (mockSlackClient.users.info as jest.Mock).mockRejectedValueOnce(
      new Error('API Error'),
    );

    const result = await replaceSlackUserIds(text, mockSlackClient);
    expect(result).toBe('Hello U12345678!');
    expect(mockSlackClient.users.info).toHaveBeenCalledWith({
      user: 'U12345678',
    });
  });

  it('should fallback to user ID when display name is not available', async () => {
    const text = 'Hello <@U12345678>!';
    (mockSlackClient.users.info as jest.Mock).mockResolvedValueOnce({
      ok: true,
      user: {
        profile: {},
      },
    });

    const result = await replaceSlackUserIds(text, mockSlackClient);
    expect(result).toBe('Hello U12345678!');
    expect(mockSlackClient.users.info).toHaveBeenCalledWith({
      user: 'U12345678',
    });
  });
});
