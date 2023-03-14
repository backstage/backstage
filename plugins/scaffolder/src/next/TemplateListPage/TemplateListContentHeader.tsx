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
import React from 'react';
import { ContentHeader, SupportButton } from '@backstage/core-components';
import { RegisterExistingButton } from './RegisterExistingButton';
import { useRouteRef } from '@backstage/core-plugin-api';
import { registerComponentRouteRef } from '../../routes';

export function TemplateListContentHeader() {
  const registerComponentLink = useRouteRef(registerComponentRouteRef);
  return (
    <ContentHeader title="Available Templates">
      <RegisterExistingButton
        title="Register Existing Component"
        to={registerComponentLink && registerComponentLink()}
      />
      <SupportButton>
        Create new software components using standard templates. Different
        templates create different kinds of components (services, websites,
        documentation, ...).
      </SupportButton>
    </ContentHeader>
  );
}
