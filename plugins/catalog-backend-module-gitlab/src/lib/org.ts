/*
 * Copyright 2021 The Backstage Authors
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

export function parseGitLabGroupUrl(url: string): null | string {
  let path = new URL(url).pathname.substr(1).split('/');

  // handle "/" pathname resulting in an array with the empty string
  if (path.length === 1 && path[0].length === 0) {
    return null; // no group path
  }

  if (path.length >= 1) {
    // handle reserved groups keyword if present
    if (path[0] === 'groups') {
      path = path.slice(1);
    }

    // group path cannot be empty after /groups/
    if (path.length === 0) {
      throw new Error('GitLab group URL is missing a group path');
    }

    // consume each path component until /-/ which is used to delimit subpages
    const components = [];
    for (const component of path) {
      if (component === '-') {
        break;
      }
      components.push(component);
    }
    return components.join('/');
  }

  throw new Error('GitLab group URL is invalid');
}
