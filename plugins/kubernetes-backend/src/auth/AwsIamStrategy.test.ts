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
import { ConfigReader } from '@backstage/config';
import {
  ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE,
  ANNOTATION_KUBERNETES_AWS_CLUSTER_ID,
  ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID,
} from '@backstage/plugin-kubernetes-common';
import { AwsIamStrategy } from './AwsIamStrategy';

const credsManager = {
  getCredentialProvider: async () => ({
    sdkCredentialProvider: {
      AccessKeyId: 'asdf',
    },
  }),
};

jest.mock('@backstage/integration-aws-node', () => ({
  DefaultAwsCredentialsManager: {
    fromConfig: () => credsManager,
  },
}));

const signer = {
  presign: jest.fn().mockResolvedValue({
    hostname: 'https://example.com',
    query: {},
    path: '/asdf',
  }),
};

jest.mock('@aws-sdk/signature-v4', () => ({
  SignatureV4: jest.fn().mockImplementation(() => signer),
}));

const fromTemporaryCredentials = jest.fn();
jest.mock('@aws-sdk/credential-providers', () => ({
  fromTemporaryCredentials: (opts: any) => {
    return fromTemporaryCredentials(opts);
  },
}));

describe('AwsIamStrategy#getCredential', () => {
  const config = new ConfigReader({});

  it('returns a presigned url', async () => {
    const strategy = new AwsIamStrategy({ config });

    const credential = await strategy.getCredential({
      name: 'test-cluster',
      url: '',
      authMetadata: {},
    });

    expect(credential).toEqual({
      type: 'bearer token',
      token: 'k8s-aws-v1.aHR0cHM6Ly9odHRwczovL2V4YW1wbGUuY29tL2FzZGY_',
    });
    expect(signer.presign).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-k8s-aws-id': 'test-cluster' }),
      }),
      expect.anything(),
    );
  });

  it('returns a presigned url for specified cluster ID', async () => {
    const strategy = new AwsIamStrategy({ config });

    const credential = await strategy.getCredential({
      name: 'cluster-name',
      url: '',
      authMetadata: {
        [ANNOTATION_KUBERNETES_AWS_CLUSTER_ID]: 'other-name',
      },
    });

    expect(credential).toEqual({
      type: 'bearer token',
      token: 'k8s-aws-v1.aHR0cHM6Ly9odHRwczovL2V4YW1wbGUuY29tL2FzZGY_',
    });
    expect(signer.presign).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-k8s-aws-id': 'other-name' }),
      }),
      expect.anything(),
    );
  });

  it('returns a presigned url for AWS credentials with assumed role', async () => {
    const strategy = new AwsIamStrategy({ config });

    const credential = await strategy.getCredential({
      name: 'test-cluster',
      url: '',
      authMetadata: {
        [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]: 'SomeRole',
      },
    });

    expect(credential).toEqual({
      type: 'bearer token',
      token: 'k8s-aws-v1.aHR0cHM6Ly9odHRwczovL2V4YW1wbGUuY29tL2FzZGY_',
    });
    expect(fromTemporaryCredentials).toHaveBeenCalledWith({
      clientConfig: {
        region: 'us-east-1',
      },
      masterCredentials: {
        AccessKeyId: 'asdf',
      },
      params: {
        ExternalId: undefined,
        RoleArn: 'SomeRole',
      },
    });
  });

  it('returns a presigned url for AWS credentials and passes the external id', async () => {
    const strategy = new AwsIamStrategy({ config });

    const credential = await strategy.getCredential({
      name: 'test-cluster',
      url: '',
      authMetadata: {
        [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]: 'SomeRole',
        [ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID]: 'external-id',
      },
    });
    expect(credential).toEqual({
      type: 'bearer token',
      token: 'k8s-aws-v1.aHR0cHM6Ly9odHRwczovL2V4YW1wbGUuY29tL2FzZGY_',
    });
    expect(fromTemporaryCredentials).toHaveBeenCalledWith({
      clientConfig: {
        region: 'us-east-1',
      },
      masterCredentials: {
        AccessKeyId: 'asdf',
      },
      params: {
        ExternalId: 'external-id',
        RoleArn: 'SomeRole',
      },
    });
  });

  it('fails on signer error', () => {
    signer.presign.mockRejectedValue(new Error('no way'));

    const strategy = new AwsIamStrategy({ config });

    return expect(
      strategy.getCredential({
        name: 'test-cluster',
        url: '',
        authMetadata: {},
      }),
    ).rejects.toThrow('no way');
  });
});
