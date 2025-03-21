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
import Typography from '@material-ui/core/Typography';
import React from 'react';

/** @public */
export type ItemCardHeaderClassKey = 'root';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.common.white,
      padding: theme.spacing(2, 2, 3),
      backgroundImage: theme.getPageTheme({ themeId: 'card' }).backgroundImage,
      backgroundPosition: 0,
      backgroundSize: 'inherit',
    },
  });

const useStyles = makeStyles(styles, { name: 'BackstageItemCardHeader' });

/** @public */
export type ItemCardHeaderProps = Partial<WithStyles<typeof styles>> & {
  /**
   * A large title to show in the header, providing the main heading.
   *
   * Use this if you want to have the default styling and placement of a title.
   */
  title?: React.ReactNode;
  /**
   * A slightly smaller title to show in the header, providing additional
   * details.
   *
   * Use this if you want to have the default styling and placement of a
   * subtitle.
   */
  subtitle?: React.ReactNode;
  /**
   * Custom children to draw in the header.
   *
   * If the title and/or subtitle were specified, the children are drawn below
   * those.
   */
  children?: React.ReactNode;
};

/**
 * A simple card header, rendering a default look for "item cards" - cards that
 * are arranged in a grid for users to select among several options.
 *
 * @remarks
 * This component expects to be placed within a Material UI `<CardMedia>`.
 *
 * Styles for the header can be overridden using the `classes` prop, e.g.:
 *
 * `<ItemCardHeader title="Hello" classes={{ root: myClassName }} />`
 *
 * @public
 */
export function ItemCardHeader(props: ItemCardHeaderProps) {
  const { title, subtitle, children } = props;
  const classes = useStyles(props);
  return (
    <Box className={classes.root}>
      {subtitle && (
        <Typography variant="subtitle2" component="h3">
          {subtitle}
        </Typography>
      )}
      {title && (
        <Typography variant="h6" component="h4">
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}
