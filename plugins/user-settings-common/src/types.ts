/*
 * Copyright 2024 The Backstage Authors
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

import type { SerializedError } from '@backstage/errors';
import type { JsonValue } from '@backstage/types';

/** @public */
export type UserSettingsSignal = {
  type: 'key-changed' | 'key-deleted';
  key: string;
};

/**
 * A failed fetch of a user setting in a bucket
 *
 * @public
 */
export type MultiUserSettingError = {
  bucket: string;
  key: string;
  error: SerializedError;
};

/**
 * A successful value of a user setting in a bucket
 *
 * @public
 */
export type MultiUserSettingSuccess = {
  bucket: string;
  key: string;
  value: JsonValue;
};

/**
 * A single setting in a bucket, or an error, used result from the /multi endpoint
 *
 * @public
 */
export type MultiUserSetting = MultiUserSettingError | MultiUserSettingSuccess;

/** @public */
export function isMultiUserSettingError(
  setting: MultiUserSetting,
): setting is MultiUserSettingError {
  return 'error' in setting;
}
