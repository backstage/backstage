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

/**
 * @public
 */
export type UserSetting = {
  bucket: string;
  key: string;
  value: string;
};

/**
 * Store definition for the user settings.
 *
 * @public
 */
export interface UserSettingsStore<Transaction> {
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;

  get(
    tx: Transaction,
    opts: { userEntityRef: string; bucket: string; key: string },
  ): Promise<UserSetting>;

  set(
    tx: Transaction,
    opts: { userEntityRef: string; bucket: string; key: string; value: string },
  ): Promise<void>;

  delete(
    tx: Transaction,
    opts: { userEntityRef: string; bucket: string; key: string },
  ): Promise<void>;

  getBucket(
    tx: Transaction,
    opts: { userEntityRef: string; bucket: string },
  ): Promise<UserSetting[]>;

  deleteBucket(
    tx: Transaction,
    opts: { userEntityRef: string; bucket: string },
  ): Promise<void>;

  getAll(
    tx: Transaction,
    opts: { userEntityRef: string },
  ): Promise<UserSetting[]>;

  deleteAll(tx: Transaction, opts: { userEntityRef: string }): Promise<void>;
}
