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

import useAsync from 'react-use/lib/useAsync';
import {
  techdocsStorageApiRef,
  useTechDocsReader,
  useTechDocsShadowDom,
} from '@backstage/plugin-techdocs';
import { useApi } from '@backstage/core-plugin-api';

export const useTechDocsApiOrigin = () => {
  const techdocsStorageApi = useApi(techdocsStorageApiRef);
  const { value } = useAsync(
    () => techdocsStorageApi.getApiOrigin(),
    [techdocsStorageApi],
  );
  return value;
};

type BaseUrlSetter<T extends HTMLElement> = (
  attributeName: string,
  attributeValue: string,
  baseUrl: string,
  element: T,
) => void | Promise<void>;

export const useTechDocsBaseUrl = <T extends HTMLElement>(
  selector: string,
  attributeName: string,
  setter?: BaseUrlSetter<T>,
) => {
  const dom = useTechDocsShadowDom();
  const { path, entityRef } = useTechDocsReader();
  const techdocsStorageApi = useApi(techdocsStorageApiRef);

  const { loading } = useAsync(async () => {
    const elements = dom.querySelectorAll<T>(selector);
    if (!elements.length) return;
    for await (const element of elements) {
      const attributeValue = element.getAttribute(attributeName);

      if (!attributeValue) continue;

      const baseUrl = await techdocsStorageApi.getBaseUrl(
        attributeValue,
        entityRef,
        path,
      );

      if (typeof setter === 'function') {
        await setter(attributeName, attributeValue, baseUrl, element);
        continue;
      }

      element.setAttribute(attributeName, baseUrl);
    }
  }, [dom, path, entityRef, techdocsStorageApi]);

  return loading;
};
