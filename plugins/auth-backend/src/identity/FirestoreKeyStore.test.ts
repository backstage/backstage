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

import { FirestoreKeyStore } from './FirestoreKeyStore';
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
  const OLD_ENV = process.env;
  const key = {
    kid: '123',
    use: 'sig',
    kty: 'plain',
    alg: 'Base64',
  } as AnyJWK;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('can create an instance without settings', () => {
    const keyStore = FirestoreKeyStore.create();

    expect(keyStore).toBeInstanceOf(FirestoreKeyStore);
  });

  it('can set the project id', async () => {
    FirestoreKeyStore.create({ projectId: 'my-project' });

    expect(Firestore).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'my-project',
      }),
    );
  });

  it('can handle keyfile file', async () => {
    FirestoreKeyStore.create({ keyFilename: 'keyFile.json' });

    expect(Firestore).toHaveBeenCalledWith(
      expect.objectContaining({
        keyFilename: 'keyFile.json',
      }),
    );
  });

  it('can use default google credentials', () => {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = 'cred.json';
    FirestoreKeyStore.create();

    expect(Firestore).toHaveBeenCalledWith(
      expect.objectContaining({
        keyFilename: 'cred.json',
      }),
    );
  });

  it('can uses a default path', async () => {
    const keyStore = FirestoreKeyStore.create();
    await keyStore.addKey(key);

    expect(firestoreMock.collection).toBeCalledWith('sessions');
  });

  it('can set the path', async () => {
    const keyStore = FirestoreKeyStore.create({
      path: 'my-path',
    });
    await keyStore.addKey(key);

    expect(firestoreMock.collection).toBeCalledWith('my-path');
  });

  it('can add keys', async () => {
    const keyStore = FirestoreKeyStore.create();
    await keyStore.addKey(key);

    expect(firestoreMock.collection).toBeCalledWith('sessions');
    expect(firestoreMock.doc).toBeCalledWith(key.kid);
    expect(firestoreMock.set).toHaveBeenCalledWith({
      kid: key.kid,
      key: JSON.stringify(key),
    });
  });

  it('can delete a single key', async () => {
    const keyStore = FirestoreKeyStore.create();
    await keyStore.removeKeys(['123']);

    expect(firestoreMock.collection).toBeCalledWith('sessions');
    expect(firestoreMock.doc).toBeCalledWith('123');
    expect(firestoreMock.delete).toBeCalledTimes(1);
  });

  it('can delete a multiple keys', async () => {
    const keyStore = FirestoreKeyStore.create();
    await keyStore.removeKeys(['123', '456']);

    expect(firestoreMock.collection).toBeCalledWith('sessions');
    expect(firestoreMock.doc).toBeCalledWith('123');
    expect(firestoreMock.doc).toBeCalledWith('456');
    expect(firestoreMock.delete).toBeCalledTimes(2);
  });

  it('can list keys', async () => {
    const keyStore = FirestoreKeyStore.create();
    const items = await keyStore.listKeys();

    expect(firestoreMock.collection).toBeCalledWith('sessions');
    expect(firestoreMock.get).toBeCalledTimes(1);
    expect(data).toBeCalledTimes(1);
    expect(toDate).toBeCalledTimes(1);
    expect(items).toMatchObject({
      items: [{ key: 'data', createdAt: 'date' }],
    });
  });
});
