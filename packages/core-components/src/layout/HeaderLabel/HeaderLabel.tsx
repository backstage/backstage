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

import Grid from '@material-ui/core/Grid';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { PropsWithChildren } from 'react';
import { Link } from '../../components/Link';

/** @public */
export type HeaderLabelClassKey = 'root' | 'label' | 'value';

const useStyles = makeStyles(
  theme => ({
    root: {
      textAlign: 'left',
    },
    label: {
      color: theme.page.fontColor,
      fontWeight: theme.typography.fontWeightBold,
      letterSpacing: 0,
      fontSize: theme.typography.fontSize,
      marginBottom: theme.spacing(1) / 2,
      lineHeight: 1,
    },
    value: {
      color: alpha(theme.page.fontColor, 0.8),
      fontSize: theme.typography.fontSize,
      lineHeight: 1,
    },
  }),
  { name: 'BackstageHeaderLabel' },
);

type HeaderLabelContentProps = PropsWithChildren<{
  value: React.ReactNode;
  className: string;
  typographyRootComponent?: keyof JSX.IntrinsicElements;
}>;

const HeaderLabelContent = ({
  value,
  className,
  typographyRootComponent,
}: HeaderLabelContentProps) => {
  return (
    <Typography
      component={
        typographyRootComponent ?? (typeof value === 'string' ? 'p' : 'span')
      }
      className={className}
    >
      {value}
    </Typography>
  );
};

type HeaderLabelProps = {
  label: string;
  value?: HeaderLabelContentProps['value'];
  contentTypograpyRootComponent?: HeaderLabelContentProps['typographyRootComponent'];
  url?: string;
};

/**
 * Additional label to main {@link Header}
 *
 * @public
 *
 */
export function HeaderLabel(props: HeaderLabelProps) {
  const { label, value, url, contentTypograpyRootComponent } = props;
  const classes = useStyles();
  const content = (
    <HeaderLabelContent
      className={classes.value}
      value={value || '<Unknown>'}
      typographyRootComponent={contentTypograpyRootComponent}
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
