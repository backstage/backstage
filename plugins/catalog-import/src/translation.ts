/*
 * Copyright 2024 The Backstage Authors
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
export const catalogImportTranslationRef = createTranslationRef({
  id: 'catalog-import',
  messages: {
    buttons: {
      back: 'Back',
    },
    defaultImportPage: {
      headerTitle: 'Register an existing component',
      contentHeaderTitle: 'Start tracking your component in {{appTitle}}',
      supportTitle:
        'Start tracking your component in {{appTitle}} by adding it to the software catalog.',
    },
    importInfoCard: {
      title: 'Register an existing component',
      deepLinkTitle: 'Learn more about the Software Catalog',
      linkDescription:
        'Enter the URL to your source code repository to add it to {{appTitle}}.',
      fileLinkTitle: 'Link to an existing entity file',
      examplePrefix: 'Example: ',
      fileLinkDescription:
        'The wizard analyzes the file, previews the entities, and adds them to the {{appTitle}} catalog.',
      githubIntegration: {
        title: 'Link to a repository',
        label: 'GitHub only',
      },
      exampleDescription:
        'The wizard discovers all {{catalogFilename}} files in the repository, previews the entities, and adds them to the {{appTitle}} catalog.',
      preparePullRequestDescription:
        'If no entities are found, the wizard will prepare a Pull Request that adds an example {{catalogFilename}} and prepares the {{appTitle}} catalog to load all entities as soon as the Pull Request is merged.',
    },
    importStepper: {
      singleLocation: {
        title: 'Select Locations',
        description: 'Discovered Locations: 1',
      },
      multipleLocations: {
        title: 'Select Locations',
        description: 'Discovered Locations: {{length, number}}',
      },
      noLocation: {
        title: 'Create Pull Request',
        createPr: {
          detailsTitle: 'Pull Request Details',
          titleLabel: 'Pull Request Title',
          titlePlaceholder: 'Add Backstage catalog entity descriptor files',
          bodyLabel: 'Pull Request Body',
          bodyPlaceholder: 'A describing text with Markdown support',
          configurationTitle: 'Entity Configuration',
          componentNameLabel: 'Name of the created component',
          componentNamePlaceholder: 'my-component',
          ownerLoadingText: 'Loading groups…',
          ownerHelperText:
            'Select an owner from the list or enter a reference to a Group or a User',
          ownerErrorHelperText: 'required value',
          ownerLabel: 'Entity Owner',
          ownerPlaceholder: 'my-group',
          codeownersHelperText:
            'WARNING: This may fail if no CODEOWNERS file is found at the target location.',
        },
      },
      analyze: {
        title: 'Select URL',
      },
      prepare: {
        title: 'Import Actions',
        description: 'Optional',
      },
      review: {
        title: 'Review',
      },
      finish: {
        title: 'Finish',
      },
    },
    stepFinishImportLocation: {
      backButtonText: 'Register another',
      repository: {
        title: 'The following Pull Request has been opened: ',
        description:
          'Your entities will be imported as soon as the Pull Request is merged.',
      },
      locations: {
        new: 'The following entities have been added to the catalog:',
        existing: 'A refresh was triggered for the following locations:',
        viewButtonText: 'View Component',
        backButtonText: 'Register another',
      },
    },
    stepInitAnalyzeUrl: {
      error: {
        repository: "Couldn't generate entities for your repository",
        locations: 'There are no entities at this location',
        default:
          'Received unknown analysis result of type {{type}}. Please contact the support team.',
        url: 'Must start with http:// or https://.',
      },
      urlHelperText:
        'Enter the full path to your entity file to start tracking your component',
      nextButtonText: 'Analyze',
    },
    stepPrepareCreatePullRequest: {
      description:
        'You entered a link to a {{integrationType}} repository but a {{catalogFilename}} could not be found. Use this form to open a Pull Request that creates one.',
      previewPr: {
        title: 'Preview Pull Request',
        subheader: 'Create a new Pull Request',
      },
      previewCatalogInfo: {
        title: 'Preview Entities',
      },
      nextButtonText: 'Create PR',
    },
    stepPrepareSelectLocations: {
      locations: {
        description:
          'Select one or more locations that are present in your git repository:',
        selectAll: 'Select All',
      },
      existingLocations: {
        description: 'These locations already exist in the catalog:',
      },
      nextButtonText: 'Review',
    },
    stepReviewLocation: {
      prepareResult: {
        title: 'The following Pull Request has been opened: ',
        description:
          'You can already import the location and {{appTitle}} will fetch the entities as soon as the Pull Request is merged.',
      },
      catalog: {
        exists: 'The following locations already exist in the catalog:',
        new: 'The following entities will be added to the catalog:',
      },
      refresh: 'Refresh',
      import: 'Import',
    },
  },
});
