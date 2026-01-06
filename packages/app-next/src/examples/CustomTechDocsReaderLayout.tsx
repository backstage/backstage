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

import { TechDocsReaderPageContent } from '@backstage/plugin-techdocs';
import { TechDocsReaderLayoutProps } from '@backstage/plugin-techdocs-react/alpha';

/**
 * Example custom TechDocs reader layout component demonstrating
 * how to use the TechDocsReaderLayoutBlueprint.
 */
export function CustomTechDocsReaderLayout(props: TechDocsReaderLayoutProps) {
  const { withSearch = true } = props;

  return (
    <div>
      <div style={{ padding: '24px', background: 'red' }}>
        <h2>My Custom TechDocs Reader Layout</h2>
      </div>
      <TechDocsReaderPageContent withSearch={withSearch} />
    </div>
  );
}
