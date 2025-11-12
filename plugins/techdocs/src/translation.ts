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
    docsTable: {
      // title: 'Documentation',
      allTitle: 'All',
      columns: {
        document: 'Document',
        owner: 'Owner',
        kind: 'Kind',
        type: 'Type',
      },
      emptyState: {
        title: 'No documents to show',
        description:
          'Create your own document. Check out our Getting Started Information',
        readMoreButton: 'Read more',
      },
    },
    techDocsBuildLogs: {
      title: 'Build Details',
      showBuildLogsButton: 'Show Build Logs',
      closeDrawerTooltip: 'Close the drawer',
      waitingForLogsMessage: 'Waiting for logs...',
    },
    techDocsPageWrapper: {
      title: 'Documentation',
      subtitle: 'Documentation available in {{ organizationName }}',
    },
  },
});
