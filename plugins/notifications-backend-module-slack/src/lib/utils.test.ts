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

import { KnownBlock } from '@slack/web-api';
import { toChatPostMessageArgs } from './util';

describe('toChatPostMessageArgs', () => {
  const frontendBaseUrl = 'https://example.org';

  it('resolves a relative link to an absolute URL', () => {
    const args = toChatPostMessageArgs({
      channel: 'C12345678',
      frontendBaseUrl,
      payload: {
        title: 'notification',
        link: '/announcements/view/123',
      },
    });

    expect(args).toEqual(
      expect.objectContaining({
        attachments: [
          expect.objectContaining({
            blocks: expect.arrayContaining([
              expect.objectContaining({
                accessory: expect.objectContaining({
                  url: 'https://example.org/announcements/view/123',
                }),
              }),
            ]),
          }),
        ],
      }),
    );
  });

  it('passes through an absolute link unchanged', () => {
    const args = toChatPostMessageArgs({
      channel: 'C12345678',
      frontendBaseUrl,
      payload: {
        title: 'notification',
        link: 'https://other.example.com/page',
      },
    });

    expect(args).toEqual(
      expect.objectContaining({
        attachments: [
          expect.objectContaining({
            blocks: expect.arrayContaining([
              expect.objectContaining({
                accessory: expect.objectContaining({
                  url: 'https://other.example.com/page',
                }),
              }),
            ]),
          }),
        ],
      }),
    );
  });

  it('passes normalized links to a custom block kit renderer', () => {
    const customBlocks: KnownBlock[] = [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: 'Custom block' },
      },
    ];

    const blockKitRenderer = jest.fn().mockReturnValue(customBlocks);

    const args = toChatPostMessageArgs({
      channel: 'C12345678',
      frontendBaseUrl,
      payload: {
        title: 'notification',
        link: '/catalog/default/component/example',
      },
      blockKitRenderer,
    });

    expect(blockKitRenderer).toHaveBeenCalledWith(
      expect.objectContaining({
        link: 'https://example.org/catalog/default/component/example',
      }),
    );
    expect(args).toEqual(
      expect.objectContaining({
        attachments: [
          expect.objectContaining({
            blocks: customBlocks,
          }),
        ],
      }),
    );
  });
});
