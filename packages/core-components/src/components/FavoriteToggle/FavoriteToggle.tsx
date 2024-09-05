/*
 * Copyright 2024 The Backstage Authors
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
import React, { ComponentProps } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Theme, makeStyles } from '@material-ui/core/styles';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';

const useStyles = makeStyles<Theme>(
  theme => ({
    icon: {
      color: '#f3ba37',
      cursor: 'pointer',
    },
    iconBorder: {
      color: theme.palette.text.primary,
      cursor: 'pointer',
    },
  }),
  { name: 'BackstageFavoriteToggleIcon' },
);

// @public (undocumented)
export type FavoriteToggleIconClassKey = 'icon' | 'iconBorder';

// @public (undocumented)
export type FavoriteToggleProps = ComponentProps<typeof IconButton> & {
  id: string;
  title: string;
  isFavorite: boolean;
  onToggle: (value: boolean) => void;
};

/**
 * Icon used in FavoriteToggle component.
 *
 * Can be used independently, useful when used as {@link @material-table/core#MaterialTableProps.actions} in {@link @material-table/core#MaterialTable}
 *
 * @public
 */
export function FavoriteToggleIcon({ isFavorite }: { isFavorite: boolean }) {
  const classes = useStyles();

  return isFavorite ? (
    <Star className={classes.icon} />
  ) : (
    <StarBorder className={classes.iconBorder} />
  );
}

/**
 * Toggle encapsulating logic for marking something as favorite,
 * primarily used in various instances of entity lists and cards but can be used elsewhere.
 *
 * This component can only be used in as a controlled toggle and does not keep internal state.
 *
 * @public
 */
export function FavoriteToggle({
  id,
  title,
  isFavorite: value,
  onToggle: onChange,
  ...iconButtonProps
}: FavoriteToggleProps) {
  return (
    <Tooltip id={id} title={title}>
      <IconButton
        aria-label={title}
        id={id}
        onClick={() => onChange(!value)}
        {...iconButtonProps}
      >
        <FavoriteToggleIcon isFavorite={value} />
      </IconButton>
    </Tooltip>
  );
}
