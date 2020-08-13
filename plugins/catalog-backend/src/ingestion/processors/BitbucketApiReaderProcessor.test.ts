/*
 * Copyright 2020 Spotify AB
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

import { BitbucketApiReaderProcessor } from './BitbucketApiReaderProcessor';

describe('BitbucketApiReaderProcessor', () => {
  it('should build raw api', () => {
    const processor = new BitbucketApiReaderProcessor();

    const tests = [
      {
        target:
          'https://bitbucket.org/mustansaranwar/backstage/src/master/templates/java-dropwizard-microservice.yaml',
        url: new URL(
          'https://api.bitbucket.org/2.0/repositories/mustansaranwar/backstage/src/master/templates//java-dropwizard-microservice.yaml',
        ),
        err: undefined,
      },
      {
        target: 'https://api.com/a/b/blob/master/path/to/c.yaml',
        url: null,
        err:
          'Incorrect url: https://api.com/a/b/blob/master/path/to/c.yaml, Error: Wrong Bitbucket URL or Invalid file path',
      },
      {
        target: 'com/a/b/blob/master/path/to/c.yaml',
        url: null,
        err:
          'Incorrect url: com/a/b/blob/master/path/to/c.yaml, TypeError: Invalid URL: com/a/b/blob/master/path/to/c.yaml',
      },
    ];

    for (const test of tests) {
      if (test.err) {
        expect(() => processor.buildRawUrl(test.target)).toThrowError(test.err);
      } else {
        expect(processor.buildRawUrl(test.target)).toEqual(test.url);
      }
    }
  });

  it('should return request options', () => {
    const tests = [
      {
        username: '',
        password: '',
        expect: {
          headers: {},
        },
      },
      {
        username: 'only-user-provided',
        password: '',
        expect: {
          headers: {},
        },
      },
      {
        username: '',
        password: 'only-password-provided',
        expect: {
          headers: {},
        },
      },
      {
        username: 'some-user',
        password: 'my-secret',
        expect: {
          headers: {
            Authorization: 'Basic c29tZS11c2VyOm15LXNlY3JldA==',
          },
        },
      },
    ];

    for (const test of tests) {
      process.env.BITBUCKET_USERNAME = test.username;
      process.env.BITBUCKET_PASSWORD = test.password;
      const processor = new BitbucketApiReaderProcessor();
      expect(processor.getRequestOptions()).toEqual(test.expect);
    }
  });
});
