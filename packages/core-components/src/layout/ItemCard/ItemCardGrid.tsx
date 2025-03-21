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
import Box from '@material-ui/core/Box';
import {
  createStyles,
  makeStyles,
  Theme,
  WithStyles,
} from '@material-ui/core/styles';
import React from 'react';

/** @public */
export type ItemCardGridClassKey = 'root';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(22em, 1fr))',
      gridAutoRows: '1fr',
      gridGap: theme.spacing(2),
    },
  });

const useStyles = makeStyles(styles, { name: 'BackstageItemCardGrid' });

/** @public */
export type ItemCardGridProps = Partial<WithStyles<typeof styles>> & {
  /**
   * The Card items of the grid.
   */
  children?: React.ReactNode;
};

/**
 * A default grid to use when arranging "item cards" - cards that let users
 * select among several options.
 *
 * @remarks
 * The immediate children are expected to be Material UI Card components.
 *
 * Styles for the grid can be overridden using the `classes` prop, e.g.:
 *
 * `<ItemCardGrid title="Hello" classes={{ root: myClassName }} />`
 *
 * This can be useful for e.g. overriding gridTemplateColumns to adapt the
 * minimum size of the cells to fit the content better.
 *
 * @public
 */
export function ItemCardGrid(props: ItemCardGridProps) {
  const { children, ...otherProps } = props;
  const classes = useStyles(otherProps);
  return (
    <Box className={classes.root} {...otherProps}>
      {children}
    </Box>
  );
}
