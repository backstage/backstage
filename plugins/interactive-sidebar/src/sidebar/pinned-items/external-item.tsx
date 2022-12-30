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

import React from 'react';

import { makeStyles } from '@material-ui/core';

import {
  InteractiveLink,
  InteractiveLinkProps,
} from '@backstage/plugin-interactive-drawers';

import {
  DeleteBookmark,
  EditMode,
  makeSidebarItemProps,
} from './sidebar-item-props';
import { FavIcon } from './favicon';

const useStyles = makeStyles(() => ({
  icon: {
    marginTop: 4,
    marginLeft: 2,
    transformOrigin: 'bottom left',
    transform: 'scale(0.8)',
  },
}));

export interface ExternalPinnedItemProps extends InteractiveLinkProps {
  deleteBookmark: DeleteBookmark;
  editMode: EditMode;
}

export function ExternalPinnedItem({
  deleteBookmark,
  editMode,
  title,
  to,
}: ExternalPinnedItemProps) {
  const { icon } = useStyles();

  const props = makeSidebarItemProps(editMode, deleteBookmark);

  return (
    <InteractiveLink
      {...props}
      title={title}
      to={to}
      icon={<FavIcon url={to} className={icon} />}
    />
  );
}
