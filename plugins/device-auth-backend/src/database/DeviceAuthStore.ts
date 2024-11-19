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

/**
 * An entry in the device auth store representing a device authorization flow attempt.
 */
export type DeviceAuthEntry = {
  userCode: string;
  clientId: string;
  deviceCode: string;
  accessToken?: string;
  isValidated: boolean;
  expiresAt: Date;
};

/**
 * Store definition for device authorization data.
 */
export interface DeviceAuthStore {
  getByUserCode(options: { userCode: string }): Promise<DeviceAuthEntry>;

  getByDeviceCode(options: { deviceCode: string }): Promise<DeviceAuthEntry>;

  create(options: {
    userCode: string;
    clientId: string;
    deviceCode: string;
    accessToken?: string;
    isValidated?: boolean;
    expiresAt: Date;
  }): Promise<void>;

  setValidated(options: {
    userCode: string;
    accessToken: string;
  }): Promise<void>;

  deleteByUserCode(options: { userCode: string }): Promise<void>;

  deleteByDeviceCode(options: { deviceCode: string }): Promise<void>;
}
