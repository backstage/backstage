/*
 * Copyright 2021 Spotify AB
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

import { Config, ConfigReader } from '@backstage/config';
import { DefaultBadgeBuilder } from './DefaultBadgeBuilder';
import { BadgeBuilder, BadgeOptions } from './types';
import { BadgeContext, BadgeFactories } from '../../types';

describe('DefaultBadgeBuilder', () => {
  let builder: BadgeBuilder;
  let config: Config;
  let factories: BadgeFactories;

  const badge = {
    description: 'a test badge',
    label: 'test',
    message: 'ok',
    link: 'http://example.com/badgelink',
  };

  beforeAll(() => {
    config = new ConfigReader({
      backend: { baseUrl: 'http://127.0.0.1' },
    });

    factories = {
      testbadge: {
        createBadge: () => badge,
      },
    };
  });

  beforeEach(() => {
    jest.resetAllMocks();
    builder = new DefaultBadgeBuilder(factories);
  });

  it('getBadges() returns all badge factory ids', async () => {
    expect(await builder.getBadges()).toEqual([{ id: 'testbadge' }]);
  });

  describe('createBadge[Json|Svg]', () => {
    const context: BadgeContext = {
      badgeUrl: 'http://127.0.0.1/badge/url',
      config,
    };

    it('badge spec', async () => {
      const options: BadgeOptions = {
        badgeInfo: { id: 'testbadge' },
        context,
      };

      const spec = await builder.createBadgeJson(options);
      expect(spec).toEqual({
        badge,
        id: 'testbadge',
        url: context.badgeUrl,
        markdown: `[![a test badge, test: ok](${context.badgeUrl} "a test badge")](${badge.link})`,
      });
    });

    it('badge image', async () => {
      const options: BadgeOptions = {
        badgeInfo: { id: 'testbadge' },
        context,
      };

      const img = await builder.createBadgeSvg(options);
      expect(img).toEqual(expect.stringMatching(/^<svg[^>]*>.*<\/svg>$/));
    });

    it('returns "unknown" badge for missing factory', async () => {
      const options: BadgeOptions = {
        badgeInfo: { id: 'other-id' },
        context,
      };

      const spec = await builder.createBadgeJson(options);
      expect(spec).toEqual({
        badge: {
          label: 'unknown badge',
          message: 'other-id',
          color: 'red',
        },
        id: 'other-id',
        url: context.badgeUrl,
        markdown: `![unknown badge: other-id](${context.badgeUrl})`,
      });
    });
  });
});
