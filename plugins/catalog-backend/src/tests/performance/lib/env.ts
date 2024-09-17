/*
 * Copyright 2023 The Backstage Authors
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

import yn from 'yn';

export const performanceTraceEnabled = yn(process.env.PERFORMANCE_TRACE, {
  default: false,
});

export const performanceTestEnabled = yn(process.env.PERFORMANCE_TEST, {
  default: false,
});

export const describePerformanceTest: jest.Describe = performanceTestEnabled
  ? describe
  : describe.skip;
