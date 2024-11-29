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
  DEFAULT_DOCUMENT_PATH,
  DEFAULT_TIMEOUT_MS,
  FirestoreKeyStore,
  FirestoreKeyStoreSettings,
} from './FirestoreKeyStore';
import { AnyJWK } from './types';

const data = jest
  .fn()
  .mockReturnValue({ key: { kid: 'something' }, kid: 'something' });
const toDate = jest.fn().mockReturnValue('date');
const get = jest.fn().mockReturnValue({
  docs: [{ data, createTime: { toDate } }],
});
const set = jest.fn();

const firestoreMock = {
  limit: jest.fn().mockReturnThis(),
  collection: jest.fn().mockReturnThis(),
  delete: jest.fn(),
  doc: jest.fn().mockReturnThis(),
  set,
  get,
};

jest.mock('@google-cloud/firestore', () => ({
  Firestore: jest.fn().mockImplementation(() => firestoreMock),
}));

jest.useFakeTimers({ legacyFakeTimers: true });

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
  const timeout = 10;
  const firestoreSettings = {
    ...settings,
    path,
    timeout,
  } as FirestoreKeyStoreSettings;

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

  it('can verify that is has a connection to the database', async () => {
    const keyStore = await FirestoreKeyStore.create();

    await expect(
      FirestoreKeyStore.verifyConnection(keyStore),
    ).resolves.not.toThrow();
  });

  it('can verify that it can not connect to the database', async () => {
    const keyStore = await FirestoreKeyStore.create();
    firestoreMock.get = jest.fn().mockRejectedValue(new Error());

    await expect(
      FirestoreKeyStore.verifyConnection(keyStore),
    ).rejects.toThrow();

    firestoreMock.get = get;
  });

  it('can use a default timeout and path', async () => {
    const keyStore = await FirestoreKeyStore.create();
    await keyStore.addKey(key);

    expect(setTimeout).toHaveBeenCalledWith(
      expect.any(Function),
      DEFAULT_TIMEOUT_MS,
    );
    expect(firestoreMock.collection).toHaveBeenCalledWith(
      DEFAULT_DOCUMENT_PATH,
    );
  });

  it('can handle a timeout', async () => {
    firestoreMock.set = jest
      .fn()
      .mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 20)),
      );
    const keyStore = await FirestoreKeyStore.create(firestoreSettings);
    const add = keyStore.addKey(key);

    jest.advanceTimersByTime(50);

    await expect(add).rejects.toEqual(
      new Error(`Operation timed out after ${timeout}ms`),
    );

    firestoreMock.set = set;
  });

  it('can add keys', async () => {
    const keyStore = await FirestoreKeyStore.create(firestoreSettings);
    await keyStore.addKey(key);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(firestoreMock.collection).toHaveBeenCalledWith(path);
    expect(firestoreMock.doc).toHaveBeenCalledWith(key.kid);
    expect(firestoreMock.set).toHaveBeenCalledWith({
      kid: key.kid,
      key,
    });
  });

  it('can delete a single key', async () => {
    const keyStore = await FirestoreKeyStore.create(firestoreSettings);
    await keyStore.removeKeys(['123']);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(firestoreMock.collection).toHaveBeenCalledWith(path);
    expect(firestoreMock.doc).toHaveBeenCalledWith('123');
    expect(firestoreMock.delete).toHaveBeenCalledTimes(1);
  });

  it('can delete a multiple keys', async () => {
    const keyStore = await FirestoreKeyStore.create(firestoreSettings);
    await keyStore.removeKeys(['123', '456']);

    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(firestoreMock.collection).toHaveBeenCalledWith(path);
    expect(firestoreMock.doc).toHaveBeenCalledWith('123');
    expect(firestoreMock.doc).toHaveBeenCalledWith('456');
    expect(firestoreMock.delete).toHaveBeenCalledTimes(2);
  });

  it('can list keys', async () => {
    const keyStore = await FirestoreKeyStore.create(firestoreSettings);
    const items = await keyStore.listKeys();

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(firestoreMock.collection).toHaveBeenCalledWith(path);
    expect(firestoreMock.get).toHaveBeenCalledTimes(1);
    expect(data).toHaveBeenCalledTimes(1);
    expect(toDate).toHaveBeenCalledTimes(1);
    expect(items).toMatchObject({
      items: [{ key: { kid: 'something' }, createdAt: 'date' }],
    });
  });

  it('supports older string versions of the keys', async () => {
    data.mockReturnValue({
      key: JSON.stringify({ kid: 'something' }),
      kid: 'something',
    });

    const keyStore = await FirestoreKeyStore.create(firestoreSettings);
    const items = await keyStore.listKeys();

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(firestoreMock.collection).toHaveBeenCalledWith(path);
    expect(firestoreMock.get).toHaveBeenCalledTimes(1);
    expect(data).toHaveBeenCalledTimes(1);
    expect(toDate).toHaveBeenCalledTimes(1);
    expect(items).toMatchObject({
      items: [{ key: { kid: 'something' }, createdAt: 'date' }],
    });
  });
});
