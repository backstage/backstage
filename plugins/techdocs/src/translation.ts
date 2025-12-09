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

import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @alpha */
export const techdocsTranslationRef = createTranslationRef({
  id: 'techdocs',
  messages: {
    aboutCard: {
      viewTechdocs: 'View TechDocs',
    },
    notFound: {
      title: 'Documentation not found',
      builderNote:
        "Note that techdocs.builder is not set to 'local' in your config, which means this Backstage app will not generate docs if they are not found. Make sure the project's docs are generated and published by some external process (e.g. CI/CD pipeline). Or change techdocs.builder to 'local' to generate docs from this Backstage instance.",
    },
    buildLogs: {
      title: 'Build Details',
      closeDrawer: 'Close the drawer',
      showBuildLogs: 'Show Build Logs',
      waitingForLogs: 'Waiting for logs...',
    },
    stateIndicator: {
      initialBuild: {
        message:
          'Documentation is accessed for the first time and is being prepared. The subsequent loads are much faster.',
      },
      contentStaleRefreshing: {
        message:
          'A newer version of this documentation is being prepared and will be available shortly.',
      },
      contentStaleReady: {
        message:
          'A newer version of this documentation is now available, please refresh to view.',
        refreshButton: 'Refresh',
      },
      contentStaleError: {
        message: 'Building a newer version of this documentation failed.',
      },
    },
    redirectNotification: {
      redirectNow: 'Redirect now',
    },
    search: {
      noResults: 'No results found',
      placeholder: 'Search {{entityTitle}} docs',
    },
    readerPageHeader: {
      owner: 'Owner',
      lifecycle: 'Lifecycle',
      source: 'Source',
    },
    home: {
      supportButton: 'Discover documentation in your ecosystem.',
    },
    pageWrapper: {
      title: 'Documentation',
      subtitle: 'Documentation available in {{orgName}}',
    },
    table: {
      columns: {
        document: 'Document',
        owner: 'Owner',
        kind: 'Kind',
        type: 'Type',
      },
      header: {
        actions: 'Actions',
      },
      toolbar: {
        searchPlaceholder: 'Filter',
      },
      pagination: {
        labelRowsSelect: 'rows',
      },
      body: {
        emptyDataSourceMessage: 'No records to display',
      },
      actions: {
        copyDocsUrl: 'Click to copy documentation link to clipboard',
        addToFavorites: 'Add to favorites',
        removeFromFavorites: 'Remove from favorites',
      },
      emptyState: {
        title: 'No documents to show',
        description:
          'Create your own document. Check out our Getting Started Information',
        docsButton: 'DOCS',
      },
      title: {
        all: 'All',
      },
    },
    error: {
      couldNotLoad: 'Could not load available documentation.',
    },
    nav: {
      title: 'Docs',
    },
    entityContent: {
      title: 'TechDocs',
    },
    reader: {
      settings: 'Settings',
    },
  },
});
