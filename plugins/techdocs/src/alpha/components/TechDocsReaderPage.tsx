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

import { ReactElement, Suspense } from 'react';
import {
  TechDocsAddons,
  type TechDocsAddonOptions,
} from '@backstage/plugin-techdocs-react';
import { attachTechDocsAddonComponentData } from '@backstage/plugin-techdocs-react/alpha';
import { EmbeddedDocsRouter, TechDocsReaderRouter } from '../../Router';
import { TechDocsReaderLayout } from './TechDocsReaderLayout';

function Addons(props: { options: TechDocsAddonOptions[] }) {
  return (
    <TechDocsAddons>
      {props.options.map(options => {
        const Addon = options.component;
        attachTechDocsAddonComponentData(Addon, options);
        return (
          <Suspense key={options.name} fallback={null}>
            <Addon />
          </Suspense>
        );
      })}
    </TechDocsAddons>
  );
}

export function TechDocsReaderPage(props: {
  addonOptions: TechDocsAddonOptions[];
  withSearch: boolean;
  withHeader: boolean;
}) {
  // The reader layout renders `TechDocsReaderPageContentAddons`, whose
  // `useTechDocsAddons()` reads the addon registry from the outlet (see
  // TechDocsReaderRouter: children become the `*` route element). The
  // registry MUST therefore be an outlet child: a sibling renders into a
  // different outlet context, its addons are invisible to the content, and
  // the reader shows docs with zero addon UI. See issue #35727.
  return (
    <TechDocsReaderRouter>
      <TechDocsReaderLayout
        withSearch={props.withSearch}
        withHeader={props.withHeader}
      >
        <Addons options={props.addonOptions} />
      </TechDocsReaderLayout>
    </TechDocsReaderRouter>
  );
}

export function TechDocsEntityContent(props: {
  addonOptions: TechDocsAddonOptions[];
  emptyState?: ReactElement;
}) {
  return (
    <EmbeddedDocsRouter emptyState={props.emptyState}>
      <Addons options={props.addonOptions} />
    </EmbeddedDocsRouter>
  );
}
