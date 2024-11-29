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
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { LinkProps } from '@material-ui/core/Link';
import LanguageIcon from '@material-ui/icons/Language';

import { IconComponent } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';

const useStyles = makeStyles({
  svgIcon: {
    display: 'inline-block',
    '& svg': {
      display: 'inline-block',
      fontSize: 'inherit',
      verticalAlign: 'baseline',
    },
  },
});

export const IconLink = (
  props: {
    href: string;
    text?: string;
    Icon?: IconComponent;
  } & LinkProps,
) => {
  const { href, text, Icon, ...linkProps } = props;

  const classes = useStyles();

  return (
    <Grid container direction="row" spacing={1}>
      <Grid item>
        <Typography component="div" className={classes.svgIcon}>
          {Icon ? <Icon /> : <LanguageIcon />}
        </Typography>
      </Grid>
      <Grid item>
        <Link to={href} {...linkProps}>
          {text || href}
        </Link>
      </Grid>
    </Grid>
  );
};
