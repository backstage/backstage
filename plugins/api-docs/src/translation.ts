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
export const apiDocsTranslationRef = createTranslationRef({
  id: 'api-docs',
  messages: {
    apiDefinitionCard: {
      error: {
        title: 'Could not fetch the API',
      },
      rawButtonTitle: 'Raw',
    },
    apiDefinitionDialog: {
      closeButtonTitle: 'Close',
      tabsAriaLabel: 'API definition options',
      toggleButtonAriaLabel: 'Toggle API Definition Dialog',
      rawButtonTitle: 'Raw',
    },
    defaultApiExplorerPage: {
      title: 'APIs',
      subtitle: '{{orgName}} API Explorer',
      pageTitleOverride: 'APIs',
      createButtonTitle: 'Register Existing API',
      supportButtonTitle: 'All your APIs',
    },
    consumedApisCard: {
      title: 'Consumed APIs',
      error: {
        title: 'Could not load APIs',
      },
      emptyContent: {
        title: 'This {{entity}} does not consume any APIs.',
      },
    },
    hasApisCard: {
      title: 'APIs',
      error: {
        title: 'Could not load APIs',
      },
      emptyContent: {
        title: 'This {{entity}} does not contain any APIs.',
      },
    },
    providedApisCard: {
      title: 'Provided APIs',
      error: {
        title: 'Could not load APIs',
      },
      emptyContent: {
        title: 'This {{entity}} does not provide any APIs.',
      },
    },
    apiEntityColumns: {
      typeTitle: 'Type',
      apiDefinitionTitle: 'API Definition',
    },
    consumingComponentsCard: {
      title: 'Consumers',
      error: {
        title: 'Could not load components',
      },
      emptyContent: {
        title: 'No component consumes this API.',
      },
    },
    providingComponentsCard: {
      title: 'Providers',
      error: {
        title: 'Could not load components',
      },
      emptyContent: {
        title: 'No component provides this API.',
      },
    },
    apisCardHelpLinkTitle: 'Learn how to change this',
  },
});
