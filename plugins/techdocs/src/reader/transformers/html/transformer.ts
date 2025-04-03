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

import DOMPurify from 'dompurify';
import { useCallback, useMemo } from 'react';

import { configApiRef, useApi } from '@backstage/core-plugin-api';

import { Transformer } from '../transformer';
import { removeUnsafeIframes, removeUnsafeLinks } from './hooks';

/**
 * Returns html sanitizer configuration
 */
const useSanitizerConfig = () => {
  const configApi = useApi(configApiRef);

  return useMemo(() => {
    return configApi.getOptionalConfig('techdocs.sanitizer');
  }, [configApi]);
};

/**
 * Returns a transformer that sanitizes the dom
 */
export const useSanitizerTransformer = (): Transformer => {
  const config = useSanitizerConfig();

  return useCallback(
    async (dom: Element) => {
      const hosts = config?.getOptionalStringArray('allowedIframeHosts');

      DOMPurify.addHook('beforeSanitizeElements', removeUnsafeLinks);
      const tags = ['link', 'meta'];

      if (hosts) {
        tags.push('iframe');
        DOMPurify.addHook('beforeSanitizeElements', removeUnsafeIframes(hosts));
      }

      // Only allow meta tags if they are used for refreshing the page. They are required for the redirect feature.
      DOMPurify.addHook('uponSanitizeElement', (currNode, data) => {
        if (data.tagName === 'meta') {
          const isMetaRefreshTag =
            currNode.getAttribute('http-equiv') === 'refresh' &&
            currNode.getAttribute('content')?.includes('url=');
          if (!isMetaRefreshTag) {
            currNode.parentNode?.removeChild(currNode);
          }
        }
      });

      // Only allow http-equiv and content attributes on meta tags. They are required for the redirect feature.
      DOMPurify.addHook('uponSanitizeAttribute', (currNode, data) => {
        if (currNode.tagName !== 'meta') {
          if (data.attrName === 'http-equiv' || data.attrName === 'content') {
            currNode.removeAttribute(data.attrName);
          }
        }
      });

      const tagNameCheck = config?.getOptionalString(
        'allowedCustomElementTagNameRegExp',
      );
      const attributeNameCheck = config?.getOptionalString(
        'allowedCustomElementAttributeNameRegExp',
      );

      // using outerHTML as we want to preserve the html tag attributes (lang)
      return DOMPurify.sanitize(dom.outerHTML, {
        ADD_TAGS: tags,
        FORBID_TAGS: ['style'],
        ADD_ATTR: ['http-equiv', 'content', 'dominant-baseline'],
        WHOLE_DOCUMENT: true,
        RETURN_DOM: true,
        CUSTOM_ELEMENT_HANDLING: {
          tagNameCheck: tagNameCheck ? new RegExp(tagNameCheck) : undefined,
          attributeNameCheck: attributeNameCheck
            ? new RegExp(attributeNameCheck)
            : undefined,
        },
      });
    },
    [config],
  );
};
