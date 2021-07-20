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

/**
 * Analytics domain covering routable extensions.
 */
export type RoutableDomain = {
  routeRef: string;
};

/**
 * Analytics domain covering component extensions.
 */
export type ComponentDomain = {
  pluginId: string;
  componentName: string;
};

/**
 * Allow arbitrary scalar values as domain attributes too.
 */
export type AnyDomain = {
  [param in string]: string | boolean | number | undefined;
};

/**
 * Common analytics domain attributes.
 */
export type AnalyticsDomainValues = Partial<
  RoutableDomain & ComponentDomain & AnyDomain
>;
