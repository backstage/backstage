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

// NOTE(freben): Intentionally uses node-fetch because of https://github.com/backstage/backstage/issues/28190
import fetch, { Response } from 'node-fetch';

import {
  UrlReaderService,
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchOptions,
  UrlReaderServiceSearchResponse,
} from '@backstage/backend-plugin-api';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import {
  GitLabIntegration,
  ScmIntegrations,
  getGitLabFileFetchUrl,
  getGitLabIntegrationRelativePath,
  getGitLabRequestOptions,
} from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { trimEnd, trimStart } from 'lodash';
import { Minimatch } from 'minimatch';
import { Readable } from 'stream';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
import { ReadTreeResponseFactory, ReaderFactory } from './types';
import { parseLastModified } from './util';

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for files on GitLab.
 *
 * @public
 */
export class GitlabUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    return integrations.gitlab.list().map(integration => {
      const reader = new GitlabUrlReader(integration, {
        treeResponseFactory,
      });
      const predicate = (url: URL) => url.host === integration.config.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: GitLabIntegration,
    private readonly deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {}

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    const { etag, lastModifiedAfter, signal, token } = options ?? {};
    const builtUrl = await this.getGitlabFetchUrl(url);

    let response: Response;
    try {
      response = await fetch(builtUrl, {
        headers: {
          ...getGitLabRequestOptions(this.integration.config, token).headers,
          ...(etag && { 'If-None-Match': etag }),
          ...(lastModifiedAfter && {
            'If-Modified-Since': lastModifiedAfter.toUTCString(),
          }),
        },
        // TODO(freben): The signal cast is there because pre-3.x versions of
        // node-fetch have a very slightly deviating AbortSignal type signature.
        // The difference does not affect us in practice however. The cast can be
        // removed after we support ESM for CLI dependencies and migrate to
        // version 3 of node-fetch.
        // https://github.com/backstage/backstage/issues/8242
        ...(signal && { signal: signal as any }),
      });
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.status === 304) {
      throw new NotModifiedError();
    }

    if (response.ok) {
      return ReadUrlResponseFactory.fromNodeJSReadable(response.body, {
        etag: response.headers.get('ETag') ?? undefined,
        lastModifiedAt: parseLastModified(
          response.headers.get('Last-Modified'),
        ),
      });
    }

    const message = `${url} could not be read as ${builtUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    const { etag, signal, token } = options ?? {};
    const { ref, full_name, filepath } = parseGitUrl(url);

    let repoFullName = full_name;

    const relativePath = getGitLabIntegrationRelativePath(
      this.integration.config,
    );

    // Considering self hosted gitlab with relative
    // assuming '/gitlab' is the relative path
    // from: /gitlab/repo/project
    // to: repo/project
    if (relativePath) {
      const rectifiedRelativePath = `${trimStart(relativePath, '/')}/`;
      repoFullName = full_name.replace(rectifiedRelativePath, '');
    }

    // Use GitLab API to get the default branch
    // encodeURIComponent is required for GitLab API
    // https://docs.gitlab.com/ee/api/README.html#namespaced-path-encoding
    const projectGitlabResponse = await fetch(
      new URL(
        `${this.integration.config.apiBaseUrl}/projects/${encodeURIComponent(
          repoFullName,
        )}`,
      ).toString(),
      getGitLabRequestOptions(this.integration.config, token),
    );
    if (!projectGitlabResponse.ok) {
      const msg = `Failed to read tree from ${url}, ${projectGitlabResponse.status} ${projectGitlabResponse.statusText}`;
      if (projectGitlabResponse.status === 404) {
        throw new NotFoundError(msg);
      }
      throw new Error(msg);
    }
    const projectGitlabResponseJson = await projectGitlabResponse.json();

    // ref is an empty string if no branch is set in provided url to readTree.
    const branch = ref || projectGitlabResponseJson.default_branch;

    // Fetch the latest commit that modifies the filepath in the provided or default branch
    // to compare against the provided sha.
    const commitsReqParams = new URLSearchParams();
    commitsReqParams.set('ref_name', branch);
    if (!!filepath) {
      commitsReqParams.set('path', filepath);
    }
    const commitsGitlabResponse = await fetch(
      new URL(
        `${this.integration.config.apiBaseUrl}/projects/${encodeURIComponent(
          repoFullName,
        )}/repository/commits?${commitsReqParams.toString()}`,
      ).toString(),
      {
        ...getGitLabRequestOptions(this.integration.config, token),
        // TODO(freben): The signal cast is there because pre-3.x versions of
        // node-fetch have a very slightly deviating AbortSignal type signature.
        // The difference does not affect us in practice however. The cast can
        // be removed after we support ESM for CLI dependencies and migrate to
        // version 3 of node-fetch.
        // https://github.com/backstage/backstage/issues/8242
        ...(signal && { signal: signal as any }),
      },
    );
    if (!commitsGitlabResponse.ok) {
      const message = `Failed to read tree (branch) from ${url}, ${commitsGitlabResponse.status} ${commitsGitlabResponse.statusText}`;
      if (commitsGitlabResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const commitSha = (await commitsGitlabResponse.json())[0]?.id ?? '';
    if (etag && etag === commitSha) {
      throw new NotModifiedError();
    }

    const archiveReqParams = new URLSearchParams();
    archiveReqParams.set('sha', branch);
    if (!!filepath) {
      archiveReqParams.set('path', filepath);
    }
    // https://docs.gitlab.com/ee/api/repositories.html#get-file-archive
    const archiveGitLabResponse = await fetch(
      `${this.integration.config.apiBaseUrl}/projects/${encodeURIComponent(
        repoFullName,
      )}/repository/archive?${archiveReqParams.toString()}`,
      {
        ...getGitLabRequestOptions(this.integration.config, token),
        // TODO(freben): The signal cast is there because pre-3.x versions of
        // node-fetch have a very slightly deviating AbortSignal type signature.
        // The difference does not affect us in practice however. The cast can
        // be removed after we support ESM for CLI dependencies and migrate to
        // version 3 of node-fetch.
        // https://github.com/backstage/backstage/issues/8242
        ...(signal && { signal: signal as any }),
      },
    );
    if (!archiveGitLabResponse.ok) {
      const message = `Failed to read tree (archive) from ${url}, ${archiveGitLabResponse.status} ${archiveGitLabResponse.statusText}`;
      if (archiveGitLabResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return await this.deps.treeResponseFactory.fromTarArchive({
      stream: Readable.from(archiveGitLabResponse.body),
      subpath: filepath,
      etag: commitSha,
      filter: options?.filter,
    });
  }

  async search(
    url: string,
    options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    const { filepath } = parseGitUrl(url);
    const staticPart = this.getStaticPart(filepath);
    const matcher = new Minimatch(filepath);
    const treeUrl = trimEnd(url.replace(filepath, staticPart), `/`);
    const pathPrefix = staticPart ? `${staticPart}/` : '';
    const tree = await this.readTree(treeUrl, {
      etag: options?.etag,
      signal: options?.signal,
      filter: path => matcher.match(`${pathPrefix}${path}`),
    });

    const files = await tree.files();
    return {
      etag: tree.etag,
      files: files.map(file => ({
        url: this.integration.resolveUrl({
          url: `/${pathPrefix}${file.path}`,
          base: url,
        }),
        content: file.content,
        lastModifiedAt: file.lastModifiedAt,
      })),
    };
  }

  /**
   * This function splits the input globPattern string into segments using the  path separator /. It then iterates over
   * the segments from the end of the array towards the beginning, checking if the concatenated string up to that
   * segment matches the original globPattern using the minimatch function. If a match is found, it continues iterating.
   * If no match is found, it returns the concatenated string up to the current segment, which is the static part of the
   * glob pattern.
   *
   * E.g. `catalog/foo/*.yaml` will return `catalog/foo`.
   *
   * @param globPattern - the glob pattern
   */
  private getStaticPart(globPattern: string) {
    const segments = globPattern.split('/');
    let i = segments.length;
    while (
      i > 0 &&
      new Minimatch(segments.slice(0, i).join('/')).match(globPattern)
    ) {
      i--;
    }
    return segments.slice(0, i).join('/');
  }

  toString() {
    const { host, token } = this.integration.config;
    return `gitlab{host=${host},authed=${Boolean(token)}}`;
  }

  private async getGitlabFetchUrl(target: string): Promise<string> {
    // If the target is for a job artifact then go down that path
    const targetUrl = new URL(target);
    if (targetUrl.pathname.includes('/-/jobs/artifacts/')) {
      return this.getGitlabArtifactFetchUrl(targetUrl).then(value =>
        value.toString(),
      );
    }
    // Default to the old behavior of assuming the url is for a file
    return getGitLabFileFetchUrl(target, this.integration.config);
  }

  // convert urls of the form:
  //    https://example.com/<namespace>/<project>/-/jobs/artifacts/<ref>/raw/<path_to_file>?job=<job_name>
  // to urls of the form:
  //    https://example.com/api/v4/projects/:id/jobs/artifacts/:ref_name/raw/*artifact_path?job=<job_name>
  private async getGitlabArtifactFetchUrl(target: URL): Promise<URL> {
    if (!target.pathname.includes('/-/jobs/artifacts/')) {
      throw new Error('Unable to process url as an GitLab artifact');
    }
    try {
      const [namespaceAndProject, ref] =
        target.pathname.split('/-/jobs/artifacts/');
      const projectPath = new URL(target);
      projectPath.pathname = namespaceAndProject;
      const projectId = await this.resolveProjectToId(projectPath);
      const relativePath = getGitLabIntegrationRelativePath(
        this.integration.config,
      );
      const newUrl = new URL(target);
      newUrl.pathname = `${relativePath}/api/v4/projects/${projectId}/jobs/artifacts/${ref}`;
      return newUrl;
    } catch (e) {
      throw new Error(
        `Unable to translate GitLab artifact URL: ${target}, ${e}`,
      );
    }
  }

  private async resolveProjectToId(pathToProject: URL): Promise<number> {
    let project = pathToProject.pathname;
    // Check relative path exist and remove it if so
    const relativePath = getGitLabIntegrationRelativePath(
      this.integration.config,
    );
    if (relativePath) {
      project = project.replace(relativePath, '');
    }
    // Trim an initial / if it exists
    project = project.replace(/^\//, '');
    const result = await fetch(
      `${
        pathToProject.origin
      }${relativePath}/api/v4/projects/${encodeURIComponent(project)}`,
      getGitLabRequestOptions(this.integration.config),
    );
    const data = await result.json();
    if (!result.ok) {
      throw new Error(`Gitlab error: ${data.error}, ${data.error_description}`);
    }
    return Number(data.id);
  }
}
