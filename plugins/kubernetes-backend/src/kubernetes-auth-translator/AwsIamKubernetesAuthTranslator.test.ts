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
import { AwsIamKubernetesAuthTranslator } from './AwsIamKubernetesAuthTranslator';

let presign = jest.fn(async () => ({
  hostname: 'https://example.com',
  query: {},
  path: '/asdf',
}));

const fromEnv = jest.fn(() => {
  return {
    AccessId: 'asdf',
  };
});
const fromTemporaryCredentials = jest.fn();
jest.mock('@aws-sdk/signature-v4', () => ({
  SignatureV4: jest.fn().mockImplementation(() => ({
    presign,
  })),
}));

jest.mock('@aws-sdk/credential-providers', () => ({
  fromEnv: () => fromEnv(),
  fromTemporaryCredentials: (opts: any) => fromTemporaryCredentials(opts),
}));

describe('AwsIamKubernetesAuthTranslator tests', () => {
  beforeEach(() => {});
  it('returns a signed url for AWS credentials without assume role', async () => {
    const authTranslator = new AwsIamKubernetesAuthTranslator();

    const authPromise = authTranslator.decorateClusterDetailsWithAuth({
      name: 'test-cluster',
      url: '',
      authProvider: 'aws',
    });
    expect(fromEnv).toHaveBeenCalledWith();
    expect((await authPromise).serviceAccountToken).toEqual(
      'k8s-aws-v1.aHR0cHM6Ly9odHRwczovL2V4YW1wbGUuY29tL2FzZGY_',
    );
  });

  it('returns a signed url for AWS credentials with assume role', async () => {
    const authTranslator = new AwsIamKubernetesAuthTranslator();

    const authPromise = authTranslator.decorateClusterDetailsWithAuth({
      assumeRole: 'asdf',
      name: 'test-cluster',
      url: '',
      authProvider: 'aws',
    });
    expect(fromTemporaryCredentials).toHaveBeenCalledWith({
      clientConfig: {
        region: 'us-east-1',
      },
      masterCredentials: fromEnv(),
      params: {
        ExternalId: undefined,
        RoleArn: 'asdf',
      },
    });
    expect((await authPromise).serviceAccountToken).toEqual(
      'k8s-aws-v1.aHR0cHM6Ly9odHRwczovL2V4YW1wbGUuY29tL2FzZGY_',
    );
  });

  it('returns a signed url for AWS credentials and passes the external id', async () => {
    const authTranslator = new AwsIamKubernetesAuthTranslator();

    const authPromise = authTranslator.decorateClusterDetailsWithAuth({
      assumeRole: 'SomeRole',
      externalId: 'external-id',
      name: 'test-cluster',
      url: '',
      authProvider: 'aws',
    });
    expect(fromTemporaryCredentials).toHaveBeenCalledWith({
      clientConfig: {
        region: 'us-east-1',
      },
      masterCredentials: fromEnv(),
      params: {
        ExternalId: 'external-id',
        RoleArn: 'SomeRole',
      },
    });
    expect((await authPromise).serviceAccountToken).toEqual(
      'k8s-aws-v1.aHR0cHM6Ly9odHRwczovL2V4YW1wbGUuY29tL2FzZGY_',
    );
  });

  describe('When the credentials is failing', () => {
    beforeEach(() => {
      presign = jest.fn(async () => {
        throw new Error('no way');
      });
    });
    it('throws the right error', async () => {
      const authTranslator = new AwsIamKubernetesAuthTranslator();
      await expect(
        authTranslator.decorateClusterDetailsWithAuth({
          name: 'test-cluster',
          url: '',
          authProvider: 'aws',
        }),
      ).rejects.toThrow('no way');
    });
  });
});
