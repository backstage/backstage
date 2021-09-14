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

import React from 'react';
import { ItemCardHeader } from '@backstage/core-components';
import {
  Card,
  CardActionArea,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { StatusTag } from '../StatusTag/StatusTag';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import { catalogRouteRef } from '@backstage/plugin-catalog-react';
import { useRouteRef } from '@backstage/core-plugin-api';
import { BazaarProject } from '../../util/types';

const useStyles = makeStyles({
  statusTag: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    marginBottom: '0.5rem',
  },
  announcement: {
    display: '-webkit-box',
    WebkitLineClamp: 5,
    WebkitBoxOrient: 'vertical',
    marginBottom: '0.8rem',
    overflow: 'hidden',
  },
  memberCount: {
    float: 'right',
  },
});

type Props = {
  bazaarProject: BazaarProject;
  memberCount: number;
};

export const ProjectCard = ({ bazaarProject, memberCount }: Props) => {
  const classes = useStyles();
  const { entityRef, name, status, updatedAt, announcement } = bazaarProject;
  const catalogLink = useRouteRef(catalogRouteRef);

  return (
    <Card key={entityRef}>
      <CardActionArea
        style={{
          height: '100%',
          overflow: 'hidden',
          width: '100%',
        }}
        component={RouterLink}
        to={`${catalogLink()}/${entityRef}`}
      >
        <ItemCardHeader
          title={name}
          subtitle={`updated ${moment(updatedAt).fromNow()}`}
        />
        <CardContent style={{ height: '12rem' }}>
          <StatusTag styles={classes.statusTag} status={status} />
          <Typography variant="body2" className={classes.memberCount}>
            {memberCount === 1
              ? `${memberCount} member`
              : `${memberCount} members`}
          </Typography>
          <div style={{ minHeight: '6.5rem', maxHeight: '6.5rem' }}>
            <Typography variant="body2" className={classes.announcement}>
              {announcement}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
