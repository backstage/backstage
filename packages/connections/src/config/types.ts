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
  ConnectionType,
  ConfiguredConnectionAuth,
} from '../api/ConnectionType';
import type {
  ConnectionTypeKey,
  LookupConnectionType,
} from '../definitions/types';

/**
 * The shape of a fully validated connection as read from configuration,
 * before any plugin filtering has been applied: the fields declared by the
 * connection type's config schema plus the framework-managed `type`, `title`,
 * `match`, and `auth` fields.
 *
 * @public
 */
export type ConfiguredConnection<
  T extends ConnectionType | ConnectionTypeKey = ConnectionType,
> = ReturnType<LookupConnectionType<T>['configSchema']['parse']> & {
  type: LookupConnectionType<T>['type'];
  title?: string;
  match?: { plugins: string[] };
  auth: ConfiguredConnectionAuth<
    LookupConnectionType<T>['authMethods'][number]
  >[];
};
