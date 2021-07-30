/*
 * Copyright 2021 Spotify AB
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

import { ItemCardHeader } from '@backstage/core';
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import { StatusTag } from '../StatusTag/StatusTag';
import { Link as RouterLink } from 'react-router-dom';
import { Entity } from '@backstage/catalog-model';
import moment from 'moment';
import { JsonObject } from '@backstage/config';

const useStyles = makeStyles({
  statusTag: {
    display: 'inline-block',
    float: 'left',
    width: '25%',
    whiteSpace: 'nowrap',
  },
});

type Props = {
  entity: Entity;
};

export const ProjectCard = ({ entity }: Props) => {
  const classes = useStyles();
  const { uid, name, description, tags } = entity.metadata;
  const { status, last_modified } = entity.metadata.bazaar as JsonObject;

  return (
    <Card data-testid={`card-${uid}`} key={uid}>
      <CardActionArea
        component={RouterLink}
        to={`/catalog/default/component/${name}`}
      >
        <ItemCardHeader
          title={name}
          subtitle={`updated ${moment(last_modified as string).fromNow()}`}
        />
        <CardContent>
          <StatusTag styles={classes.statusTag} status={status as string} />
        </CardContent>
        <CardContent>{description?.slice(0, 180)}</CardContent>
        <CardContent>
          {tags
            ?.filter(tag => tag !== 'bazaar')
            .map((tag: string) => (
              <Chip
                data-testid={`chip-${tag}`}
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
