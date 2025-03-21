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
export const catalogTranslationRef = createTranslationRef({
  id: 'catalog',
  messages: {
    indexPage: {
      title: `{{orgName}} Catalog`,
      createButtonTitle: 'Create',
      supportButtonContent: 'All your software catalog entities',
    },
    aboutCard: {
      title: 'About',
      refreshButtonTitle: 'Schedule entity refresh',
      editButtonTitle: 'Edit Metadata',
      createSimilarButtonTitle: 'Create something similar',
      refreshScheduledMessage: 'Refresh scheduled',
      launchTemplate: 'Launch Template',
      viewTechdocs: 'View TechDocs',
      viewSource: 'View Source',
      descriptionField: {
        label: 'Description',
        value: 'No description',
      },
      ownerField: {
        label: 'Owner',
        value: 'No Owner',
      },
      domainField: {
        label: 'Domain',
        value: 'No Domain',
      },
      systemField: {
        label: 'System',
        value: 'No System',
      },
      parentComponentField: {
        label: 'Parent Component',
        value: 'No Parent Component',
      },
      typeField: {
        label: 'Type',
      },
      lifecycleField: {
        label: 'Lifecycle',
      },
      tagsField: {
        label: 'Tags',
        value: 'No Tags',
      },
      targetsField: {
        label: 'Targets',
      },
    },
    searchResultItem: {
      lifecycle: 'Lifecycle',
      Owner: 'Owner',
    },
    catalogTable: {
      warningPanelTitle: 'Could not fetch catalog entities.',
      viewActionTitle: 'View',
      editActionTitle: 'Edit',
      starActionTitle: 'Add to favorites',
      unStarActionTitle: 'Remove from favorites',
    },
    dependencyOfComponentsCard: {
      title: 'Dependency of components',
      emptyMessage: 'No component depends on this component',
    },
    dependsOnComponentsCard: {
      title: 'Depends on components',
      emptyMessage: 'No component is a dependency of this component',
    },
    dependsOnResourcesCard: {
      title: 'Depends on resources',
      emptyMessage: 'No resource is a dependency of this component',
    },
    entityContextMenu: {
      copiedMessage: 'Copied!',
      moreButtonTitle: 'More',
      inspectMenuTitle: 'Inspect entity',
      copyURLMenuTitle: 'Copy entity URL',
      unregisterMenuTitle: 'Unregister entity',
    },
    entityLabelsCard: {
      title: 'Labels',
      emptyDescription:
        'No labels defined for this entity. You can add labels to your entity YAML as shown in the highlighted example below:',
      readMoreButtonTitle: 'Read more',
    },
    entityLabels: {
      warningPanelTitle: 'Entity not found',
      ownerLabel: 'Owner',
      lifecycleLabel: 'Lifecycle',
    },
    entityLinksCard: {
      title: 'Links',
      emptyDescription:
        'No links defined for this entity. You can add links to your entity YAML as shown in the highlighted example below:',
      readMoreButtonTitle: 'Read more',
    },
    entityNotFound: {
      title: 'Entity was not found',
      description:
        'Want to help us build this? Check out our Getting Started documentation.',
      docButtonTitle: 'DOCS',
    },
    deleteEntity: {
      dialogTitle: 'Are you sure you want to delete this entity?',
      deleteButtonTitle: 'Delete',
      cancelButtonTitle: 'Cancel',
      description:
        'This entity is not referenced by any location and is therefore not receiving updates. Click here to delete.',
    },
    entityProcessingErrorsDescription: 'The error below originates from',
    entityRelationWarningDescription:
      "This entity has relations to other entities, which can't be found in the catalog.\n Entities not found are: ",
    hasComponentsCard: {
      title: 'Has components',
      emptyMessage: 'No component is part of this system',
    },
    hasResourcesCard: {
      title: 'Has resources',
      emptyMessage: 'No resource is part of this system',
    },
    hasSubcomponentsCard: {
      title: 'Has subcomponents',
      emptyMessage: 'No subcomponent is part of this component',
    },
    hasSubdomainsCard: {
      title: 'Has subdomains',
      emptyMessage: 'No subdomain is part of this domain',
    },
    hasSystemsCard: {
      title: 'Has systems',
      emptyMessage: 'No system is part of this domain',
    },
    relatedEntitiesCard: {
      emptyHelpLinkTitle: 'Learn how to change this',
    },
    systemDiagramCard: {
      title: 'System Diagram',
      description: 'Use pinch & zoom to move around the diagram.',
      edgeLabels: {
        partOf: 'part of',
        provides: 'provides',
        dependsOn: 'depends on',
      },
    },
  },
});
