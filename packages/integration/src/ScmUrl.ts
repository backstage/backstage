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

/**
 * References an SCM based location.
 *
 * @public
 */
export interface ScmUrl {
  /** The host name of the SCM integration, e.g. "github.com". */
  host: string;
  /** The root URL of the SCM integration, including protocol and root path, e.g. "https://dev.example.com:8080/git". */
  root: string;
  /** The organization the repository owner belongs to, if any (only applies to some providers). */
  organization?: string | undefined;
  /** The repository owner. */
  owner?: string | undefined;
  /** The repository name. */
  name?: string | undefined;
  /** The targeted ref (e.g. "master" or "dev"). */
  ref?: string | undefined;
  /** The file path relative to the repo root, if any, including the leading slash. */
  path?: string | undefined;
  /** The type of file path, if any, e.g. "blob" or "edit" */
  pathType?: string | undefined;
}
