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

import { homePageWidgetDataRef } from '@backstage/plugin-home-react/alpha';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import type { ReactElement } from 'react';
import type { HomePageFeaturedTemplatesProps } from './HomePageFeaturedTemplates';
import { scaffolderFeaturedTemplatesWidget } from '../../extensions';

type FeaturedTemplatesElement = ReactElement<HomePageFeaturedTemplatesProps>;

describe('scaffolderFeaturedTemplatesWidget', () => {
  it('uses the default widget configuration', () => {
    const widget = createExtensionTester(scaffolderFeaturedTemplatesWidget).get(
      homePageWidgetDataRef,
    );

    expect(widget.title).toBe('Featured Templates');
    expect(widget.name).toBe('HomePageFeaturedTemplates');
    expect((widget.component as FeaturedTemplatesElement).props.tag).toBe(
      'featured',
    );
  });

  it('applies configuration overrides', () => {
    const tester = createExtensionTester(scaffolderFeaturedTemplatesWidget, {
      config: { title: 'Golden Paths', tag: 'golden-path' },
    });
    const widget = tester.get(homePageWidgetDataRef);

    expect(widget.title).toBe('Golden Paths');
    expect((widget.component as FeaturedTemplatesElement).props.tag).toBe(
      'golden-path',
    );
  });
});
