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
export const scaffolderTranslationRef = createTranslationRef({
  id: 'scaffolder',
  messages: {
    actionsPage: {
      title: 'Installed actions',
      pageTitle: 'Create a New Component',
      subtitle: 'This is the collection of all installed actions',
      content: {
        emptyState: {
          title: 'No information to display',
          description:
            'There are no actions installed or there was an issue communicating with backend.',
        },
        tableCell: {
          name: 'Name',
          title: 'Title',
          description: 'Description',
          type: 'Type',
        },
        noRowsDescription: 'No schema defined',
      },
      action: {
        input: 'Input',
        output: 'Output',
        examples: 'Examples',
      },
    },
    fields: {
      entityNamePicker: {
        title: 'Name',
        description: 'Unique name of the component',
      },
      entityPicker: {
        title: 'Entity',
        description: 'An entity from the catalog',
      },
      entityTagsPicker: {
        title: 'Tags',
        description:
          "Add any relevant tags, hit 'Enter' to add new tags. Valid format: [a-z0-9+#] separated by [-], at most 63 characters",
      },
      myGroupsPicker: {
        title: 'Entity',
        description: 'An entity from the catalog',
      },
      ownedEntityPicker: {
        title: 'Entity',
        description: 'An entity from the catalog',
      },
      ownerPicker: {
        title: 'Owner',
        description: 'The owner of the component',
      },
      azureRepoPicker: {
        organization: {
          title: 'Organization',
          description: 'The Organization that this repo will belong to',
        },
        project: {
          title: 'Project',
          description: 'The Project that this repo will belong to',
        },
      },
      bitbucketRepoPicker: {
        workspaces: {
          title: 'Allowed Workspaces',
          inputTitle: 'Workspaces',
          description: 'The Workspace that this repo will belong to',
        },
        project: {
          title: 'Allowed Projects',
          inputTitle: 'Projects',
          description: 'The Project that this repo will belong to',
        },
      },
      gerritRepoPicker: {
        owner: {
          title: 'Owner',
          description: 'The owner of the project (optional)',
        },
        parent: {
          title: 'Parent',
          description: 'The project parent that the repo will belong to',
        },
      },
      giteaRepoPicker: {
        owner: {
          title: 'Owner Available',
          inputTitle: 'Owner',
          description:
            'Gitea namespace where this repository will belong to. It can be the name of organization, group, subgroup, user, or the project.',
        },
      },
      githubRepoPicker: {
        owner: {
          title: 'Owner Available',
          inputTitle: 'Owner',
          description:
            'The organization, user or project that this repo will belong to',
        },
      },
      gitlabRepoPicker: {
        owner: {
          title: 'Owner Available',
          inputTitle: 'Owner',
          description:
            'GitLab namespace where this repository will belong to. It can be the name of organization, group, subgroup, user, or the project.',
        },
      },
      repoUrlPicker: {
        host: {
          title: 'Host',
          description: 'The host where the repository will be created',
        },
        repository: {
          title: 'Repositories Available',
          inputTitle: 'Repository',
          description: 'The name of the repository',
        },
      },
    },
    listTaskPage: {
      title: 'List template tasks',
      pageTitle: 'Templates Tasks',
      subtitle: 'All tasks that have been started',
      content: {
        emptyState: {
          title: 'No information to display',
          description:
            'There are no tasks or there was an issue communicating with backend.',
        },
        tableTitle: 'Tasks',
        tableCell: {
          taskID: 'Task ID',
          template: 'Template',
          created: 'Created',
          owner: 'Owner',
          status: 'Status',
        },
      },
    },
    ownerListPicker: {
      title: 'Task Owner',
      options: {
        owned: 'Owned',
        all: 'All',
      },
    },
    ongoingTask: {
      title: 'Run of',
      pageTitle: {
        hasTemplateName: 'Run of {{templateName}}',
        noTemplateName: 'Scaffolder Run',
      },
      subtitle: 'Task {{taskId}}',
      cancelButtonTitle: 'Cancel',
      startOverButtonTitle: 'Start Over',
      hideLogsButtonTitle: 'Hide Logs',
      showLogsButtonTitle: 'Show Logs',
      contextMenu: {
        hideLogs: 'Hide Logs',
        showLogs: 'Show Logs',
        hideButtonBar: 'Hide Button Bar',
        showButtonBar: 'Show Button Bar',
        startOver: 'Start Over',
        cancel: 'Cancel',
      },
    },
    templateTypePicker: {
      title: 'Categories',
    },
    templateEditorPage: {
      title: 'Template Editor',
      subtitle: 'Edit, preview, and try out templates and template forms',
      dryRunResults: {
        title: 'Dry-run results',
      },
      dryRunResultsList: {
        title: 'Result {{resultId}}',
        downloadButtonTitle: 'Download as .zip',
        deleteButtonTitle: 'Delete result',
      },
      dryRunResultsView: {
        tab: {
          files: 'Files',
          log: 'Log',
          output: 'Output',
        },
      },
      taskStatusStepper: {
        skippedStepTitle: 'Skipped',
      },
      customFieldExplorer: {
        selectFieldLabel: 'Choose Custom Field Extension',
        fieldForm: {
          title: 'Field Options',
          applyButtonTitle: 'Apply',
        },
        preview: {
          title: 'Example Template Spec',
        },
      },
      templateEditorBrowser: {
        closeConfirmMessage: 'Are you sure? Unsaved changes will be lost',
        saveIconTooltip: 'Save all files',
        reloadIconTooltip: 'Reload directory',
        closeIconTooltip: 'Close directory',
      },
      templateEditorIntro: {
        title: 'Get started by choosing one of the options below',
        loadLocal: {
          title: 'Load Template Directory',
          description:
            'Load a local template directory, allowing you to both edit and try executing your own template.',
          unsupportedTooltip: 'Only supported in some Chromium-based browsers',
        },
        formEditor: {
          title: 'Edit Template Form',
          description:
            'Preview and edit a template form, either using a sample template or by loading a template from the catalog.',
        },
        fieldExplorer: {
          title: 'Custom Field Explorer',
          description:
            'View and play around with available installed custom field extensions.',
        },
      },
      templateEditorTextArea: {
        saveIconTooltip: 'Save file',
        refreshIconTooltip: 'Reload file',
      },
      templateFormPreviewer: {
        title: 'Load Existing Template',
      },
    },
    templateListPage: {
      title: 'Create a new component',
      subtitle:
        'Create new software components using standard templates in your organization',
      pageTitle: 'Create a new component',
      templateGroups: {
        defaultTitle: 'Templates',
        otherTitle: 'Other Templates',
      },
      contentHeader: {
        title: 'Available Templates',
        registerExistingButtonTitle: 'Register Existing Component',
        supportButtonTitle:
          'Create new software components using standard templates. Different templates create different kinds of components (services, websites, documentation, ...).',
      },
      additionalLinksForEntity: {
        viewTechDocsTitle: 'View TechDocs',
      },
    },
    templateWizardPage: {
      title: 'Create a new component',
      subtitle:
        'Create new software components using standard templates in your organization',
      pageTitle: 'Create a new component',
      pageContextMenu: {
        editConfigurationTitle: 'Edit Configuration',
      },
    },
  },
});
