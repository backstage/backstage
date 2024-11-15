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
export interface Config {
  deviceAuth?: {
    /**
     * The interval in seconds at which to instruct the client
     * device to poll for tokens
     */
    initialInterval: number;

    /**
     * The expiration time in seconds for device codes
     */
    deviceCodeExpiration: number;

    /**
     * The URL path to the user code authentication endpoint. Used to generate
     * the validation_uri. Should match the path set for the DeviceAuthPage
     * component in the packages/app/src/App.tsx file.
     */

    userCodeAuthUrlPath: string;
  };
}
