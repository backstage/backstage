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
import type { ConnectionRegistration } from '@backstage/backend-plugin-api/alpha';
import type { ConnectionsService } from '@backstage/connections';
import { InputError } from '@backstage/errors';

/** @internal */
export function withDeclaredConnections(
  service: ConnectionsService,
  registrations: ReadonlyArray<ConnectionRegistration>,
): ConnectionsService {
  const assertDeclared = (type: string) => {
    if (
      !registrations.some(({ type: registeredType }) => registeredType === type)
    ) {
      throw new InputError(
        `Plugin attempted to look up an undeclared connection of type "${type}". Declare it during register() with declareConnection(reg, { type: "${type}" }).`,
      );
    }
  };
  return {
    async find(options) {
      assertDeclared(options.type);
      return service.find(options);
    },
  };
}
