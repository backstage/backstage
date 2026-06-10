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
import type { z } from 'zod/v4';
import type { ConnectionAuthValue, ConnectionType } from './ConnectionType';
import {
  ConnectionMatch,
  ConnectionTypeKey,
  LookupConnectionType,
} from '../definitions';

/** @public */
export type AuthValue<T extends ConnectionType | ConnectionTypeKey> =
  ConnectionAuthValue<LookupConnectionType<T>['authMethods'][number]>;

// A connection of a specific type.
//
// - With `T`: a single type, e.g. `Connection<'github'>`.
// - With `TAuthMethod`: narrows `auth` to a single method variant — the
//   shape returned by `ConnectionsService.find`.
// - With no parameters: an open shape suitable for internal storage.
//   Use `AnyConnection` when you want a discriminated union for narrowing.
/** @public */
export type Connection<
  T extends ConnectionType | ConnectionTypeKey = ConnectionType,
  TAuthMethod extends string = string,
> = {
  type: LookupConnectionType<T>['type'];
  auth: string extends TAuthMethod
    ? AuthValue<T>[]
    : Extract<AuthValue<T>, { method: TAuthMethod }>;
} & z.infer<LookupConnectionType<T>['configSchema']>;

// Discriminated union of every known connection type, suitable for
// `switch (c.type)` narrowing.
export type AnyConnection = {
  [K in ConnectionTypeKey]: Connection<K>;
}[ConnectionTypeKey];

// The on-disk shape of a connection: the same as `Connection`, plus the
// top-level `match` and per-auth `match` rules used for plugin scoping.
export type RootConnection<
  T extends ConnectionType | ConnectionTypeKey = ConnectionType,
> = Omit<Connection<T>, 'auth'> & {
  match?: ConnectionMatch;
  auth: (AuthValue<T> & { match?: ConnectionMatch })[];
};

export type AnyRootConnection = {
  [K in ConnectionTypeKey]: RootConnection<K>;
}[ConnectionTypeKey];
