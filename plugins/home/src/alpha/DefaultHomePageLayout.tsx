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

import { Fragment } from 'react';
import { Content } from '@backstage/core-components';
import type { HomePageLayoutProps } from '@backstage/plugin-home-react/alpha';
import { CustomHomepageGrid } from '../components';

/**
 * The default home page layout component.
 *
 * Renders widgets inside a `<CustomHomepageGrid/>` wrapped in `<Content/>`.
 * This is used when no custom layout extension is installed.
 */
export function DefaultHomePageLayout(props: HomePageLayoutProps) {
  const { widgets } = props;
  return (
    <Content>
      <CustomHomepageGrid>
        {widgets.map((widget, index) => (
          <Fragment key={widget.name ?? index}>{widget.component}</Fragment>
        ))}
      </CustomHomepageGrid>
    </Content>
  );
}
