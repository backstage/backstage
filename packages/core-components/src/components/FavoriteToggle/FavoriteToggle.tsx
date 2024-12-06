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
import { ComponentProps } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { StarIcon, UnstarredIcon } from '../../icons';

const useStyles = makeStyles<Theme>(
  () => ({
    icon: {
      color: '#f3ba37',
      cursor: 'pointer',
      display: 'inline-flex',
    },
    iconBorder: {
      color: 'inherit',
      cursor: 'pointer',
      display: 'inline-flex',
    },
  }),
  { name: 'BackstageFavoriteToggleIcon' },
);

/**
 * @public
 */
export type FavoriteToggleIconClassKey = 'icon' | 'iconBorder';

/**
 * Icon used in FavoriteToggle component.
 *
 * Can be used independently, useful when used as {@link @material-table/core#MaterialTableProps.actions} in {@link @material-table/core#MaterialTable}
 *
 * @public
 */
export function FavoriteToggleIcon(props: { isFavorite: boolean }) {
  const { isFavorite } = props;
  const classes = useStyles();

  return (
    <Typography
      component="span"
      className={isFavorite ? classes.icon : classes.iconBorder}
    >
      {isFavorite ? <StarIcon /> : <UnstarredIcon />}
    </Typography>
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
export function FavoriteToggle(
  props: ComponentProps<typeof IconButton> & {
    id: string;
    title: string;
    isFavorite: boolean;
    onToggle: (value: boolean) => void;
  },
) {
  const {
    id,
    title,
    isFavorite: value,
    onToggle: onChange,
    ...iconButtonProps
  } = props;
  return (
    <Tooltip id={id} title={title}>
      <IconButton
        aria-label={title}
        id={id}
        onClick={() => onChange(!value)}
        color="inherit"
        {...iconButtonProps}
      >
        <FavoriteToggleIcon isFavorite={value} />
      </IconButton>
    </Tooltip>
  );
}
