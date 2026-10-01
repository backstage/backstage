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

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Where and how to fetch one skill with `skills add`. */
export interface SkillSource {
  /** Repository URL without a ref, for display. */
  repoUrl: string;
  ref: string;
  /**
   * The skill's own tree URL, passed to `skills add` as-is. `skills` installs
   * exactly the skill in the directory this points at.
   */
  installUrl: string;
  /**
   * Set for GitHub Enterprise hosts. `skills` only recognizes tree URLs on a
   * host other than github.com when `GH_HOST` is set to that host.
   */
  ghHost?: string;
  /**
   * Set for local sources: the real path of the skill directory. For these,
   * `repoUrl` and `installUrl` are the same path and `ref` is empty.
   */
  localPath?: string;
}

/** Reads the file system for `file:` sources, injectable to keep selection pure. */
export interface LocalSkillProbe {
  /** The real path, or undefined when the path does not exist. */
  realpath(path: string): string | undefined;
  isDirectory(path: string): boolean;
  hasSkillMd(directory: string): boolean;
}

export const nodeLocalSkillProbe: LocalSkillProbe = {
  realpath: p => {
    try {
      return fs.realpathSync(p);
    } catch {
      return undefined;
    }
  },
  isDirectory: p => fs.statSync(p).isDirectory(),
  hasSkillMd: p => fs.existsSync(path.join(p, 'SKILL.md')),
};

export interface ParseSkillSourceOptions {
  /** Whether `file:` locations may be used. They are off by default. */
  allowFileSources?: boolean;
  probe?: LocalSkillProbe;
}

export type SkillSourceResult =
  | { ok: true; source: SkillSource }
  | { ok: false; reason: string };

const fail = (reason: string): SkillSourceResult => ({ ok: false, reason });

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseFileSource(
  location: string,
  options: ParseSkillSourceOptions,
): SkillSourceResult {
  if (!options.allowFileSources) {
    return fail('file sources are disabled; pass --allow-file-sources');
  }
  const probe = options.probe ?? nodeLocalSkillProbe;
  let filePath = location.slice('file:'.length);
  if (filePath.startsWith('//')) {
    try {
      const url = new URL(location);
      if (url.host) {
        return fail('file sources must be absolute paths');
      }
      filePath = fileURLToPath(url);
    } catch {
      return fail('source location is not a valid file URL');
    }
  }
  if (!path.isAbsolute(filePath)) {
    return fail('file sources must be absolute paths');
  }
  const real = probe.realpath(filePath);
  if (!real) {
    return fail(`the directory ${path.resolve(filePath)} does not exist`);
  }
  if (!probe.isDirectory(real)) {
    return fail(`${real} is not a directory`);
  }
  if (!probe.hasSkillMd(real)) {
    return fail(`${real} does not contain SKILL.md directly`);
  }
  return {
    ok: true,
    source: { repoUrl: real, ref: '', installUrl: real, localPath: real },
  };
}

/**
 * Parses a `backstage.io/source-location` annotation value of the form
 * `url:<git tree URL>` that points at a skill directory.
 */
export function parseSkillSource(
  location: string | undefined,
  options: ParseSkillSourceOptions = {},
): SkillSourceResult {
  if (!location) {
    return fail('missing the backstage.io/source-location annotation');
  }
  if (location.startsWith('file:')) {
    return parseFileSource(location, options);
  }
  if (!location.startsWith('url:')) {
    return fail('source location must start with "url:" or "file:"');
  }
  let url: URL;
  try {
    url = new URL(location.slice('url:'.length));
  } catch {
    return fail('source location is not a valid URL');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return fail('source location must be an http(s) URL');
  }

  const segments = url.pathname.split('/').filter(Boolean);
  const treeIndex = segments.findIndex((s, i) => i >= 2 && s === 'tree');
  if (treeIndex < 0) {
    return fail(
      'source location is not a tree URL (expected .../tree/<ref>/<path to skill directory>)',
    );
  }
  const dashed = segments[treeIndex - 1] === '-';
  const repoSegments = segments.slice(0, dashed ? treeIndex - 1 : treeIndex);
  const rawRef = segments[treeIndex + 1];
  const pathSegments = segments.slice(treeIndex + 2);
  if (repoSegments.length < 2) {
    return fail(
      'source location is not a tree URL (repository path not found)',
    );
  }
  if (!dashed && repoSegments.length !== 2) {
    return fail(
      'tree URLs without "/-/" must have exactly an owner/repo path before "/tree/"; skills would install a different repository',
    );
  }
  if (!rawRef || pathSegments.length === 0) {
    return fail(
      'source location points at the repository root; it must point at a skill directory',
    );
  }
  const last = pathSegments[pathSegments.length - 1];
  if (/\.md$/i.test(last)) {
    return fail(
      `source location points at a file ("${last}"); it must point at the directory containing SKILL.md`,
    );
  }
  const ref = safeDecode(rawRef);
  if (ref.includes('/')) {
    return fail(
      `the ref "${ref}" contains "/", which skills cannot parse from a tree URL`,
    );
  }
  const skillPath = pathSegments.map(safeDecode).join('/');
  for (const [label, value] of [
    ['ref', ref],
    ['path', skillPath],
  ]) {
    const forbidden = value.match(/[#?\\]/);
    if (forbidden) {
      return fail(
        `the ${label} "${value}" contains "${forbidden[0]}", which skills cannot handle in a tree URL`,
      );
    }
  }
  const isEnterprise = !dashed && url.hostname !== 'github.com';
  if (isEnterprise && url.port) {
    return fail(
      `the host "${url.host}" has a port, which skills does not support for GitHub Enterprise`,
    );
  }

  // skills does not URL-decode the ref or the path it receives.
  const repoUrl = `${url.origin}/${repoSegments.join('/')}`;
  return {
    ok: true,
    source: {
      repoUrl,
      ref,
      installUrl: `${repoUrl}${dashed ? '/-' : ''}/tree/${ref}/${skillPath}`,
      ...(isEnterprise ? { ghHost: url.hostname } : {}),
    },
  };
}
