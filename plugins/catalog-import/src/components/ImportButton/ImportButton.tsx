/*
 * Copyright 2022 The Backstage Authors
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

import { ResponsiveIconButton } from '@backstage/core-components';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common';
import { usePermission } from '@backstage/plugin-permission-react';
import GetAppIcon from '@material-ui/icons/GetApp';
import React from 'react';
import { LinkProps } from 'react-router-dom';

/**
 * Properties for {@link ImportButton}
 *
 * @public
 */
export type ImportButtonProps = {
  title: string;
} & Partial<Pick<LinkProps, 'to'>>;

/**
 * "Import component(s)" button for the catalog. Responsive to display only an icon for small
 * screens.
 *
 * @public
 */
export function ImportButton(props: ImportButtonProps) {
  const { allowed } = usePermission(catalogEntityCreatePermission);

  if (!allowed) {
    return null;
  }

  return (
    <ResponsiveIconButton icon={<GetAppIcon />} variant="outlined" {...props} />
  );
}
