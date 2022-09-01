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

import React, { ReactNode } from 'react';
import {
  ListItemIcon,
  ListItemText,
  ListItemTextProps,
} from '@material-ui/core';

/**
 * Props for {@link SearchAutocompleteDefaultOption}.
 *
 * @public
 */
export type SearchAutocompleteDefaultOptionProps = {
  icon?: ReactNode;
  primaryText: ListItemTextProps['primary'];
  primaryTextTypographyProps?: ListItemTextProps['primaryTypographyProps'];
  secondaryText?: ListItemTextProps['secondary'];
  secondaryTextTypographyProps?: ListItemTextProps['secondaryTypographyProps'];
  disableTextTypography?: ListItemTextProps['disableTypography'];
};

/**
 * A default search autocomplete option component.
 *
 * @public
 */
export const SearchAutocompleteDefaultOption = ({
  icon,
  primaryText,
  primaryTextTypographyProps,
  secondaryText,
  secondaryTextTypographyProps,
  disableTextTypography,
}: SearchAutocompleteDefaultOptionProps) => (
  <>
    {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
    <ListItemText
      primary={primaryText}
      primaryTypographyProps={primaryTextTypographyProps}
      secondary={secondaryText}
      secondaryTypographyProps={secondaryTextTypographyProps}
      disableTypography={disableTextTypography}
    />
  </>
);
