/*
 * Copyright 2021 The Backstage Authors
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
export const advancedAppConfig = `app:
  title: Scaffolded Backstage App
  baseUrl: http://localhost:3000

organization:
  name: My Company

backend:
  baseUrl: http://localhost:7000
  listen:
    port: 7000
  csp:
    connect-src: ["'self'", 'http:', 'https:']
  cors:
    origin: http://localhost:3000
    methods: [GET, POST, PUT, DELETE]
    credentials: true
  # config options: https://node-postgres.com/api/client
  database:
    client: pg
    connection:
      host: \${POSTGRES_HOST}
      port: \${POSTGRES_PORT}
      user: \${POSTGRES_USER}
      password: \${POSTGRES_PASSWORD}
      # https://node-postgres.com/features/ssl
      #ssl: require # see https://www.postgresql.org/docs/current/libpq-ssl.html Table 33.1. SSL Mode Descriptions (e.g. require)
      #ca: # if you have a CA file and want to verify it you can uncomment this section
      #  $file: <file-path>/ca/server.crt
  # workingDirectory: /tmp # Use this to configure a working directory for the scaffolder, defaults to the OS temp-dir

integrations:
  github:
    - host: github.com
      token: \${GITHUB_TOKEN}
    ### Example for how to add your GitHub Enterprise instance using the API:
    # - host: ghe.example.net
    #   apiBaseUrl: https://ghe.example.net/api/v3
    #   token: \${GHE_TOKEN}

proxy:
  '/test':
    target: 'https://example.com'
    changeOrigin: true

# Reference documentation http://backstage.io/docs/features/techdocs/configuration
# Note: After experimenting with basic setup, use CI/CD to generate docs
# and an external cloud storage when deploying TechDocs for production use-case.
# https://backstage.io/docs/features/techdocs/how-to-guides#how-to-migrate-from-techdocs-basic-to-recommended-deployment-approach
techdocs:
  builder: 'local' # Alternatives - 'external'
  generators:
    techdocs: 'docker' # Alternatives - 'local'
  publisher:
    type: 'local' # Alternatives - 'googleGcs' or 'awsS3'. Read documentation for using alternatives.

auth:
  # see https://backstage.io/docs/tutorials/quickstart-app-auth to know more about enabling auth providers
  providers: {}

scaffolder:
  github:
    token: \${GITHUB_TOKEN}
    visibility: public # or 'internal' or 'private'

catalog:
  rules:
    - allow: [Component, System, API, Group, User, Template, Location]
  locations:
    - type: sysmodel
      target: http://sysmodel.spotify.net
      rules:
        - allow: [Component, System]
    - type: ldap-org
      target: ldaps://ds.spotify.net
  processors:
    cheese:
      haha:
        - target: ldaps://ds.spotify.net

service-auth:
  maintainers:
    - jmaiz
    - samiram
    - tejask
    - eide
    - gustafr`;
