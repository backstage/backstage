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
import type { NpmSnapshot } from '../../src/pluginDirectory/manifest';

type Repository = NonNullable<
  Extract<NpmSnapshot, { status: 'fresh' }>['repository']
>;
type UnavailableReason = Extract<
  NpmSnapshot,
  { status: 'unavailable' }
>['reason'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTimestamp(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}

function normalizeGitHubUrl(repositoryUrl: string): string | undefined {
  const shorthand = /^github:([^/]+)\/([^/#]+?)(?:\.git)?(?:#.*)?$/.exec(
    repositoryUrl,
  );
  if (shorthand) {
    return `https://github.com/${shorthand[1]}/${shorthand[2]}`;
  }

  let url = repositoryUrl.replace(/^git\+/, '');
  url = url.replace(/^git@github\.com:/, 'https://github.com/');

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }

  if (parsed.hostname.toLowerCase() !== 'github.com') {
    return undefined;
  }

  const parts = parsed.pathname.split('/').filter(Boolean);
  if (parts.length !== 2) {
    return undefined;
  }

  const repository = parts[1].replace(/\.git$/, '');
  if (!parts[0] || !repository) {
    return undefined;
  }

  return `https://github.com/${parts[0]}/${repository}`;
}

function parseRepository(value: unknown): Repository | undefined {
  let url: string;
  let directory: string | undefined;

  if (typeof value === 'string') {
    url = value;
  } else if (isRecord(value) && typeof value.url === 'string') {
    url = value.url;
    if (value.directory !== undefined) {
      if (typeof value.directory !== 'string' || value.directory.length === 0) {
        return undefined;
      }
      directory = value.directory;
    }
  } else {
    return undefined;
  }

  const normalizedUrl = normalizeGitHubUrl(url);
  if (!normalizedUrl) {
    return undefined;
  }

  return directory
    ? { url: normalizedUrl, directory }
    : { url: normalizedUrl };
}

function unavailable(
  lastAttemptAt: string,
  reason: UnavailableReason,
): NpmSnapshot {
  return { status: 'unavailable', lastAttemptAt, reason };
}

export async function fetchNpmSnapshot(
  packageName: string,
  fetchImpl: typeof fetch = fetch,
): Promise<NpmSnapshot> {
  const lastAttemptAt = new Date().toISOString();

  let response: Response;
  try {
    response = await fetchImpl(
      `https://registry.npmjs.org/${encodeURIComponent(packageName)}`,
    );
  } catch {
    return unavailable(lastAttemptAt, 'npm-invalid-response');
  }

  if (!response.ok) {
    return unavailable(
      lastAttemptAt,
      response.status === 404 ? 'npm-not-found' : 'npm-invalid-response',
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return unavailable(lastAttemptAt, 'npm-invalid-response');
  }

  if (!isRecord(body)) {
    return unavailable(lastAttemptAt, 'npm-invalid-response');
  }

  const distTags = body['dist-tags'];
  const time = body.time;
  if (!isRecord(distTags) || !isRecord(time)) {
    return unavailable(lastAttemptAt, 'npm-invalid-response');
  }

  const latestVersion = distTags.latest;
  if (typeof latestVersion !== 'string' || latestVersion.length === 0) {
    return unavailable(lastAttemptAt, 'npm-invalid-response');
  }

  const lastPublishedAt = time[latestVersion];
  if (!isTimestamp(lastPublishedAt)) {
    return unavailable(lastAttemptAt, 'npm-invalid-response');
  }

  const repository = parseRepository(body.repository);

  return {
    status: 'fresh',
    lastAttemptAt,
    checkedAt: lastAttemptAt,
    latestVersion,
    lastPublishedAt,
    ...(repository ? { repository } : {}),
  };
}
