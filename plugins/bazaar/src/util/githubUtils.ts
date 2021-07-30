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

import yamlJS from 'js-yaml';
import { Octokit } from '@octokit/rest';
import btoa from 'btoa';
import {
  OAuthApi,
  ProfileInfoApi,
  BackstageIdentityApi,
  SessionApi,
} from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';

export const getBranches = async (
  auth: OAuthApi & ProfileInfoApi & BackstageIdentityApi & SessionApi,
  entity: Entity,
) => {
  const token = await auth.getAccessToken('repo');
  const octokit = new Octokit({ auth: token });
  const name = entity?.metadata?.name;
  const owner = entity?.spec?.owner;

  const branchResponse = await octokit.request(
    `https://api.github.com/repos/${owner}/${name}/branches`,
  );

  return branchResponse.data
    .filter((branch: JsonObject) => branch.name !== 'master')
    .map((branch: JsonObject) => branch.name);
};

export const createPullRequest = async (
  auth: OAuthApi & ProfileInfoApi & BackstageIdentityApi & SessionApi,
  title: string,
  commitMessage: string,
  branch: string,
  clonedEntity: Entity,
) => {
  const token = await auth.getAccessToken('repo');
  const octokit = new Octokit({ auth: token });

  const owner = clonedEntity?.spec?.owner;
  const repo = clonedEntity.metadata.name;
  const path = 'catalog-info.yaml';

  const getResponse = await octokit.request(
    `GET /repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
  );

  const yamlData = yamlJS.dump(clonedEntity);

  const fileSHA: string = getResponse.data.sha;

  await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {
    message: commitMessage,
    content: btoa(yamlData),
    branch: branch,
    sha: fileSHA,
  });

  const postResponse = await octokit.request(
    `POST /repos/${owner}/${repo}/pulls`,
    {
      title: title,
      head: branch,
      base: 'master',
    },
  );

  if (postResponse.status === 201) {
    window.open(
      `https://github.com/${owner}/${repo}/pull/${postResponse.data.number}`,
      '_blank',
    );
  }
};
