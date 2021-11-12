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

// This is a bit of a hack that we use to avoid having to redeclare these types
// within this package or have an explicit dependency on core-app-api.
// These types end up being inlined and duplicated into this package at build time.
// eslint-disable-next-line no-restricted-imports
export type {
  BootErrorPageProps,
  SignInResult,
  SignInPageProps,
  ErrorBoundaryFallbackProps,
  AppComponents,
  AppContext,
} from '../../../core-app-api/src/app/types';
