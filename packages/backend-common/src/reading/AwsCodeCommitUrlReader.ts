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

import {
  ReaderFactory,
  ReadTreeOptions,
  ReadTreeResponse,
  ReadTreeResponseFactory,
  ReadUrlOptions,
  ReadUrlResponse,
  SearchResponse,
  UrlReader,
} from './types';
import {
  AwsCredentialsManager,
  DefaultAwsCredentialsManager,
} from '@backstage/integration-aws-node';
import {
  AwsCodeCommitIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import { ForwardedError, NotModifiedError } from '@backstage/errors';
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
import {
  CodeCommitClient,
  GetFileCommand,
  GetFileCommandInput,
  GetFileCommandOutput,
} from '@aws-sdk/client-codecommit';
import { AwsCredentialIdentityProvider } from '@aws-sdk/types';
import { Readable } from 'stream';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';

export function parseUrl(url: string): {
  filePath: string;
  repositoryName: string;
  region: string;
  commitSpecifier: string;
} {
  const parsedUrl = new URL(url);

  const hostMatch = parsedUrl.host.match(/^([^\.]+).console.aws.amazon.com$/);
  if (!hostMatch) {
    throw new Error(
      `Invalid AWS CodeCommit URL (unexpected host format): ${url}`,
    );
  }
  const [, region] = hostMatch;

  const pathMatch = parsedUrl.pathname.match(
    /^\/codesuite\/codecommit\/repositories\/([^\/]+)\/browse\/((.*)\/)?--\/(.*)$/,
  );
  if (!pathMatch) {
    if (!parsedUrl.pathname.includes('/browse/')) {
      if (parsedUrl.pathname.includes('/files/edit/')) {
        throw new Error(
          'Please provide the view path to yaml file from CodeCommit, not the edit path',
        );
      } else {
        throw new Error(
          'Please provide full path to yaml file from CodeCommit',
        );
      }
    }
    throw new Error(
      `Invalid AWS CodeCommit URL (unexpected path format): ${url}`,
    );
  }
  const [, repositoryName, , commitSpecifier, filePath] = pathMatch;

  return {
    region,
    repositoryName,
    filePath,
    commitSpecifier: commitSpecifier || `refs/heads/main`,
  };
}

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for AWS S3 buckets.
 *
 * @public
 */
export class AwsCodeCommitUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    const credsManager = DefaultAwsCredentialsManager.fromConfig(config);

    return integrations.awsCodeCommit.list().map(integration => {
      const reader = new AwsCodeCommitUrlReader(credsManager, integration, {
        treeResponseFactory,
      });
      const predicate = (url: URL) => {
        return (
          url.host.endsWith(integration.config.host) &&
          url.pathname.startsWith('/codesuite/codecommit')
        );
      };

      return { reader, predicate };
    });
  };

  constructor(
    private readonly credsManager: AwsCredentialsManager,
    private readonly integration: AwsCodeCommitIntegration,
    // TODO: Delete
    // @ts-ignore
    private readonly deps: {
      treeResponseFactory: ReadTreeResponseFactory;
    },
  ) {}

  /**
   * If accessKeyId and secretAccessKey are missing, the standard credentials provider chain will be used:
   * https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html
   */
  private static buildStaticCredentials(
    accessKeyId: string,
    secretAccessKey: string,
  ): AwsCredentialIdentityProvider {
    return async () => {
      return {
        accessKeyId,
        secretAccessKey,
      };
    };
  }

  private static async buildCredentials(
    credsManager: AwsCredentialsManager,
    region: string,
    integration?: AwsCodeCommitIntegration,
  ): Promise<AwsCredentialIdentityProvider> {
    // Fall back to the default credential chain if neither account ID
    // nor explicit credentials are provided
    if (!integration) {
      return (await credsManager.getCredentialProvider()).sdkCredentialProvider;
    }

    const accessKeyId = integration.config.accessKeyId;
    const secretAccessKey = integration.config.secretAccessKey;
    let explicitCredentials: AwsCredentialIdentityProvider;
    if (accessKeyId && secretAccessKey) {
      explicitCredentials = AwsCodeCommitUrlReader.buildStaticCredentials(
        accessKeyId,
        secretAccessKey,
      );
    } else {
      explicitCredentials = (await credsManager.getCredentialProvider())
        .sdkCredentialProvider;
    }

    const roleArn = integration.config.roleArn;
    if (roleArn) {
      return fromTemporaryCredentials({
        masterCredentials: explicitCredentials,
        params: {
          RoleSessionName: 'backstage-aws-code-commit-url-reader',
          RoleArn: roleArn,
          ExternalId: integration.config.externalId,
        },
        clientConfig: { region },
      });
    }

    return explicitCredentials;
  }

  private async buildCodeCommitClient(
    credsManager: AwsCredentialsManager,
    region: string,
    integration: AwsCodeCommitIntegration,
  ): Promise<CodeCommitClient> {
    const credentials = await AwsCodeCommitUrlReader.buildCredentials(
      credsManager,
      region,
      integration,
    );

    const s3 = new CodeCommitClient({
      region: region,
      credentials: credentials,
    });
    return s3;
  }

  async readUrl(
    url: string,
    options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    // etag and lastModifiedAfter are not supported by the CodeCommit API
    try {
      const { filePath, repositoryName, region, commitSpecifier } =
        parseUrl(url);
      const codeCommitClient = await this.buildCodeCommitClient(
        this.credsManager,
        region,
        this.integration,
      );
      const abortController = new AbortController();

      const input: GetFileCommandInput = {
        repositoryName: repositoryName,
        commitSpecifier: commitSpecifier,
        filePath: filePath,
      };

      options?.signal?.addEventListener('abort', () => abortController.abort());
      const getObjectCommand = new GetFileCommand(input);
      const response: GetFileCommandOutput = await codeCommitClient.send(
        getObjectCommand,
        {
          abortSignal: abortController.signal,
        },
      );

      if (options?.etag && options.etag === response.commitId) {
        throw new NotModifiedError();
      }

      return ReadUrlResponseFactory.fromReadable(
        Readable.from([response?.fileContent] || []),
        {
          etag: response.commitId,
        },
      );
    } catch (e) {
      if (e.$metadata && e.$metadata.httpStatusCode === 304) {
        throw new NotModifiedError();
      }
      if (e.name && e.name === 'NotModifiedError') {
        throw new NotModifiedError();
      }

      throw new ForwardedError('Could not retrieve file from CodeCommit', e);
    }
  }

  async readTree(
    // TODO: Delete
    // @ts-ignore
    url: string,
    // TODO: Delete
    // @ts-ignore
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    // TODO: Implement
    throw new Error('AwsCodeCommitReader does not implement readTree');
  }

  async search(): Promise<SearchResponse> {
    // TODO: Implement
    throw new Error('AwsCodeCommitReader does not implement search');
  }

  toString() {
    const secretAccessKey = this.integration.config.secretAccessKey;
    return `awsCodeCommit{host=${this.integration.config.host},authed=${Boolean(
      secretAccessKey,
    )}}`;
  }
}
