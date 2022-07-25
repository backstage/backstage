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

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import {
  makeStyles,
  Typography,
  IconButton,
  TypographyProps,
} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';

import { useProvider } from '../Context';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    '&:not(:first-child)': {
      marginTop: theme.spacing(4),
    },
  },
  button: {
    marginLeft: theme.spacing(0.5),
  },
}));

type HeadingProps = TypographyProps & {
  component: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

const Heading = ({ id, className, children, ...rest }: HeadingProps) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { path, entityRef } = useProvider();
  const [show, setShow] = useState(false);

  const handleHover = useCallback(
    (open: boolean) => () => {
      setShow(open);
    },
    [setShow],
  );

  const handleClick = useCallback(() => {
    const baseUrl = `/docs/${entityRef.namespace}/${entityRef.kind}/${entityRef.name}`;
    const pathname = baseUrl.concat(path ? `/${path}` : '');
    navigate(`${pathname}#${id}`);
  }, [id, path, entityRef, navigate]);

  return (
    <Typography
      {...rest}
      id={id}
      className={clsx(classes.root, className)}
      onMouseEnter={handleHover(true)}
      onMouseLeave={handleHover(false)}
    >
      {children}
      {show ? (
        <IconButton
          className={classes.button}
          onClick={handleClick}
          // edge="start"
          size="small"
          aria-label="link"
        >
          <LinkIcon />
        </IconButton>
      ) : null}
    </Typography>
  );
};

const H1 = ({ id, children }: JSX.IntrinsicElements['h1']) => (
  <Heading id={id} variant="h3" component="h1">
    {children}
  </Heading>
);

const H2 = ({ id, children }: JSX.IntrinsicElements['h2']) => (
  <Heading id={id} variant="h4" component="h2">
    {children}
  </Heading>
);

const H3 = ({ id, children }: JSX.IntrinsicElements['h3']) => (
  <Heading id={id} variant="h5" component="h3">
    {children}
  </Heading>
);

const H4 = ({ id, children }: JSX.IntrinsicElements['h4']) => (
  <Heading id={id} variant="h6" component="h4">
    {children}
  </Heading>
);

const H5 = ({ id, children }: JSX.IntrinsicElements['h5']) => (
  <Heading id={id} variant="h6" component="h5">
    {children}
  </Heading>
);

const H6 = ({ id, children }: JSX.IntrinsicElements['h6']) => (
  <Heading id={id} variant="h6" component="h6">
    {children}
  </Heading>
);

export { H1 as h1, H2 as h2, H3 as h3, H4 as h4, H5 as h5, H6 as h6 };
