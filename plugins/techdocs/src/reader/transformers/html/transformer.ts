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
import { removeUnsafeIframes, removeUnsafeLinks, isHost } from './hooks';
import {
  readStringArrayOrConfigArrayFromConfig,
  isSimpleIframeConfig,
} from './transformerHelpers';

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
      const iframeConfigs = readStringArrayOrConfigArrayFromConfig(
        config,
        'allowedIframeHosts',
      );
      // holds all allowable iframe attributes since some attributes  might be custom
      // and will be stripped at the end even if allowed through the uponSanitizeElement
      const allIframeAllowedAttributes = ['src'];

      DOMPurify.addHook('beforeSanitizeElements', removeUnsafeLinks);
      const tags = ['link', 'meta'];

      if (iframeConfigs) {
        tags.push('iframe');

        const hosts = [];
        if (isSimpleIframeConfig(iframeConfigs)) {
          hosts.push(...iframeConfigs);
        } else {
          // by default we need to keep track of 'all' original iframe attributes to allow DOMPurify to handle them normally
          const baseAllowedAttributes = [
            'allow',
            'allowfullscreen',
            'allowpaymentrequest',
            'browsingtopics',
            'credentialless',
            'csp',
            'height',
            'loading',
            'name',
            'referrerpolicy',
            'sandbox',
            'src',
            'srcdoc',
            'width',
          ];

          for (const iframeConfig of iframeConfigs) {
            // check that the config is correct
            const validKeys = ['src', 'allowedAttributes'];
            for (const key of iframeConfig.keys()) {
              if (!validKeys.includes(key)) {
                const valid = validKeys.map(k => `'${k}'`).join(', ');
                throw new Error(
                  `Invalid key '${key}' in 'allowedIframeHosts' config, expected one of ${valid}`,
                );
              }
            }

            const host = iframeConfig.getString('src');
            hosts.push(host);

            const currentIframeAllowedAttributes =
              iframeConfig.getOptionalStringArray('allowedAttributes') || [];
            // add to our list of allowed attributes for not stripping at the end
            allIframeAllowedAttributes.push(...currentIframeAllowedAttributes);
            const allowedAttributes = baseAllowedAttributes.concat(
              currentIframeAllowedAttributes,
            );

            DOMPurify.addHook('uponSanitizeElement', (currNode, data) => {
              if (data.tagName === 'iframe') {
                if (isHost(currNode, host)) {
                  for (const attr of currNode.attributes) {
                    if (
                      baseAllowedAttributes.includes(
                        attr.name.toLocaleLowerCase(),
                      )
                    ) {
                      break;
                    }
                    if (
                      !allowedAttributes.includes(attr.name.toLocaleLowerCase())
                    ) {
                      currNode.removeAttribute(attr.name);
                    }
                  }
                }
              }
            });
          }
        }
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
        ADD_ATTR: ['http-equiv', 'content', ...allIframeAllowedAttributes],
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
