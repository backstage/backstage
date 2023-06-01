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
import { ConfigReader } from '@backstage/config';
import { readSignalsBrokerOptions } from './config';

describe('config', () => {
  afterEach(() => jest.resetAllMocks());

  it('should read boolean config', () => {
    const config = new ConfigReader({ signals: true });
    expect(readSignalsBrokerOptions(config)).toEqual({ enabled: true });
  });

  it('should read signals config', () => {
    const config = new ConfigReader({
      signals: { enabled: true, endpoint: 'ws://localhost:7007' },
    });
    expect(readSignalsBrokerOptions(config)).toEqual({
      enabled: true,
      adapter: 'memory',
      databaseConnection: undefined,
    });
  });

  it('should disable events with undefined config', () => {
    expect(readSignalsBrokerOptions()).toEqual({
      enabled: false,
      adapter: 'memory',
      databaseConnection: undefined,
    });
  });
});
