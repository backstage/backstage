import { releases } from './releases';

function tryToLoadCustomSidebar(ref) {
  try {
    return require(ref);
  } catch (e) {
    return [];
  }
}

const catalogSidebar = tryToLoadCustomSidebar(
  '../docs/features/software-catalog/api/sidebar.ts',
);
const searchSidebar = tryToLoadCustomSidebar(
  '../docs/features/search/api/sidebar.ts',
);

export default {
  docs: {
    Overview: [
      'overview/what-is-backstage',
      'overview/architecture-overview',
      'overview/background',
      'overview/vision',
      'overview/roadmap',
      'overview/threat-model',
      'overview/versioning-policy',
    ],
    'Getting Started': [
      'getting-started/index',
      {
        type: 'category',
        label: 'Configuring Backstage',
        items: [
          'getting-started/config/database',
          'getting-started/config/authentication',
          'getting-started/configure-app-with-plugins',
          'getting-started/app-custom-theme',
          'getting-started/homepage',
        ],
      },
      {
        type: 'category',
        label: 'Deploying Backstage',
        items: [
          'deployment/index',
          'deployment/scaling',
          'deployment/docker',
          'deployment/k8s',
        ],
      },
      {
        type: 'category',
        label: 'Using Backstage',
        items: [
          'getting-started/logging-in',
          'getting-started/register-a-component',
          'getting-started/create-a-component',
        ],
      },
      'overview/support',
      'getting-started/keeping-backstage-updated',
    ],
    'Core Features': [
      {
        type: 'category',
        label: 'Auth and Identity',
        items: [
          'auth/index',
          {
            type: 'category',
            label: 'Included providers',
            items: [
              'auth/auth0/provider',
              'auth/atlassian/provider',
              'auth/aws-alb/provider',
              'auth/microsoft/provider',
              'auth/microsoft/easy-auth',
              'auth/bitbucket/provider',
              'auth/bitbucketServer/provider',
              'auth/cloudflare/provider',
              'auth/github/provider',
              'auth/gitlab/provider',
              'auth/google/provider',
              'auth/google/gcp-iap-auth',
              'auth/guest/provider',
              'auth/okta/provider',
              'auth/oauth2-proxy/provider',
              'auth/onelogin/provider',
              'auth/vmware-cloud/provider',
            ],
          },
          'auth/identity-resolver',
          'auth/oauth',
          'auth/oidc',
          'auth/add-auth-provider',
          'auth/service-to-service-auth',
          'auth/autologout',
          'auth/troubleshooting',
        ],
      },
      {
        type: 'category',
        label: 'Kubernetes',
        items: [
          'features/kubernetes/overview',
          'features/kubernetes/installation',
          'features/kubernetes/configuration',
          'features/kubernetes/authentication',
          'features/kubernetes/authentication-strategies',
          'features/kubernetes/troubleshooting',
          'features/kubernetes/proxy',
        ],
      },
      {
        type: 'category',
        label: 'Notifications',
        items: [
          'notifications/index',
          'notifications/processors',
          'notifications/usage',
        ],
      },
      {
        type: 'category',
        label: 'Permissions',
        items: [
          'permissions/overview',
          'permissions/concepts',
          'permissions/getting-started',
          'permissions/writing-a-policy',
          'permissions/frontend-integration',
          'permissions/custom-rules',
          {
            type: 'category',
            label: 'Tutorial: using Permissions in your plugin',
            items: [
              'permissions/plugin-authors/01-setup',
              'permissions/plugin-authors/02-adding-a-basic-permission-check',
              'permissions/plugin-authors/03-adding-a-resource-permission-check',
              'permissions/plugin-authors/04-authorizing-access-to-paginated-data',
              'permissions/plugin-authors/05-frontend-authorization',
            ],
          },
        ],
      },
      {
        type: 'category',
        label: 'Search',
        items: [
          'features/search/search-overview',
          'features/search/getting-started',
          'features/search/concepts',
          {
            type: 'category',
            label: 'API',
            link:
              searchSidebar.length > 0
                ? {
                    type: 'generated-index',
                    title: 'Search API',
                    slug: '/category/search-api',
                  }
                : {
                    type: 'doc',
                    id: 'openapi/generated-docs/404',
                  },
            items: searchSidebar,
          },
          'features/search/architecture',
          'features/search/search-engines',
          'features/search/collators',
          'features/search/how-to-guides',
        ],
      },
      {
        type: 'category',
        label: 'Software Catalog',
        items: [
          'features/software-catalog/software-catalog-overview',
          'features/software-catalog/life-of-an-entity',
          'features/software-catalog/configuration',
          'features/software-catalog/system-model',
          'features/software-catalog/descriptor-format',
          'features/software-catalog/references',
          'features/software-catalog/well-known-annotations',
          'features/software-catalog/well-known-relations',
          'features/software-catalog/well-known-statuses',
          'features/software-catalog/extending-the-model',
          'features/software-catalog/external-integrations',
          'features/software-catalog/catalog-customization',
          {
            type: 'category',
            label: 'API',
            link:
              catalogSidebar.length > 0
                ? {
                    type: 'generated-index',
                    title: 'Catalog API',
                    slug: '/category/catalog-api',
                  }
                : {
                    type: 'doc',
                    id: 'openapi/generated-docs/404',
                  },
            items: catalogSidebar,
          },
          'features/software-catalog/creating-the-catalog-graph',
          'features/software-catalog/faq',
        ],
      },
      {
        type: 'category',
        label: 'Software Templates',
        items: [
          'features/software-templates/software-templates-index',
          'features/software-templates/configuration',
          'features/software-templates/adding-templates',
          'features/software-templates/writing-templates',
          'features/software-templates/input-examples',
          'features/software-templates/builtin-actions',
          'features/software-templates/writing-custom-actions',
          'features/software-templates/writing-tests-for-actions',
          'features/software-templates/writing-custom-field-extensions',
          'features/software-templates/writing-custom-step-layouts',
          'features/software-templates/authorizing-scaffolder-template-details',
          'features/software-templates/migrating-to-rjsf-v5',
          'features/software-templates/migrating-from-v1beta2-to-v1beta3',
          'features/software-templates/dry-run-testing',
          'features/software-templates/experimental',
        ],
      },
      {
        type: 'category',
        label: 'TechDocs',
        items: [
          'features/techdocs/techdocs-overview',
          'features/techdocs/getting-started',
          'features/techdocs/concepts',
          'features/techdocs/addons',
          'features/techdocs/architecture',
          'features/techdocs/extensions',
          'features/techdocs/creating-and-publishing',
          'features/techdocs/configuration',
          'features/techdocs/using-cloud-storage',
          'features/techdocs/configuring-ci-cd',
          'features/techdocs/cli',
          'features/techdocs/how-to-guides',
          'features/techdocs/troubleshooting',
          'features/techdocs/faqs',
        ],
      },
    ],
    Integrations: [
      'integrations/index',
      {
        type: 'category',
        label: 'AWS S3',
        items: [
          'integrations/aws-s3/locations',
          'integrations/aws-s3/discovery',
        ],
      },
      {
        type: 'category',
        label: 'Azure Blob Storage',
        items: [
          'integrations/azure-blobStorage/locations',
          'integrations/azure-blobStorage/discovery',
        ],
      },
      {
        type: 'category',
        label: 'Azure',
        items: [
          'integrations/azure/locations',
          'integrations/azure/discovery',
          'integrations/azure/org',
        ],
      },
      {
        type: 'category',
        label: 'Bitbucket Cloud',
        items: [
          'integrations/bitbucketCloud/locations',
          'integrations/bitbucketCloud/discovery',
        ],
      },
      {
        type: 'category',
        label: 'Bitbucket Server',
        items: [
          'integrations/bitbucketServer/locations',
          'integrations/bitbucketServer/discovery',
        ],
      },
      {
        type: 'category',
        label: 'Datadog',
        items: ['integrations/datadog-rum/installation'],
      },
      {
        type: 'category',
        label: 'Gerrit',
        items: [
          'integrations/gerrit/locations',
          'integrations/gerrit/discovery',
        ],
      },
      {
        type: 'category',
        label: 'GitHub',
        items: [
          'integrations/github/locations',
          'integrations/github/discovery',
          'integrations/github/org',
          'integrations/github/github-apps',
        ],
      },
      {
        type: 'category',
        label: 'GitLab',
        items: [
          'integrations/gitlab/locations',
          'integrations/gitlab/discovery',
          'integrations/gitlab/org',
        ],
      },
      {
        type: 'category',
        label: 'Gitea',
        items: ['integrations/gitea/locations'],
      },
      {
        type: 'category',
        label: 'Harness',
        items: ['integrations/harness/locations'],
      },
      {
        type: 'category',
        label: 'Google GCS',
        items: ['integrations/google-cloud-storage/locations'],
      },
      {
        type: 'category',
        label: 'LDAP',
        items: ['integrations/ldap/org'],
      },
    ],
    Plugins: [
      'plugins/index',
      'plugins/existing-plugins',
      'plugins/create-a-plugin',
      'plugins/plugin-development',
      'plugins/structure-of-a-plugin',
      'plugins/integrating-plugin-into-software-catalog',
      'plugins/integrating-search-into-plugins',
      'plugins/composability',
      'plugins/internationalization',
      'plugins/analytics',
      'plugins/feature-flags',
      {
        type: 'category',
        label: 'OpenAPI',
        items: [
          'openapi/01-getting-started',
          'openapi/generate-client',
          'openapi/test-case-validation',
        ],
      },
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
          'plugins/publish-private',
          'plugins/add-to-directory',
          'plugins/observability',
        ],
      },
    ],
    Configuration: [
      'conf/index',
      'conf/reading',
      'conf/writing',
      'conf/defining',
    ],
    Framework: [
      {
        type: 'category',
        label: 'Backend System',
        items: [
          'backend-system/index',
          {
            type: 'category',
            label: 'Architecture',
            items: [
              'backend-system/architecture/index',
              'backend-system/architecture/services',
              'backend-system/architecture/plugins',
              'backend-system/architecture/extension-points',
              'backend-system/architecture/modules',
              'backend-system/architecture/feature-loaders',
              'backend-system/architecture/naming-patterns',
            ],
          },
          {
            type: 'category',
            label: 'Building Backends',
            items: [
              'backend-system/building-backends/index',
              'backend-system/building-backends/migrating',
            ],
          },
          {
            type: 'category',
            label: 'Building Plugins & Modules',
            items: [
              'backend-system/building-plugins-and-modules/index',
              'backend-system/building-plugins-and-modules/testing',
              'backend-system/building-plugins-and-modules/migrating',
            ],
          },
          {
            type: 'category',
            label: 'Core Services',
            items: [
              'backend-system/core-services/index',
              'backend-system/core-services/auditor',
              'backend-system/core-services/auth',
              'backend-system/core-services/cache',
              'backend-system/core-services/database',
              'backend-system/core-services/discovery',
              'backend-system/core-services/http-auth',
              'backend-system/core-services/http-router',
              'backend-system/core-services/identity',
              'backend-system/core-services/lifecycle',
              'backend-system/core-services/logger',
              'backend-system/core-services/permissions',
              'backend-system/core-services/permissions-registry',
              'backend-system/core-services/plugin-metadata',
              'backend-system/core-services/root-config',
              'backend-system/core-services/root-health',
              'backend-system/core-services/root-http-router',
              'backend-system/core-services/root-lifecycle',
              'backend-system/core-services/root-logger',
              'backend-system/core-services/scheduler',
              'backend-system/core-services/token-manager',
              'backend-system/core-services/url-reader',
              'backend-system/core-services/user-info',
            ],
          },
        ],
      },
      {
        type: 'category',
        label: 'New Frontend System',
        items: [
          'frontend-system/index',
          {
            type: 'category',
            label: 'Architecture',
            items: [
              'frontend-system/architecture/index',
              'frontend-system/architecture/app',
              'frontend-system/architecture/plugins',
              'frontend-system/architecture/extensions',
              'frontend-system/architecture/extension-blueprints',
              'frontend-system/architecture/extension-overrides',
              'frontend-system/architecture/references',
              'frontend-system/architecture/utility-apis',
              'frontend-system/architecture/routes',
              'frontend-system/architecture/naming-patterns',
              'frontend-system/architecture/migrations',
            ],
          },
          {
            type: 'category',
            label: 'Building Plugins',
            items: [
              'frontend-system/building-plugins/index',
              'frontend-system/building-plugins/testing',
              'frontend-system/building-plugins/common-extension-blueprints',
              'frontend-system/building-plugins/built-in-data-refs',
              'frontend-system/building-plugins/migrating',
            ],
          },
          {
            type: 'category',
            label: 'Building Apps',
            items: [
              'frontend-system/building-apps/index',
              'frontend-system/building-apps/configuring-extensions',
              'frontend-system/building-apps/built-in-extensions',
              'frontend-system/building-apps/plugin-conversion',
              'frontend-system/building-apps/migrating',
            ],
          },
          {
            type: 'category',
            label: 'Utility APIs',
            items: [
              'frontend-system/utility-apis/index',
              'frontend-system/utility-apis/creating',
              'frontend-system/utility-apis/consuming',
              'frontend-system/utility-apis/configuring',
            ],
          },
        ],
      },
      {
        'Backstage CLI': [
          'tooling/cli/overview',
          'tooling/cli/build-system',
          'tooling/cli/commands',
          'tooling/cli/templates',
          {
            type: 'category',
            label: 'Local Development',
            items: [
              'tooling/local-dev/linking-local-packages',
              'tooling/local-dev/debugging',
              'tooling/local-dev/profiling',
            ],
          },
          'tooling/package-metadata',
        ],
      },
    ],
    Tutorials: [
      { 'Non-technical': ['overview/adopting'] },
      {
        Technical: [
          'tutorials/quickstart-app-plugin',
          'tutorials/configuring-plugin-databases',
          'tutorials/manual-knex-rollback',
          'tutorials/switching-sqlite-postgres',
          'tutorials/using-backstage-proxy-within-plugin',
          'tutorials/enable-public-entry',
          'tutorials/setup-opentelemetry',
          'accessibility/index',
        ],
      },
      {
        Migrations: [
          'tutorials/react-router-stable-migration',
          'tutorials/react18-migration',
          'tutorials/package-role-migration',
          'tutorials/migrating-away-from-core',
          'tutorials/yarn-migration',
          'tutorials/migrate-to-mui5',
          'tutorials/auth-service-migration',
        ],
      },
    ],
    FAQ: ['faq/index', 'faq/product', 'faq/technical'],
    Contribute: [
      'contribute/index',
      'contribute/getting-involved',
      'contribute/project-structure',
    ],
    References: [
      {
        'Designing for Backstage': [
          'dls/design',
          'dls/component-design-guidelines',
          'dls/contributing-to-storybook',
          'dls/figma',
        ],
      },
      {
        type: 'category',
        label: 'Architecture Decision Records (ADRs)',
        items: [
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
          'architecture-decisions/adrs-adr010',
          'architecture-decisions/adrs-adr011',
          'architecture-decisions/adrs-adr012',
          'architecture-decisions/adrs-adr013',
          'architecture-decisions/adrs-adr014',
        ],
      },
      'api/deprecations',
      'references/glossary',
      'api/utility-apis',
      'reference/index',
    ],
  },
  releases: {
    'Release Notes': releases.map(release => `releases/${release}`),
  },
};
