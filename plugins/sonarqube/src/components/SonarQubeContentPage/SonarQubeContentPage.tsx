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
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import {
  isSonarQubeAvailable,
  SONARQUBE_PROJECT_KEY_ANNOTATION,
} from '../useProjectKey';
import { SonarQubeCard } from '../SonarQubeCard';

/** @public */
export type SonarQubeContentPageProps = {
  title?: string;
  supportTitle?: string;
} & React.ComponentPropsWithoutRef<'div'>;

/** @public */
export const SonarQubeContentPage = ({
  title = 'SonarQube Dashboard',
  supportTitle,
  ...otherProps
}: SonarQubeContentPageProps) => {
  const { entity } = useEntity();

  return isSonarQubeAvailable(entity) ? (
    <Content {...otherProps}>
      <ContentHeader title={title}>
        {supportTitle && <SupportButton>{supportTitle}</SupportButton>}
      </ContentHeader>
      <SonarQubeCard />
    </Content>
  ) : (
    <MissingAnnotationEmptyState
      annotation={SONARQUBE_PROJECT_KEY_ANNOTATION}
    />
  );
};
