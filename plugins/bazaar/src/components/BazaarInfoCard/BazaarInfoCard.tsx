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

import React, { useState } from 'react';
import {
  Grid,
  makeStyles,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  IconButton,
  Popover,
  MenuList,
  MenuItem,
  ListItemText,
} from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { AboutField } from '@backstage/plugin-catalog';
import { StatusTag } from '../StatusTag';
import EditIcon from '@material-ui/icons/Edit';
import ChatIcon from '@material-ui/icons/Chat';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import { EditProjectDialog } from '../EditProjectDialog';
import { DeleteProjectDialog } from '../DeleteProjectDialog';
import { HeaderIconLinkRow, IconLinkVerticalProps } from '@backstage/core';
import { JsonObject } from '@backstage/config';

const useStyles = makeStyles({
  title: {
    fontSize: '24px',
    marginTop: '0rem',
  },
  container: {
    padding: '0.5rem',
    fontSize: '10px',
  },
  subtitle: {
    color: '(255, 255, 255, 0.7)',
    overflow: 'hidden',
    fontSize: '10px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    margin: '0.3rem 0',
    backgroundColor: '',
  },
  text: {
    fontSize: '0.875rem',
  },
  description: {
    wordBreak: 'break-word',
  },
  edit: {
    float: 'right',
  },
  icon: {
    marginRight: '1.75rem',
  },
});

export const isBazaarAvailable = (entity: Entity) => {
  return Boolean(entity.metadata.bazaar);
};

export const BazaarInfoCard = () => {
  const { entity } = useEntity();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const [openEdit, setOpenEdit] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const onOpen = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const closeEdit = () => {
    setOpenEdit(false);
  };

  const closeDelete = () => {
    setOpenDelete(false);
  };

  const popoverCloseHandler = () => {
    setPopoverOpen(false);
  };

  const links: IconLinkVerticalProps[] = [
    {
      label: 'Community',
      icon: <ChatIcon />,
    },
    {
      label: 'Join',
      icon: <PersonAddIcon />,
      href: '',
    },
  ];

  return (
    <Card>
      <EditProjectDialog
        openEdit={openEdit}
        entity={entity}
        handleClose={closeEdit}
      />
      <DeleteProjectDialog
        entity={entity}
        openDelete={openDelete}
        handleClose={closeDelete}
      />
      <CardHeader
        title="Bazaar"
        action={
          <IconButton onClick={onOpen}>
            <MoreVertIcon />
          </IconButton>
        }
        subheader={<HeaderIconLinkRow links={links} />}
      />
      <Divider />
      <CardContent>
        <Popover
          open={popoverOpen}
          onClose={popoverCloseHandler}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuList>
            <MenuItem
              onClick={() => {
                setOpenEdit(true);
                setPopoverOpen(false);
              }}
            >
              <EditIcon className={classes.icon} />
              <ListItemText primary="Suggest changes" />
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setOpenDelete(true);
                setPopoverOpen(false);
              }}
            >
              <DeleteIcon className={classes.icon} />
              <ListItemText primary="Remove from Bazaar" />
            </MenuItem>
          </MenuList>
        </Popover>
        <Grid container>
          <Grid item xs={12}>
            <AboutField label="Bazaar description">
              {(entity?.metadata?.bazaar as JsonObject).bazaar_description
                ? (
                    (entity?.metadata?.bazaar as JsonObject)
                      .bazaar_description as string
                  )
                    .split('\n')
                    .map((str: string) => (
                      <Typography
                        key={Math.floor(Math.random() * 1000)}
                        variant="body2"
                        paragraph
                        className={classes.description}
                      >
                        {str}
                      </Typography>
                    ))
                : 'No description'}
            </AboutField>
          </Grid>

          <Grid item xs={6}>
            <AboutField label="Status">
              <StatusTag
                status={
                  (entity?.metadata?.bazaar as JsonObject).status as string
                }
              />
            </AboutField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
