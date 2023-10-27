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
    catalog_page_title: `{{orgName}} Catalog`,
    catalog_page_create_button_title: 'Create',
    all_your_software_catalog: 'All your software catalog entities',
    about: 'About',
    schedule_entity_refresh: 'Schedule entity refresh',
    edit_metadata: 'Edit Metadata',
    refresh_scheduled: 'Refresh scheduled',
    view_source: 'View Source',
    view_techdocs: 'View TechDocs',
    launch_template: 'Launch Template',
    no_description: 'No description',
    no_owner: 'No Owner',
    no_domain: 'No Domain',
    no_system: 'No System',
    no_parent_component: 'No Parent Component',
    no_tags: 'No Tags',
    description: 'Description',
    owner: 'Owner',
    domain: 'Domain',
    system: 'System',
    parent_component: 'Parent Component',
    type: 'Type',
    lifecycle: 'Lifecycle',
    tags: 'Tags',
    targets: 'Targets',
    unknown: 'unknown',
    name: 'Name',
    title: 'Title',
    label: 'Label',
    labels: 'Labels',
    namespace: 'Namespace',
    could_not_fetch_catalog: 'Could not fetch catalog entities.',
    view: 'View',
    edit: 'Edit',
    remove_from_favorites: 'Remove from favorites',
    add_to_favorites: 'Add to favorites',
    dependency_of_components: 'Dependency of components',
    no_depends_on_component: 'No component depends on this component',
    depends_on_components: 'Depends on components',
    no_dependency_of_component:
      'No component is a dependency of this component',
    depends_on_resources: 'Depends on resources',
    no_resource_dependency_of_component:
      'No resource is a dependency of this component',
    copied: 'Copied!',
    more: 'More',
    copy_entity_url: 'Copy entity URL',
    inspect_entity: 'Inspect entity',
    unregister_entity: 'Unregister entity',
    read_more: 'Read more',
    no_attribute_defind_for_entity_description:
      'No {{attribute}} defined for this entity. You can add {{attribute}} to your entity YAML as shown in the highlighted example below:',
    entity_not_found: 'Entity not found',
    entity_not_found_description: 'There is no {{kind}} with the requested',
    entity_not_found_description_suffix: 'kind, namespace, and name',
    links: 'links',
    docs: 'DOCS',
    want_to_help_start_with_doc:
      'Want to help us build this? Check out our Getting Started documentation.',
    confirm_delete_entity_title: 'Are you sure you want to delete this entity?',
    delete: 'Delete',
    cancel: 'Cancel',
    entity_orphan_warning_description:
      'This entity is not referenced by any location and is therefore not receiving updates. Click here to delete.',
    entity_processing_error_description: 'The error below originates from',
    entity_relation_warnning_description:
      "This entity has relations to other entities, which can't be found in the catalog. \n Entities not found are: {{value}}",
    no_component_is_part_of_system: 'No component is part of this system',
    has_components: 'Has components',
    has_resources: 'Has resources',
    no_resource_is_part_of_system: 'No resource is part of this system',
    has_subcomponents: 'Has subcomponents',
    no_subcomponent_is_part_of_component:
      'No subcomponent is part of this component',
    has_systems: 'Has systems',
    no_system_is_part_of_domain: 'No system is part of this domain',
    learn_how_to_change_this: 'Learn how to change this.',
    part_of: 'part of',
    provides: 'provides',
    depends_on: 'depends on',
    system_diagram: 'System Diagram',
    use_pinch_zoo_to_move_around_diagram:
      'Use pinch & zoo to move around the diagram.',
    all: 'all',
  },
});
