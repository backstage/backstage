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
    installed_actions: 'Installed Actions',
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
    hide_logs: 'Hide Logs',
    show_logs: 'Show Logs',
    hide_button_bar: 'Hide Button Bar',
    show_button_bar: 'Show Button Bar',
    run_of_template_name: 'Run of {{templateName}}',
    task_taskid: 'Task {{taskId}}',
    page_not_found: 'Page not found',
    custom_field_title_example: '{{customFieldName}} Example',
    choose_custom_field_extension: 'Choose Custom Field Extension',
    field_options: 'Field Options',
    apply: 'Apply',
    example_template_spec: 'Example Template Spec',
    template_parameters_must_be_an_array:
      'Template parameters must be an array',
    template_editor: 'Template Editor',
    try_it: 'Try It',
    template_editor_subtitle:
      'Edit, preview, and try out templates and template forms',
    error_loading_exisiting_templates:
      'Error loading exisiting templates: {{errorMessage}}',
    load_existing_template: 'Load Existing Template',
    view_techdocs: 'View TechDocs',
    template_list_page_subtitle:
      'Create new software components using standard templates in your organization',
    template_list_page_support_button:
      'Create new software components using standard templates. Different templates create different kinds of components (services, websites, documentation, ...).',
    template_wizard_page_subtitle:
      'Create new software components using standard templates in your organization',
    no_information_to_display: 'No information to display',
    list_task_page_empty_state_description:
      'There is no Tasks or there was an issue communicating with backend.',
    task_id: 'Task ID',
    template: 'Template',
    created: 'Created',
    status: 'Status',
    templates_tasks: 'Templates Tasks',
    list_template_tasks: 'List template tasks',
    all_tasks_that_have_been_started: 'All tasks that have been started',
    back: 'Back',
    reset: 'Reset',
    create: 'Create',
    task_list: 'Task List',
    skipped: 'Skipped',
    waiting_for_logs: 'Waiting for logs...',
    task_activity: 'Task Activity',
    activity_for_task: 'Activity for task: {{taskId}}',
    task_not_found: 'Task not found',
    no_task_found_with_this_id: 'No task found with this ID',
    start_over: 'Start Over',
    cancelling: 'Cancelling...',
    cancel: 'Cancel',
    template_card_warning_deprecated:
      'This template uses a syntax that has been deprecated, and should be migrated to a newer syntax. Click for more info.',
    links: 'Links',
    choose: 'Choose',
    dry_run_result: 'Result {{resultId}}',
    download_as_zip: 'Download as .zip',
    delete_result: 'Delete result',
    files: 'Files',
    log: 'Log',
    are_you_sure_unsaved_changes_will_be_lost:
      'Are you sure? Unsaved changes will be lost',
    save_all_files: 'Save all files',
    reload_directory: 'Reload directory',
    close_directory: 'Close directory',
    load_template_directory: 'Load Template Directory',
    template_editor_intro_subtitle:
      'Load a local template directory, allowing you to both edit and try executing your own template.',
    only_supported_in_some_chromium_based_browsers:
      'Only supported in some Chromium-based browsers',
    edit_template_form: 'Edit Template Form',
    template_editor_intro_edit_help:
      'Preview and edit a template form, either using a sample template or by loading a template from the catalog.',
    custom_field_explorer: 'Custom Field Explorer',
    template_editor_intro_custom_field_help:
      'View and play around with available installed custom field extensions.',
    get_started_by_choosing_one_of_the_options_below:
      'Get started by choosing one of the options below',
    template_list_error_loading_template:
      'Oops! Something went wrong loading the templates',
    template_list_empty_templates_state:
      'No templates found that match your filter. Learn more about',
    adding_templates: 'adding templates',
  },
});
