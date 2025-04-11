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

import { ReaderFactory, ReadTreeResponseFactory } from './types';
import {
  UrlReaderService,
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchOptions,
  UrlReaderServiceSearchResponse,
} from '@backstage/backend-plugin-api';
import {
  AwsCredentialsManager,
  DefaultAwsCredentialsManager,
} from '@backstage/integration-aws-node';
import {
  AwsCodeCommitIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import {
  assertError,
  ForwardedError,
  NotModifiedError,
} from '@backstage/errors';
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
import {
  CodeCommitClient,
  GetFileCommand,
  GetFileCommandInput,
  GetFileCommandOutput,
  GetFolderCommand,
} from '@aws-sdk/client-codecommit';
import { AwsCredentialIdentityProvider } from '@aws-sdk/types';
import { Readable } from 'stream';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
import { relative } from 'path/posix';
import { AbortController } from '@aws-sdk/abort-controller';

export function parseUrl(
  url: string,
  requireGitPath: boolean = false,
): {
  path: string;
  repositoryName: string;
  region: string;
  commitSpecifier?: string;
} {
  const parsedUrl = new URL(url);

  if (parsedUrl.pathname.includes('/files/edit/')) {
    throw new Error(
      'Please provide the view url to yaml file from CodeCommit, not the edit url',
    );
  }
  if (requireGitPath && !parsedUrl.pathname.includes('/browse/')) {
    throw new Error('Please provide full path to yaml file from CodeCommit');
  }

  const hostMatch = parsedUrl.host.match(
    /^([^\.]+)\.console\.aws\.amazon\.com$/,
  );
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
    if (!requireGitPath) {
      const pathname = parsedUrl.pathname
        .split('/--/')[0]
        .replace('/codesuite/codecommit/repositories/', '');
      const [repositoryName, commitSpecifier] = pathname.split('/browse');

      return {
        region,
        repositoryName: repositoryName.replace(/^\/|\/$/g, ''),
        path: '/',
        commitSpecifier:
          commitSpecifier === ''
            ? undefined
            : commitSpecifier?.replace(/^\/|\/$/g, ''),
      };
    }
    throw new Error(
      `Invalid AWS CodeCommit URL (unexpected path format): ${url}`,
    );
  }
  const [, repositoryName, , commitSpecifier, path] = pathMatch;

  return {
    region,
    repositoryName,
    path,
    // the commitSpecifier is passed to AWS SDK which does not allow empty strings so replace empty string with undefined
    commitSpecifier: commitSpecifier === '' ? undefined : commitSpecifier,
  };
}

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for AWS CodeCommit.
 *
 * @public
 */
export class AwsCodeCommitUrlReader implements UrlReaderService {
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

    const codeCommit = new CodeCommitClient({
      customUserAgent: 'backstage-aws-codecommit-url-reader',
      region: region,
      credentials: credentials,
    });
    return codeCommit;
  }

  async readUrl(
    url: string,
    options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    // etag and lastModifiedAfter are not supported by the CodeCommit API
    try {
      const { path, repositoryName, region, commitSpecifier } = parseUrl(
        url,
        true,
      );
      const codeCommitClient = await this.buildCodeCommitClient(
        this.credsManager,
        region,
        this.integration,
      );
      const abortController = new AbortController();

      const input: GetFileCommandInput = {
        repositoryName: repositoryName,
        commitSpecifier: commitSpecifier,
        filePath: path,
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
        Readable.from([response?.fileContent]),
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

  async readTreePath(
    codeCommitClient: CodeCommitClient,
    abortSignal: any,
    path: string,
    repositoryName: string,
    commitSpecifier?: string,
    etag?: string,
  ): Promise<string[]> {
    const getFolderCommand = new GetFolderCommand({
      folderPath: path,
      repositoryName: repositoryName,
      commitSpecifier: commitSpecifier,
    });
    const response = await codeCommitClient.send(getFolderCommand, {
      abortSignal: abortSignal,
    });

    if (etag && etag === response.commitId) {
      throw new NotModifiedError();
    }

    const output: string[] = [];
    if (response.files) {
      response.files.forEach(file => {
        if (file.absolutePath) {
          output.push(file.absolutePath);
        }
      });
    }
    if (!response.subFolders) {
      return output;
    }

    for (const subFolder of response.subFolders) {
      if (subFolder.absolutePath) {
        output.push(
          ...(await this.readTreePath(
            codeCommitClient,
            abortSignal,
            subFolder.absolutePath,
            repositoryName,
            commitSpecifier,
            etag,
          )),
        );
      }
    }
    return output;
  }

  async readTree(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    // url: https://eu-west-1.console.aws.amazon.com/codesuite/codecommit/repositories/test-stijn-delete-techdocs/browse?region=eu-west-1
    try {
      const { path, repositoryName, region, commitSpecifier } = parseUrl(url);
      const codeCommitClient = await this.buildCodeCommitClient(
        this.credsManager,
        region,
        this.integration,
      );

      const abortController = new AbortController();
      options?.signal?.addEventListener('abort', () => abortController.abort());

      const allFiles: string[] = await this.readTreePath(
        codeCommitClient,
        abortController.signal,
        path,
        repositoryName,
        commitSpecifier,
        options?.etag,
      );
      const responses = [];

      for (let i = 0; i < allFiles.length; i++) {
        const getFileCommand = new GetFileCommand({
          repositoryName: repositoryName,
          filePath: String(allFiles[i]),
          commitSpecifier: commitSpecifier,
        });
        const response = await codeCommitClient.send(getFileCommand);
        const objectData = await Readable.from([response?.fileContent]);

        responses.push({
          data: objectData,
          path: relative(
            path.startsWith('/') ? path : `/${path}`,
            allFiles[i].startsWith('/') ? allFiles[i] : `/${allFiles[i]}`,
          ),
        });
      }

      return await this.deps.treeResponseFactory.fromReadableArray(responses);
    } catch (e) {
      if (e.name && e.name === 'NotModifiedError') {
        throw new NotModifiedError();
      }
      throw new ForwardedError(
        'Could not retrieve file tree from CodeCommit',
        e,
      );
    }
  }

  async search(
    url: string,
    options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    const { path } = parseUrl(url, true);

    if (path.match(/[*?]/)) {
      throw new Error('Unsupported search pattern URL');
    }

    try {
      const data = await this.readUrl(url, options);

      return {
        files: [
          {
            url: url,
            content: data.buffer,
            lastModifiedAt: data.lastModifiedAt,
          },
        ],
        etag: data.etag ?? '',
      };
    } catch (error) {
      assertError(error);
      if (error.name === 'NotFoundError') {
        return {
          files: [],
          etag: '',
        };
      }
      throw error;
    }
  }

  toString() {
    const secretAccessKey = this.integration.config.secretAccessKey;
    return `awsCodeCommit{host=${this.integration.config.host},authed=${Boolean(
      secretAccessKey,
    )}}`;
  }
}
