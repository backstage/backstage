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

import React, { useCallback } from 'react';

import {
  TechDocsShadowDom,
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';

import { useMkDocsReaderDom } from '../useMkDocsReaderDom';
import { MkDocsReaderContentAddons } from '../MkDocsReaderContentAddons';
import { useMkDocsReaderPage } from '../MkDocsReaderPage';

/**
 * TechDocs reader page content that uses mkdocs.
 * @public
 */
export const MkDocsReaderContent = () => {
  const { entityRef, setReady } = useTechDocsReaderPage();
  const { setShadowRoot } = useMkDocsReaderPage();

  const dom = useMkDocsReaderDom(entityRef);

  const handleAppend = useCallback(
    (shadowRoot: ShadowRoot) => {
      setReady(true);
      setShadowRoot(shadowRoot);
    },
    [setReady, setShadowRoot],
  );

  if (!dom) {
    return null;
  }

  // Centers the styles loaded event to avoid having multiple locations setting the opacity style in Shadow Dom causing the screen to flash multiple times
  return (
    <TechDocsShadowDom element={dom} onAppend={handleAppend}>
      <MkDocsReaderContentAddons />
    </TechDocsShadowDom>
  );
};
