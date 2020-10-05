backend:
  lighthouseHostname: {{ include "lighthouse.serviceName" . | quote }}
  listen: {{ .Values.appConfig.backend.listen | quote }}
  cors:
    origin: {{ .Values.appConfig.backend.cors.origin | quote }}
  database:
    client: {{ .Values.appConfig.backend.database.client | quote }}
    connection:
      host: {{ include "backend.postgresql.host" . | quote }}
      port: {{ include "backend.postgresql.port" . | quote }}
      user: {{ include "backend.postgresql.user" . | quote }}
      database: {{ .Values.appConfig.backend.database.connection.database | quote }}
      ssl:
        rejectUnauthorized: {{ .Values.appConfig.backend.database.connection.ssl.rejectUnauthorized | quote }}
        ca: {{ include "backstage.backend.postgresCaFilename" . | quote }}

catalog:
  locations:
    # Backstage example components
    - type: github
      target: https://github.com/spotify/backstage/blob/master/packages/catalog-model/examples/all-components.yaml
    # Example component for github-actions
    - type: github
      target: https://github.com/spotify/backstage/blob/master/plugins/github-actions/examples/sample.yaml
    # Example component for techdocs
    - type: github
      target: https://github.com/spotify/backstage/blob/master/plugins/techdocs-backend/examples/documented-component/documented-component.yaml
    # Backstage example APIs
    - type: github
      target: https://github.com/spotify/backstage/blob/master/packages/catalog-model/examples/all-apis.yaml
    # Backstage example templates
    - type: github
      target: https://github.com/spotify/backstage/blob/master/plugins/scaffolder-backend/sample-templates/all-templates.yaml

sentry:
  organization: {{ .Values.appConfig.sentry.organization | quote }}

auth:
  providers:
    github:
      development:
        clientId: {{ .Values.auth.github.clientId }}
        appOrigin: {{ .Values.appConfig.auth.providers.github.development.appOrigin | quote }}
    google:
      development:
        clientId: {{ .Values.auth.google.clientId }}
        appOrigin: {{ .Values.appConfig.auth.providers.google.development.appOrigin | quote }}
    gitlab:
      development:
        clientId: {{ .Values.auth.gitlab.clientId }}
        appOrigin: {{ .Values.appConfig.auth.providers.gitlab.development.appOrigin | quote }}
        audience: {{ .Values.auth.gitlab.baseUrl }}
    okta:
      development:
        clientId: {{ .Values.auth.okta.clientId }}
        audience: {{ .Values.auth.okta.audience }}
        appOrigin: {{ .Values.appConfig.auth.providers.okta.development.appOrigin | quote }}
    oauth2:
      development:
        clientId: {{ .Values.auth.oauth2.clientId }}
        tokenUrl: {{ .Values.auth.oauth2.tokenUrl }}
        appOrigin: {{ .Values.appConfig.auth.providers.oauth2.development.appOrigin | quote }}
    auth0:
      development:
        clientId: {{ .Values.auth.auth0.clientId }}
    microsoft:
      development:
        clientId: {{ .Values.auth.microsoft.clientId }}
        tenantId: {{ .Values.auth.microsoft.tenantId }}

lighthouse:
  baseUrl: {{ .Values.appConfig.lighthouse.baseUrl | quote }}
