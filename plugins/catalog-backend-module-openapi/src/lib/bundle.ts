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
import type {
  ParserOptions,
  ResolverOptions,
} from '@apidevtools/json-schema-ref-parser';
import { parse, stringify } from 'yaml';

const protocolPattern = /^(\w{2,}):\/\//i;
const getProtocol = (refPath: string) => {
  const match = protocolPattern.exec(refPath);
  if (match) {
    return match[1].toLowerCase();
  }
  return undefined;
};

export type BundlerRead = (url: string) => Promise<Buffer>;

export type BundlerResolveUrl = (url: string, base: string) => string;

// Preserved references paths for AsyncAPI v3 documents
const asyncApiV3PreservedPaths = [
  /#\/channels\/.*\/servers/,
  /#\/operations\/.*\/channel/,
  /#\/operations\/.*\/messages/,
  /#\/operations\/.*\/reply\/channel/,
  /#\/operations\/.*\/reply\/messages/,
  /#\/components\/channels\/.*\/servers/,
  /#\/components\/operations\/.*\/channel/,
  /#\/components\/operations\/.*\/messages/,
  /#\/components\/operations\/.*\/reply\/channel/,
  /#\/components\/operations\/.*\/reply\/messages/,
];

export async function bundleFileWithRefs(
  fileWithRefs: string,
  baseUrl: string,
  read: BundlerRead,
  resolveUrl: BundlerResolveUrl,
): Promise<string> {
  // file.baseUrl from the parser is a filesystem path, not an SCM URL. For
  // nested refs (depth > 1) we need the parent's SCM URL to resolve against,
  // so we track the translation from each read file's internal URL to the
  // SCM URL we computed for it.
  const resolvedUrlMap = new Map<string, string>();

  const fileUrlReaderResolver: ResolverOptions = {
    canRead: file => {
      const protocol = getProtocol(file.url);
      return protocol === undefined || protocol === 'file';
    },
    read: async file => {
      const ref = file.reference ?? file.url;
      const parentBaseUrl = file.baseUrl?.split('#')[0];
      const parentUrl = parentBaseUrl
        ? resolvedUrlMap.get(parentBaseUrl) ?? baseUrl
        : baseUrl;
      const url = resolveUrl(ref, parentUrl);
      resolvedUrlMap.set(file.url, url);
      return await read(url);
    },
  };
  const httpUrlReaderResolver: ResolverOptions = {
    canRead: ref => {
      const protocol = getProtocol(ref.url);
      return protocol === 'http' || protocol === 'https';
    },
    read: async ref => {
      const reference = ref.reference ?? ref.url;
      const parentBaseUrl = ref.baseUrl?.split('#')[0];
      const parentUrl = parentBaseUrl
        ? resolvedUrlMap.get(parentBaseUrl) ?? baseUrl
        : baseUrl;
      const url = resolveUrl(reference, parentUrl);
      resolvedUrlMap.set(ref.url, url);
      return await read(url);
    },
  };
  const options: ParserOptions = {
    resolve: {
      file: fileUrlReaderResolver,
      http: httpUrlReaderResolver,
    },
  };

  const fileObject = parse(fileWithRefs);

  if (fileObject.asyncapi) {
    const version = parseInt(fileObject.asyncapi, 10);

    if (version === 3) {
      options.bundle = {
        excludedPathMatcher: (refPath: string): any => {
          return asyncApiV3PreservedPaths.some(pattern =>
            pattern.test(refPath),
          );
        },
      };
    }
  }
  const { $RefParser } = await import('@apidevtools/json-schema-ref-parser');
  const bundledObject = await $RefParser.bundle(fileObject, options);
  return stringify(bundledObject);
}
