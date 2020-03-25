{{/* The maximum length of a name is 63. This leaves space for 54 characters as  '-frontend' is 9 characters. */}}


{{- define "frontend.name" -}}
{{- $name := default .Chart.Name | trunc 54 | trimSuffix "-" -}}
{{- printf "%s-%s" $name "frontend" -}}
{{- end -}}



{{- define "backstage.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Frontend labels
*/}}
{{- define "frontend.labels" -}}
helm.sh/chart: {{ include "backstage.chart" . }}
{{ include "frontend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Frontend selector labels
*/}}
{{- define "frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "frontend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
