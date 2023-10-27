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
export const catalogReactTranslationRef = createTranslationRef({
  id: 'catalog-react',
  messages: {
    filters: 'Filters',
    failed_to_load_entity_kinds: 'Failed to load entity kinds',
    kind: 'Kind',
    lifecycle: 'Lifecycle',
    namespace: 'Namespace',
    owner: 'Owner',
    special_email: 'Email {{email}}',
    mailto: 'mailto:{{email}}',
    show_details: 'Show details',
    drill_into_entity_to_see_tags:
      'Drill into the entity to see all of the tags.',
    processing_status: 'Processing Status',
    search: 'Search',
    tags: 'Tags',
    failed_to_load_entity_types: 'Failed to load entity types',
    type: 'Type',
    all: 'All',
    remove_from_favorites: 'Remove from favorites',
    add_to_favorites: 'Add to favorites',
    ancestry: 'Ancestry',
    entity_had_no_location_information: 'Entity had no location information.',
    no_other_entities_on_location:
      'There were no other entities on this location.',
    colocated: 'Colocated',
    colocated_description:
      'These are the entities that are colocated with this entity - as in, they originated from the same data source (e.g. came from the same YAML file), or from the same origin (e.g. the originally registered URL).',
    at_the_same_location: 'At the same location',
    at_the_same_origin: 'At the same origin',
    entity_as_json: 'Entity as JSON',
    entity_as_json_description:
      'This is the raw entity data as received from the catalog, on JSON form.',
    overview: 'Overview',
    annotations: 'Annotations',
    labels: 'Labels',
    entity_as_yaml: 'Entity as YAML',
    entity_as_yaml_description:
      'This is the raw entity data as received from the catalog, on YAML form.',
    entity_inspector: 'Entity Inspector',
    close: 'Close',
    cancel: 'Cancel',
    remove_entity_by_name: 'Removed entity {{entityName}}',
    cannot_unregister_entity_due_to_protected:
      'You cannot unregister this entity, since it originates from a protected Backstage configuration (location "{{location}}"). If you believe this is in error, please contact the {{appTitle}} integrator.',
    advanced_options: 'Advanced Options',
    delete_entity_description:
      'You have the option to delete the entity itself from the catalog. Note that this should only be done if you know that the catalog file has been deleted at, or moved from, its origin location. If that is not the case, the entity will reappear shortly as the next refresh round is performed by the catalog.',
    delete_entity: 'Delete Entity',
    delete_entity_only_delete_description:
      'This entity does not seem to originate from a registered location. You therefore only have the option to delete it outright from the catalog.',
    action_will_unregister_entities:
      'This action will unregister the following entities:',
    located_at_following_location: 'Located at the following location:',
    to_undo_re_register_entity:
      'To undo, just re-register the entity in {{appTitle}}.',
    unregister_location: 'Unregister Location',
    delete_entity_advance_option_description:
      'You also have the option to delete the entity itself from the catalog. Note that this should only be done if you know that the catalog file has been deleted at, or moved from, its origin location. If that is not the case, the entity will reappear shortly as the next refresh round is performed by the catalog.',
    internal_unknown_error: 'Internal error: Unknown state',
    confirm_unregister_entity:
      'Are you sure you want to unregister this entity?',
    personal: 'Personal',
    company: 'Company',
    starred: 'Starred',
    owned: 'Owned',
    ancestry_link_prefix:
      'This is the ancestry of entities above the current one - as in, the chain(s) of entities down to the current one, where ',
    ancestry_link: 'processors emitted',
    ancestry_link_suffix:
      ' child entities that ultimately led to the current one existing. Note that this is a completely different mechanism from relations.',
  },
});
