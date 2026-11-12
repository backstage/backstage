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

import { type ReactNode } from 'react';
import {
  BreadcrumbsContext,
  useBreadcrumbsRegistry,
} from './breadcrumbsRegistry';
import { PageTitleContext, usePageTitleRegistry } from './pageTitleRegistry';

/**
 * Provides the registries that pages and their content report to, such as
 * breadcrumbs and document title segments, from the root of the app.
 *
 * @internal
 */
export function PageRegistryProvider(props: { children: ReactNode }) {
  const breadcrumbs = useBreadcrumbsRegistry();
  const pageTitles = usePageTitleRegistry();
  return (
    <BreadcrumbsContext.Provider value={breadcrumbs}>
      <PageTitleContext.Provider value={pageTitles}>
        {props.children}
      </PageTitleContext.Provider>
    </BreadcrumbsContext.Provider>
  );
}
