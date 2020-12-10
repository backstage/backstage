/*
 * Copyright 2020 Spotify AB
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
import recursiveReadDir from 'recursive-readdir';

export type responseHeadersType = {
  'Content-Type': string;
};

/**
 * Some files need special headers to be used correctly by the frontend. This function
 * generates headers in the response to those file requests.
 * @param {string} fileExtension html, css, js etc.
 */
export const getHeadersForFileExtension = (
  fileExtension: string,
): responseHeadersType => {
  const headersCommon = {
    'Content-Type': 'text/plain',
  };
  const headersHTML = {
    ...headersCommon,
    'Content-Type': 'text/html; charset=UTF-8',
  };

  const headersCSS = {
    ...headersCommon,
    'Content-Type': 'text/css; charset=UTF-8',
  };

  switch (fileExtension) {
    case 'html':
      return headersHTML;
    case 'css':
      return headersCSS;
    default:
      return headersCommon;
  }
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
