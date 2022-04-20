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

/**
 * Examines a full URL and extracts a group reference out of it.
 *
 * @remarks
 *
 * Examples:
 *
 * https://example.com/a/b -> a/b
 * https://example.com/groups/a/b -> a/b
 * https://example.com/groups/a/b/-/foo -> a/b
 */
export function parseGroupUrl(
  url: string,
  baseUrl?: string,
): string | undefined {
  let path = getUrlPathComponents(url, baseUrl);

  // handle reserved groups keyword if present
  if (path[0] === 'groups') {
    path = path.slice(1);
  }

  // handle "/" pathname resulting in an array with the empty string
  if (!path.length) {
    return undefined; // no group path
  }

  // consume each path component until /-/ which is used to delimit sub-pages
  const dashPosition = path.indexOf('-');
  if (dashPosition !== -1) {
    path = path.slice(0, dashPosition);
  }

  if (!path.length) {
    return undefined;
  }

  return path.join('/');
}

/**
 * Takes the path of a URL and returns its component parts as an array of
 * strings.
 *
 * @remarks
 *
 * If a base URL is given, we check that the given URL matches the base, and
 * then remove the base parts from it, leaving only the parts that are on top of
 * the base ones.
 */
export function getUrlPathComponents(url: string, baseUrl?: string): string[] {
  function partsOf(urlToSplit: string) {
    const asUrl = new URL(urlToSplit);
    return [
      `${asUrl.protocol}://${asUrl.host}`,
      asUrl.pathname.split('/').filter(Boolean),
    ] as const;
  }

  const [currentHostAndProto, currentPathParts] = partsOf(url);
  if (!baseUrl) {
    return currentPathParts;
  }

  // ensure base url path components are a subset of the group path
  const [baseHostAndProto, basePathParts] = partsOf(baseUrl);
  if (
    baseHostAndProto !== currentHostAndProto ||
    !basePathParts.every(
      (component, index) => component === currentPathParts[index],
    )
  ) {
    throw new Error(
      `The GitLab base URL is not a substring of the GitLab target group URL: base: ${baseUrl}, target: ${url}`,
    );
  }

  // remove base url path components from target url group path components
  return currentPathParts.slice(basePathParts.length);
}
