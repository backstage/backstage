/*
 * Copyright 2020 Spotify AB
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
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
} from '@material-ui/core';
import { SubHeader } from './SubHeader';
import { SubHeaderLink } from './types';

const useStyles = makeStyles({
  gridItemCard: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 10px)', // for pages without content header
    marginBottom: '10px',
  },
  gridItemCardContent: {
    flex: 1,
  },
});

type Props = {
  title: string;
  headerClass?: string;
  headerAction?: React.ReactNode;
  links: SubHeaderLink[];
  contentClass?: string;
  content: React.ReactNode;
  variant?: string;
};

export const AboutCard = ({
  title,
  headerAction,
  links,
  content,
  variant,
}: Props) => {
  const classes = useStyles();
  return (
    <Card className={variant === 'gridItem' ? classes.gridItemCard : ''}>
      <CardHeader
        title={title}
        action={headerAction}
        subheader={<SubHeader links={links} />}
      />
      <Divider />
      <CardContent
        className={variant === 'gridItem' ? classes.gridItemCardContent : ''}
      >
        {content}
      </CardContent>
    </Card>
  );
};
