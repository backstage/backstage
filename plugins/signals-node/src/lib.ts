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
import {
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { DefaultSignalService } from './DefaultSignalService';
import { SignalService } from './SignalService';

/** @public */
export const signalService = createServiceRef<SignalService>({
  id: 'signals.service',
  scope: 'plugin',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        // TODO: EventBroker. It is optional for now but it's actually required so waiting for the new backend system
        //       for the events-backend for this to work.
      },
      factory({}) {
        return DefaultSignalService.create({});
      },
    }),
});
