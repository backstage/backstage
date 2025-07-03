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
import { AnyJWK, KeyStore, StoredKey } from './types';
import { exportJWK, importPKCS8, importSPKI, JWK } from 'jose';
import { KeyLike } from 'jose';
import { promises as fs } from 'fs';
import { Config } from '@backstage/config';

export type KeyPair = {
  publicKey: JWK;
  privateKey: JWK;
};

export type StaticKeyConfig = {
  publicKeyFile: string;
  privateKeyFile: string;
  keyId: string;
  algorithm: string;
};

const DEFAULT_ALGORITHM = 'ES256';

/**
 * Key store that loads predefined public/private key pairs from disk
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
 * private and public key paths in the StaticKeyStore.create(...) method.
 */
export class StaticKeyStore implements KeyStore {
  private readonly keyPairs: KeyPair[];
  private readonly createdAt: Date;

  private constructor(keyPairs: KeyPair[]) {
    if (keyPairs.length === 0) {
      throw new Error('Should provide at least one key pair');
    }

    this.keyPairs = keyPairs;
    this.createdAt = new Date();
  }

  public static async fromConfig(config: Config): Promise<StaticKeyStore> {
    const keyConfigs = config
      .getConfigArray('auth.keyStore.static.keys')
      .map(c => {
        const staticKeyConfig: StaticKeyConfig = {
          publicKeyFile: c.getString('publicKeyFile'),
          privateKeyFile: c.getString('privateKeyFile'),
          keyId: c.getString('keyId'),
          algorithm: c.getOptionalString('algorithm') ?? DEFAULT_ALGORITHM,
        };

        return staticKeyConfig;
      });

    const keyPairs = await Promise.all(
      keyConfigs.map(async k => await this.loadKeyPair(k)),
    );

    return new StaticKeyStore(keyPairs);
  }

  addKey(_key: AnyJWK): Promise<void> {
    throw new Error('Cannot add keys to the static key store');
  }

  listKeys(): Promise<{ items: StoredKey[] }> {
    const keys = this.keyPairs.map(k => this.keyPairToStoredKey(k));
    return Promise.resolve({ items: keys });
  }

  getPrivateKey(keyId: string): JWK {
    const keyPair = this.keyPairs.find(k => k.publicKey.kid === keyId);
    if (keyPair === undefined) {
      throw new Error(`Could not find key with keyId: ${keyId}`);
    }

    return keyPair.privateKey;
  }

  removeKeys(_kids: string[]): Promise<void> {
    throw new Error('Cannot remove keys from the static key store');
  }

  private keyPairToStoredKey(keyPair: KeyPair): StoredKey {
    const publicKey = {
      ...keyPair.publicKey,
      use: 'sig',
    };

    return {
      key: publicKey as AnyJWK,
      createdAt: this.createdAt,
    };
  }

  private static async loadKeyPair(options: StaticKeyConfig): Promise<KeyPair> {
    const algorithm = options.algorithm;
    const keyId = options.keyId;
    const publicKey = await this.loadPublicKeyFromFile(
      options.publicKeyFile,
      keyId,
      algorithm,
    );
    const privateKey = await this.loadPrivateKeyFromFile(
      options.privateKeyFile,
      keyId,
      algorithm,
    );

    return { publicKey, privateKey };
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
}
