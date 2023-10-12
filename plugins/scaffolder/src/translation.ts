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
    activity_for_task: 'Activity for task: {{taskId}}',
    adding_templates: 'adding templates',
    all_tasks_that_have_been_started: 'All tasks that have been started',
    allowed_projects: 'Allowed Projects',
    allowed_workspaces: 'Allowed Workspaces',
    an_entity_from_the_catalog: 'An entity from the catalog',
    apply: 'Apply',
    are_you_sure_unsaved_changes_will_be_lost:
      'Are you sure? Unsaved changes will be lost',
    available_templates: 'Available Templates',
    back: 'Back',
    cancel: 'Cancel',
    cancelling: 'Cancelling...',
    choose: 'Choose',
    choose_custom_field_extension: 'Choose Custom Field Extension',
    close_directory: 'Close directory',
    create: 'Create',
    create_a_new_component: 'Create a New Component',
    create_new_software_components_using_standard_templates:
      'Create new software components using standard templates',
    created: 'Created',
    custom_field_explorer: 'Custom Field Explorer',
    custom_field_title_example: '{{customFieldName}} Example',
    delete_result: 'Delete result',
    description: 'Description',
    download_as_zip: 'Download as .zip',
    dry_run_result: 'Result {{resultId}}',
    edit_template_form: 'Edit Template Form',
    entity: 'Entity',
    entity_name_picker_validation_message:
      'Must start and end with an alphanumeric character, and contain only alphanumeric characters, hyphens, underscores, and periods. Maximum length is 63 characters.',
    entity_tags_picker_helper_text:
      "Add any relevant tags, hit 'Enter' to add new tags. Valid format: [a-z0-9+#] separated by [-], at most 63 characters",
    error_loading_exisiting_templates:
      'Error loading exisiting templates: {{errorMessage}}',
    example_template_spec: 'Example Template Spec',
    examples: 'Examples',
    failed_to_load_installed_actions: 'Failed to load installed actions',
    field_options: 'Field Options',
    files: 'Files',
    get_started_by_choosing_one_of_the_options_below:
      'Get started by choosing one of the options below',
    hide_button_bar: 'Hide Button Bar',
    hide_logs: 'Hide Logs',
    host: 'Host',
    input: 'Input',
    installed_actions: 'Installed Actions',
    links: 'Links',
    list_task_page_empty_state_description:
      'There is no Tasks or there was an issue communicating with backend.',
    list_template_tasks: 'List template tasks',
    load_existing_template: 'Load Existing Template',
    load_template_directory: 'Load Template Directory',
    loading: 'Loading...',
    log: 'Log',
    name: 'Name',
    no_information_to_display: 'No information to display',
    no_schema_defined: 'No schema defined',
    no_task_found_with_this_id: 'No task found with this ID',
    no_user_entity_ref_found: 'No user entity ref found',
    only_supported_in_some_chromium_based_browsers:
      'Only supported in some Chromium-based browsers',
    organization: 'Organization',
    other_templates: 'Other Templates',
    output: 'Output',
    owner: 'Owner',
    owner_available: 'Owner Available',
    page_not_found: 'Page not found',
    parent: 'Parent',
    project: 'Project',
    register_existing_component: 'Register Existing Component',
    reload_directory: 'Reload directory',
    repo_picker_github_help_text:
      'The organization, user or project that this repo will belong to',
    repo_picker_gitlab_help_text:
      'GitLab namespace where this repository will belong to. It can be the name of organization, group, subgroup, user, or the project.',
    repo_picker_organization_help_text:
      'The Organization that this repo will belong to',
    repo_picker_project_help_text: 'The Project that this repo will belong to',
    repo_picker_project_help_text_optional:
      'The owner of the project (optional)',
    repo_picker_project_parent_help_text:
      'The project parent that the repo will belong to',
    repo_picker_workspace_helper_text:
      'The Workspace that this repo will belong to',
    repositories_available: 'Repositories Available',
    repository: 'Repository',
    reset: 'Reset',
    run_of_template_name: 'Run of {{templateName}}',
    save_all_files: 'Save all files',
    scaffolder_page_support_button:
      'Create new software components using standard templates. Different templates create different kinds of components (services, websites, documentation, ...).',
    show_button_bar: 'Show Button Bar',
    show_logs: 'Show Logs',
    skipped: 'Skipped',
    start_over: 'Start Over',
    status: 'Status',
    tags: 'Tags',
    task_activity: 'Task Activity',
    task_id: 'Task ID',
    task_list: 'Task List',
    task_not_found: 'Task not found',
    task_taskid: 'Task {{taskId}}',
    template: 'Template',
    template_card_warning_deprecated:
      'This template uses a syntax that has been deprecated, and should be migrated to a newer syntax. Click for more info.',
    template_editor: 'Template Editor',
    template_editor_intro_custom_field_help:
      'View and play around with available installed custom field extensions.',
    template_editor_intro_edit_help:
      'Preview and edit a template form, either using a sample template or by loading a template from the catalog.',
    template_editor_intro_subtitle:
      'Load a local template directory, allowing you to both edit and try executing your own template.',
    template_editor_subtitle:
      'Edit, preview, and try out templates and template forms',
    template_list_empty_templates_state:
      'No templates found that match your filter. Learn more about',
    template_list_error_loading_template:
      'Oops! Something went wrong loading the templates',
    template_list_page_subtitle:
      'Create new software components using standard templates in your organization',
    template_list_page_support_button:
      'Create new software components using standard templates. Different templates create different kinds of components (services, websites, documentation, ...).',
    template_parameters_must_be_an_array:
      'Template parameters must be an array',
    template_wizard_page_subtitle:
      'Create new software components using standard templates in your organization',
    templates: 'Templates',
    templates_tasks: 'Templates Tasks',
    the_host_where_the_repository_will_be_created:
      'The host where the repository will be created',
    the_name_of_the_repository: 'The name of the repository',
    the_owner_of_the_component: 'The owner of the component',
    this_is_the_collection_of_all_installed_actions:
      'This is the collection of all installed actions',
    title: 'Title',
    try_it: 'Try It',
    type: 'Type',
    unique_name_of_the_component: 'Unique name of the component from here',
    unknown: 'unknown',
    view_techdocs: 'View TechDocs',
    waiting_for_logs: 'Waiting for logs...',
    workspace: 'Workspace',
  },
});
