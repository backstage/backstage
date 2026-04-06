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

import { TechDocsShadowDom } from '@backstage/plugin-techdocs-react';
import { Progress } from '@backstage/core-components';

import { TechDocsStateIndicator } from '../../reader/components/TechDocsStateIndicator';
import { withTechDocsReaderProvider } from '../../reader/components/TechDocsReaderProvider';
import { TechDocsReaderPageContentAddons } from '../../reader/components/TechDocsReaderPageContent/TechDocsReaderPageContentAddons';
import type { TechDocsReaderPageContentProps } from '../../reader/components/TechDocsReaderPageContent/TechDocsReaderPageContent';
import { useTechDocsReaderContentData } from '../../hooks/useTechDocsReaderContentData';

export const TechDocsReaderContent = withTechDocsReaderProvider(
  (props: TechDocsReaderPageContentProps) => {
    const {
      dom,
      handleAppend,
      isNotFound,
      isDomReady,
      showProgress,
      NotFoundErrorPage,
    } = useTechDocsReaderContentData({
      defaultPath: props.defaultPath,
      onReady: props.onReady,
    });

    if (isNotFound) return <NotFoundErrorPage />;

    if (!isDomReady) {
      return <TechDocsStateIndicator />;
    }

    return (
      <>
        <TechDocsStateIndicator />
        {showProgress && <Progress />}
        <TechDocsShadowDom element={dom!} onAppend={handleAppend}>
          <TechDocsReaderPageContentAddons />
        </TechDocsShadowDom>
      </>
    );
  },
);
