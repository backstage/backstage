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
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useState } from 'react';
import { Link } from '../../components/Link';
import { CodeSnippet } from '../../components';
import { makeStyles } from '@material-ui/core/styles';

interface IStackDetailsProps {
  stack: string;
}

const useStyles = makeStyles(
  theme => ({
    title: {
      paddingBottom: theme.spacing(5),
      [theme.breakpoints.down('xs')]: {
        paddingBottom: theme.spacing(4),
        fontSize: theme.typography.h3.fontSize,
      },
    },
  }),
  { name: 'BackstageErrorPageStackDetails' },
);

/**
 * Error page details with stack trace
 *
 * @public
 *
 */
export function StackDetails(props: IStackDetailsProps) {
  const { stack } = props;
  const classes = useStyles();

  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  if (!detailsOpen) {
    return (
      <Typography variant="h6" className={classes.title}>
        <Link to="#" onClick={() => setDetailsOpen(true)}>
          Show more details
        </Link>
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        <Link to="#" onClick={() => setDetailsOpen(false)}>
          Show less details
        </Link>
      </Typography>
      <CodeSnippet
        text={stack}
        language="text"
        showCopyCodeButton
        showLineNumbers
      />
    </>
  );
}
