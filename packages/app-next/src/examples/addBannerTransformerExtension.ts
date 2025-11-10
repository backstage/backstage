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

import { TransformerBlueprint } from '@backstage/plugin-techdocs-react/alpha';

export const bannerTransformer = TransformerBlueprint.make({
  name: 'test-banner',
  params: {
    phase: 'pre',
    priority: 45,
    transformer: async dom => {
      const banner = document.createElement('div');
      banner.style.backgroundColor = '#4caf50';
      banner.style.color = 'white';
      banner.style.padding = '1rem';
      banner.style.fontSize = '1.5rem';
      banner.style.fontWeight = 'bold';
      banner.style.textAlign = 'center';
      banner.style.margin = '0 0 1rem 0';
      banner.innerHTML = '🎉 CUSTOM TRANSFORMER IS WORKING! 🎉';

      // Find the content area and prepend the banner
      const content = dom.querySelector('.md-content__inner');
      if (content) {
        content.insertBefore(banner, content.firstChild);
      } else {
        // Fallback: try to insert at the start of the dom element itself
        if (dom.firstChild) {
          dom.insertBefore(banner, dom.firstChild);
        }
      }
      return dom;
    },
  },
});
