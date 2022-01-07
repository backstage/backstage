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

type RepoUrlPickerOptions = {
  host?: string;
  owner?: string;
  repo?: string;
  organization?: string;
  workspace?: string;
  project?: string;
};

export function serializeRepoPickerUrl(data: RepoUrlPickerOptions) {
  if (!data.host) {
    return undefined;
  }

  const params = new URLSearchParams();
  if (data.owner) {
    params.set('owner', data.owner);
  }
  if (data.repo) {
    params.set('repo', data.repo);
  }
  if (data.organization) {
    params.set('organization', data.organization);
  }
  if (data.workspace) {
    params.set('workspace', data.workspace);
  }
  if (data.project) {
    params.set('project', data.project);
  }

  return `${data.host}?${params.toString()}`;
}

export function parseRepoPickerUrl(
  url: string | undefined,
): RepoUrlPickerOptions {
  let host = undefined;
  let owner = undefined;
  let repo = undefined;
  let organization = undefined;
  let workspace = undefined;
  let project = undefined;

  try {
    if (url) {
      const parsed = new URL(`https://${url}`);
      host = parsed.host;
      owner = parsed.searchParams.get('owner') || undefined;
      repo = parsed.searchParams.get('repo') || undefined;
      organization = parsed.searchParams.get('organization') || undefined;
      workspace = parsed.searchParams.get('workspace') || undefined;
      project = parsed.searchParams.get('project') || undefined;
    }
  } catch {
    /* ok */
  }

  return { host, owner, repo, organization, workspace, project };
}
