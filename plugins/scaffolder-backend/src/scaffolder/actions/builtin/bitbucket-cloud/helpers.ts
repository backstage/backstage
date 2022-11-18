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
import fetch, { Response, RequestInit } from 'node-fetch';

/**
 * Uses the Bitbucket Cloud REST API to create a new repository.
 * @public
 */
export const bitbucketCloudCreateRepository = async (opts: {
  workspace: string;
  project: string;
  repo: string;
  description?: string;
  repoVisibility: 'private' | 'public';
  mainBranch: string;
  authorization: string;
  apiBaseUrl: string;
}) => {
  const {
    workspace,
    project,
    repo,
    description,
    repoVisibility,
    mainBranch,
    authorization,
    apiBaseUrl,
  } = opts;

  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      scm: 'git',
      description: description,
      is_private: repoVisibility === 'private',
      project: { key: project },
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  let response: Response;
  try {
    response = await fetch(
      `${apiBaseUrl}/repositories/${workspace}/${repo}`,
      options,
    );
  } catch (e) {
    throw new Error(`Unable to create repository, ${e}`);
  }

  if (response.status !== 200) {
    throw new Error(
      `Unable to create repository, ${response.status} ${
        response.statusText
      }, ${await response.text()}`,
    );
  }

  const r = await response.json();
  let remoteUrl = '';
  for (const link of r.links.clone) {
    if (link.name === 'https') {
      remoteUrl = link.href;
    }
  }

  // "mainbranch.name" cannot be set neither at create nor update of the repo
  // the first pushed branch will be set as "main branch" then
  const repoContentsUrl = `${r.links.html.href}/src/${mainBranch}`;
  return { remoteUrl, repoContentsUrl };
};

export const bitbucketCloudEnablePipeline = async (opts: {
  workspace: string;
  repo: string;
  authorization: string;
  apiBaseUrl: string;
}) => {
  const { workspace, repo, authorization, apiBaseUrl } = opts;

  const options: RequestInit = {
    method: 'PUT',
    body: JSON.stringify({
      enabled: true,
      repository: {},
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  let response: Response;
  try {
    response = await fetch(
      `${apiBaseUrl}/repositories/${workspace}/${repo}/pipelines_config`,
      options,
    );
  } catch (e) {
    throw new Error(`Unable to enable pipelines, ${e}`);
  }

  if (response.status !== 200) {
    throw new Error(
      `Unable to enable pipelines, ${response.status} ${
        response.statusText
      }, ${await response.text()}`,
    );
  }

  const r = await response.json();

  return { pipelineEnabled: r.enabled };
};
