/*
 * Copyright 2020 The Backstage Authors
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
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { AwsIamKubernetesAuthTranslator } from './AwsIamKubernetesAuthTranslator';

describe('AwsIamKubernetesAuthTranslator tests', () => {
  let role: any = undefined;
  const credentials: any = {
    accessKeyId: 'bloop',
    secretAccessKey: 'omg-so-secret',
    sessionToken: 'token',
  };

  let assumeResponse: any = {
    Credentials: {
      AccessKeyId: credentials.accessKeyId,
      SecretAccessKey: credentials.secretAccessKey,
      SessionToken: credentials.sessionToken,
    },
  };

  let mockedCredentials: any = undefined;

  AWS.config.credentials = new AWS.Credentials(credentials);

  AWSMock.setSDKInstance(AWS);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  function executeTranslation() {
    AWSMock.mock('STS', 'assumeRole', (_params: any, callback: Function) => {
      callback(null, assumeResponse);
    });

    const authTranslator = new AwsIamKubernetesAuthTranslator();

    if (mockedCredentials) {
      jest
        .spyOn(authTranslator, 'awsGetCredentials')
        .mockImplementation(async () => mockedCredentials);
    }

    const response = authTranslator.decorateClusterDetailsWithAuth({
      assumeRole: role,
      name: 'test-cluster',
      url: '',
      authProvider: 'aws',
    });

    mockedCredentials = undefined;

    return response;
  }

  it('returns a signed url for AWS credentials', async () => {
    // These credentials are not real.
    // Pulled from example in docs: https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html
    AWS.config.credentials = new AWS.Credentials(
      'AKIAIOSFODNN7EXAMPLE',
      'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    );

    const response = await executeTranslation();
    expect(response.serviceAccountToken).toBeDefined();
  });

  describe('When the role is assumed', () => {
    // These credentials are not real.
    // Pulled from example in docs: https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html
    AWS.config.credentials = new AWS.Credentials(
      'AKIAIOSFODNN7EXAMPLE',
      'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    );
    role = 'SomeRole';

    describe('When the role is valid', () => {
      it('returns a signed url for AWS credentials', async () => {
        const response = await executeTranslation();
        expect(response.serviceAccountToken).toBeDefined();
      });
    });

    describe('When the role is invalid', () => {
      it('returns the original AWS credentials', async () => {
        assumeResponse = undefined;
        await expect(executeTranslation()).rejects.toThrow(
          /Unable to assume role:/,
        );
      });
    });
  });

  describe('When no AWS creds are available', () => {
    it('throws unable to get AWS credentials', async () => {
      mockedCredentials = new Error();
      await expect(executeTranslation()).rejects.toThrow(
        'No AWS credentials found.',
      );
    });
  });

  describe('When invalid AWS creds are available', () => {
    it('throws credentials are invalid to get AWS credentials', async () => {
      const undefinedSecret: any = undefined;
      AWS.config.credentials = new AWS.Credentials(
        'AKIAIOSFODNN7EXAMPLE',
        undefinedSecret,
      );
      await expect(executeTranslation()).rejects.toThrow(
        'Invalid AWS credentials found.',
      );
    });
  });
});
