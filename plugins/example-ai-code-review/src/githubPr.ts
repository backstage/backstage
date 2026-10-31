/*
 * Copyright 2026 The Backstage Authors
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

import { ScmIntegrationRegistry } from '@backstage/integration';

/** The most diff characters that are sent to the model. */
export const MAX_DIFF_CHARACTERS = 60_000;

export type GithubPrRef = {
  host: string;
  owner: string;
  repo: string;
  number: number;
};

export function parsePullRequestUrl(input: string): GithubPrRef {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error(`Not a valid URL: ${input}`);
  }
  const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) {
    throw new Error(
      'Expected a GitHub pull request URL like https://github.com/owner/repo/pull/123',
    );
  }
  return {
    host: url.host,
    owner: match[1],
    repo: match[2],
    number: Number(match[3]),
  };
}

export type PullRequestFile = {
  filename: string;
  status: string;
  patch?: string;
};

/**
 * Fetches the changed files of a pull request straight from the GitHub API,
 * authenticated with the signed-in user's own token. The request intentionally
 * uses the global fetch rather than the Backstage fetch API, so that the token
 * is only ever sent to GitHub and never to a Backstage backend.
 */
export async function fetchPullRequestDiff(options: {
  prUrl: string;
  integrations: ScmIntegrationRegistry;
  getToken: (url: string) => Promise<string>;
  maxCharacters?: number;
}): Promise<{
  diff: string;
  truncated: boolean;
  fileCount: number;
  files: PullRequestFile[];
}> {
  const ref = parsePullRequestUrl(options.prUrl);
  const integration = options.integrations.github.byHost(ref.host);
  if (!integration) {
    throw new Error(`No GitHub integration is configured for ${ref.host}`);
  }
  const apiBaseUrl = integration.config.apiBaseUrl ?? 'https://api.github.com';
  const token = await options.getToken(
    `https://${ref.host}/${ref.owner}/${ref.repo}`,
  );

  const files: PullRequestFile[] = [];
  for (let page = 1; page <= 10; page++) {
    const response = await fetch(
      `${apiBaseUrl}/repos/${ref.owner}/${ref.repo}/pulls/${ref.number}/files?per_page=100&page=${page}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(
        `GitHub request failed with ${response.status} ${response.statusText}`,
      );
    }
    const batch: PullRequestFile[] = await response.json();
    files.push(...batch);
    if (batch.length < 100) {
      break;
    }
  }

  const max = options.maxCharacters ?? MAX_DIFF_CHARACTERS;
  let diff = '';
  let truncated = false;
  for (const file of files) {
    const section = `--- ${file.filename} (${file.status})\n${
      file.patch ?? '(no textual patch)'
    }\n\n`;
    if (diff.length + section.length > max) {
      truncated = true;
      diff += section.slice(0, Math.max(0, max - diff.length));
      break;
    }
    diff += section;
  }
  return { diff, truncated, fileCount: files.length, files };
}
