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
import { CardHeader, Divider, IconButton, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {
  HeaderIconLinkRow,
  IconLinkVerticalProps,
} from '@backstage/core-components';
import EditIcon from '@material-ui/icons/Edit';
import ChatIcon from '@material-ui/icons/Chat';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { EditProjectDialog } from '../EditProjectDialog';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { BazaarProject, Member } from '../../types';
import { bazaarApiRef } from '../../api';
import { Alert } from '@material-ui/lab';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { parseEntityRef } from '@backstage/catalog-model';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { CardContentFields } from '../CardContentFields';
import { fetchProjectMembers } from '../../util/fetchMethods';

const useStyles = makeStyles({
  wordBreak: {
    wordBreak: 'break-all',
    whiteSpace: 'normal',
    margin: '-0.25rem 0',
  },
});

type Props = {
  bazaarProject: BazaarProject | null | undefined;
  fetchBazaarProject: () => Promise<BazaarProject | null>;
};

export const EntityBazaarInfoContent = ({
  bazaarProject,
  fetchBazaarProject,
}: Props) => {
  const classes = useStyles();
  const bazaarApi = useApi(bazaarApiRef);
  const identity = useApi(identityApiRef);
  const [openEdit, setOpenEdit] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [openUnlink, setOpenUnlink] = useState(false);
  const [members, fetchMembers] = useAsyncFn(async () => {
    return bazaarProject
      ? await fetchProjectMembers(bazaarApi, bazaarProject)
      : [];
  });

  const [userId, fetchUserId] = useAsyncFn(async () => {
    return await (
      await identity.getProfileInfo()
    ).displayName;
  });

  useEffect(() => {
    fetchMembers();
    fetchUserId();
  }, [fetchMembers, fetchUserId]);

  useEffect(() => {
    if (members.value && userId.value) {
      setIsMember(
        members.value
          ?.map((member: Member) => member.userId)
          .indexOf(userId.value) >= 0,
      );
    }
  }, [bazaarProject, members, identity, userId.value]);

  const handleMembersClick = async () => {
    if (userId.value) {
      if (!isMember) {
        await bazaarApi.addMember(bazaarProject?.id!, userId.value);
      } else {
        await bazaarApi.deleteMember(bazaarProject!.id, userId.value);
      }
      setIsMember(!isMember);
      fetchMembers();
    }
  };

  const links: IconLinkVerticalProps[] = [
    {
      label: 'Entity page',
      icon: <DashboardIcon />,
      disabled: true,
    },
    {
      label: 'Unlink project',
      icon: <LinkOffIcon />,
      disabled: false,
      onClick: () => {
        setOpenUnlink(true);
      },
    },
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
      href: bazaarProject?.community,
      disabled: bazaarProject?.community === '' || !isMember,
    },
  ];

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleUnlinkClose = () => {
    setOpenUnlink(false);
  };

  const handleUnlinkSubmit = async () => {
    const updateResponse = await bazaarApi.updateProject({
      ...bazaarProject,
      entityRef: null,
    });

    if (updateResponse.status === 'ok') {
      handleUnlinkClose();
      fetchBazaarProject();
    }
  };

  if (members.error) {
    return <Alert severity="error">{members?.error?.message}</Alert>;
  }

  if (bazaarProject) {
    return (
      <div>
        <EditProjectDialog
          bazaarProject={bazaarProject!}
          openEdit={openEdit}
          handleEditClose={handleEditClose}
          fetchBazaarProject={fetchBazaarProject}
        />

        {openUnlink && (
          <ConfirmationDialog
            open={openUnlink}
            handleClose={handleUnlinkClose}
            message={[
              'Are you sure you want to unlink ',
              <b className={classes.wordBreak}>
                {parseEntityRef(bazaarProject.entityRef!).name}
              </b>,
              ' from ',
              <b className={classes.wordBreak}>{bazaarProject.title}</b>,
              ' ?',
            ]}
            type="unlink"
            handleSubmit={handleUnlinkSubmit}
          />
        )}

        <CardHeader
          title={
            <Typography paragraph className={classes.wordBreak}>
              {bazaarProject?.title!}
            </Typography>
          }
          action={
            <div>
              <IconButton
                onClick={() => {
                  setOpenEdit(true);
                }}
              >
                <EditIcon />
              </IconButton>
            </div>
          }
          subheader={<HeaderIconLinkRow links={links} />}
        />
        <Divider />

        <CardContentFields
          bazaarProject={bazaarProject}
          members={members.value || []}
          descriptionSize={10}
          membersSize={2}
        />
      </div>
    );
  }
  return null;
};
