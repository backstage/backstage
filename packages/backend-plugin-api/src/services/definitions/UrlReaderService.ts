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

import { Readable } from 'stream';

/**
 * A generic interface for fetching plain data from URLs.
 *
 * @public
 */
export interface UrlReaderService {
  /**
   * Reads a single file and return its content.
   */
  readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;

  /**
   * Reads a full or partial file tree.
   */
  readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;

  /**
   * Searches for a file in a tree using a glob pattern.
   */
  search(url: string, options?: SearchOptions): Promise<SearchResponse>;
}

/**
 * An options object for readUrl operations.
 *
 * @public
 */
export type ReadUrlOptions = {
  /**
   * An ETag which can be provided to check whether a
   * {@link UrlReaderService.readUrl} response has changed from a previous execution.
   *
   * @remarks
   *
   * In the {@link UrlReaderService.readUrl} response, an ETag is returned along with
   * the data. The ETag is a unique identifier of the data, usually the commit
   * SHA or ETag from the target.
   *
   * When an ETag is given in ReadUrlOptions, {@link UrlReaderService.readUrl} will
   * first compare the ETag against the ETag of the target. If they match,
   * {@link UrlReaderService.readUrl} will throw a
   * {@link @backstage/errors#NotModifiedError} indicating that the response
   * will not differ from the previous response which included this particular
   * ETag. If they do not match, {@link UrlReaderService.readUrl} will return the rest
   * of the response along with a new ETag.
   */
  etag?: string;

  /**
   * A date which can be provided to check whether a
   * {@link UrlReaderService.readUrl} response has changed since the lastModifiedAt.
   *
   * @remarks
   *
   * In the {@link UrlReaderService.readUrl} response, an lastModifiedAt is returned
   * along with data. The lastModifiedAt date represents the last time the data
   * was modified.
   *
   * When an lastModifiedAfter is given in ReadUrlOptions, {@link UrlReaderService.readUrl}
   * will compare the lastModifiedAfter against the lastModifiedAt of the target. If
   * the data has not been modified since this date, the {@link UrlReaderService.readUrl}
   * will throw a {@link @backstage/errors#NotModifiedError} indicating that the
   * response does not contain any new data. If they do not match,
   * {@link UrlReaderService.readUrl} will return the rest of the response along with new
   * lastModifiedAt date.
   */
  lastModifiedAfter?: Date;

  /**
   * An abort signal to pass down to the underlying request.
   *
   * @remarks
   *
   * Not all reader implementations may take this field into account.
   */
  signal?: AbortSignal;

  /**
   * An optional token to use for authentication when reading the resources.
   *
   * @remarks
   *
   * By default all URL Readers will use the integrations config which is supplied
   * when creating the Readers. Sometimes it might be desireable to use the already
   * created URLReaders but with a different token, maybe that's supplied by the user
   * at runtime.
   */
  token?: string;
};

/**
 * A response object for {@link UrlReaderService.readUrl} operations.
 *
 * @public
 */
export type ReadUrlResponse = {
  /**
   * Returns the data that was read from the remote URL.
   */
  buffer(): Promise<Buffer>;

  /**
   * Returns the data that was read from the remote URL as a Readable stream.
   *
   * @remarks
   *
   * This method will be required in a future release.
   */
  stream?(): Readable;

  /**
   * Etag returned by content provider.
   *
   * @remarks
   *
   * Can be used to compare and cache responses when doing subsequent calls.
   */
  etag?: string;

  /**
   * Last modified date of the file contents.
   */
  lastModifiedAt?: Date;
};

/**
 * An options object for {@link UrlReaderService.readTree} operations.
 *
 * @public
 */
