/*
 * Copyright 2020 Spotify AB
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

import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import { ApiEntityPage } from './kinds/ApiEntityPage';
import { ComponentEntityPage } from './kinds/ComponentEntityPage';
import { DefaultEntityPage } from './kinds/DefaultEntityPage';
import { DomainEntityPage } from './kinds/DomainEntityPage';
import { GroupEntityPage } from './kinds/GroupEntityPage';
import { SystemEntityPage } from './kinds/SystemEntityPage';
import { UserEntityPage } from './kinds/UserEntityPage';

export const EntityPage = () => {
  const { entity } = useEntity();
  switch (entity?.kind?.toLowerCase()) {
    case 'component':
      return <ComponentEntityPage entity={entity} />;
    case 'api':
      return <ApiEntityPage entity={entity} />;
    case 'group':
      return <GroupEntityPage entity={entity} />;
    case 'user':
      return <UserEntityPage entity={entity} />;
    case 'system':
      return <SystemEntityPage entity={entity} />;
    case 'domain':
      return <DomainEntityPage entity={entity} />;
    default:
      return <DefaultEntityPage entity={entity} />;
  }
};
