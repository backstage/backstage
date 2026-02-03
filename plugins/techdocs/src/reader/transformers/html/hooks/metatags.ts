/*
 * Copyright 2025 The Backstage Authors
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
import { UponSanitizeElementHook } from 'dompurify';
import { isElement } from '../utils';

/**
 * Checks if a meta tag is a refresh redirect tag that should be allowed.
 * These tags are required for the TechDocs redirect feature.
 */
const isAllowedMetaRefreshTag = (element: Element): boolean => {
  const httpEquiv = element.getAttribute('http-equiv');
  const content = element.getAttribute('content');

  return httpEquiv === 'refresh' && content?.includes('url=') === true;
};

/**
 * Removes unsafe meta tags from the DOM while preserving allowed refresh redirect tags.
 * Only meta tags used for page refreshing/redirects are allowed as they are required
 * for the TechDocs redirect feature.
 */
export const removeUnsafeMetaTags: UponSanitizeElementHook = (node, data) => {
  if (!isElement(node)) return;

  if (data.tagName === 'meta' && !isAllowedMetaRefreshTag(node)) {
    node.parentNode?.removeChild(node);
  }
};
