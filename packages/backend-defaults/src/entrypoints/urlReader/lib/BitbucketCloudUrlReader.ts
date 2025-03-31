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
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  LoggerService,
  UrlReaderService,
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceReadTreeResponse,
  // UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchOptions,
  UrlReaderServiceSearchResponse,
} from '@backstage/backend-plugin-api';
import {
  assertError,
  NotFoundError,
  NotModifiedError,
} from '@backstage/errors';
import {
  BitbucketCloudIntegration,
  getBitbucketCloudDefaultBranch,
  getBitbucketCloudDownloadUrl,
  //  getBitbucketCloudFileFetchUrl,
  getBitbucketCloudRequestOptions,
  ScmIntegrations,
} from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { trimEnd } from 'lodash';
import { Minimatch } from 'minimatch';
import { ReaderFactory, ReadTreeResponseFactory } from './types';
// import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';

const execAsync = promisify(exec);

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for files from Bitbucket Cloud.
 *
 * @public
 */
export class BitbucketCloudUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, logger, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    return integrations.bitbucketCloud.list().map(integration => {
      const reader = new BitbucketCloudUrlReader(integration, {
        treeResponseFactory,
        logger,
      });
      const predicate = (url: URL) => url.host === integration.config.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: BitbucketCloudIntegration,
    private readonly deps: {
      treeResponseFactory: ReadTreeResponseFactory;
      logger: LoggerService;
    },
  ) {
    const { host, username, appPassword } = integration.config;

    if (username && !appPassword) {
      throw new Error(
        `Bitbucket Cloud integration for '${host}' has configured a username but is missing a required appPassword.`,
      );
    }
  }

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(url: string): Promise<UrlReaderServiceReadUrlResponse> {
    const { username, appPassword, host } = this.integration.config;

    if (!username || !appPassword) {
      throw new Error(
        `Missing credentials for Bitbucket Cloud integration. Ensure username and appPassword are configured.`,
      );
    }

    const { owner, name: repoName, ref, filepath } = parseGitUrl(url);
    const branch = ref || 'main';
    const repoUrlLogging = `https://${host}/${owner}/${repoName}.git`;
    let repoUrl = '';

    // test repository
    if (username === 'username') {
      repoUrl = repoUrlLogging;
    } else {
      repoUrl = `https://${encodeURIComponent(username)}:${encodeURIComponent(
        appPassword,
      )}@${host}/${owner}/${repoName}.git`;
    }

    //
    const tempDir = await fs.promises.mkdtemp(
      join(tmpdir(), `${repoName}-${Date.now()}`),
    );

    try {
      // criar diretório temporário
      this.deps.logger.info(`Creating temporary directory: ${tempDir}`);
      await fs.promises.mkdir(tempDir, { recursive: true });

      // Clonar o repositório
      this.deps.logger.info(
        `Cloning repository: ${repoUrlLogging} (branch: ${branch}, dir: ${tempDir})`,
      );
      const { stderr, stdout } = await execAsync(
        `git clone --branch ${branch} --depth 1 ${repoUrl} ${tempDir}`,
      );

      if (stderr) {
        this.deps.logger.warn(`Git clone stderr: ${JSON.stringify(stderr)}`);
        // throw new Error(`Failed to clone repository: ${stderr}`);
      }

      if (stdout) {
        this.deps.logger.info(`Git clone stdout: ${stdout}`);
      }

      // Caminho completo do arquivo no repositório clonado
      const fullPath = path.join(tempDir, filepath || 'catalog-info.yaml');
      this.deps.logger.info(`Reading file: ${fullPath}`);

      if (!fs.existsSync(fullPath)) {
        this.deps.logger.error(`File not found: ${fullPath}`);
        throw new NotFoundError(`File not found: ${fullPath}`);
      }

      // Ler o conteúdo do arquivo
      const fileContent = await fs.promises.readFile(fullPath);
      return {
        buffer: async () => fileContent,
      };
    } catch (error) {
      this.deps.logger.error(`Error during git clone: ${error.message}`);
      throw error;
    } finally {
      // Limpar o diretório temporário
      this.deps.logger.info(`Removing temporary directory: ${tempDir}`);
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  }

  async readTree(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    const { filepath } = parseGitUrl(url);

    const lastCommitShortHash = await this.getLastCommitShortHash(url);
    if (options?.etag && options.etag === lastCommitShortHash) {
      throw new NotModifiedError();
    }

    const downloadUrl = await getBitbucketCloudDownloadUrl(
      url,
      this.integration.config,
    );
    const archiveResponse = await fetch(
      downloadUrl,
      getBitbucketCloudRequestOptions(this.integration.config),
    );
    if (!archiveResponse.ok) {
      const message = `Failed to read tree from ${url}, ${archiveResponse.status} ${archiveResponse.statusText}`;
      if (archiveResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return await this.deps.treeResponseFactory.fromTarArchive({
      response: archiveResponse,
      subpath: filepath,
      etag: lastCommitShortHash,
      filter: options?.filter,
    });
  }

  async search(
    url: string,
    options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    const { filepath } = parseGitUrl(url);

    // If it's a direct URL we use readUrl instead
    if (!filepath?.match(/[*?]/)) {
      try {
        const data = await this.readUrl(url);

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

    const matcher = new Minimatch(filepath);

    // TODO(freben): For now, read the entire repo and filter through that. In
    // a future improvement, we could be smart and try to deduce that non-glob
    // prefixes (like for filepaths such as some-prefix/**/a.yaml) can be used
    // to get just that part of the repo.
    const treeUrl = trimEnd(url.replace(filepath, ''), '/');

    const tree = await this.readTree(treeUrl, {
      etag: options?.etag,
      filter: localPath => matcher.match(localPath),
    });
    const files = await tree.files();

    return {
      etag: tree.etag,
      files: files.map(file => ({
        url: this.integration.resolveUrl({
          url: `/${file.path}`,
          base: url,
        }),
        content: file.content,
        lastModifiedAt: file.lastModifiedAt,
      })),
    };
  }

  toString() {
    const { host, username, appPassword } = this.integration.config;
    const authed = Boolean(username && appPassword);
    return `bitbucketCloud{host=${host},authed=${authed}}`;
  }

  private async getLastCommitShortHash(url: string): Promise<string> {
    const { name: repoName, owner: project, ref } = parseGitUrl(url);

    let branch = ref;
    if (!branch) {
      branch = await getBitbucketCloudDefaultBranch(
        url,
        this.integration.config,
      );
    }

    const commitsApiUrl = `${this.integration.config.apiBaseUrl}/repositories/${project}/${repoName}/commits/${branch}`;

    const commitsResponse = await fetch(
      commitsApiUrl,
      getBitbucketCloudRequestOptions(this.integration.config),
    );
    if (!commitsResponse.ok) {
      const message = `Failed to retrieve commits from ${commitsApiUrl}, ${commitsResponse.status} ${commitsResponse.statusText}`;
      if (commitsResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const commits = await commitsResponse.json();
    if (
      commits &&
      commits.values &&
      commits.values.length > 0 &&
      commits.values[0].hash
    ) {
      return commits.values[0].hash.substring(0, 12);
    }

    throw new Error(`Failed to read response from ${commitsApiUrl}`);
  }
}
