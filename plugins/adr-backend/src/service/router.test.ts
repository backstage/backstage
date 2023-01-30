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

import {
  CacheClient,
  ReadTreeResponse,
  ReadTreeResponseFile,
  ReadUrlResponse,
  UrlReader,
} from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { Logger } from 'winston';

const listEndpointName = '/list';
const fileEndpointName = '/file';

const makeBufferFromString = (string: string) => async () =>
  Buffer.from(string);

const testingUrlFakeFileTree: ReadTreeResponseFile[] = [
  {
    path: 'folder/testFile001.txt',
    content: makeBufferFromString('folder/testFile001.txt content'),
  },
  {
    path: 'testFile001.txt',
    content: makeBufferFromString('testFile002.txt content'),
  },
  {
    path: 'testFile002.txt',
    content: makeBufferFromString('testFile001.txt content'),
  },
];

const makeFileContent = async (fileContent: string) => {
  const result: ReadUrlResponse = {
    buffer: makeBufferFromString(fileContent),
  };
  return result;
};

const testFileOneContent = 'testFileOne content';
const testFileTwoContent = 'testFileTwo content';
const genericFileContent = 'file content';

const mockUrlReader: UrlReader = {
  readUrl(url: string) {
    switch (url) {
      case 'testFileOne':
        return makeFileContent(testFileOneContent);
      case 'testFileTwo':
        return makeFileContent(testFileTwoContent);
      default:
        return makeFileContent(genericFileContent);
    }
  },
  readTree() {
    const result: ReadTreeResponse = {
      files: async () => testingUrlFakeFileTree,
      archive() {
        throw new Error('Function not implemented.');
      },
      dir() {
        throw new Error('Function not implemented.');
      },
      etag: '',
    };

    const resultPromise = async () => result;
    return resultPromise();
  },
  search() {
    throw new Error('search not implemented.');
  },
};

class MockCacheClient implements CacheClient {
  private itemRegistry: { [key: string]: any };

  constructor() {
    this.itemRegistry = {};
  }

  async get(key: string) {
    return this.itemRegistry[key];
  }

  async set(key: string, value: any) {
    this.itemRegistry[key] = value;
  }

  async delete(key: string) {
    delete this.itemRegistry[key];
  }
}

describe('createRouter', () => {
  let app: express.Express;

  beforeEach(async () => {
    jest.resetAllMocks();

    const router = await createRouter({
      reader: mockUrlReader,
      cacheClient: new MockCacheClient(),
      logger: {
        error: (message: any) => message,
      } as Logger,
    });
    app = express().use(router);
  });

  describe(`GET ${listEndpointName}`, () => {
    it('returns bad request (400) when no url is provided', async () => {
      const urlNotSpecifiedRequest = await request(app).get(listEndpointName);
      const urlNotSpecifiedStatus = urlNotSpecifiedRequest.status;
      const urlNotSpecifiedMessage = urlNotSpecifiedRequest.body.message;

      const urlNotFilledRequest = await request(app).get(
        `${listEndpointName}?url=`,
      );
      const urlNotFilledStatus = urlNotFilledRequest.status;
      const urlNotFilledMessage = urlNotFilledRequest.body.message;

      const expectedStatusCode = 400;
      const expectedErrorMessage = 'No URL provided';

      expect(urlNotSpecifiedStatus).toBe(expectedStatusCode);
      expect(urlNotSpecifiedMessage).toBe(expectedErrorMessage);

      expect(urlNotFilledStatus).toBe(expectedStatusCode);
      expect(urlNotFilledMessage).toBe(expectedErrorMessage);
    });

    it('returns the correct listing when reading a url', async () => {
      const result = await request(app).get(`${listEndpointName}?url=testing`);
      const { status, body, error } = result;

      const expectedStatusCode = 200;
      const expectedBody = {
        data: [
          {
            type: 'file',
            name: 'testFile001.txt',
            path: 'folder/testFile001.txt',
          },
          {
            type: 'file',
            name: 'testFile001.txt',
            path: 'testFile001.txt',
          },
          {
            type: 'file',
            name: 'testFile002.txt',
            path: 'testFile002.txt',
          },
        ],
      };

      expect(error).toBeFalsy();
      expect(status).toBe(expectedStatusCode);
      expect(body).toEqual(expectedBody);
    });
  });

  describe(`GET ${fileEndpointName}`, () => {
    it('returns bad request (400) when no url is provided', async () => {
      const urlNotSpecifiedRequest = await request(app).get(fileEndpointName);
      const urlNotSpecifiedStatus = urlNotSpecifiedRequest.status;
      const urlNotSpecifiedMessage = urlNotSpecifiedRequest.body.message;

      const urlNotFilledRequest = await request(app).get(
        `${fileEndpointName}?url=`,
      );
      const urlNotFilledStatus = urlNotFilledRequest.status;
      const urlNotFilledMessage = urlNotFilledRequest.body.message;

      const expectedStatusCode = 400;
      const expectedErrorMessage = 'No URL provided';

      expect(urlNotSpecifiedStatus).toBe(expectedStatusCode);
      expect(urlNotSpecifiedMessage).toBe(expectedErrorMessage);

      expect(urlNotFilledStatus).toBe(expectedStatusCode);
      expect(urlNotFilledMessage).toBe(expectedErrorMessage);
    });

    it('returns the correct file contents when reading a url', async () => {
      const fileOneResponse = await request(app).get(
        `${fileEndpointName}?url=testFileOne`,
      );
      const fileOneStatus = fileOneResponse.status;
      const fileOneBody = fileOneResponse.body;
      const fileOneError = fileOneResponse.error;

      const fileTwoResponse = await request(app).get(
        `${fileEndpointName}?url=testFileTwo`,
      );
      const fileTwoStatus = fileTwoResponse.status;
      const fileTwoBody = fileTwoResponse.body;
      const fileTwoError = fileTwoResponse.error;

      const expectedStatusCode = 200;

      expect(fileOneError).toBeFalsy();
      expect(fileOneStatus).toBe(expectedStatusCode);
      expect(fileOneBody.data).toBe(testFileOneContent);

      expect(fileTwoError).toBeFalsy();
      expect(fileTwoStatus).toBe(expectedStatusCode);
      expect(fileTwoBody.data).toBe(testFileTwoContent);
    });
  });
});
