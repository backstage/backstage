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
import { SignatureV4 } from '@smithy/signature-v4';
import {
  ANNOTATION_KUBERNETES_AWS_ACCOUNT_ID,
  ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE,
  ANNOTATION_KUBERNETES_AWS_CLUSTER_ID,
  ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID,
} from '@backstage/plugin-kubernetes-common';
import { AwsIamStrategy } from './AwsIamStrategy';

const credsManager = {
  getCredentialProvider: jest.fn().mockResolvedValue({
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

jest.mock('@smithy/signature-v4', () => ({
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

  beforeEach(() => {
    jest.clearAllMocks();
    credsManager.getCredentialProvider.mockResolvedValue({
      sdkCredentialProvider: {
        AccessKeyId: 'asdf',
      },
    });
  });

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

  it('uses account credentials directly without assuming another role', async () => {
    const strategy = new AwsIamStrategy({ config });
    const accountCredentials = { AccessKeyId: 'account-specific' };
    credsManager.getCredentialProvider.mockResolvedValue({
      sdkCredentialProvider: accountCredentials,
    });

    await strategy.getCredential({
      name: 'test-cluster',
      url: '',
      authMetadata: { [ANNOTATION_KUBERNETES_AWS_ACCOUNT_ID]: '123456789012' },
    });

    expect(credsManager.getCredentialProvider).toHaveBeenCalledWith({
      accountId: '123456789012',
    });
    expect(credsManager.getCredentialProvider).toHaveBeenCalledTimes(1);
    expect(fromTemporaryCredentials).not.toHaveBeenCalled();
    expect(SignatureV4).toHaveBeenCalledWith(
      expect.objectContaining({ credentials: accountCredentials }),
    );
    expect(signer.presign).toHaveBeenCalled();
  });

  it.each([false, true])(
    'propagates explicit account lookup errors without fallback (assume role: %s)',
    async assumeRole => {
      const strategy = new AwsIamStrategy({ config });
      const error = new Error(
        'There is no AWS integration that matches 123456789012',
      );
      credsManager.getCredentialProvider.mockRejectedValue(error);

      await expect(
        strategy.getCredential({
          name: 'test-cluster',
          url: '',
          authMetadata: {
            [ANNOTATION_KUBERNETES_AWS_ACCOUNT_ID]: '123456789012',
            ...(assumeRole
              ? {
                  [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]:
                    'arn:aws:iam::234567890123:role/ClusterAccess',
                }
              : {}),
          },
        }),
      ).rejects.toBe(error);

      expect(credsManager.getCredentialProvider).toHaveBeenCalledTimes(1);
      expect(credsManager.getCredentialProvider).toHaveBeenCalledWith({
        accountId: '123456789012',
      });
      expect(fromTemporaryCredentials).not.toHaveBeenCalled();
      expect(SignatureV4).not.toHaveBeenCalled();
      expect(signer.presign).not.toHaveBeenCalled();
    },
  );

  it.each([undefined, 'external-id'])(
    'uses account credentials to assume a separate cluster role (external ID: %s)',
    async externalId => {
      const strategy = new AwsIamStrategy({ config });
      const accountCredentials = { AccessKeyId: 'account-specific' };
      credsManager.getCredentialProvider.mockResolvedValue({
        sdkCredentialProvider: accountCredentials,
      });

      await strategy.getCredential({
        name: 'test-cluster',
        url: '',
        authMetadata: {
          [ANNOTATION_KUBERNETES_AWS_ACCOUNT_ID]: '123456789012',
          [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]:
            'arn:aws:iam::234567890123:role/ClusterAccess',
          ...(externalId
            ? { [ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID]: externalId }
            : {}),
        },
      });

      expect(credsManager.getCredentialProvider).toHaveBeenCalledWith({
        accountId: '123456789012',
      });
      expect(credsManager.getCredentialProvider).toHaveBeenCalledTimes(1);
      expect(fromTemporaryCredentials).toHaveBeenCalledWith({
        clientConfig: { region: 'us-east-1' },
        masterCredentials: accountCredentials,
        params: {
          ExternalId: externalId,
          RoleArn: 'arn:aws:iam::234567890123:role/ClusterAccess',
        },
      });
    },
  );

  it('returns a presigned url for AWS credentials with assumed role when no account config exists', async () => {
    const strategy = new AwsIamStrategy({ config });

    credsManager.getCredentialProvider.mockImplementation(
      async (opts?: any) => {
        if (opts?.arn) {
          throw new Error(
            'There is no AWS integration that matches the account',
          );
        }
        return { sdkCredentialProvider: { AccessKeyId: 'asdf' } };
      },
    );

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

  it('uses account-specific credentials as master credentials when account config exists for the assume role ARN', async () => {
    const strategy = new AwsIamStrategy({ config });

    const accountCreds = { AccessKeyId: 'account-specific' };
    credsManager.getCredentialProvider.mockImplementation(
      async (opts?: any) => {
        if (opts?.arn) {
          return {
            accountId: '123456789012',
            sdkCredentialProvider: accountCreds,
          };
        }
        return { sdkCredentialProvider: { AccessKeyId: 'asdf' } };
      },
    );

    const credential = await strategy.getCredential({
      name: 'test-cluster',
      url: '',
      authMetadata: {
        [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]:
          'arn:aws:iam::123456789012:role/MyRole',
      },
    });

    expect(credential).toEqual({
      type: 'bearer token',
      token: 'k8s-aws-v1.aHR0cHM6Ly9odHRwczovL2V4YW1wbGUuY29tL2FzZGY_',
    });
    expect(credsManager.getCredentialProvider).toHaveBeenCalledWith({
      arn: 'arn:aws:iam::123456789012:role/MyRole',
    });
    expect(fromTemporaryCredentials).toHaveBeenCalledWith({
      clientConfig: {
        region: 'us-east-1',
      },
      masterCredentials: accountCreds,
      params: {
        ExternalId: undefined,
        RoleArn: 'arn:aws:iam::123456789012:role/MyRole',
      },
    });
  });

  it('returns a presigned url for AWS credentials and passes the external id', async () => {
    const strategy = new AwsIamStrategy({ config });

    credsManager.getCredentialProvider.mockImplementation(
      async (opts?: any) => {
        if (opts?.arn) {
          throw new Error(
            'There is no AWS integration that matches the account',
          );
        }
        return { sdkCredentialProvider: { AccessKeyId: 'asdf' } };
      },
    );

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
