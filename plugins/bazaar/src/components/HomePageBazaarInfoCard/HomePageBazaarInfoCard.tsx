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
  Card,
  CardHeader,
  Divider,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import {
  HeaderIconLinkRow,
  IconLinkVerticalProps,
} from '@backstage/core-components';
import EditIcon from '@material-ui/icons/Edit';
import ChatIcon from '@material-ui/icons/Chat';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CloseIcon from '@material-ui/icons/Close';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { EditProjectDialog } from '../EditProjectDialog';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {
  useApi,
  identityApiRef,
  useRouteRef,
} from '@backstage/core-plugin-api';
import { Member, BazaarProject } from '../../types';
import { bazaarApiRef } from '../../api';
import { Alert } from '@material-ui/lab';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';

import {
  stringifyEntityRef,
  Entity,
  parseEntityRef,
} from '@backstage/catalog-model';

import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';
import { CardContentFields } from '../CardContentFields/CardContentFields';
import { LinkProjectDialog } from '../LinkProjectDialog';
import {
  fetchCatalogItems,
  fetchProjectMembers,
} from '../../util/fetchMethods';
import { parseBazaarResponse } from '../../util/parseMethods';

const useStyles = makeStyles({
  wordBreak: {
    wordBreak: 'break-all',
    whiteSpace: 'normal',
    margin: '-0.25rem 0',
  },
});

type Props = {
  initProject: BazaarProject;
  handleClose: () => void;
  initEntity: Entity;
};

export const HomePageBazaarInfoCard = ({
  initProject,
  handleClose,
  initEntity,
}: Props) => {
  const classes = useStyles();
  const entityLink = useRouteRef(entityRouteRef);
  const bazaarApi = useApi(bazaarApiRef);
  const identity = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);
  const [openEdit, setOpenEdit] = useState(false);
  const [openProjectSelector, setOpenProjectSelector] = useState(false);
  const [openUnlink, setOpenUnlink] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const [catalogEntities, fetchCatalogEntities] = useAsyncFn(async () => {
    const entities = await fetchCatalogItems(catalogApi);
    const bazaarProjects = await bazaarApi.getProjects();
    const bazaarLinkedRefs: string[] = bazaarProjects.data
      .filter((entity: any) => entity.entity_ref !== null)
      .map((entity: any) => entity.entity_ref);

    return entities.filter(
      (entity: Entity) =>
        !bazaarLinkedRefs.includes(stringifyEntityRef(entity)),
    );
  });

  const [bazaarProject, fetchBazaarProject] = useAsyncFn(async () => {
    const response = await bazaarApi.getProjectById(initProject.id);
    return await parseBazaarResponse(response);
  });

  const [members, fetchMembers] = useAsyncFn(async () => {
    return fetchProjectMembers(bazaarApi, bazaarProject.value ?? initProject);
  });

  const [userId, fetchUserId] = useAsyncFn(async () => {
    return await (
      await identity.getProfileInfo()
    ).displayName;
  });

  useEffect(() => {
    fetchMembers();
    fetchBazaarProject();
    fetchCatalogEntities();
    fetchUserId();
  }, [fetchMembers, fetchBazaarProject, fetchCatalogEntities, fetchUserId]);

  useEffect(() => {
    if (members.value && userId.value) {
      setIsMember(
        members.value
          ?.map((member: Member) => member.userId)
          .indexOf(userId.value) >= 0,
      );
    }
  }, [bazaarProject.value, members, identity, userId.value]);

  const handleMembersClick = async () => {
    if (userId.value) {
      if (!isMember) {
        await bazaarApi.addMember(bazaarProject.value!.id, userId.value);
      } else {
        await bazaarApi.deleteMember(bazaarProject.value!.id, userId.value);
      }
      setIsMember(!isMember);
      fetchMembers();
    }
  };

  const getEntityPageLink = () => {
    if (bazaarProject?.value?.entityRef) {
      const { name, kind, namespace } = parseEntityRef(
        bazaarProject.value.entityRef,
      );
      return entityLink({ kind, namespace, name });
    }
    return '';
  };

  const handleLink = () => {
    if (bazaarProject.value?.entityRef) {
      setOpenUnlink(true);
    } else {
      fetchCatalogEntities();
      setOpenProjectSelector(true);
    }
  };

  const links: IconLinkVerticalProps[] = [
    {
      label: 'Entity page',
      icon: <DashboardIcon />,
      href: bazaarProject.value?.entityRef ? getEntityPageLink() : '',
      disabled: bazaarProject.value?.entityRef === null,
    },
    {
      label: bazaarProject.value?.entityRef ? 'Unlink project' : 'Link project',
      icon: bazaarProject.value?.entityRef ? (
        <LinkOffIcon />
      ) : (
        <InsertLinkIcon />
      ),
      onClick: handleLink,
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
      href: bazaarProject.value?.community,
      disabled: !bazaarProject.value?.community || !isMember,
    },
  ];

  const handleUnlinkSubmit = async () => {
    const updateResponse = await bazaarApi.updateProject({
      ...bazaarProject.value,
      entityRef: null,
    });

    if (updateResponse.status === 'ok') {
      setOpenUnlink(false);
      fetchBazaarProject();
    }
  };

  if (bazaarProject.error) {
    return <Alert severity="error">{bazaarProject?.error?.message}</Alert>;
  } else if (members.error) {
    return <Alert severity="error">{members?.error?.message}</Alert>;
  }

  return (
    <div>
      <LinkProjectDialog
        openProjectSelector={openProjectSelector}
        handleProjectSelectorClose={() => setOpenProjectSelector(false)}
        catalogEntities={catalogEntities.value || []}
        bazaarProject={bazaarProject.value || initProject}
        fetchBazaarProject={fetchBazaarProject}
        initEntity={initEntity}
      />

      {openUnlink && (
        <ConfirmationDialog
          open={openUnlink}
          handleClose={() => setOpenUnlink(false)}
          message={[
            'Are you sure you want to unlink ',
            <b className={classes.wordBreak}>
              {parseEntityRef(bazaarProject.value?.entityRef!).name}
            </b>,
            ' from ',
            <b className={classes.wordBreak}>{bazaarProject.value?.name}</b>,
            ' ?',
          ]}
          type="unlink"
          handleSubmit={handleUnlinkSubmit}
        />
      )}

      <Card>
        <EditProjectDialog
          bazaarProject={bazaarProject.value || initProject}
          openEdit={openEdit}
          handleEditClose={() => setOpenEdit(false)}
          handleCardClose={handleClose}
          fetchBazaarProject={fetchBazaarProject}
        />

        <CardHeader
          title={
            <p className={classes.wordBreak}>
              {bazaarProject.value?.name || initProject.name}
            </p>
          }
          action={
            <div>
              <IconButton onClick={() => setOpenEdit(true)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          }
          subheader={<HeaderIconLinkRow links={links} />}
        />
        <Divider />

        <CardContentFields
          bazaarProject={bazaarProject.value || initProject}
          members={members.value || []}
          descriptionSize={9}
          membersSize={3}
        />
      </Card>
    </div>
  );
};
