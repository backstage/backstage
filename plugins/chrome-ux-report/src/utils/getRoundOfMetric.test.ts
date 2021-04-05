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

import { getRoundOfMetric } from './getRoundOfMetric';

describe('getRoundOfMetric', () => {
  it('return round of metric when metric is 0.913', async () => {
    const metric = 0.913;
    const result = getRoundOfMetric(metric);

    expect(result).toEqual(91.3);
  });

  it('return round of metric when metric is 0.018', async () => {
    const metric = 0.018;
    const result = getRoundOfMetric(metric);

    expect(result).toEqual(1.8);
  });
});
