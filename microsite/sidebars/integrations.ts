export default {
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
      items: ['integrations/aws-s3/locations', 'integrations/aws-s3/discovery'],
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
      items: ['integrations/gerrit/locations', 'integrations/gerrit/discovery'],
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
      items: ['integrations/gitea/locations', 'integrations/gitea/discovery'],
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
};
