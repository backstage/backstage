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
export const catalogReactTranslationRef = createTranslationRef({
  id: 'catalog-react',
  messages: {
    catalogFilter: {
      title: 'Filters',
      buttonTitle: 'Filters',
    },
    entityKindPicker: {
      title: 'Kind',
      errorMessage: 'Failed to load entity kinds',
    },
    entityLifecyclePicker: {
      title: 'Lifecycle',
    },
    entityNamespacePicker: {
      title: 'Namespace',
    },
    entityOwnerPicker: {
      title: 'Owner',
    },
    entityProcessingStatusPicker: {
      title: 'Processing Status',
    },
    entityTagPicker: {
      title: 'Tags',
    },
    entityPeekAheadPopover: {
      title: 'Drill into the entity to see all of the tags.',
      emailCardAction: {
        title: 'Email {{email}}',
        subTitle: 'mailto {{email}}',
      },
      entityCardActionsTitle: 'Show details',
    },
    entitySearchBar: {
      placeholder: 'Search',
    },
    entityTypePicker: {
      title: 'Type',
      errorMessage: 'Failed to load entity types',
      optionAllTitle: 'all',
    },
    favoriteEntity: {
      addToFavorites: 'Add to favorites',
      removeFromFavorites: 'Remove from favorites',
    },
    inspectEntityDialog: {
      title: 'Entity Inspector',
      closeButtonTitle: 'Close',
      ancestryPage: {
        title: 'Ancestry',
      },
      colocatedPage: {
        title: 'Colocated',
        description:
          'These are the entities that are colocated with this entity - as in, they originated from the same data source (e.g. came from the same YAML file), or from the same origin (e.g. the originally registered URL).',
        alertNoLocation: 'Entity had no location information.',
        alertNoEntity: 'There were no other entities on this location.',
      },
      jsonPage: {
        title: 'Entity as JSON',
        description:
          'This is the raw entity data as received from the catalog, on JSON form.',
      },
      overviewPage: {
        title: 'Overview',
      },
      yamlPage: {
        title: 'Entity as YAML',
        description:
          'This is the raw entity data as received from the catalog, on YAML form.',
      },
    },
    unregisterEntityDialog: {
      title: 'Are you sure you want to unregister this entity?',
      cancelButtonTitle: 'Cancel',
      deleteButtonTitle: 'Delete Entity',
      deleteEntitySuccessMessage: 'Removed entity {{entityName}}',
      bootstrapState: {
        title:
          'You cannot unregister this entity, since it originates from a protected Backstage configuration (location "{{location}}"). If you believe this is in error, please contact the {{appTitle}} integrator.',
        advancedDescription:
          'You have the option to delete the entity itself from the catalog. Note that this should only be done if you know that the catalog file has been deleted at, or moved from, its origin location. If that is not the case, the entity will reappear shortly as the next refresh round is performed by the catalog.',
        advancedOptions: 'Advanced Options',
      },
      onlyDeleteStateTitle:
        'This entity does not seem to originate from a registered location. You therefore only have the option to delete it outright from the catalog.',
      unregisterState: {
        title: 'This action will unregister the following entities:',
        subTitle: 'Located at the following location:',
        description: 'To undo, just re-register the entity in {{appTitle}}.',
        unregisterButtonTitle: 'Unregister Location',
        advancedOptions: 'Advanced Options',
        advancedDescription:
          'You also have the option to delete the entity itself from the catalog. Note that this should only be done if you know that the catalog file has been deleted at, or moved from, its origin location. If that is not the case, the entity will reappear shortly as the next refresh round is performed by the catalog.',
      },
      errorStateTitle: 'Internal error: Unknown state',
    },
    userListPicker: {
      defaultOrgName: 'Company',
      personalFilter: {
        title: 'Personal',
        ownedLabel: 'Owned',
        starredLabel: 'Starred',
      },
      orgFilterAllLabel: 'All',
    },
  },
});
