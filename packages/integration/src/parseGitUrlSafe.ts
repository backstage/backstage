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
import parseGitUrl from 'git-url-parse';

/**
 * Wraps git-url-parse and rejects URLs whose decoded components contain
 * path traversal segments, and whose repository path contains URL fragment
 * or query delimiters. Without this check, a URL like
 * `https://github.com/o/r/blob/main/%2e%2e%2f%2e%2e%2fuser/repos` would be
 * decoded to `../../user/repos` and could escape the expected API path when
 * interpolated into provider API URLs. The same applies to the other parts
 * of the repository path, such as an owner that decodes to something
 * containing `..` segments or `#` / `?` delimiters, which can otherwise
 * redirect the resulting request to a different API path. The reference and
 * file path may contain delimiters, since they only ever appear after the
 * repository path in the constructed request URLs.
 *
 * The delimiter check can be skipped for the repository path components with
 * the `allowUrlDelimiters` option, for consumers that use the parse result
 * for something other than constructing request URLs.
 *
 * This is intentionally not part of the package API. It is shared within the
 * monorepo, where the URL readers import it directly.
 */
export function parseGitUrlSafe(
  url: string,
  options: { allowUrlDelimiters?: boolean } = {},
) {
  const parsed = parseGitUrl(url);
  // The filepath only ever ends up as a trailing part of the intended API
  // path, so it can't redirect requests elsewhere on its own, but it still
  // needs the traversal check. The other components are interpolated into
  // positions of the URL where traversal segments or URL delimiters can
  // redirect the request to a different API path.
  assertSafeScmUrlComponent(parsed.filepath, { allowUrlDelimiters: true });
  for (const component of [parsed.owner, parsed.name, parsed.full_name]) {
    assertSafeScmUrlComponent(component, options);
  }
  // References may legitimately contain URL delimiters, such as a branch
  // name that contains `#`. They only ever appear after the owner and
  // repository name in the constructed request URLs, so they can't redirect
  // the request to a different API path. They still need the traversal check.
  assertSafeScmUrlComponent(parsed.ref, { allowUrlDelimiters: true });
  return parsed;
}

function assertSafeScmUrlComponent(
  component: string | undefined,
  options: { allowUrlDelimiters?: boolean } = {},
) {
  if (!component) {
    return;
  }

  let decoded = component;
  let previous;
  do {
    previous = decoded;
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      break;
    }
  } while (decoded !== previous);

  // Tabs and newlines are removed from a URL before it is parsed, so they can
  // sit inside a dot segment of a component while the request URL that the
  // component ends up in still resolves them as traversal
  decoded = decoded.replace(/[\t\n\r]/g, '');

  if (
    decoded.split(/[\\/?#]/).some(segment => {
      // A malformed escape elsewhere in the component can stop the decoding
      // above early, leaving dot segments percent-encoded; they still act
      // as dot segments once the component lands in a request URL. The
      // query and fragment delimiters split segments for the same reason:
      // a `..?` or `..#` segment ends the path of the request URL, leaving
      // a dot segment behind it
      const normalized = segment.replace(/%2e/gi, '.');
      return normalized === '..' || normalized === '.';
    })
  ) {
    throw new Error(
      'Invalid SCM URL: path traversal is not allowed in the URL',
    );
  }

  if (
    !options.allowUrlDelimiters &&
    (decoded.includes('#') || decoded.includes('?'))
  ) {
    throw new Error(
      'Invalid SCM URL: URL fragment and query delimiters are not allowed in the repository path of the URL',
    );
  }
}
