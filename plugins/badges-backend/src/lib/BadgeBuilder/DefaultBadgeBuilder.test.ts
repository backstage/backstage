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

import { Config } from '@backstage/config';
import { DefaultBadgeBuilder } from './DefaultBadgeBuilder';
import { BadgeBuilder, BadgeOptions } from './types';
import { BadgeContext, BadgeFactories } from '../../types';

describe('DefaultBadgeBuilder', () => {
  let builder: BadgeBuilder;
  let config: jest.Mocked<Config>;
  let factories: BadgeFactories;

  const badge = {
    description: 'a test badge',
    label: 'test',
    message: 'ok',
    link: 'http://example.com/badgelink',
  };

  beforeAll(() => {
    config = {
      get: jest.fn(),
      getBoolean: jest.fn(),
      getConfig: jest.fn(),
      getConfigArray: jest.fn(),
      getNumber: jest.fn(),
      getOptional: jest.fn(),
      getOptionalBoolean: jest.fn(),
      getOptionalConfig: jest.fn(),
      getOptionalConfigArray: jest.fn(),
      getOptionalNumber: jest.fn(),
      getOptionalString: jest.fn(),
      getOptionalStringArray: jest.fn(),
      getString: jest.fn(),
      getStringArray: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
    };

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

  it('getBadgeIds() returns all badge factory ids', async () => {
    expect(await builder.getBadgeIds()).toEqual(['testbadge']);
  });

  describe('createBadge', () => {
    const context: BadgeContext = {
      badgeUrl: 'http://127.0.0.1/badge/url',
      config,
    };

    it('returns the spec when format is "json"', async () => {
      const options: BadgeOptions = {
        badgeId: 'testbadge',
        context,
        format: 'json',
      };

      const spec = await builder.createBadge(options);
      expect(JSON.parse(spec)).toEqual({
        badge,
        id: 'testbadge',
        url: context.badgeUrl,
        markdown: `[![a test badge, test: ok](${context.badgeUrl} "a test badge")](${badge.link})`,
      });
    });

    it('returns the badge image when format is "svg"', async () => {
      const options: BadgeOptions = {
        badgeId: 'testbadge',
        context,
        format: 'svg',
      };

      const spec = await builder.createBadge(options);
      expect(spec).toEqual(expect.stringMatching(/^<svg[^>]*>.*<\/svg>$/));
    });

    it('returns "unknown" badge for missing factory', async () => {
      const options: BadgeOptions = {
        badgeId: 'other-id',
        context,
        format: 'json',
      };

      const spec = await builder.createBadge(options);
      expect(JSON.parse(spec)).toEqual({
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