export type ReadTreeOptions = {
  /**
   * A filter that can be used to select which files should be included.
   *
   * @remarks
   *
   * The path passed to the filter function is the relative path from the URL
   * that the file tree is fetched from, without any leading '/'.
   *
   * For example, given the URL https://github.com/my/repo/tree/master/my-dir, a file
   * at https://github.com/my/repo/blob/master/my-dir/my-subdir/my-file.txt will
   * be represented as my-subdir/my-file.txt
   *
   * If no filter is provided, all files are extracted.
   */
  filter?(path: string, info?: { size: number }): boolean;

  /**
   * An ETag which can be provided to check whether a
   * {@link UrlReaderService.readTree} response has changed from a previous execution.
   *
   * @remarks
   *
   * In the {@link UrlReaderService.readTree} response, an ETag is returned along with
   * the tree blob. The ETag is a unique identifier of the tree blob, usually
   * the commit SHA or ETag from the target.
   *
   * When an ETag is given as a request option, {@link UrlReaderService.readTree} will
   * first compare the ETag against the ETag on the target branch. If they
   * match, {@link UrlReaderService.readTree} will throw a
   * {@link @backstage/errors#NotModifiedError} indicating that the response
   * will not differ from the previous response which included this particular
   * ETag. If they do not match, {@link UrlReaderService.readTree} will return the
   * rest of the response along with a new ETag.
   */
  etag?: string;

  /**
   * An abort signal to pass down to the underlying request.
   *
   * @remarks
   *
   * Not all reader implementations may take this field into account.
   */
  signal?: AbortSignal;

  /**
   * An optional token to use for authentication when reading the resources.
   *
   * @remarks
   *
   * By default all URL Readers will use the integrations config which is supplied
   * when creating the Readers. Sometimes it might be desireable to use the already
   * created URLReaders but with a different token, maybe that's supplied by the user
   * at runtime.
   */
  token?: string;
};

/**
 * Options that control {@link ReadTreeResponse.dir} execution.
 *
 * @public
 */
export type ReadTreeResponseDirOptions = {
  /**
   * The directory to write files to.
   *
   * @remarks
   *
   * Defaults to the OS tmpdir, or `backend.workingDirectory` if set in config.
   */
  targetDir?: string;
};

/**
 * A response object for {@link UrlReaderService.readTree} operations.
 *
 * @public
 */
export type ReadTreeResponse = {
  /**
   * Returns an array of all the files inside the tree, and corresponding
   * functions to read their content.
   */
  files(): Promise<ReadTreeResponseFile[]>;

  /**
   * Returns the tree contents as a binary archive, using a stream.
   */
  archive(): Promise<NodeJS.ReadableStream>;

  /**
   * Extracts the tree response into a directory and returns the path of the
   * directory.
   *
   * **NOTE**: It is the responsibility of the caller to remove the directory after use.
   */
  dir(options?: ReadTreeResponseDirOptions): Promise<string>;

  /**
   * Etag returned by content provider.
   *
   * @remarks
   *
   * Can be used to compare and cache responses when doing subsequent calls.
   */
  etag: string;
};

/**
 * Represents a single file in a {@link UrlReaderService.readTree} response.
 *
 * @public
 */
export type ReadTreeResponseFile = {
  /**
   * The filepath of the data.
   */
  path: string;

  /**
   * The binary contents of the file.
   */
  content(): Promise<Buffer>;

  /**
   * The last modified timestamp of the data.
   */
  lastModifiedAt?: Date;
};

/**
 * An options object for search operations.
 *
 * @public
 */
export type SearchOptions = {
  /**
   * An etag can be provided to check whether the search response has changed from a previous execution.
   *
   * In the search() response, an etag is returned along with the files. The etag is a unique identifier
   * of the current tree, usually the commit SHA or etag from the target.
   *
   * When an etag is given in SearchOptions, search will first compare the etag against the etag
   * on the target branch. If they match, search will throw a NotModifiedError indicating that the search
   * response will not differ from the previous response which included this particular etag. If they mismatch,
   * search will return the rest of SearchResponse along with a new etag.
   */
  etag?: string;

  /**
   * An abort signal to pass down to the underlying request.
   *
   * @remarks
   *
   * Not all reader implementations may take this field into account.
   */
  signal?: AbortSignal;

  /**
   * An optional token to use for authentication when reading the resources.
   *
   * @remarks
   *
   * By default all URL Readers will use the integrations config which is supplied
   * when creating the Readers. Sometimes it might be desireable to use the already
   * created URLReaders but with a different token, maybe that's supplied by the user
   * at runtime.
   */
  token?: string;
};

/**
 * The output of a search operation.
 *
 * @public
 */
export type SearchResponse = {
  /**
   * The files that matched the search query.
   */
  files: SearchResponseFile[];

  /**
   * A unique identifier of the current remote tree, usually the commit SHA or etag from the target.
   */
  etag: string;
};

/**
 * Represents a single file in a search response.
 *
 * @public
 */
export type SearchResponseFile = {
  /**
   * The full URL to the file.
   */
  url: string;

  /**
   * The binary contents of the file.
   */
  content(): Promise<Buffer>;

  /**
   * The last modified timestamp of the data.
   */
  lastModifiedAt?: Date;
};
