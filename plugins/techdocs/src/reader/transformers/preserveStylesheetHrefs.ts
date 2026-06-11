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

import { CompoundEntityRef } from '@backstage/catalog-model';
import { TechDocsStorageApi } from '../../api';
import type { Transformer } from './transformer';

export const STYLESHEET_HREFS_DATASET = 'techdocsStylesheetHrefs';

export function extractStylesheetHrefs(dom: Element): string[] {
  return Array.from(
    dom.querySelectorAll<HTMLLinkElement>('head link[rel="stylesheet"]'),
  )
    .map(link => link.getAttribute('href') ?? '')
    .filter(Boolean);
}

/**
 * Capture stylesheet hrefs before the sanitizer may remove link tags.
 */
export const preserveStylesheetHrefs = (): Transformer => {
  return dom => {
    const hrefs = extractStylesheetHrefs(dom);
    if (hrefs.length > 0) {
      (dom as HTMLElement).dataset[STYLESHEET_HREFS_DATASET] =
        JSON.stringify(hrefs);
    }
    return dom;
  };
};

type ResolvePreservedStylesheetHrefsOptions = {
  techdocsStorageApi: TechDocsStorageApi;
  entityId: CompoundEntityRef;
  path: string;
};

/**
 * Resolve preserved relative stylesheet hrefs to absolute TechDocs storage URLs.
 */
export const resolvePreservedStylesheetHrefs = ({
  techdocsStorageApi,
  entityId,
  path,
}: ResolvePreservedStylesheetHrefsOptions): Transformer => {
  return async dom => {
    const element = dom as HTMLElement;
    const raw = element.dataset[STYLESHEET_HREFS_DATASET];
    if (!raw) {
      return dom;
    }

    let hrefs: string[];
    try {
      hrefs = JSON.parse(raw);
    } catch {
      return dom;
    }

    if (!Array.isArray(hrefs) || hrefs.length === 0) {
      return dom;
    }

    const resolved = await Promise.all(
      hrefs.map(href => techdocsStorageApi.getBaseUrl(href, entityId, path)),
    );
    const unique = resolved.filter(Boolean);
    if (unique.length > 0) {
      element.dataset[STYLESHEET_HREFS_DATASET] = JSON.stringify(unique);
    }

    return dom;
  };
};
