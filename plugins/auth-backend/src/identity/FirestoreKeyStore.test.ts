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

import { Firestore } from '@google-cloud/firestore';

import {
  FirestoreKeyStore,
  FirestoreKeyStoreSettings,
} from './FirestoreKeyStore';
import { AnyJWK } from './types';

const data = jest.fn().mockReturnValue('data');
const toDate = jest.fn().mockReturnValue('date');

const firestoreMock = {
  collection: jest.fn().mockReturnThis(),
  delete: jest.fn(),
  doc: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnValue({
    docs: [{ data, createTime: { toDate } }],
  }),
  set: jest.fn(),
};

jest.mock('@google-cloud/firestore', () => ({
  Firestore: jest.fn().mockImplementation(() => firestoreMock),
}));

describe('FirestoreKeyStore', () => {
  const key = {
    kid: '123',
    use: 'sig',
    kty: 'plain',
    alg: 'Base64',
  } as AnyJWK;

  const settings = {
    projectId: 'my-project',
    host: 'my-host',
    port: 8080,
    ssl: false,
    keyFilename: 'cred.json',
  };
  const path = 'my-path';
  const firestoreSettings = { ...settings, path } as FirestoreKeyStoreSettings;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can create an instance without settings', async () => {
    const keyStore = await FirestoreKeyStore.create();

    expect(keyStore).toBeInstanceOf(FirestoreKeyStore);
    expect(Firestore).toHaveBeenCalledWith({});
  });

  it('can create an instance with settings', async () => {
    await FirestoreKeyStore.create(firestoreSettings);

    expect(Firestore).toHaveBeenCalledWith(settings);
  });

  it('can use a default path', async () => {
    const keyStore = await FirestoreKeyStore.create();
    await keyStore.addKey(key);

    expect(firestoreMock.collection).toBeCalledWith('sessions');
  });

  it('can add keys', async () => {
    const keyStore = await FirestoreKeyStore.create(firestoreSettings);
    await keyStore.addKey(key);

    expect(firestoreMock.collection).toBeCalledWith(path);
    expect(firestoreMock.doc).toBeCalledWith(key.kid);
    expect(firestoreMock.set).toHaveBeenCalledWith({
      kid: key.kid,
      key: JSON.stringify(key),
    });
  });

  it('can delete a single key', async () => {
    const keyStore = await FirestoreKeyStore.create(firestoreSettings);
    await keyStore.removeKeys(['123']);

    expect(firestoreMock.collection).toBeCalledWith(path);
    expect(firestoreMock.doc).toBeCalledWith('123');
    expect(firestoreMock.delete).toBeCalledTimes(1);
  });

  it('can delete a multiple keys', async () => {
    const keyStore = await FirestoreKeyStore.create(firestoreSettings);
    await keyStore.removeKeys(['123', '456']);

    expect(firestoreMock.collection).toBeCalledWith(path);
    expect(firestoreMock.doc).toBeCalledWith('123');
    expect(firestoreMock.doc).toBeCalledWith('456');
    expect(firestoreMock.delete).toBeCalledTimes(2);
  });

  it('can list keys', async () => {
    const keyStore = await FirestoreKeyStore.create(firestoreSettings);
    const items = await keyStore.listKeys();

    expect(firestoreMock.collection).toBeCalledWith(path);
    expect(firestoreMock.get).toBeCalledTimes(1);
    expect(data).toBeCalledTimes(1);
    expect(toDate).toBeCalledTimes(1);
    expect(items).toMatchObject({
      items: [{ key: 'data', createdAt: 'date' }],
    });
  });
});
