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

import { Config } from '@backstage/config';

/**
 * The Kubernetes auth method parameters needed for the vault-backend plugin
 * to login.
 *
 * @public
 */
export interface VaultKubernetesAuthConfig {
  type: 'kubernetes';
  /**
   * The role used to login to Vault.
   */
  role: string;

  /**
   * The authPath used to login to Vault. If not set, it defaults to 'kubernetes'.
   */
  authPath?: string;

  /**
   * The path where the service account token is. If not set,
   * it defaults to '/var/run/secrets/kubernetes.io/serviceaccount/token'.
   */
  serviceAccountTokenPath?: string;
}

/**
 * The configuration needed for the vault-backend plugin
 *
 * @public
 */
export interface VaultConfig {
  /**
   * The baseUrl for your Vault instance.
   */
  baseUrl: string;

  /**
   * The publicUrl for your Vault instance (Optional).
   */
  publicUrl?: string;

  /**
   * The credentials used to login to Vault. They can be a raw token
   * or the Kubernetes
   */
  token: string | VaultKubernetesAuthConfig;

  /**
   * The secret engine name where in vault. Defaults to `secrets`.
   */
  secretEngine: string;

  /**
   * The version of the K/V API. Defaults to `2`.
   */
  kvVersion: number;
}

/**
 * Extract the Vault config from a config object
 *
 * @public
 *
 * @param config - The config object to extract from
 */
export function getVaultConfig(config: Config): VaultConfig {
  return {
    baseUrl: config.getString('vault.baseUrl'),
    publicUrl: config.getOptionalString('vault.publicUrl'),
    token: config.get<string | VaultKubernetesAuthConfig>('vault.token'),
    kvVersion: config.getOptionalNumber('vault.kvVersion') ?? 2,
    secretEngine: config.getOptionalString('vault.secretEngine') ?? 'secrets',
  };
}
