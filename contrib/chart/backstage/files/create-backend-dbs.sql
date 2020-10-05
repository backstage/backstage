{{ $backendDb := .Values.appConfig.backend.database.connection.database }}
{{ $lighthouseDb := .Values.lighthouse.database.connection.database }}
{{ $user := .Values.global.postgresql.postgresqlUsername }}

create database {{ $backendDb }};
grant all privileges on database {{ $backendDb }} to {{ $user }};

{{ if not (eq $backendDb $lighthouseDb) }}
create database {{ $lighthouseDb }};
grant all privileges on database {{ $lighthouseDb }} to {{ $user }};
{{ end }}