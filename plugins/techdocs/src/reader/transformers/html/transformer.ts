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
import {
  removeRestrictedAttributes,
  removeUnsafeIframes,
  removeUnsafeLinks,
  removeUnsafeMetaTags,
} from './hooks';

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

      DOMPurify.addHook('uponSanitizeElement', removeUnsafeMetaTags);

      DOMPurify.addHook('uponSanitizeAttribute', removeRestrictedAttributes);

      const tagNameCheck = config?.getOptionalString(
        'allowedCustomElementTagNameRegExp',
      );
      const attributeNameCheck = config?.getOptionalString(
        'allowedCustomElementAttributeNameRegExp',
      );
      const additionalAllowedURIProtocols =
        config?.getOptionalStringArray('additionalAllowedURIProtocols') || [];

      // Define allowed URI protocols, including any additional ones from the config.
      // The default protocols are based on the DOMPurify defaults.
      const allowedURIProtocols = [
        'callto',
        'cid',
        'ftp',
        'ftps',
        'http',
        'https',
        'mailto',
        'matrix',
        'sms',
        'tel',
        'xmpp',
        ...additionalAllowedURIProtocols,
      ].filter(Boolean);

      const allowedURIRegExp = new RegExp(
        // This regex is not exposed by DOMPurify, so we need to define it ourselves.
        // It is possible for this to drift from the default in future versions of DOMPurify.
        // See: https://raw.githubusercontent.com/cure53/DOMPurify/master/src/regexp.ts
        `^(?:${allowedURIProtocols.join(
          '|',
        )}:|[^a-z]|[a-z+.-]+(?:[^a-z+.\\-:]|$))`,
        'i',
      );

      // using outerHTML as we want to preserve the html tag attributes (lang)
      return DOMPurify.sanitize(dom.outerHTML, {
        ADD_TAGS: tags,
        FORBID_TAGS: ['style'],
        ADD_ATTR: ['http-equiv', 'content', 'dominant-baseline'],
        WHOLE_DOCUMENT: true,
        RETURN_DOM: true,
        ALLOWED_URI_REGEXP: allowedURIRegExp,
        CUSTOM_ELEMENT_HANDLING: {
          tagNameCheck: tagNameCheck ? new RegExp(tagNameCheck) : undefined,
          attributeNameCheck: attributeNameCheck
            ? new RegExp(attributeNameCheck)
            : undefined,
        },
      }) as Element;
    },
    [config],
  );
};
