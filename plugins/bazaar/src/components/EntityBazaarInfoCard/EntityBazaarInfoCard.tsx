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

import React, { useState, useEffect } from 'react';
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
import {
  Progress,
  HeaderIconLinkRow,
  IconLinkVerticalProps,
  Avatar,
} from '@backstage/core-components';
import { Link } from 'react-router-dom';
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
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { Member, BazaarProject } from '../../types';
import { bazaarApiRef } from '../../api';
import { Alert } from '@material-ui/lab';
import { useAsyncFn } from 'react-use';

const useStyles = makeStyles({
  description: {
    wordBreak: 'break-word',
  },
  icon: {
    marginRight: '1.75rem',
  },
  link: {
    color: '#9cc9ff',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  memberLink: {
    display: 'block',
    marginBottom: '0.3rem',
  },
});

const sortMembers = (m1: Member, m2: Member) => {
  return new Date(m2.joinDate!).getTime() - new Date(m1.joinDate!).getTime();
};

export const EntityBazaarInfoCard = () => {
  const { entity } = useEntity();
  const classes = useStyles();
  const bazaarApi = useApi(bazaarApiRef);
  const identity = useApi(identityApiRef);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isBazaar, setIsBazaar] = useState(false);
  const [members, fetchMembers] = useAsyncFn(async () => {
    const response = await bazaarApi.getMembers(entity);

    const dbMembers = response.data.map((obj: any) => {
      const member: Member = {
        userId: obj.user_id,
        entityRef: obj.entity_ref,
        joinDate: obj.join_date,
      };

      return member;
    });

    dbMembers.sort(sortMembers);

    return dbMembers;
  });

  const [bazaarProject, fetchBazaarProject] = useAsyncFn(async () => {
    const response = await bazaarApi.getMetadata(entity);

    if (response) {
      const metadata = await response.json().then((resp: any) => resp.data[0]);

      if (metadata) {
        return {
          entityRef: metadata.entity_ref,
          name: metadata.name,
          community: metadata.community,
          announcement: metadata.announcement,
          status: metadata.status,
          updatedAt: metadata.updated_at,
          membersCount: metadata.members_count,
        } as BazaarProject;
      }
    }
    return null;
  });

  useEffect(() => {
    fetchMembers();
    fetchBazaarProject();
  }, [fetchMembers, fetchBazaarProject]);

  useEffect(() => {
    const isBazaarMember =
      members?.value
        ?.map((member: Member) => member.userId)
        .indexOf(identity.getUserId()) >= 0;
    const isBazaarProject = bazaarProject.value !== null;

    setIsMember(isBazaarMember);
    setIsBazaar(isBazaarProject);
  }, [bazaarProject, members, identity]);

  const onOpen = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const closeEdit = () => {
    setOpen(false);
  };

  const closeDelete = () => {
    setOpenDelete(false);
  };

  const popoverCloseHandler = () => {
    setPopoverOpen(false);
  };

  const handleMembersClick = async () => {
    if (!isMember) {
      await bazaarApi.addMember(entity);
    } else {
      await bazaarApi.deleteMember(entity);
    }

    fetchMembers();
    fetchBazaarProject();
  };

  const links: IconLinkVerticalProps[] = [
    {
      label: isMember ? 'Leave' : 'Join',
      icon: isMember ? <ExitToAppIcon /> : <PersonAddIcon />,
      href: '',
      onClick: async () => {
        handleMembersClick();
      },
    },
    {
      label: 'Community',
      icon: <ChatIcon />,
      href: bazaarProject?.value?.community,
      disabled: bazaarProject?.value?.community === '',
    },
  ];

  if (!isBazaar) {
    return null;
  } else if (bazaarProject.loading || members.loading) {
    return <Progress />;
  } else if (bazaarProject.error) {
    return <Alert severity="error">{bazaarProject?.error?.message}</Alert>;
  } else if (members.error) {
    return <Alert severity="error">{members?.error?.message}</Alert>;
  }
  return (
    <Card>
      {bazaarProject?.value && (
        <EditProjectDialog
          open={open}
          entity={entity}
          bazaarProject={bazaarProject.value}
          fetchBazaarProject={fetchBazaarProject}
          handleClose={closeEdit}
          isAddForm={false}
        />
      )}

      {bazaarProject?.value && (
        <DeleteProjectDialog
          bazaarProject={bazaarProject.value}
          openDelete={openDelete}
          handleClose={closeDelete}
          setIsBazaar={setIsBazaar}
        />
      )}
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
                setOpen(true);
                setPopoverOpen(false);
              }}
            >
              <EditIcon className={classes.icon} />
              <ListItemText primary="Edit project" />
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
            <AboutField label="Announcement">
              {bazaarProject?.value?.announcement
                ? bazaarProject?.value?.announcement
                    .split('\n')
                    .map((str: string, i: number) => (
                      <Typography
                        key={i}
                        variant="body2"
                        paragraph
                        className={classes.description}
                      >
                        {str}
                      </Typography>
                    ))
                : 'No announcement'}
            </AboutField>
          </Grid>

          <Grid item xs={6}>
            <AboutField label="Status">
              <StatusTag status={bazaarProject?.value?.status || 'proposed'} />
            </AboutField>
          </Grid>

          <Grid item xs={6}>
            {' '}
            <AboutField label="Latest members">
              {members?.value?.length ? (
                members.value.slice(0, 3).map((member: Member) => {
                  return (
                    <div key={member.userId}>
                      <Avatar
                        displayName={member.userId}
                        customStyles={{
                          width: '19px',
                          height: '19px',
                          fontSize: '8px',
                          float: 'left',
                          marginRight: '0.3rem',
                        }}
                      />
                      <Link
                        className={classes.memberLink}
                        to={`http://github.com/${member.userId}`}
                      >
                        {member?.userId}
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div />
              )}
            </AboutField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
