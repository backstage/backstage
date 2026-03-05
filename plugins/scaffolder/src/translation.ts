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
    aboutCard: {
      launchTemplate: 'Launch Template',
    },
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
        searchFieldPlaceholder: 'Search for an action',
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
      multiEntityPicker: {
        title: 'Entity',
        description: 'An entity from the catalog',
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
      repoOwnerPicker: {
        title: 'Owner',
        description: 'The owner of the repository',
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
      retryButtonTitle: 'Retry',
      startOverButtonTitle: 'Start Over',
      hideLogsButtonTitle: 'Hide Logs',
      showLogsButtonTitle: 'Show Logs',
      contextMenu: {
        hideLogs: 'Hide Logs',
        showLogs: 'Show Logs',
        hideButtonBar: 'Hide Button Bar',
        retry: 'Retry',
        showButtonBar: 'Show Button Bar',
        startOver: 'Start Over',
        cancel: 'Cancel',
      },
    },
    templateEditorForm: {
      stepper: {
        emptyText: 'There are no spec parameters in the template to preview.',
      },
    },
    renderSchema: {
      tableCell: {
        name: 'Name',
        title: 'Title',
        description: 'Description',
        type: 'Type',
      },
      undefined: 'No schema defined',
    },
    templatingExtensions: {
      title: 'Templating Extensions',
      pageTitle: 'Templating Extensions',
      subtitle: 'This is the collection of available templating extensions',
      content: {
        emptyState: {
          title: 'No information to display',
          description:
            'There are no templating extensions available or there was an issue communicating with the backend.',
        },
        searchFieldPlaceholder: 'Search for an extension',
        filters: {
          title: 'Filters',
          notAvailable: 'There are no template filters defined.',
          metadataAbsent: 'Filter metadata unavailable',
          schema: {
            input: 'Input',
            arguments: 'Arguments',
            output: 'Output',
          },
          examples: 'Examples',
        },
        functions: {
          title: 'Functions',
          notAvailable: 'There are no global template functions defined.',
          metadataAbsent: 'Function metadata unavailable',
          schema: {
            arguments: 'Arguments',
            output: 'Output',
          },
          examples: 'Examples',
        },
        values: {
          title: 'Values',
          notAvailable: 'There are no global template values defined.',
        },
      },
    },
    templateTypePicker: {
      title: 'Categories',
    },
    templateIntroPage: {
      title: 'Manage Templates',
      subtitle:
        'Edit, preview, and try out templates, forms, and custom fields',
    },
    templateFormPage: {
      title: 'Template Editor',
      subtitle: 'Edit, preview, and try out templates forms',
    },
    templateCustomFieldPage: {
      title: 'Custom Field Explorer',
      subtitle: 'Edit, preview, and try out custom fields',
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
        fieldPreview: {
          title: 'Field Preview',
        },
        preview: {
          title: 'Template Spec',
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
          unsupportedTooltip:
            'Only supported in some Chromium-based browsers with the page loaded over HTTPS',
        },
        createLocal: {
          title: 'Create New Template',
          description:
            'Create a local template directory, allowing you to both edit and try executing your own template.',
          unsupportedTooltip:
            'Only supported in some Chromium-based browsers with the page loaded over HTTPS',
        },
        formEditor: {
          title: 'Template Form Playground',
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
        emptyStateParagraph: 'Please select an action on the file menu.',
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
      templateWithTitle: 'Create new {{templateTitle}}',
      pageContextMenu: {
        editConfigurationTitle: 'Edit Configuration',
      },
    },
    templateEditorToolbar: {
      customFieldExplorerTooltip: 'Custom Fields Explorer',
      installedActionsDocumentationTooltip: 'Installed Actions Documentation',
      templatingExtensionsDocumentationTooltip:
        'Templating Extensions Documentation',
      addToCatalogButton: 'Publish',
      addToCatalogDialogTitle: 'Publish changes',
      addToCatalogDialogContent: {
        stepsIntroduction:
          'Follow the instructions below to create or update a template:',
        stepsListItems:
          'Save the template files in a local directory\nCreate a pull request to a new or existing git repository\nIf the template already exists, the changes will be reflected in the software catalog once the pull request gets merged\nBut if you are creating a new template, follow the documentation linked below to register the new template repository in software catalog',
      },
      addToCatalogDialogActions: {
        documentationButton: 'Go to the documentation',
        documentationUrl:
          'https://backstage.io/docs/features/software-templates/adding-templates/',
      },
    },
    templateEditorToolbarFileMenu: {
      button: 'File',
      options: {
        openDirectory: 'Open template directory',
        createDirectory: 'Create template directory',
        closeEditor: 'Close template editor',
      },
    },
    templateEditorToolbarTemplatesMenu: {
      button: 'Templates',
    },
  },
});
