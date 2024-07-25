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
import CardActions from '@material-ui/core/CardActions';
import { alpha, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(
  theme => ({
    root: {
      justifyContent: 'flex-end',
    },
    cta: {
      ...theme.typography.button,
      alignItems: 'center',
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.primary.main,
      display: 'inline-flex',
      fontSize: theme.typography.pxToRem(12),
      justifyContent: 'center',
      minWidth: theme.spacing(8),
      padding: theme.spacing(0.5, 2),
      textWrap: 'nowrap',
      outline: 'none',
      '&:hover, &:focus': {
        boxShadow: 'none',
        textDecoration: 'none',
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.hoverOpacity,
        ),
      },
      '&:focus': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.focusOpacity,
        ),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    primaryCta: {
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    },
    secondaryCta: {
      position: 'relative',
      zIndex: theme.zIndex.speedDial,
    },
  }),
  { name: 'PostCardActions' },
);

export type PostCardActionsProps = {
  cta: {
    label: string;
    action: string;
  };
  secondaryCta?: {
    label: string;
    action: string;
  };
};

export function PostCardActions({ cta, secondaryCta }: PostCardActionsProps) {
  const classes = useStyles();
  return (
    <CardActions className={classes.root}>
      {secondaryCta && (
        <Link
          className={`${classes.cta} ${classes.secondaryCta}`}
          to={secondaryCta.action}
        >
          {secondaryCta.label}
        </Link>
      )}
      <Link className={`${classes.cta} ${classes.primaryCta}`} to={cta.action}>
        {cta.label}
      </Link>
    </CardActions>
  );
}
