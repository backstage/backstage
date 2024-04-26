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
 * Object containing the secret name and some links
 * @public
 */
export type VaultSecret = {
  name: string;
  path: string;
  showUrl: string;
  editUrl: string;
};

/**
 * Interface for the Vault API
 * @public
 */
export interface VaultApi {
  /**
   * Returns the URL to access the Vault UI with the defined config.
   */
  getFrontendSecretsUrl(): string;

  /**
   * Returns a list of secrets used to show in a table.
   * @param secretPath - The path where the secrets are stored in Vault
   * @param options - Additional options to be passed to the Vault API, allows to override vault default settings in app config file
   */
  listSecrets(
    secretPath: string,
    options?: {
      secretEngine?: string;
    },
  ): Promise<VaultSecret[]>;

  /**
   * Optional, to renew the token used to list the secrets. Throws an
   * error if the token renewal went wrong.
   */
  renewToken?(): Promise<void>;
}
