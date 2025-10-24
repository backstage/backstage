export default {
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
};
