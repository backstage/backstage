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
import { stitchingStrategyFromConfig } from './types';

it('accepts default and positive stitching durations in all supported formats', () => {
  expect(stitchingStrategyFromConfig(new ConfigReader({}))).toEqual({
    pollingInterval: { seconds: 1 },
    stitchTimeout: { seconds: 60 },
  });
  for (const value of [{ milliseconds: 50 }, '50ms', 'PT0.05S']) {
    const strategy = stitchingStrategyFromConfig(
      new ConfigReader({
        catalog: {
          stitchingStrategy: {
            pollingInterval: value,
            stitchTimeout: '2 hours',
          },
        },
      }),
    );
    expect(strategy.pollingInterval).toEqual({ milliseconds: 50 });
    expect(strategy.stitchTimeout).toEqual({ hours: 2 });
  }
});

it.each(['pollingInterval', 'stitchTimeout'])(
  'rejects non-positive %s with its configuration key',
  key => {
    for (const value of [
      { seconds: 0 },
      '0ms',
      'PT0S',
      { seconds: -1 },
      '-1s',
      '-PT1S',
      { seconds: 1, milliseconds: -1000 },
    ]) {
      expect(() =>
        stitchingStrategyFromConfig(
          new ConfigReader({
            catalog: { stitchingStrategy: { [key]: value } },
          }),
        ),
      ).toThrow(`catalog.stitchingStrategy.${key}`);
    }
    expect(() =>
      stitchingStrategyFromConfig(
        new ConfigReader({
          catalog: { stitchingStrategy: { [key]: { seconds: Infinity } } },
        }),
      ),
    ).toThrow(
      `'catalog.stitchingStrategy.${key}' must be finite and greater than zero`,
    );
  },
);
