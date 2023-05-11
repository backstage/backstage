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

import {
  isSonarQubeAvailable as NonDeprecatedIsSonarQubeAvailable,
  SONARQUBE_PROJECT_KEY_ANNOTATION as NON_DEPRECATED_SONARQUBE_PROJECT_KEY_ANNOTATION,
} from '@backstage/plugin-sonarqube-react';

export { SonarQubeCard } from './SonarQubeCard';
export type { DuplicationRating } from './SonarQubeCard';
export type { SonarQubeContentPageProps } from './SonarQubeContentPage';

/**
 * @public
 *
 * @deprecated use the same type from `@backstage/plugin-sonarqube-react` instead
 */
export const isSonarQubeAvailable = NonDeprecatedIsSonarQubeAvailable;

/**
 * @public
 *
 * @deprecated use the same type from `@backstage/plugin-sonarqube-react` instead
 */
export const SONARQUBE_PROJECT_KEY_ANNOTATION =
  NON_DEPRECATED_SONARQUBE_PROJECT_KEY_ANNOTATION;
