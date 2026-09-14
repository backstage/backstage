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
import type {
  BackendModuleRegistrationPoints,
  BackendPluginRegistrationPoints,
} from '@backstage/backend-plugin-api';

import type { ConnectionRegistration } from '@backstage/backend-plugin-api/alpha';

/**
 * Declares that a plugin or module uses a particular connection type.
 * Must be called inside the `register` callback, before `registerInit`.
 *
 * @public
 */
export function declareConnection(
  reg: BackendPluginRegistrationPoints | BackendModuleRegistrationPoints,
  registration: ConnectionRegistration,
): void {
  const internal = reg as {
    registerConnection?: (r: ConnectionRegistration) => void;
  };
  if (typeof internal.registerConnection !== 'function') {
    throw new Error(
      'declareConnection: the provided registration points object does not support registerConnection. ' +
        'Make sure you are calling this inside a createBackendPlugin or createBackendModule register callback.',
    );
  }
  internal.registerConnection(registration);
}
