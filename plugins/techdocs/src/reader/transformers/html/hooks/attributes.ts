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
import { UponSanitizeAttributeHook } from 'dompurify';

/**
 * Removes attributes that should only be present on meta tags from other elements.
 * This ensures that http-equiv and content attributes are only allowed on meta tags
 * where they are required for the redirect feature.
 */
export const removeRestrictedAttributes: UponSanitizeAttributeHook = (
  node,
  data,
) => {
  if (node.tagName !== 'META') {
    if (data.attrName === 'http-equiv' || data.attrName === 'content') {
      node.removeAttribute(data.attrName);
    }
  }
};
