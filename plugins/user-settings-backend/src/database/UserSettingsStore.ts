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

import { JsonValue } from '@backstage/types';

/**
 * A single setting in a bucket
 */
export type UserSetting = {
  bucket: string;
  key: string;
  value: JsonValue;
};

/**
 * Store definition for the user settings.
 */
export interface UserSettingsStore {
  get(options: {
    userEntityRef: string;
    bucket: string;
    key: string;
  }): Promise<UserSetting>;

  set(options: {
    userEntityRef: string;
    bucket: string;
    key: string;
    value: JsonValue;
  }): Promise<void>;

  delete(options: {
    userEntityRef: string;
    bucket: string;
    key: string;
  }): Promise<void>;
}
