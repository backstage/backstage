/*
 * Copyright 2023 The Backstage Authors
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

/**
 * Annotation for specifying the API server of a Kubernetes cluster
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_API_SERVER = 'kubernetes.io/api-server';

/**
 * Annotation for specifying the Certificate Authority of an API server for a Kubernetes cluster
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_API_SERVER_CA =
  'kubernetes.io/api-server-certificate-authority';

/**
 * Annotation for specifying the auth provider for a Kubernetes cluster
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_AUTH_PROVIDER =
  'kubernetes.io/auth-provider';

/**
 * Annotation for specifying the oidc provider used to get id tokens for a Kubernetes cluster
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER =
  'kubernetes.io/oidc-token-provider';

/**
 * Annotation for specifying boolean value for skip metric lookup.
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_SKIP_METRICS_LOOKUP =
  'kubernetes.io/skip-metrics-lookup';

/**
 * Annotation for specifying boolean value for skip tls verify.
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_SKIP_TLS_VERIFY =
  'kubernetes.io/skip-tls-verify';

/**
 * Annotation for specifying the dashboard url for a Kubernetes cluster.
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_DASHBOARD_URL =
  'kubernetes.io/dashboard-url';

/**
 * Annotation for specifying the dashboard app for a Kubernetes cluster.
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_DASHBOARD_APP =
  'kubernetes.io/dashboard-app';

/**
 * Annotation for specifying the dashboard app parameters for a Kubernetes cluster.
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_DASHBOARD_PARAMETERS =
  'kubernetes.io/dashboard-parameters';

/**
 * Annotation for specifying the assume role use to authenticate with AWS.
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE =
  'kubernetes.io/aws-assume-role';

/**
 * Annotation for specifying the AWS ID of a cluster when signing STS tokens
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_AWS_CLUSTER_ID =
  'kubernetes.io/x-k8s-aws-id';

/**
 * Annotation for specifying an external id when communicating with AWS
 *
 * @public
 */
export const ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID =
  'kubernetes.io/aws-external-id';
