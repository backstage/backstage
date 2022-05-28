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
import { useMemo, useCallback } from 'react';

import { useApi, configApiRef } from '@backstage/core-plugin-api';

import { Transformer } from '../transformer';
import { removeUnsafeLinks, removeUnsafeIframes } from './hooks';

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
 * Returns a transformer that sanitizes the dom's internal html.
 */
export const useSanitizerTransformer = (): Transformer => {
  const config = useSanitizerConfig();

  return useCallback(
    async (dom: Element) => {
      const hosts = config?.getOptionalStringArray('allowedIframeHosts');

      DOMPurify.addHook('beforeSanitizeElements', removeUnsafeLinks);
      const tags = ['link'];

      if (hosts) {
        tags.push('iframe');
        DOMPurify.addHook('beforeSanitizeElements', removeUnsafeIframes(hosts));
      }

      return DOMPurify.sanitize(dom.innerHTML, {
        ADD_TAGS: tags,
        FORBID_TAGS: ['style'],
        WHOLE_DOCUMENT: true,
        RETURN_DOM: true,
      });
    },
    [config],
  );
};
