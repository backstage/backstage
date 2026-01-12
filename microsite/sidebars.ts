import { releases } from './releases';
import { makeGeneratedIndexCategory, makeApiCategory } from './helper';

const tryToLoadCustomSidebar = (ref: string): any[] => {
  try {
    return require(ref);
  } catch (e) {
    return [];
  }
};

const catalogSidebar = tryToLoadCustomSidebar(
  '../docs/features/software-catalog/api/sidebar.ts',
);
const searchSidebar = tryToLoadCustomSidebar(
  '../docs/features/search/api/sidebar.ts',
);
const scaffolderSidebar = tryToLoadCustomSidebar(
  '../docs/features/software-templates/api/sidebar.ts',
);

function sidebarElementWithIndex(
  element: {
    description?: string;
    differentiator?: string;
    label: string;
    docId?: string;
  },
  children: Array<string | object>,
) {
  const { label, description, differentiator = '' } = element;
  return {
    type: 'category',
    label,
    description,
    link: {
      type: 'generated-index',
      title: label,
      slug: `/${differentiator}${label
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')}/generated-index`,
    },
    items: children,
  };
}

export default {
  docs: [
    makeGeneratedIndexCategory('Overview', 'overview', [
      'overview/what-is-backstage',
      'overview/technical-overview',
      'overview/architecture-overview',
      'overview/roadmap',
      'overview/threat-model',
      'overview/versioning-policy',
    ]),
    ,
    makeGeneratedIndexCategory('Getting Started', 'getting-started', [
      'getting-started/index',
      makeGeneratedIndexCategory(
        'Configuring Backstage',
        'configuring-backstage',
        [
          'getting-started/config/database',
          'getting-started/config/authentication',
          'getting-started/configure-app-with-plugins',
          'getting-started/homepage',
        ],
      ),
      makeGeneratedIndexCategory('Deploying Backstage', 'deploying-backstage', [
        'deployment/index',
        'deployment/scaling',
        'deployment/docker',
        'deployment/k8s',
      ]),
      makeGeneratedIndexCategory('Using Backstage', 'using-backstage', [
        'getting-started/logging-in',
        'getting-started/register-a-component',
        'getting-started/create-a-component',
      ]),
      'overview/support',
      'getting-started/keeping-backstage-updated',
    ]),
    makeGeneratedIndexCategory('Core Features', 'core-features', [
      makeGeneratedIndexCategory('Auth and Identity', 'auth-and-identity', [
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
      ]),

      {
        label: 'Integrations',
        description: 'Connect and integrate with external services.',
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
          makeApiCategory('Search', searchSidebar),
          ,
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
                : { type: 'doc', id: 'openapi/generated-docs/404' },
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
          'features/software-templates/templating-extensions',
          {
            type: 'category',
            label: 'API',
            link:
              scaffolderSidebar.length > 0
                ? {
                    type: 'generated-index',
                    title: 'Scaffolder API',
                    slug: '/category/scaffolder-api',
                  }
                : { type: 'doc', id: 'openapi/generated-docs/404' },
            items: scaffolderSidebar,
          },
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
    ]),
    {
      type: 'category',
      label: 'Integrations',
      link: {
        type: 'generated-index',
        title: 'Integrations',
        slug: '/integrations',
      },
      items: [
        'integrations/index',
        {
          type: 'category',
          label: 'AWS S3',
          link: { type: 'generated-index', title: 'AWS S3', slug: '/aws-s3' },
          items: [
            'integrations/aws-s3/locations',
            'integrations/aws-s3/discovery',
          ],
        },
        {
          type: 'category',
          label: 'Azure Blob Storage',
          link: {
            type: 'generated-index',
            title: 'Azure Blob Storage',
            slug: '/azure-blob-storage',
          },
          items: [
            'integrations/azure-blobStorage/locations',
            'integrations/azure-blobStorage/discovery',
          ],
        },
        {
          type: 'category',
          label: 'Azure',
          link: { type: 'generated-index', title: 'Azure', slug: '/azure' },
          items: [
            'integrations/azure/locations',
            'integrations/azure/discovery',
            'integrations/azure/org',
          ],
        },
        {
          type: 'category',
          label: 'Bitbucket Cloud',
          link: {
            type: 'generated-index',
            title: 'Bitbucket Cloud',
            slug: '/bitbucket-cloud',
          },
          items: [
            'integrations/bitbucketCloud/locations',
            'integrations/bitbucketCloud/discovery',
          ],
        },
        {
          type: 'category',
          label: 'Bitbucket Server',
          link: {
            type: 'generated-index',
            title: 'Bitbucket Server',
            slug: '/bitbucket-server',
          },
          items: [
            'integrations/bitbucketServer/locations',
            'integrations/bitbucketServer/discovery',
          ],
        },
        {
          type: 'category',
          label: 'Datadog',
          link: { type: 'generated-index', title: 'datadog', slug: '/datadog' },
          items: ['integrations/datadog-rum/installation'],
        },
        {
          type: 'category',
          label: 'Gerrit',
          link: { type: 'generated-index', title: 'Gerrit', slug: '/gerrit' },
          items: [
            'integrations/gerrit/locations',
            'integrations/gerrit/discovery',
          ],
        },
        {
          type: 'category',
          label: 'GitHub',
          link: { type: 'generated-index', title: 'github', slug: '/github' },
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
          link: { type: 'generated-index', title: 'gitlab', slug: '/gitlab' },
          items: [
            'integrations/gitlab/locations',
            'integrations/gitlab/discovery',
            'integrations/gitlab/org',
          ],
        },
        {
          type: 'category',
          label: 'Gitea',
          link: { type: 'generated-index', title: 'gitea', slug: '/gitea' },
          items: [
            'integrations/gitea/locations',
            'integrations/gitea/discovery',
          ],
        },
        {
          type: 'category',
          label: 'Harness',
          link: { type: 'generated-index', title: 'Harness', slug: '/harness' },
          items: ['integrations/harness/locations'],
        },
        {
          type: 'category',
          label: 'Google GCS',
          link: {
            type: 'generated-index',
            title: 'Google GCS',
            slug: '/google-gcs',
          },
          items: ['integrations/google-cloud-storage/locations'],
        },
        {
          type: 'category',
          label: 'LDAP',
          link: { type: 'generated-index', title: 'LDAP', slug: '/ldap' },
          items: ['integrations/ldap/org'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Plugins',
      link: { type: 'generated-index', title: 'Plugins', slug: '/plugins' },
      items: [
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
          link: { type: 'generated-index', title: 'OpenAPI', slug: '/openapi' },
          items: [
            'openapi/01-getting-started',
            'openapi/generate-client',
            'openapi/test-case-validation',
          ],
        },
        {
          type: 'category',
          label: 'Backends and APIs',
          link: {
            type: 'generated-index',
            title: 'Backends and APIs',
            slug: '/backends-and-apis',
          },
          items: [
            'plugins/proxying',
            'plugins/backend-plugin',
            'plugins/call-existing-api',
          ],
        },
        {
          type: 'category',
          label: 'Testing',
          link: { type: 'generated-index', title: 'Testing', slug: '/testing' },
          items: ['plugins/testing'],
        },
        {
          type: 'category',
          label: 'Publishing',
          link: {
            type: 'generated-index',
            title: 'Publishing',
            slug: '/publishing-doc',
          },
          items: [
            'plugins/publish-private',
            'plugins/add-to-directory',
            'plugins/observability',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      link: {
        type: 'generated-index',
        title: 'Configuration',
        slug: '/configuration',
      },
      items: ['conf/index', 'conf/reading', 'conf/writing', 'conf/defining'],
    },
    {
      type: 'category',
      label: 'Framework',
      link: { type: 'generated-index', title: 'Framework', slug: '/framework' },
      items: [
        {
          type: 'category',
          label: 'Backend System',
          link: {
            type: 'generated-index',
            title: 'Backend System',
            slug: '/backend-system',
          },
          items: [
            'backend-system/index',
            {
              type: 'category',
              label: 'Architecture',
              link: {
                type: 'generated-index',
                title: 'Architecture',
                slug: '/architecture',
              },
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
              link: {
                type: 'generated-index',
                title: 'Building Backends',
                slug: '/building-backends',
              },
              items: [
                'backend-system/building-backends/index',
                'backend-system/building-backends/migrating',
              ],
            },
            {
              type: 'category',
              label: 'Building Plugins & Modules',
              link: {
                type: 'generated-index',
                title: 'Building Plugins & Modules',
                slug: '/building-plugins-and-modules',
              },
              items: [
                'backend-system/building-plugins-and-modules/index',
                'backend-system/building-plugins-and-modules/testing',
                'backend-system/building-plugins-and-modules/migrating',
              ],
            },
            {
              type: 'category',
              label: 'Core Services',
              link: {
                type: 'generated-index',
                title: 'Core Services',
                slug: '/core-services',
              },
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
                'backend-system/core-services/actions-registry',
                'backend-system/core-services/actions',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'New Frontend System',
          link: {
            type: 'generated-index',
            title: 'New Frontend System',
            slug: '/new-frontend-system',
          },
          items: [
            'frontend-system/index',
            {
              type: 'category',
              label: 'Architecture',
              link: {
                type: 'generated-index',
                title: 'Architecture',
                slug: '/architecture',
              },
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
              link: {
                type: 'generated-index',
                title: 'Building Plugins',
                slug: '/building-plugins',
              },
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
              link: {
                type: 'generated-index',
                title: 'Building Apps',
                slug: '/building-apps',
              },
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
              link: {
                type: 'generated-index',
                title: 'Utility APIs',
                slug: '/utility-apis',
              },
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
          type: 'category',
          label: 'Tooling',
          link: { type: 'generated-index', title: 'Tooling', slug: '/tooling' },
          items: [
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
        {
          type: 'category',
          label: 'User Interface',
          link: {
            type: 'generated-index',
            title: 'User Interface',
            slug: '/user-interface',
          },
          items: [
            'conf/user-interface/index',
            'conf/user-interface/logo',
            'conf/user-interface/icons',
            'conf/user-interface/sidebar',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      link: { type: 'generated-index', title: 'Tutorials', slug: '/tutorials' },
      items: [
        {
          type: 'category',
          label: 'Non-technical',
          link: {
            type: 'generated-index',
            title: 'Non-technical',
            slug: '/non-technical-tutorials',
          },
          items: ['overview/adopting'],
        },
        {
          type: 'category',
          label: 'Technical',
          link: {
            type: 'generated-index',
            title: 'Technical',
            slug: '/technical-tutorials',
          },
          items: [
            'tutorials/quickstart-app-plugin',
            'tutorials/configuring-plugin-databases',
            'tutorials/manual-knex-rollback',
            'tutorials/switching-sqlite-postgres',
            'tutorials/using-backstage-proxy-within-plugin',
            'tutorials/enable-public-entry',
            'tutorials/setup-opentelemetry',
            'tutorials/integrating-event-driven-updates-with-entity-providers',
            'accessibility/index',
          ],
        },
        {
          type: 'category',
          label: 'Migrations',
          link: {
            type: 'generated-index',
            title: 'Migrations',
            slug: '/migration-tutorials',
          },
          items: [
            'tutorials/react-router-stable-migration',
            'tutorials/react18-migration',
            'tutorials/package-role-migration',
            'tutorials/migrating-away-from-core',
            'tutorials/yarn-migration',
            'tutorials/migrate-to-mui5',
            'tutorials/auth-service-migration',
            'tutorials/jsx-transform-migration',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'FAQ',
      link: { type: 'generated-index', title: 'FAQ', slug: '/faq' },
      items: ['faq/index', 'faq/product', 'faq/technical'],
    },
    {
      type: 'category',
      label: 'Contribute',
      link: {
        type: 'generated-index',
        title: 'Contribute',
        slug: '/contribute',
      },
      items: [
        'contribute/index',
        'contribute/getting-involved',
        'contribute/project-structure',
      ],
    },
    {
      type: 'category',
      label: 'References',
      link: {
        type: 'generated-index',
        title: 'References',
        slug: '/references',
      },
      items: [
        {
          type: 'category',
          label: 'Designing for Backstage',
          link: {
            type: 'generated-index',
            title: 'Designing for Backstage',
            slug: '/designing-for-backstage',
          },
          items: [
            'dls/design',
            'dls/component-design-guidelines',
            'dls/contributing-to-storybook',
            'dls/figma',
          ],
        },
        {
          type: 'category',
          label: 'Architecture Decision Records (ADRs)',
          link: {
            type: 'generated-index',
            title: 'Architecture Decision Records (ADRs)',
            slug: '/architecture-decision-records-adrs',
          },
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
    {
      ...(process.env.GOLDEN_PATH
        ? {
            'Golden Paths': [
              {
                type: 'category',
                label: '001 - create-app',
                items: [
                  'golden-path/create-app/index',
                  'golden-path/create-app/npx-create-app',
                  'golden-path/create-app/local-development',
                  'golden-path/create-app/installing-plugins',
                  'golden-path/create-app/logging-in',
                  'golden-path/create-app/custom-theme',
                  'golden-path/create-app/keeping-backstage-updated',
                ],
              },
              {
                type: 'category',
                label: '002 - Plugins',
                items: [
                  'golden-path/plugins/index',
                  'golden-path/plugins/why-build-plugins',
                  'golden-path/plugins/sustainable-plugin-development',
                  {
                    type: 'category',
                    label: 'Backend Plugins',
                    items: [
                      'golden-path/plugins/backend/001-first-steps',
                      'golden-path/plugins/backend/002-poking-around',
                    ],
                  },
                ],
              },
            ],
          }
        : {}),
    },
  ],
  releases: {
    'Release Notes': releases.map(release => `releases/${release}`),
  },
};
