/*
 * Copyright 2021 The Backstage Authors
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

/**
 * Function that returns the catalog refresh interval in seconds.
 * @deprecated use {@link ProcessingIntervalFunction} instead
 * @public
 */
export type RefreshIntervalFunction = () => number;

/**
 * Function that returns the catalog processing interval in seconds.
 * @public
 */
export type ProcessingIntervalFunction = () => number;

/**
 * Creates a function that returns a random refresh interval between minSeconds and maxSeconds.
 * @returns A {@link RefreshIntervalFunction} that provides the next refresh interval
 * @deprecated use {@link createRandomProcessingInterval} instead
 * @public
 */
export function createRandomRefreshInterval(options: {
  minSeconds: number;
  maxSeconds: number;
}): RefreshIntervalFunction {
  const { minSeconds, maxSeconds } = options;
  return () => {
    return Math.random() * (maxSeconds - minSeconds) + minSeconds;
  };
}

/**
 * Creates a function that returns a random processing interval between minSeconds and maxSeconds.
 * @returns A {@link ProcessingIntervalFunction} that provides the next processing interval
 * @public
 */
export function createRandomProcessingInterval(options: {
  minSeconds: number;
  maxSeconds: number;
}): ProcessingIntervalFunction {
  const { minSeconds, maxSeconds } = options;
  return () => {
    return Math.random() * (maxSeconds - minSeconds) + minSeconds;
  };
}
