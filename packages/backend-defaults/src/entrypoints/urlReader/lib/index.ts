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

export { AzureUrlReader } from './AzureUrlReader';
export { BitbucketCloudUrlReader } from './BitbucketCloudUrlReader';
export { BitbucketUrlReader } from './BitbucketUrlReader';
export { BitbucketServerUrlReader } from './BitbucketServerUrlReader';
export { GerritUrlReader } from './GerritUrlReader';
export { GithubUrlReader } from './GithubUrlReader';
export { GitlabUrlReader } from './GitlabUrlReader';
export { GiteaUrlReader } from './GiteaUrlReader';
export { HarnessUrlReader } from './HarnessUrlReader';
export { AwsS3UrlReader } from './AwsS3UrlReader';
export { FetchUrlReader } from './FetchUrlReader';
export { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
export type {
  FromReadableArrayOptions,
  ReaderFactory,
  ReadTreeResponseFactory,
  ReadTreeResponseFactoryOptions,
  ReadUrlResponseFactoryFromStreamOptions,
  UrlReaderPredicateTuple,
} from './types';
export { UrlReaders } from './UrlReaders';
export type { UrlReadersOptions } from './UrlReaders';
