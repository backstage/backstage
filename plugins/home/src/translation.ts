/*
 * Copyright 2023 The Backstage Authors
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

import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @alpha */
export const homePageTranslationRef = createTranslationRef({
  id: 'home',
  messages: {
    components: {
      customHomepage: {
        addWidgetDialog: {
          title: 'Add new widget to dashboard',
        },
        customHomepageButtons: {
          editButton: {
            title: 'Edit',
          },
          restoreDefaultsButton: {
            title: 'Restore defaults',
          },
          clearAllButton: {
            title: 'Clear all',
          },
          addWidgetButton: {
            title: 'Add widget',
          },
          saveButton: {
            title: 'Save',
          },
        },
        widgetSettingsOverlay: {
          settingsSchema: {
            tooltip: {
              title: 'Edit settings',
            },
          },
          deleteWidgetButton: {
            tooltip: {
              title: 'Delete widget',
            },
          },
        },
      },
      staredEntities: {
        favoriteToggleButton: {
          title: '"Remove entity from favorites',
        },
      },
      visitList: {
        visitListEmpty: {
          notice: 'There are no visits to show yet.',
          description:
            'Once you start using Backstage, your visits will appear here as a quick link to carry on where you left off.',
        },
        visitListFew: {
          description:
            'The more pages you visit, the more pages will appear here.',
        },
      },
    },
    homePageComponents: {
      featuredDocsCard: {
        defaultLinkText: 'LEARN MORE',
        emptyState: {
          title: 'No documents to show',
          description:
            'Create your own document. Check out our Getting Started Information',
          buttonTitle: 'DOCS',
        },
      },
      randomJoke: {
        loadingLabel: 'Loading...',
        settings: {
          jokeTypeLabel: 'Joke type',
        },
        rerollButton: {
          title: 'Reroll',
        },
      },
      starredEntities: {
        defaultNoStarredEntitiesMessage:
          'Click the star beside an entity name to add it to this list!',
      },
      visitedByType: {
        actions: {
          viewMore: {
            label: 'View More',
          },
          viewLess: {
            label: 'View Less',
          },
        },
      },
    },
  },
});
