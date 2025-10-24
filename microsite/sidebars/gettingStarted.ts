export default {
  type: 'category',
  label: 'Getting Started',
  link: {
    type: 'generated-index',
    title: 'Getting Started',
    slug: '/getting-started',
  },
  items: [
    'getting-started/index',
    {
      type: 'category',
      label: 'Configuring Backstage',
      link: {
        type: 'generated-index',
        title: 'Configuring Backstage',
        slug: '/configuring-backstage',
      },
      items: [
        'getting-started/config/database',
        'getting-started/config/authentication',
        'getting-started/configure-app-with-plugins',
        'getting-started/homepage',
      ],
    },
    {
      type: 'category',
      label: 'Deploying Backstage',
      link: {
        type: 'generated-index',
        title: 'Deploying Backstage',
        slug: '/deploying-backstage',
      },
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
      link: {
        type: 'generated-index',
        title: 'Using Backstage',
        slug: '/using-backstage',
      },
      items: [
        'getting-started/logging-in',
        'getting-started/register-a-component',
        'getting-started/create-a-component',
      ],
    },
    'overview/support',
    'getting-started/keeping-backstage-updated',
  ],
};
