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
import { EventsClientManager } from './EventsClientManager';
import { DefaultEventsClient } from './EventsClient';

describe('EventsClientManager', () => {
  const logger = getVoidLogger();

  it('should return noop client if no config', () => {
    const config = new ConfigReader({});
    const client = EventsClientManager.fromConfig(config, { logger })
      .forPlugin('catalog')
      .getClient();
    expect(client instanceof DefaultEventsClient).toBeFalsy();
  });

  it('should return client with boolean config', () => {
    const config = new ConfigReader({ backend: { events: true } });
    const client = EventsClientManager.fromConfig(config, { logger })
      .forPlugin('catalog')
      .getClient();
    expect(client instanceof DefaultEventsClient).toBeTruthy();
  });

  it('should return client with object config', () => {
    const config = new ConfigReader({
      backend: { events: { enabled: true } },
    });
    const client = EventsClientManager.fromConfig(config, { logger })
      .forPlugin('catalog')
      .getClient();
    expect(client instanceof DefaultEventsClient).toBeTruthy();
  });
});
