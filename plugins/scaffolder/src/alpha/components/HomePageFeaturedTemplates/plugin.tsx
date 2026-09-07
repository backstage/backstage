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

import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import { HomePageWidgetBlueprint } from '@backstage/plugin-home-react/alpha';
import { z } from 'zod';
import { selectedTemplateRouteRef, templatesRouteRef } from './routes';

const featuredTemplatesWidget = HomePageWidgetBlueprint.makeWithOverrides({
  configSchema: {
    title: z.string().trim().min(1).default('Featured Templates'),
    tag: z.string().trim().min(1).default('featured'),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      name: 'HomePageFeaturedTemplates',
      title: config.title,
      components: () =>
        import('./FeaturedTemplates').then(m => ({
          Content: m.FeaturedTemplates,
        })),
      componentProps: { tag: config.tag },
      layout: {
        width: { defaultColumns: 6, minColumns: 3 },
        height: { defaultRows: 6, minRows: 6 },
      },
    });
  },
});

export default createFrontendPlugin({
  pluginId: 'featured-templates',
  externalRoutes: {
    selectedTemplate: selectedTemplateRouteRef,
    templates: templatesRouteRef,
  },
  extensions: [featuredTemplatesWidget],
});
