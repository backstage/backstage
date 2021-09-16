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
import {
  useApi,
  identityApiRef,
  configApiRef,
} from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { Member, BazaarProject } from '../../types';
import { bazaarApiRef, getEntityRef } from '../../api';

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
  return new Date(m2.joinDate).getTime() - new Date(m1.joinDate).getTime();
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
  const [members, setMembers] = useState<Member[]>([]);
  const [bazaarProject, setBazaarProject] = useState<BazaarProject>({
    entityRef: '',
    name: '',
    announcement: '',
    status: 'proposed',
    updatedAt: '',
  });
  const [isBazaar, setIsBazaar] = useState(false);

  const baseUrl = useApi(configApiRef)
    .getConfig('backend')
    .getString('baseUrl');

  const getInitMemberStatus = async () => {
    const response = await bazaarApi.getMembers(baseUrl, entity);
    const dbMembers = response.data.map((obj: any) => {
      const member: Member = {
        userId: obj.user_id,
        entityRef: obj.entity_ref,
        joinDate: obj.join_date,
      };

      return member;
    });

    dbMembers.sort(sortMembers);

    setMembers(dbMembers);
    setIsMember(
      dbMembers
        .map((member: Member) => member.userId)
        .indexOf(identity.getUserId()) >= 0,
    );
  };

  const getMetadata = async () => {
    const response = await bazaarApi.getMetadata(baseUrl, entity);

    if (response.status !== 404) {
      setIsBazaar(true);
      const data = await response.json().then((resp: any) => resp.data);

      setBazaarProject({
        entityRef: data[0].entityRef,
        name: data[0].name,
        announcement: data[0].announcement,
        status: data[0].status,
        updatedAt: data[0].updatedAt,
      });
    }
  };

  const { loading } = useAsync(async () => {
    await getInitMemberStatus();
    await getMetadata();
  });

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
    setIsMember(!isMember);

    const newMember: Member = {
      userId: identity.getUserId(),
      entityRef: getEntityRef(entity),
      joinDate: new Date().toISOString(),
    };

    if (!isMember) {
      setMembers((prevMembers: Member[]) => {
        const newMembers: Member[] = [...prevMembers, newMember];
        newMembers.sort(sortMembers);
        return newMembers;
      });
      await bazaarApi.addMember(baseUrl, entity);
    } else {
      setMembers(
        members.filter(
          (member: Member) => member.userId !== identity.getUserId(),
        ),
      );
      await bazaarApi.deleteMember(baseUrl, entity);
    }
  };

  const links: IconLinkVerticalProps[] = [
    {
      label: 'Community',
      icon: <ChatIcon />,
    },
    {
      label: isMember ? 'Leave' : 'Join',
      icon: isMember ? <ExitToAppIcon /> : <PersonAddIcon />,
      href: '',
      onClick: async () => {
        handleMembersClick();
      },
    },
  ];

  if (loading) {
    return <Progress />;
  } else if (!isBazaar) {
    return (
      <Card>
        <CardHeader title="Bazaar" style={{ paddingBottom: '1rem' }} />
        <Divider />
        <CardContent>
          <Typography variant="body1">
            This project is not in the Bazaar. Go to the{' '}
            <Link className={classes.link} to="/bazaar">
              Bazaar
            </Link>{' '}
            to add the project or to{' '}
            <Link className={classes.link} to="/bazaar/about">
              read more
            </Link>
            .
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <EditProjectDialog
        open={open}
        entity={entity}
        bazaarProject={bazaarProject}
        setBazaarProject={setBazaarProject}
        handleClose={closeEdit}
        isAddForm={false}
      />

      <DeleteProjectDialog
        entity={entity}
        openDelete={openDelete}
        handleClose={closeDelete}
        setIsBazaar={setIsBazaar}
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
                setOpen(true);
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
            <AboutField label="Announcement">
              {bazaarProject.announcement
                ? bazaarProject.announcement.split('\n').map((str: string) => (
                    <Typography
                      key={Math.floor(Math.random() * 1000)}
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
              <StatusTag status={bazaarProject.status} />
            </AboutField>
          </Grid>

          <Grid item xs={6}>
            {' '}
            <AboutField label="Latest members">
              {members.length ? (
                members.slice(0, 3).map(member => {
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
