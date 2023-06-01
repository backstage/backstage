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
import { getVoidLogger } from '../logging';
import { SignalsClientManager } from './SignalsClientManager';
import { DefaultSignalsClient } from './SignalsClient';

describe('SignalsClientManager', () => {
  const logger = getVoidLogger();

  it('should return noop client if no config', () => {
    const config = new ConfigReader({});
    const client = SignalsClientManager.fromConfig(config, { logger })
      .forPlugin('catalog')
      .getClient();
    expect(client instanceof DefaultSignalsClient).toBeFalsy();
  });

  it('should return client with boolean config', () => {
    const config = new ConfigReader({ backend: { signals: true } });
    const client = SignalsClientManager.fromConfig(config, { logger })
      .forPlugin('catalog')
      .getClient();
    expect(client instanceof DefaultSignalsClient).toBeTruthy();
  });

  it('should return client with object config', () => {
    const config = new ConfigReader({
      backend: { signals: { enabled: true } },
    });
    const client = SignalsClientManager.fromConfig(config, { logger })
      .forPlugin('catalog')
      .getClient();
    expect(client instanceof DefaultSignalsClient).toBeTruthy();
  });
});
