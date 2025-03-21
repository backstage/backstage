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

import { Config } from '@backstage/config';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';
import { promises as fs } from 'fs';
import { JWK, exportJWK, importPKCS8, importSPKI } from 'jose';
import { KeyLike } from 'jose';
import { KeyPayload } from './types';
import { PluginKeySource } from './types';

export type KeyPair = {
  publicKey: JWK;
  privateKey?: JWK;
  keyId: string;
};

export type StaticKeyConfig = {
  publicKeyFile: string;
  privateKeyFile?: string;
  keyId: string;
  algorithm: string;
};

const DEFAULT_ALGORITHM = 'ES256';

const SECONDS_IN_MS = 1000;

/**
 * Key source that loads predefined public/private key pairs from disk.
 *
 * The private key should be represented using the PKCS#8 format,
 * while the public key should be in the SPKI format.
 *
 * @remarks
 *
 * You can generate a public and private key pair, using
 * openssl:
 *
 * Generate a private key using the ES256 algorithm
 * ```sh
 * openssl ecparam -name prime256v1 -genkey -out private.ec.key
 * ```
 * Convert it to PKCS#8 format
 * ```sh
 * openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private.ec.key -out private.key
 * ```
 * Extract the public key
 * ```sh
 * openssl ec -inform PEM -outform PEM -pubout -in private.key -out public.key
 * ```
 *
 * Provide the paths to private.key and public.key as the respective
 * private and public key paths in the `create` method.
 */
export class StaticConfigPluginKeySource implements PluginKeySource {
  private constructor(
    private readonly keyPairs: KeyPair[],
    private readonly keyDurationSeconds: number,
  ) {}

  public static async create(options: {
    sourceConfig: Config;
    keyDuration: HumanDuration;
  }): Promise<PluginKeySource> {
    const keyConfigs = options.sourceConfig
      .getConfigArray('static.keys')
      .map(c => {
        const staticKeyConfig: StaticKeyConfig = {
          publicKeyFile: c.getString('publicKeyFile'),
          privateKeyFile: c.getOptionalString('privateKeyFile'),
          keyId: c.getString('keyId'),
          algorithm: c.getOptionalString('algorithm') ?? DEFAULT_ALGORITHM,
        };

        return staticKeyConfig;
      });

    const keyPairs = await Promise.all(
      keyConfigs.map(async k => await this.loadKeyPair(k)),
    );

    if (keyPairs.length < 1) {
      throw new Error(
        'At least one key pair must be provided in static.keys, when the static key store type is used',
      );
    } else if (!keyPairs[0].privateKey) {
      throw new Error(
        'Private key for signing must be provided in the first key pair in static.keys, when the static key store type is used',
      );
    }

    return new StaticConfigPluginKeySource(
      keyPairs,
      durationToMilliseconds(options.keyDuration) / SECONDS_IN_MS,
    );
  }

  async getPrivateSigningKey(): Promise<JWK> {
    return this.keyPairs[0].privateKey!;
  }

  async listKeys(): Promise<{ keys: KeyPayload[] }> {
    const keys = this.keyPairs.map(k => this.keyPairToStoredKey(k));
    return { keys };
  }

  private static async loadKeyPair(options: StaticKeyConfig): Promise<KeyPair> {
    const algorithm = options.algorithm;
    const keyId = options.keyId;
    const publicKey = await this.loadPublicKeyFromFile(
      options.publicKeyFile,
      keyId,
      algorithm,
    );
    const privateKey = options.privateKeyFile
      ? await this.loadPrivateKeyFromFile(
          options.privateKeyFile,
          keyId,
          algorithm,
        )
      : undefined;

    return { publicKey, privateKey, keyId };
  }

  private static async loadPublicKeyFromFile(
    path: string,
    keyId: string,
    algorithm: string,
  ): Promise<JWK> {
    return this.loadKeyFromFile(path, keyId, algorithm, importSPKI);
  }

  private static async loadPrivateKeyFromFile(
    path: string,
    keyId: string,
    algorithm: string,
  ): Promise<JWK> {
    return this.loadKeyFromFile(path, keyId, algorithm, importPKCS8);
  }

  private static async loadKeyFromFile(
    path: string,
    keyId: string,
    algorithm: string,
    importer: (content: string, algorithm: string) => Promise<KeyLike>,
  ): Promise<JWK> {
    const content = await fs.readFile(path, { encoding: 'utf8', flag: 'r' });
    const key = await importer(content, algorithm);
    const jwk = await exportJWK(key);
    jwk.kid = keyId;
    jwk.alg = algorithm;

    return jwk;
  }

  private keyPairToStoredKey(keyPair: KeyPair): KeyPayload {
    const publicKey = {
      ...keyPair.publicKey,
      kid: keyPair.keyId,
    };

    return {
      key: publicKey,
      id: keyPair.keyId,
      expiresAt: new Date(Date.now() + this.keyDurationSeconds * SECONDS_IN_MS),
    };
  }
}
