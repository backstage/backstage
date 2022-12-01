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
// strongly inspired from https://github.com/adamjarret/parse-refresh-redirect/blob/master/index.js
import { Parser } from 'htmlparser2';

const pattern = /\d*;?\s*url=(.+)/i;

function parseMetaRefreshContent(content: string): string | undefined {
  const matches = content.match(pattern);
  const url = matches ? matches[1] : undefined;
  return url;
}

/**
 *
 * @param text HTML string to parse
 * @returns URL to redirect to or undefined
 */
export function parseRefresh(text: string) {
  const resultHolder: Record<string, string | undefined> = {};
  const metaParser = buildMetaParser(resultHolder);
  metaParser.parseComplete(text);
  return resultHolder.redirect;
}

function buildMetaParser(resultHolder: Record<string, string | undefined>) {
  return new Parser({
    onopentag(name, attributes) {
      if (name === 'meta' && attributes['http-equiv'] === 'refresh') {
        const redirect = parseMetaRefreshContent(attributes.content);
        resultHolder.redirect = redirect;
      }
    },
  });
}

/**
 * Resolve a relative path compared to a given base path
 * @param basePath base path to start from
 * @param relativePath relative path to apply to base path to transform
 * @returns resolved path
 */
export function resolveRelPath(basePath: string, relativePath: string) {
  if (relativePath.startsWith('/')) {
    return relativePath;
  } else if (!relativePath.includes('../')) {
    // we do not have ../ items
    if (basePath.endsWith('/')) {
      return basePath + relativePath;
    }
    const lastSlash = basePath.lastIndexOf('/');
    const basedir = basePath.substring(0, lastSlash);
    return `${basedir}/${relativePath}`;
  }
  const countOfDotdotslash = relativePath.split('../').length - 1;
  const pathSplit = basePath.split('/');
  const finalPath = pathSplit
    .slice(0, pathSplit.length - countOfDotdotslash)
    .join('/');
  const rpWithoutDds = relativePath.replace('../', '');
  return `${finalPath}/${rpWithoutDds}`;
}
