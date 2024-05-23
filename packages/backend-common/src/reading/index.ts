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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AzureUrlReader as _AzureUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/AzureUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { BitbucketCloudUrlReader as _BitbucketCloudUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/BitbucketCloudUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { BitbucketUrlReader as _BitbucketUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/BitbucketUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { BitbucketServerUrlReader as _BitbucketServerUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/BitbucketServerUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { GerritUrlReader as _GerritUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/GerritUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { GithubUrlReader as _GithubUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/GithubUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { GitlabUrlReader as _GitlabUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/GitlabUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { GiteaUrlReader as _GiteaUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/GiteaUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { HarnessUrlReader as _HarnessUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/HarnessUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AwsS3UrlReader as _AwsS3UrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/AwsS3UrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { FetchUrlReader as _FetchUrlReader } from '../../../backend-defaults/src/entrypoints/urlReader/lib/FetchUrlReader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { UrlReaders as _UrlReaders } from '../../../backend-defaults/src/entrypoints/urlReader/lib/UrlReaders';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ReadUrlResponseFactory as _ReadUrlResponseFactory } from '../../../backend-defaults/src/entrypoints/urlReader/lib/ReadUrlResponseFactory';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { UrlReadersOptions as _UrlReadersOptions } from '../../../backend-defaults/src/entrypoints/urlReader/lib/UrlReaders';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { FromReadableArrayOptions as _FromReadableArrayOptions } from '../../../backend-defaults/src/entrypoints/urlReader/lib/types';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type {
  ReaderFactory as _ReaderFactory,
  ReadTreeResponseFactory as _ReadTreeResponseFactory,
  ReadTreeResponseFactoryOptions as _ReadTreeResponseFactoryOptions,
  ReadUrlResponseFactoryFromStreamOptions as _ReadUrlResponseFactoryFromStreamOptions,
  UrlReaderPredicateTuple as _UrlReaderPredicateTuple,
} from '../../../backend-defaults/src/entrypoints/urlReader/lib/types';

import type {
  ReadTreeOptions as _ReadTreeOptions,
  ReadTreeResponse as _ReadTreeResponse,
  ReadTreeResponseFile as _ReadTreeResponseFile,
  ReadTreeResponseDirOptions as _ReadTreeResponseDirOptions,
  ReadUrlOptions as _ReadUrlOptions,
  ReadUrlResponse as _ReadUrlResponse,
  SearchOptions as _SearchOptions,
  SearchResponse as _SearchResponse,
  SearchResponseFile as _SearchResponseFile,
  UrlReaderService as _UrlReaderService,
} from '@backstage/backend-plugin-api';

/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const AzureUrlReader = _AzureUrlReader;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const BitbucketCloudUrlReader = _BitbucketCloudUrlReader;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const BitbucketUrlReader = _BitbucketUrlReader;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const BitbucketServerUrlReader = _BitbucketServerUrlReader;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const GerritUrlReader = _GerritUrlReader;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const GithubUrlReader = _GithubUrlReader;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const GitlabUrlReader = _GitlabUrlReader;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const GiteaUrlReader = _GiteaUrlReader;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const HarnessUrlReader = _HarnessUrlReader;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const AwsS3UrlReader = _AwsS3UrlReader;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const FetchUrlReader = _FetchUrlReader;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const UrlReaders = _UrlReaders;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export const ReadUrlResponseFactory = _ReadUrlResponseFactory;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type UrlReadersOptions = _UrlReadersOptions;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type FromReadableArrayOptions = _FromReadableArrayOptions;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type ReaderFactory = _ReaderFactory;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type ReadTreeResponseFactory = _ReadTreeResponseFactory;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type ReadTreeResponseFactoryOptions = _ReadTreeResponseFactoryOptions;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type ReadUrlResponseFactoryFromStreamOptions =
  _ReadUrlResponseFactoryFromStreamOptions;
/**
 * @public
 * @deprecated Import from `@backstage/backend-defaults/urlReader` instead
 */
export type UrlReaderPredicateTuple = _UrlReaderPredicateTuple;

/**
 * @public
 * @deprecated Use `ÙrlReaderReadTreeOptions` from `@backstage/backend-plugin-api` instead
 */
export type ReadTreeOptions = _ReadTreeOptions;
/**
 * @public
 * @deprecated Use `ÙrlReaderReadTreeResponse` from `@backstage/backend-plugin-api` instead
 */
export type ReadTreeResponse = _ReadTreeResponse;
/**
 * @public
 * @deprecated Use `ÙrlReaderReadTreeResponseFile` from `@backstage/backend-plugin-api` instead
 */
export type ReadTreeResponseFile = _ReadTreeResponseFile;
/**
 * @public
 * @deprecated Use `ÙrlReaderReadTreeResponseDirOptions` from `@backstage/backend-plugin-api` instead
 */
export type ReadTreeResponseDirOptions = _ReadTreeResponseDirOptions;
/**
 * @public
 * @deprecated Use `ÙrlReaderReadUrlOptions` from `@backstage/backend-plugin-api` instead
 */
export type ReadUrlOptions = _ReadUrlOptions;
/**
 * @public
 * @deprecated Use `ÙrlReaderReadUrlResponse` from `@backstage/backend-plugin-api` instead
 */
export type ReadUrlResponse = _ReadUrlResponse;
/**
 * @public
 * @deprecated Use `ÙrlReaderSearchOptions` from `@backstage/backend-plugin-api` instead
 */
export type SearchOptions = _SearchOptions;
/**
 * @public
 * @deprecated Use `ÙrlReaderSearchResponse` from `@backstage/backend-plugin-api` instead
 */
export type SearchResponse = _SearchResponse;
/**
 * @public
 * @deprecated Use `ÙrlReaderSearchResponseFile` from `@backstage/backend-plugin-api` instead
 */
export type SearchResponseFile = _SearchResponseFile;
/**
 * @public
 * @deprecated Use `ÙrlReaderService` from `@backstage/backend-plugin-api` instead
 */
export type UrlReader = _UrlReaderService;
