export default {
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
};
