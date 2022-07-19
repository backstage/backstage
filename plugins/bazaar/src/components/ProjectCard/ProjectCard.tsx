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

import React, { useState } from 'react';
import { ItemCardHeader } from '@backstage/core-components';
import {
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { StatusTag } from '../StatusTag/StatusTag';
import { BazaarProject } from '../../types';
import { DateTime } from 'luxon';
import { HomePageBazaarInfoCard } from '../HomePageBazaarInfoCard';
import { Entity } from '@backstage/catalog-model';

const useStyles = makeStyles({
  statusTag: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    marginBottom: '0.8rem',
  },
  description: {
    display: '-webkit-box',
    WebkitLineClamp: 7,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textAlign: 'justify',
  },
  memberCount: {
    float: 'right',
  },
  content: {
    height: '13rem',
  },
  header: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

type Props = {
  project: BazaarProject;
  fetchBazaarProjects: () => Promise<BazaarProject[]>;
  catalogEntities: Entity[];
};

export const ProjectCard = ({
  project,
  fetchBazaarProjects,
  catalogEntities,
}: Props) => {
  const classes = useStyles();
  const [openCard, setOpenCard] = useState(false);
  const { id, name, status, updatedAt, description, membersCount } = project;

  const handleClose = () => {
    setOpenCard(false);
    fetchBazaarProjects();
  };

  return (
    <div>
      <Dialog fullWidth onClose={handleClose} open={openCard}>
        <HomePageBazaarInfoCard
          initProject={project}
          handleClose={handleClose}
          initEntity={catalogEntities[0] || null}
        />
      </Dialog>

      <Card key={id}>
        <CardActionArea onClick={() => setOpenCard(true)}>
          <ItemCardHeader
            classes={{ root: classes.header }}
            title={
              <Typography noWrap variant="h6" component="h4">
                {name}
              </Typography>
            }
            subtitle={`updated ${DateTime.fromISO(
              new Date(updatedAt!).toISOString(),
            ).toRelative({
              base: DateTime.now(),
            })}`}
          />
          <CardContent className={classes.content}>
            <StatusTag styles={classes.statusTag} status={status} />
            <Typography variant="body2" className={classes.memberCount}>
              {Number(membersCount) === Number(1)
                ? `${membersCount} member`
                : `${membersCount} members`}
            </Typography>
            <Typography variant="body2" className={classes.description}>
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};
