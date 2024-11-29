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

import { TechDocsStorageApi } from '@backstage/plugin-techdocs-react';

/**
 * Checks whether a node is iframe or not.
 * @param node - can be any element.
 * @returns true when node is iframe.
 */
const isIframe = (node: Element) => node.nodeName === 'IFRAME';

const parseRelativeUrl = (resource: string, baseApiUrl: string) => {
  try {
    // Extract the frontend base path from document.baseURI (e.g., '/docs/default/Resource/simple-docs/')
    const frontendBaseUrl = new URL(document.baseURI).pathname;

    let updatedResource = resource;

    if (resource.startsWith('.')) {
      updatedResource = resource.slice(1);
    }

    const constructedUrl = `${baseApiUrl}/static${frontendBaseUrl}${updatedResource}`;
    const parsedUrl = new URL(constructedUrl);

    return parsedUrl.href;
  } catch (error) {
    return null;
  }
};

/**
 * Checks whether a iframe is safe or not.
 * @param node - is an iframe element.
 * @param hosts - list of allowed hosts.
 * @returns true when iframe is included in hosts.
 */
const isSafe = (node: Element, hosts: string[], baseApiUrl: string) => {
  const src = node.getAttribute('src') || '';
  try {
    const { host } = new URL(src);
    return hosts.includes(host);
  } catch {
    node.setAttribute('src', parseRelativeUrl(src, baseApiUrl) || '');
    return true;
  }
};

/**
 * Returns a function that removes unsafe iframe nodes.
 * @param node - can be any element.
 * @param hosts - list of allowed hosts.
 */
export const removeUnsafeIframes =
  (hosts: string[], techdocsStorageApi: TechDocsStorageApi) =>
  async (node: Element) => {
    const baseApiUrl = await techdocsStorageApi.getApiOrigin();
    if (!isIframe(node)) {
      return node;
    }

    if (!isSafe(node, hosts, baseApiUrl)) {
      node.remove();
    }
    return node;
  };
