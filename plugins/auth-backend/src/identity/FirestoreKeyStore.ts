/*
 * Copyright 2021 The Backstage Authors
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

import { LoggerService } from '@backstage/backend-plugin-api';
import {
  DocumentData,
  Firestore,
  QuerySnapshot,
  Settings,
  WriteResult,
} from '@google-cloud/firestore';

import { toError } from '@backstage/errors';
import { AnyJWK, KeyStore, StoredKey } from './types';

export type FirestoreKeyStoreSettings = Settings & Options;

type Options = {
  path?: string;
  timeout?: number;
};

export const DEFAULT_TIMEOUT_MS = 10000;
export const DEFAULT_DOCUMENT_PATH = 'sessions';

export class FirestoreKeyStore implements KeyStore {
  static async create(
    settings?: FirestoreKeyStoreSettings,
  ): Promise<FirestoreKeyStore> {
    const { path, timeout, ...firestoreSettings } = settings ?? {};
    const database = new Firestore(firestoreSettings);

    return new FirestoreKeyStore(
      database,
      path ?? DEFAULT_DOCUMENT_PATH,
      timeout ?? DEFAULT_TIMEOUT_MS,
    );
  }

  private readonly database: Firestore;
  private readonly path: string;
  private readonly timeout: number;

  private constructor(database: Firestore, path: string, timeout: number) {
    this.database = database;
    this.path = path;
    this.timeout = timeout;
  }

  static async verifyConnection(
    keyStore: FirestoreKeyStore,
    logger?: LoggerService,
  ): Promise<void> {
    try {
      await keyStore.verify();
    } catch (error) {
      const err = toError(error);
      if (process.env.NODE_ENV !== 'development') {
        throw new Error(`Failed to connect to database: ${err.message}`);
      }
      logger?.warn(`Failed to connect to database: ${err.message}`);
    }
  }

  async addKey(key: AnyJWK): Promise<void> {
    await this.withTimeout<WriteResult>(
      this.database.collection(this.path).doc(key.kid).set({
        kid: key.kid,
        key: key,
      }),
    );
  }

  async listKeys(): Promise<{ items: StoredKey[] }> {
    const keys = await this.withTimeout<QuerySnapshot<DocumentData>>(
      this.database.collection(this.path).get(),
    );

    return {
      items: keys.docs.map(doc => {
        const { key } = doc.data();

        return {
          createdAt: doc.createTime.toDate(),
          key: typeof key === 'string' ? JSON.parse(key) : key,
        };
      }),
    };
  }

  async removeKeys(kids: string[]): Promise<void> {
    if (kids.length === 0) {
      return;
    }

    // Firestore batched writes support up to 500 operations per batch
    const BATCH_SIZE = 500;
    for (let i = 0; i < kids.length; i += BATCH_SIZE) {
      const chunk = kids.slice(i, i + BATCH_SIZE);
      const batch = this.database.batch();
      for (const kid of chunk) {
        batch.delete(this.database.collection(this.path).doc(kid));
      }
      await this.withTimeout<WriteResult[]>(batch.commit());
    }
  }

  /**
   * Helper function to allow us to modify the timeout used when
   * performing Firestore database operations.
   *
   * The reason for this is that it seems that there's no other
   * practical solution to change the default timeout of 10mins
   * that Firestore has.
   *
   */
  private async withTimeout<T>(operation: Promise<T>): Promise<T> {
    const timer = new Promise<never>((_, reject) =>
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${this.timeout}ms`));
      }, this.timeout),
    );
    return Promise.race<T>([operation, timer]);
  }

  /**
   * Used to verify that the database is reachable.
   */
  private async verify(): Promise<void> {
    await this.withTimeout(this.database.collection(this.path).limit(1).get());
  }
}
