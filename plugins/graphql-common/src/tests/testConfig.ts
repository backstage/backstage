export const backstageConfig = {
  backend: {
    listen: { port: 8800 },
    database: {
      prefix: 'graphql_tests_',
      client: 'pg',
      connection: {
        host: 'localhost',
        port: '5432',
        user: 'postgres',
        password: 'postgres',
      },
    },
    baseUrl: 'http://localhost:8800',
  },
  catalog: {
    rules: [
      {
        allow: [
          'Component',
          'System',
          'API',
          'Group',
          'User',
          'Resource',
          'Location'
        ],
      },
    ],
    locations: [
      {
        type: 'url',
        target:
          'https://github.com/thefrontside/backstage/blob/main/catalog-info.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-components.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-systems.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-apis.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/all-resources.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/acme/org.yaml',
      },
      {
        type: 'url',
        target:
          'https://github.com/backstage/software-templates/blob/main/scaffolder-templates/react-ssr-template/template.yaml',
        rules: [{ allow: ['Template'] }]
      },{
        type: 'url',
        target:
          'https://github.com/backstage/software-templates/blob/main/scaffolder-templates/springboot-grpc-template/template.yaml',
        rules: [{ allow: ['Template'] }]
      },{
        type: 'url',
        target:
          'https://github.com/backstage/software-templates/blob/main/scaffolder-templates/docs-template/template.yaml',
        rules: [{ allow: ['Template'] }]
      },
    ],
  },
};
