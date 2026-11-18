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

/**
 * Constructs the catalog location URL for a file inside an Azure DevOps
 * repository.
 *
 * This is the single source of the URL format that is used both by the Azure
 * DevOps entity provider and by the SCM events bridge, so that webhook-driven
 * events can be matched against the locations that the provider emits.
 *
 * The path and branch are placed in the `path` and `version` query parameters
 * of the URL, and are encoded as query parameter values: characters that are
 * structurally significant in a URL query string (`&`, `#`, `=`, `+`) are
 * percent-encoded so that they cannot alter which parameters the URL carries.
 * This mirrors how the Azure URL readers in `@backstage/integration` parse
 * these locations back apart, using `URLSearchParams` decoding.
 *
 * The encoding of everything else is kept byte-compatible with the `encodeURI`
 * format that these locations have always used, including `%20` for spaces,
 * so that locations for ordinary file paths are left unchanged.
 */
export function toCatalogLocationUrl(options: {
  repoUrl: string;
  path: string;
  branch?: string;
}): string {
  const encodeValue = (value: string) =>
    encodeURI(value).replace(/[&#+=]/g, encodeURIComponent);

  let fullUrl = `${encodeURI(options.repoUrl)}?path=${encodeValue(
    options.path,
  )}`;
  if (options.branch) {
    fullUrl += `&version=GB${encodeValue(options.branch)}`;
  }
  return fullUrl;
}
