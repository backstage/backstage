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
import { BackstageTheme } from '@backstage/theme';

type Props = {
  project: BazaarProject;
  fetchBazaarProjects: () => Promise<BazaarProject[]>;
  catalogEntities: Entity[];
  height: 'large' | 'small';
};

type StyleProps = {
  height: 'large' | 'small';
};

const useStyles = makeStyles((theme: BackstageTheme) => ({
  description: (props: StyleProps) => ({
    height: props.height === 'large' ? '10rem' : '4rem',
    WebkitBackgroundClip: 'text',
    backgroundImage: `linear-gradient(180deg, ${theme.palette.textContrast} 0%, ${theme.palette.textContrast} 60%, transparent 100%)`,
    color: 'transparent',
  }),
  statusTag: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    marginBottom: '0.8rem',
  },
  memberCount: {
    float: 'right',
  },
  header: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '5rem',
  },
}));

export const ProjectCard = ({
  project,
  fetchBazaarProjects,
  catalogEntities,
  height,
}: Props) => {
  const classes = useStyles({ height });
  const [openCard, setOpenCard] = useState(false);
  const { id, title, status, updatedAt, description, membersCount } = project;

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
                {title}
              </Typography>
            }
            subtitle={`updated ${DateTime.fromISO(
              new Date(updatedAt!).toISOString(),
            ).toRelative({
              base: DateTime.now(),
            })}`}
          />
          <CardContent>
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
