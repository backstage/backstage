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

export const scaffolderTranslationRef = createTranslationRef({
  id: 'scaffolder',
  messages: {
    failed_to_load_installed_actions: 'Failed to load installed actions',
    no_schema_defined: 'No schema defined',
    name: 'Name',
    title: 'Title',
    description: 'Description',
    type: 'Type',
    unknown: 'unknown',
    create_a_new_component: 'Create a New Component',
    installed_actions: 'Installed actions',
    this_is_the_collection_of_all_installed_actions:
      'This is the collection of all installed actions',
    examples: 'Examples',
    output: 'Output',
    input: 'Input',
    unique_name_of_the_component: 'Unique name of the component from here',
    entity_name_picker_validation_message:
      'Must start and end with an alphanumeric character, and contain only alphanumeric characters, hyphens, underscores, and periods. Maximum length is 63 characters.',
    entity: 'Entity',
    an_entity_from_the_catalog: 'An entity from the catalog',
    tags: 'Tags',
    entity_tags_picker_helper_text:
      "Add any relevant tags, hit 'Enter' to add new tags. Valid format: [a-z0-9+#] separated by [-], at most 63 characters",
    no_user_entity_ref_found: 'No user entity ref found',
    owner: 'Owner',
    the_owner_of_the_component: 'The owner of the component',
    loading: 'Loading...',
    organization: 'Organization',
    repo_picker_organization_help_text:
      'The Organization that this repo will belong to',
    project: 'Project',
    repo_picker_project_help_text: 'The Project that this repo will belong to',
    allowed_workspaces: 'Allowed Workspaces',
    workspace: 'Workspace',
    repo_picker_workspace_helper_text:
      'The Workspace that this repo will belong to',
    allowed_projects: 'Allowed Projects',
    repo_picker_project_help_text_optional:
      'The owner of the project (optional)',
    parent: 'Parent',
    repo_picker_project_parent_help_text:
      'The project parent that the repo will belong to',
    owner_available: 'Owner Available',
    repo_picker_github_help_text:
      'The organization, user or project that this repo will belong to',
    repo_picker_gitlab_help_text:
      'GitLab namespace where this repository will belong to. It can be the name of organization, group, subgroup, user, or the project.',
    host: 'Host',
    the_host_where_the_repository_will_be_created:
      'The host where the repository will be created',
    repositories_available: 'Repositories Available',
    repository: 'Repository',
    the_name_of_the_repository: 'The name of the repository',
    other_templates: 'Other Templates',
    templates: 'Templates',
    create_new_software_components_using_standard_templates:
      'Create new software components using standard templates',
    available_templates: 'Available Templates',
    register_existing_component: 'Register Existing Component',
    scaffolder_page_support_button:
      'Create new software components using standard templates. Different templates create different kinds of components (services, websites, documentation, ...).',
  },
});
