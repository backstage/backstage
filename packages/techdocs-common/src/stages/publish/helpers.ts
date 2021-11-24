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
import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import mime from 'mime-types';
import path from 'path';
import createLimiter from 'p-limit';
import recursiveReadDir from 'recursive-readdir';

/**
 * Helper to get the expected content-type for a given file extension. Also
 * takes XSS mitigation into account.
 */
const getContentTypeForExtension = (ext: string): string => {
  const defaultContentType = 'text/plain; charset=utf-8';

  // Prevent sanitization bypass by preventing browsers from directly rendering
  // the contents of untrusted files.
  if (ext.match(/htm|xml|svg/i)) {
    return defaultContentType;
  }

  return mime.contentType(ext) || defaultContentType;
};

export type responseHeadersType = {
  'Content-Type': string;
};

/**
 * Some files need special headers to be used correctly by the frontend. This function
 * generates headers in the response to those file requests.
 * @param {string} fileExtension .html, .css, .js, .png etc.
 */
export const getHeadersForFileExtension = (
  fileExtension: string,
): responseHeadersType => {
  return {
    'Content-Type': getContentTypeForExtension(fileExtension),
  };
};

/**
 * Recursively traverse all the sub-directories of a path and return
 * a list of absolute paths of all the files. e.g. tree command in Unix
 *
 * @example
 *
 * /User/username/my_dir
 *     dirA
 *     |   subDirA
 *     |   |   file1
 *     EmptyDir
 *     dirB
 *     |   file2
 *     file3
 *
 * getFileListRecursively('/Users/username/myDir')
 * // returns
 * [
 *   '/User/username/my_dir/dirA/subDirA/file1',
 *   '/User/username/my_dir/dirB/file2',
 *   '/User/username/my_dir/file3'
 * ]
 * @param rootDirPath Absolute path to the root directory.
 */
export const getFileTreeRecursively = async (
  rootDirPath: string,
): Promise<string[]> => {
  // Iterate on all the files in the directory and its sub-directories
  const fileList = await recursiveReadDir(rootDirPath).catch(error => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });
  return fileList;
};

/**
 * Takes a posix path and returns a lower-cased version of entity's triplet
 * with the remaining path in posix.
 *
 * Path must not include a starting slash.
 *
 * @example
 * lowerCaseEntityTriplet('default/Component/backstage')
 * // return default/component/backstage
 */
export const lowerCaseEntityTriplet = (posixPath: string): string => {
  const [namespace, kind, name, ...rest] = posixPath.split(path.posix.sep);
  const lowerNamespace = namespace.toLowerCase();
  const lowerKind = kind.toLowerCase();
  const lowerName = name.toLowerCase();
  return [lowerNamespace, lowerKind, lowerName, ...rest].join(path.posix.sep);
};

/**
 * Takes either a win32 or posix path and returns a lower-cased version of entity's triplet
 * with the remaining path in posix.
 *
 * Starting slashes will be trimmed.
 *
 * Throws an error if the path does not appear to be an entity triplet.
 *
 * @example
 * lowerCaseEntityTripletInStoragePath('/default/Component/backstage/file.txt')
 * // return default/component/backstage/file.txt
 */
export const lowerCaseEntityTripletInStoragePath = (
  originalPath: string,
): string => {
  let posixPath = originalPath;
  if (originalPath.includes(path.win32.sep)) {
    posixPath = originalPath.split(path.win32.sep).join(path.posix.sep);
  }

  // remove leading slash
  const parts = posixPath.split(path.posix.sep);
  if (parts[0] === '') {
    parts.shift();
  }

  // check if all parts of the entity exist (name, namespace, kind) plus filename
  if (parts.length <= 3) {
    throw new Error(
      `Encountered file unmanaged by TechDocs ${originalPath}. Skipping.`,
    );
  }

  return lowerCaseEntityTriplet(parts.join(path.posix.sep));
};

/**
 * Take a posix path and return a path without leading and trailing
 * separators
 *
 * @example
 * normalizeExternalStorageRootPath('/backstage-data/techdocs/')
 * // return backstage-data/techdocs
 */
export const normalizeExternalStorageRootPath = (posixPath: string): string => {
  // remove leading slash
  let normalizedPath = posixPath;
  if (posixPath.startsWith(path.posix.sep)) {
    normalizedPath = posixPath.slice(1);
  }

  // remove trailing slash
  if (normalizedPath.endsWith(path.posix.sep)) {
    normalizedPath = normalizedPath.slice(0, normalizedPath.length - 1);
  }

  return normalizedPath;
};

// Only returns the files that existed previously and are not present anymore.
export const getStaleFiles = (
  newFiles: string[],
  oldFiles: string[],
): string[] => {
  const staleFiles = new Set(oldFiles);
  newFiles.forEach(newFile => {
    staleFiles.delete(newFile);
  });
  return Array.from(staleFiles);
};

// Compose actual filename on remote bucket including entity information
export const getCloudPathForLocalPath = (
  entity: Entity,
  localPath = '',
  useLegacyPathCasing = false,
  externalStorageRootPath = '',
): string => {
  // Convert destination file path to a POSIX path for uploading.
  // GCS expects / as path separator and relativeFilePath will contain \\ on Windows.
  // https://cloud.google.com/storage/docs/gsutil/addlhelp/HowSubdirectoriesWork
  const relativeFilePathPosix = localPath.split(path.sep).join(path.posix.sep);

  // The / delimiter is intentional since it represents the cloud storage and not the local file system.
  const entityRootDir = `${
    entity.metadata?.namespace ?? ENTITY_DEFAULT_NAMESPACE
  }/${entity.kind}/${entity.metadata.name}`;

  const relativeFilePathTriplet = `${entityRootDir}/${relativeFilePathPosix}`;

  const destination = useLegacyPathCasing
    ? relativeFilePathTriplet
    : lowerCaseEntityTriplet(relativeFilePathTriplet);

  // Again, the / delimiter is intentional, as it represents remote storage.
  const destinationWithRoot = [
    // The extra filter prevents unintended double slashes and prefixes.
    ...externalStorageRootPath.split(path.posix.sep).filter(s => s !== ''),
    destination,
  ].join('/');

  return destinationWithRoot; // Remote storage file relative path
};

// Perform rate limited generic operations by passing a function and a list of arguments
export const bulkStorageOperation = async <T>(
  operation: (arg: T) => Promise<unknown>,
  args: T[],
  { concurrencyLimit } = { concurrencyLimit: 25 },
) => {
  const limiter = createLimiter(concurrencyLimit);
  await Promise.all(args.map(arg => limiter(operation, arg)));
};
