import {
  searchSidebar,
  catalogSidebar,
  scaffolderSidebar,
} from './helpers/helpers';

export default {
  type: 'category',
  label: 'Core Features',
  link: {
    type: 'generated-index',
    title: 'Core Features',
    slug: '/core-features',
  },
  items: [
    {
      type: 'category',
      label: 'Auth and Identity',
      link: {
        type: 'generated-index',
        title: 'Auth and Identity',
        slug: '/auth-and-identity',
      },
      items: [
        'auth/index',
        {
          type: 'category',
          label: 'Included providers',
          link: {
            type: 'generated-index',
            title: 'Included providers',
            slug: '/auth-and-identity/included-providers',
          },
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
      link: {
        type: 'generated-index',
        title: 'Kubernetes',
        slug: '/kubernetes',
      },
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
      link: {
        type: 'generated-index',
        title: 'Notifications',
        slug: '/notifications',
      },
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
              : { type: 'doc', id: 'openapi/generated-docs/404' },
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
  ],
};
