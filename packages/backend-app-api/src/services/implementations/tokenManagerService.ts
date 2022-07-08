/*
 * Copyright 2022 The Backstage Authors
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

import {
  configServiceRef,
  loggerServiceRef,
  createServiceFactory,
  tokenManagerServiceRef,
  loggerToWinstonLogger,
} from '@backstage/backend-plugin-api';
import { ServerTokenManager } from '@backstage/backend-common';

export const tokenManagerFactory = createServiceFactory({
  service: tokenManagerServiceRef,
  deps: {
    configFactory: configServiceRef,
    loggerFactory: loggerServiceRef,
  },
  factory: async ({ configFactory, loggerFactory }) => {
    const logger = await loggerFactory('root');
    const config = await configFactory('root');
    return async (_pluginId: string) => {
      // doesn't the logger want to be inferred from the plugin tho here?
      // maybe ... also why do we recreate it every time otherwise
      // we should memoize on a per plugin right? so I think it's should be fine to re-use the plugin one
      // we shouldn't recreate on a per plugin basis.
      // hm - on the other hand, is this really ever called more than once?
      // not this function right. should only be called when the plugin requests this serviceRef
      // yeah so no need to worry about memo probably
      // but we still want to scope the logger to the ServrTokenmanagfer>?
      // mm sure maybe
      // maybe in this case it doesn't provide so much value b
      // oh hang on - isn't it up to THE MANAGER to make a child internally if it wants to do that
      // so that it becomes a property intrinsic to that class, no matter how it's constructed
      // or is that too much responsibility for it - making the constructor complex so to speak, making it harder to tweak that behavior
      // this is not ultra efficient :)

      // I think the naming here is wrong to be gonest
      // this isn't like the cache manager or the database manager
      // the manager name is confusuion i think
      // aye perhaps
      return ServerTokenManager.fromConfig(config, {
        logger: loggerToWinstonLogger(logger),
      });
    };
  },
});
