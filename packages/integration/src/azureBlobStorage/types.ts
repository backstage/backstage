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

import { TokenCredential } from '@azure/identity';
import {
  StorageSharedKeyCredential,
  AnonymousCredential,
} from '@azure/storage-blob';

/**
 * This allows implementations to be provided to retrieve Azure Storage accounts credentials.
 *
 * @public
 *
 */
export interface AzureCredentialsManager {
  getCredentials(
    accountName: string,
  ): Promise<
    TokenCredential | StorageSharedKeyCredential | AnonymousCredential
  >;
}
