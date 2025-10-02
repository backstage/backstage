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
import { createTranslationRef } from '@backstage/frontend-plugin-api';

/** @alpha */
export const catalogGraphTranslationRef = createTranslationRef({
  id: 'catalog-graph',
  messages: {
    catalogGraphCard: {
      title: 'Relations',
      deepLinkTitle: 'View graph',
    },
    catalogGraphPage: {
      title: 'Catalog Graph',
      filterToggleButtonTitle: 'Filters',
      supportButtonDescription:
        'Start tracking your component in by adding it to the software catalog.',
      simplifiedSwitchLabel: 'Simplified',
      mergeRelationsSwitchLabel: 'Merge relations',
      zoomOutDescription:
        'Use pinch &amp; zoom to move around the diagram. Click to change active node, shift click to navigate to entity.',
      curveFilter: {
        title: 'Curve',
        curveMonotoneX: 'Monotone X',
        curveStepBefore: 'Step Before',
      },
      directionFilter: {
        title: 'Direction',
        leftToRight: 'Left to right',
        rightToLeft: 'Right to left',
        topToBottom: 'Top to bottom',
        bottomToTop: 'Bottom to top',
      },
      maxDepthFilter: {
        title: 'Max depth',
        inputPlaceholder: '∞ Infinite',
        clearButtonAriaLabel: 'clear max depth',
      },
      selectedKindsFilter: {
        title: 'Kinds',
      },
      selectedRelationsFilter: {
        title: 'Relations',
      },
    },
  },
});
