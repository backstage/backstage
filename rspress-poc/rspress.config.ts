import { defineConfig } from 'rspress/config';
import * as path from 'path';

export default defineConfig({
  root: path.join(__dirname, '../docs'),
  title: 'Backstage',
  description: 'An open source framework for building developer portals',
  logo: {
    dark: '/img/logo.svg',
    light: '/img/logo-black.svg',
  },
  icon: '/img/favicon.ico',
  head: [
    ['meta', { property: 'og:title', content: 'Backstage' }],
    ['meta', { property: 'og:description', content: 'An open source framework for building developer portals' }],
  ],
  markdown: {
    mdxRs: true, // Use Rust compiler for speed
  },
  route: {
    include: ['**/*.{md,mdx}'],
    exclude: ['**/node_modules/**', '**/build/**', '**/theme/**'],
    cleanUrls: true, // Remove .html from URLs
  },
  // Multi-version support (ready for when docs are organized into version folders)
  // multiVersion: {
  //   default: 'stable',
  //   versions: ['stable', 'next']
  // },
  builderConfig: {
    tools: {
      rspack: {
        resolve: {
          preferRelative: true, // Treat relative image paths without ./ as relative
        },
        module: {
          rules: [
            {
              test: /\.ya?ml$/,
              use: 'yaml-loader',
            },
          ],
        },
      },
    },
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/overview/what-is-backstage' },
      { text: 'API Reference', link: '/reference/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Plugins', link: '/plugins' },
      { text: 'Community', link: '/community' },
      {
        text: 'GitHub',
        link: 'https://github.com/backstage/backstage',
      },
      {
        text: 'Discord',
        link: 'https://discord.gg/backstage-687207715902193673',
      },
    ],
    sidebar: {
      // Main docs sidebar - applies to all doc pages
      // Custom pages (home, blog, plugins) use custom layouts that bypass this
      '/': [
        {
          text: 'Overview',
          items: [
            { text: 'What is Backstage?', link: '/overview/what-is-backstage' },
            { text: 'Technical Overview', link: '/overview/technical-overview' },
            { text: 'Architecture Overview', link: '/overview/architecture-overview' },
            { text: 'Roadmap', link: '/overview/roadmap' },
            { text: 'Threat Model', link: '/overview/threat-model' },
            { text: 'Versioning Policy', link: '/overview/versioning-policy' },
          ],
        },
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/getting-started/index' },
            {
              text: 'Configuring Backstage',
              collapsed: true,
              items: [
                { text: 'Database', link: '/getting-started/config/database' },
                { text: 'Authentication', link: '/getting-started/config/authentication' },
                { text: 'Configure App with Plugins', link: '/getting-started/configure-app-with-plugins' },
                { text: 'Homepage', link: '/getting-started/homepage' },
              ],
            },
            {
              text: 'Deploying Backstage',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/deployment/index' },
                { text: 'Scaling', link: '/deployment/scaling' },
                { text: 'Docker', link: '/deployment/docker' },
                { text: 'Kubernetes', link: '/deployment/k8s' },
              ],
            },
            {
              text: 'Using Backstage',
              collapsed: true,
              items: [
                { text: 'Logging In', link: '/getting-started/logging-in' },
                { text: 'Register a Component', link: '/getting-started/register-a-component' },
                { text: 'Create a Component', link: '/getting-started/create-a-component' },
              ],
            },
            { text: 'Support', link: '/overview/support' },
            { text: 'Keeping Backstage Updated', link: '/getting-started/keeping-backstage-updated' },
          ],
        },
        {
          text: 'Core Features',
          collapsed: true,
          items: [
            {
              text: 'Auth and Identity',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/auth/index' },
                { text: 'Identity Resolver', link: '/auth/identity-resolver' },
                { text: 'OAuth', link: '/auth/oauth' },
                { text: 'OIDC', link: '/auth/oidc' },
                { text: 'Add Auth Provider', link: '/auth/add-auth-provider' },
                { text: 'Service to Service Auth', link: '/auth/service-to-service-auth' },
              ],
            },
            {
              text: 'Kubernetes',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/features/kubernetes/overview' },
                { text: 'Installation', link: '/features/kubernetes/installation' },
                { text: 'Configuration', link: '/features/kubernetes/configuration' },
                { text: 'Authentication', link: '/features/kubernetes/authentication' },
              ],
            },
            {
              text: 'Notifications',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/notifications/index' },
                { text: 'Processors', link: '/notifications/processors' },
                { text: 'Usage', link: '/notifications/usage' },
              ],
            },
            {
              text: 'Permissions',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/permissions/overview' },
                { text: 'Concepts', link: '/permissions/concepts' },
                { text: 'Getting Started', link: '/permissions/getting-started' },
                { text: 'Writing a Policy', link: '/permissions/writing-a-policy' },
              ],
            },
            {
              text: 'Search',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/features/search/search-overview' },
                { text: 'Getting Started', link: '/features/search/getting-started' },
                { text: 'Concepts', link: '/features/search/concepts' },
                { text: 'Architecture', link: '/features/search/architecture' },
              ],
            },
            {
              text: 'Software Catalog',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/features/software-catalog/software-catalog-overview' },
                { text: 'Life of an Entity', link: '/features/software-catalog/life-of-an-entity' },
                { text: 'Configuration', link: '/features/software-catalog/configuration' },
                { text: 'System Model', link: '/features/software-catalog/system-model' },
                { text: 'Descriptor Format', link: '/features/software-catalog/descriptor-format' },
              ],
            },
            {
              text: 'Software Templates',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/features/software-templates/software-templates-index' },
                { text: 'Configuration', link: '/features/software-templates/configuration' },
                { text: 'Adding Templates', link: '/features/software-templates/adding-templates' },
                { text: 'Writing Templates', link: '/features/software-templates/writing-templates' },
                { text: 'Builtin Actions', link: '/features/software-templates/builtin-actions' },
              ],
            },
            {
              text: 'TechDocs',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/features/techdocs/techdocs-overview' },
                { text: 'Getting Started', link: '/features/techdocs/getting-started' },
                { text: 'Concepts', link: '/features/techdocs/concepts' },
                { text: 'Architecture', link: '/features/techdocs/architecture' },
              ],
            },
          ],
        },
        {
          text: 'Integrations',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/integrations/index' },
            {
              text: 'GitHub',
              collapsed: true,
              items: [
                { text: 'Locations', link: '/integrations/github/locations' },
                { text: 'Discovery', link: '/integrations/github/discovery' },
                { text: 'Org Data', link: '/integrations/github/org' },
                { text: 'GitHub Apps', link: '/integrations/github/github-apps' },
              ],
            },
            {
              text: 'GitLab',
              collapsed: true,
              items: [
                { text: 'Locations', link: '/integrations/gitlab/locations' },
                { text: 'Discovery', link: '/integrations/gitlab/discovery' },
                { text: 'Org Data', link: '/integrations/gitlab/org' },
              ],
            },
          ],
        },
        {
          text: 'Plugins',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/plugins/index' },
            { text: 'Existing Plugins', link: '/plugins/existing-plugins' },
            { text: 'Create a Plugin', link: '/plugins/create-a-plugin' },
            { text: 'Plugin Development', link: '/plugins/plugin-development' },
            { text: 'Structure of a Plugin', link: '/plugins/structure-of-a-plugin' },
          ],
        },
        {
          text: 'Configuration',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/conf/index' },
            { text: 'Reading', link: '/conf/reading' },
            { text: 'Writing', link: '/conf/writing' },
            { text: 'Defining', link: '/conf/defining' },
          ],
        },
        {
          text: 'Framework',
          collapsed: true,
          items: [
            {
              text: 'Backend System',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/backend-system/index' },
                {
                  text: 'Architecture',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: '/backend-system/architecture/index' },
                    { text: 'Services', link: '/backend-system/architecture/services' },
                    { text: 'Plugins', link: '/backend-system/architecture/plugins' },
                  ],
                },
              ],
            },
            {
              text: 'New Frontend System',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/frontend-system/index' },
                {
                  text: 'Architecture',
                  collapsed: true,
                  items: [
                    { text: 'Overview', link: '/frontend-system/architecture/index' },
                    { text: 'App', link: '/frontend-system/architecture/app' },
                    { text: 'Plugins', link: '/frontend-system/architecture/plugins' },
                  ],
                },
              ],
            },
          ],
        },
        {
          text: 'FAQ',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/faq/index' },
            { text: 'Product', link: '/faq/product' },
            { text: 'Technical', link: '/faq/technical' },
          ],
        },
        {
          text: 'Contribute',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/contribute/index' },
            { text: 'Getting Involved', link: '/contribute/getting-involved' },
            { text: 'Project Structure', link: '/contribute/project-structure' },
          ],
        },
        {
          text: 'References',
          collapsed: true,
          items: [
            { text: 'Glossary', link: '/references/glossary' },
            { text: 'API Utility APIs', link: '/api/utility-apis' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Package Index', link: '/reference/' },
          ],
        },
        {
          text: 'Core Packages',
          collapsed: false,
          items: [
            { text: '@backstage/backend-app-api', link: '/reference/backend-app-api' },
            { text: '@backstage/backend-plugin-api', link: '/reference/backend-plugin-api' },
            { text: '@backstage/core-app-api', link: '/reference/core-app-api' },
            { text: '@backstage/core-plugin-api', link: '/reference/core-plugin-api' },
            { text: '@backstage/core-components', link: '/reference/core-components' },
            { text: '@backstage/frontend-app-api', link: '/reference/frontend-app-api' },
            { text: '@backstage/frontend-plugin-api', link: '/reference/frontend-plugin-api' },
            { text: '@backstage/catalog-model', link: '/reference/catalog-model' },
            { text: '@backstage/catalog-client', link: '/reference/catalog-client' },
            { text: '@backstage/config', link: '/reference/config' },
            { text: '@backstage/errors', link: '/reference/errors' },
            { text: '@backstage/theme', link: '/reference/theme' },
            { text: '@backstage/types', link: '/reference/types' },
          ],
        },
        {
          text: 'Defaults & Utilities',
          collapsed: true,
          items: [
            { text: '@backstage/app-defaults', link: '/reference/app-defaults' },
            { text: '@backstage/backend-defaults', link: '/reference/backend-defaults' },
            { text: '@backstage/frontend-defaults', link: '/reference/frontend-defaults' },
            { text: '@backstage/integration', link: '/reference/integration' },
            { text: '@backstage/config-loader', link: '/reference/config-loader' },
            { text: '@backstage/test-utils', link: '/reference/test-utils' },
            { text: '@backstage/backend-test-utils', link: '/reference/backend-test-utils' },
            { text: '@backstage/frontend-test-utils', link: '/reference/frontend-test-utils' },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/backstage/backstage',
      },
    ],
  },
});
