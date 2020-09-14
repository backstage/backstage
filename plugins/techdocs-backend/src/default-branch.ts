/*
 * Copyright 2020 Spotify AB
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
import https from 'https';
import parseGitUrl from 'git-url-parse';

interface IGitlabCommit {
  author_email: string;
  author_name: string;
  authored_date: string;
  committed_date: string;
  committer_email: string;
  committer_name: string;
  id: string;
  short_id: string;
  title: string;
  message: string;
  parent_ids: string[];
}

interface IGitlabBranch {
  name: string;
  merged: boolean;
  protected: boolean;
  default: boolean;
  developers_can_push: boolean;
  developers_can_merge: boolean;
  can_push: boolean;
  web_url: string;
  commit: IGitlabCommit;
}

/** @source https://github.com/Knutakir/default-branch/blob/master/index.js */
function getGithubPath(url: string): string {
  let path = '';

  if (
    !(
      url.startsWith('https://github.com/') ||
      url.startsWith('http://github.com/')
    )
  ) {
    path = `https://github.com/${url}`;
  }

  if (path.startsWith('http://github.com/')) {
    // Force https connection
    path = `${url.substr(0, 4)}s${url.substr(4)}`;
  }

  return `${path}/branches`;
}

function getGitlabPath(url: string): string {
  const { resource, full_name: fullName } = parseGitUrl(url);
  /** @source https://docs.gitlab.com/ee/api/v3_to_v4.html#api-v3-to-api-v4 */
  const apiPrefix = 'api/v4/projects';
  /** @source https://docs.gitlab.com/ee/api/branches.html */
  const branchesPath = 'repository/branches';
  /** @source https://docs.gitlab.com/ee/api/README.html#namespaced-path-encoding */
  const gitlabProjectEncoded = fullName.replace('/', '%2F');

  return `https://${resource}/${apiPrefix}/${gitlabProjectEncoded}/${branchesPath}`;
}

/** @source https://github.com/Knutakir/default-branch/blob/master/index.js */
function getGithubDefaultBranch(
  data: string,
  resolve: any,
  reject: any,
): Promise<string> {
  // The default branch is always the first on the page
  const regexp = /class="(.*)branch-name(.*)>(.*)</g;

  try {
    // The first item (0) will be at the top and will be the default branch
    // @ts-ignore
    const regexMatch = data.match(regexp)[0].split('>')[1].split('<')[0];
    return resolve(regexMatch);
  } catch (error) {
    return reject(new Error('Not found default branch'));
  }
}

function getGitlabDefaultBranch(
  data: string,
  resolve: any,
  reject: any,
): Promise<string> {
  const parsedData = JSON.parse(data);
  const { name } = (parsedData || []).find(
    (branch: IGitlabBranch) => branch.default === true,
  );

  if (!name) {
    return reject(new Error('Not found default branch'));
  }

  return resolve(name);
}

export const getDefaultBranch = (repositoryUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const typeMapping = [
      { url: /github*/g, type: 'github' },
      { url: /gitlab*/g, type: 'gitlab' },
    ];

    const type = typeMapping.filter(item => item.url.test(repositoryUrl))[0]
      ?.type;

    let path = '';

    switch (type) {
      case 'github':
        path = getGithubPath(repositoryUrl);
        break;
      case 'gitlab':
        path = getGitlabPath(repositoryUrl);
        break;

      default:
        return reject(new Error('Failed to get repository type'));
    }

    return https.get(path, response => {
      const statusCode = response.statusCode || 0;

      if (statusCode < 200 || statusCode > 299) {
        reject(new Error(`Failed to load url: ${response.statusCode}`));
        return;
      }

      response.setEncoding('utf8');

      let rawData = '';
      response.on('data', chunk => {
        rawData += chunk;
      });

      response.on('end', () => {
        try {
          if (type === 'github') {
            return getGithubDefaultBranch(rawData, resolve, reject);
          }

          if (type === 'gitlab') {
            return getGitlabDefaultBranch(rawData, resolve, reject);
          }

          return reject(new Error(`Can't get default branch`));
        } catch (error) {
          return reject(new Error(`Failed to get default branch: ${error}`));
        }
      });
    });
  });
};
