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

import React from 'react';
import { useOutlet } from 'react-router-dom';
import { TableColumn, TableProps } from '@backstage/core-components';
import {
  EntityListPagination,
  EntityOwnerPickerProps,
  UserListFilterKind,
} from '@backstage/plugin-catalog-react';
import { DefaultTechDocsHome } from './DefaultTechDocsHome';
import { DocsTableRow } from './Tables';

/**
 * Props for {@link TechDocsIndexPage}
 *
 * @public
 */
export type TechDocsIndexPageProps = {
  initialFilter?: UserListFilterKind;
  columns?: TableColumn<DocsTableRow>[];
  actions?: TableProps<DocsTableRow>['actions'];
  ownerPickerMode?: EntityOwnerPickerProps['mode'];
  pagination?: EntityListPagination;
};

export const TechDocsIndexPage = (props: TechDocsIndexPageProps) => {
  const outlet = useOutlet();

  return outlet || <DefaultTechDocsHome {...props} />;
};
