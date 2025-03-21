/*
 * Copyright 2020 The Backstage Authors
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
 * The namespace that entities without an explicit namespace fall into.
 *
 * @public
 */
export const DEFAULT_NAMESPACE = 'default';

/**
 * Annotation for linking to entity page from catalog pages.
 *
 * @public
 */
export const ANNOTATION_VIEW_URL = 'backstage.io/view-url';

/**
 * Annotation for linking to entity edit page from catalog pages.
 *
 * @public
 */
export const ANNOTATION_EDIT_URL = 'backstage.io/edit-url';

/**
 * Annotation for specifying the API server of a Kubernetes cluster
 *
 * @deprecated Import this constant from `@backstage/plugin-kubernetes-common` instead
 * @public
 */
export const ANNOTATION_KUBERNETES_API_SERVER = 'kubernetes.io/api-server';

/**
 * Annotation for specifying the Certificate Authority of an API server for a Kubernetes cluster
 *
 * @deprecated Import this constant from `@backstage/plugin-kubernetes-common` instead
 * @public
 */
export const ANNOTATION_KUBERNETES_API_SERVER_CA =
  'kubernetes.io/api-server-certificate-authority';

/**
 * Annotation for specifying the auth provider for a Kubernetes cluster
 *
 * @deprecated Import this constant from `@backstage/plugin-kubernetes-common` instead
 * @public
 */
export const ANNOTATION_KUBERNETES_AUTH_PROVIDER =
  'kubernetes.io/auth-provider';
