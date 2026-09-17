/*
 * Copyright 2023 The Backstage Authors
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
 * The type of Azure DevOps credential, either bearer or pat.
 * @public
 */
export type AzureDevOpsCredentialType = 'bearer' | 'pat';

/**
 * A set of credentials for Azure DevOps.
 *
 * @public
 */
export type AzureDevOpsCredentials = {
  headers: { [name: string]: string };
  token: string;
  type: AzureDevOpsCredentialType;
};

/**
 * This allows implementations to be provided to retrieve Azure DevOps credentials.
 *
 * @public
 *
 */
export interface AzureDevOpsCredentialsProvider {
  getCredentials(opts: {
    url: string;
  }): Promise<AzureDevOpsCredentials | undefined>;
}
