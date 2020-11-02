/*
 * Copyright 2020 Spotify AB
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
module.exports = {
  docs: {
    Overview: [
      'overview/what-is-backstage',
      'overview/architecture-overview',
      'overview/roadmap',
      'overview/vision',
      'overview/background',
      'overview/adopting',
      'overview/logos',
    ],
    'Getting Started': [
      'getting-started/index',
      'getting-started/running-backstage-locally',
      'getting-started/development-environment',
      'getting-started/create-an-app',
      {
        type: 'category',
        label: 'App configuration',
        items: [
          'getting-started/configure-app-with-plugins',
          'getting-started/app-custom-theme',
        ],
      },
      {
        type: 'category',
        label: 'Deployment',
        items: [
          'getting-started/deployment-k8s',
          'getting-started/deployment-helm',
          'getting-started/deployment-other',
        ],
      },
    ],
    'Core Features': [
      {
        type: 'category',
        label: 'Software Catalog',
        items: [
          'features/software-catalog/software-catalog-overview',
          'features/software-catalog/installation',
          'features/software-catalog/configuration',
          'features/software-catalog/system-model',
          'features/software-catalog/descriptor-format',
          'features/software-catalog/references',
          'features/software-catalog/well-known-annotations',
          'features/software-catalog/extending-the-model',
          'features/software-catalog/external-integrations',
          'features/software-catalog/software-catalog-api',
        ],
      },
      {
        type: 'category',
        label: 'Software Templates',
        items: [
          'features/software-templates/software-templates-index',
          'features/software-templates/installation',
          'features/software-templates/adding-templates',
          'features/software-templates/extending/extending-index',
          'features/software-templates/extending/extending-templater',
          'features/software-templates/extending/extending-publisher',
          'features/software-templates/extending/extending-preparer',
        ],
      },
      {
        type: 'category',
        label: 'TechDocs',
        items: [
          'features/techdocs/techdocs-overview',
          'features/techdocs/getting-started',
          'features/techdocs/concepts',
          'features/techdocs/architecture',
          'features/techdocs/creating-and-publishing',
          'features/techdocs/troubleshooting',
          'features/techdocs/faqs',
        ],
      },
    ],
    Plugins: [
      'plugins/index',
      'plugins/existing-plugins',
      'plugins/create-a-plugin',
      'plugins/plugin-development',
      'plugins/structure-of-a-plugin',
      'plugins/integrating-plugin-into-service-catalog',
      {
        type: 'category',
        label: 'Backends and APIs',
        items: [
          'plugins/proxying',
          'plugins/backend-plugin',
          'plugins/call-existing-api',
        ],
      },
      {
        type: 'category',
        label: 'Testing',
        items: ['plugins/testing'],
      },
      {
        type: 'category',
        label: 'Publishing',
        items: [
          'plugins/publishing',
          'plugins/publish-private',
          'plugins/add-to-marketplace',
        ],
      },
    ],
    Configuration: [
      'conf/index',
      'conf/reading',
      'conf/writing',
      'conf/defining',
    ],
    'Auth and identity': [
      'auth/index',
      'auth/add-auth-provider',
      'auth/auth-backend',
      'auth/oauth',
      'auth/glossary',
      'auth/auth-backend-classes',
    ],

    'Designing for Backstage': [
      'dls/design',
      'dls/contributing-to-storybook',
      'dls/figma',
    ],
    'API references': [
      {
        type: 'category',
        label: 'TypeScript API',
        items: [
          'api/utility-apis',
          'reference/utility-apis/README',
          'reference/createPlugin',
          'reference/createPlugin-feature-flags',
          'reference/createPlugin-router',
        ],
      },
      {
        type: 'category',
        label: 'Backend APIs',
        items: ['api/backend'],
      },
    ],
    Tutorials: [
      'tutorials/journey',
      'tutorials/quickstart-app-auth',
      'tutorials/quickstart-app-plugin',
    ],
    'Architecture Decision Records (ADRs)': [
      'architecture-decisions/adrs-overview',
      'architecture-decisions/adrs-adr001',
      'architecture-decisions/adrs-adr002',
      'architecture-decisions/adrs-adr003',
      'architecture-decisions/adrs-adr004',
      'architecture-decisions/adrs-adr005',
      'architecture-decisions/adrs-adr006',
      'architecture-decisions/adrs-adr007',
      'architecture-decisions/adrs-adr008',
      'architecture-decisions/adrs-adr009',
    ],
    Support: ['support/support', 'support/project-structure'],
    FAQ: ['FAQ'],
  },
};
