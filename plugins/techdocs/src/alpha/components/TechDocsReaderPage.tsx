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

// Deliberately a function call rather than a component. Addons are discovered
// by walking the router outlet as an element tree: the walk only follows
// `props.children` and never invokes a component, and this is also the only
// place the addon component data is attached. A component wrapper breaks both,
// because its children are built by a render that the walk never performs.
function renderAddons(addonOptions: TechDocsAddonOptions[]) {
  return (
    <TechDocsAddons>
      {addonOptions.map(options => {
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
  withFeedbackLink: boolean;
}) {
  return (
    <TechDocsReaderRouter>
      <TechDocsReaderLayout
        withSearch={props.withSearch}
        withHeader={props.withHeader}
        withFeedbackLink={props.withFeedbackLink}
      />
      {renderAddons(props.addonOptions)}
    </TechDocsReaderRouter>
  );
}

export function TechDocsEntityContent(props: {
  addonOptions: TechDocsAddonOptions[];
  emptyState?: ReactElement;
  withFeedbackLink: boolean;
}) {
  return (
    <EmbeddedDocsRouter
      emptyState={props.emptyState}
      withFeedbackLink={props.withFeedbackLink}
    >
      {renderAddons(props.addonOptions)}
    </EmbeddedDocsRouter>
  );
}
