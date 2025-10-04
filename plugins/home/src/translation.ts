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

/**
 * @alpha
 */
export const homeTranslationRef = createTranslationRef({
  id: 'home',
  messages: {
    addWidgetDialog: {
      title: 'Add new widget to dashboard',
    },
    customHomepageButtons: {
      edit: 'Edit',
      restoreDefaults: 'Restore defaults',
      clearAll: 'Clear all',
      addWidget: 'Add widget',
      save: 'Save',
      cancel: 'Cancel',
    },
    customHomepage: {
      noWidgets: "No widgets added. Start by clicking the 'Add widget' button.",
    },
    widgetSettingsOverlay: {
      editSettingsTooptip: 'Edit settings',
      deleteWidgetTooltip: 'Delete widget',
      submitButtonTitle: 'Submit',
      cancelButtonTitle: 'Cancel',
    },
    starredEntityListItem: {
      removeFavoriteEntityTitle: 'Remove entity from favorites',
    },
    visitList: {
      empty: {
        title: 'There are no visits to show yet.',
        description:
          'Once you start using Backstage, your visits will appear here as a quick link to carry on where you left off.',
      },
      few: {
        title: 'The more pages you visit, the more pages will appear here.',
      },
    },
    quickStart: {
      title: 'Onboarding',
      description: 'Get started with Backstage',
      learnMoreLinkTitle: 'Learn more',
    },
    starredEntities: {
      noStarredEntitiesMessage:
        'Click the star beside an entity name to add it to this list!',
    },
    visitedByType: {
      action: {
        viewMore: 'View more',
        viewLess: 'View less',
      },
    },
    featuredDocsCard: {
      learnMoreTitle: 'LEARN MORE',
      empty: {
        title: 'No documents to show',
        description:
          'Create your own document. Check out our Getting Started Information',
        learnMoreLinkTitle: 'DOCS',
      },
    },
  },
});
