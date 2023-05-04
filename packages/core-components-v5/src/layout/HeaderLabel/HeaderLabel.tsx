/*
 * Copyright 2020 The Backstage Authors
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

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import React from 'react';
import { Link } from '../../components/Link';

/** @public */
export type HeaderLabelClassKey = 'root' | 'label' | 'value';

const useStyles = makeStyles({ name: 'BackstageHeaderLabel' })(theme => ({
  root: {
    textAlign: 'left',
  },
  label: {
    color: theme.page.fontColor,
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: 0,
    fontSize: theme.typography.fontSize,
    // TODO: Use Theme Variable
    marginBottom: '4px',
    lineHeight: 1,
  },
  value: {
    color: alpha(theme.page.fontColor, 0.8),
    fontSize: theme.typography.fontSize,
    lineHeight: 1,
  },
}));

type HeaderLabelContentProps = {
  value: React.ReactNode;
  className: string;
};

const HeaderLabelContent = ({ value, className }: HeaderLabelContentProps) => {
  return (
    <Typography
      component={typeof value === 'string' ? 'p' : 'span'}
      className={className}
    >
      {value}
    </Typography>
  );
};

type HeaderLabelProps = {
  label: string;
  value?: HeaderLabelContentProps['value'];
  url?: string;
};

/**
 * Additional label to main {@link Header}
 *
 * @public
 *
 */
export function HeaderLabel(props: HeaderLabelProps) {
  const { label, value, url } = props;
  const { classes } = useStyles();
  const content = (
    <HeaderLabelContent
      className={classes.value}
      value={value || '<Unknown>'}
    />
  );
  return (
    <Grid item>
      <Typography component="span" className={classes.root}>
        <Typography className={classes.label}>{label}</Typography>
        {url ? <Link to={url}>{content}</Link> : content}
      </Typography>
    </Grid>
  );
}
