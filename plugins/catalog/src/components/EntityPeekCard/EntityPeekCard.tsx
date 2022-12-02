/*
 * Copyright 2020 The Backstage Authors
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
import React, { useCallback } from 'react';
import {
  CompoundEntityRef,
  Entity,
  isUserEntity,
  isGroupEntity,
  UserEntity,
  GroupEntity,
} from '@backstage/catalog-model';
import {
  Button,
  MenuItem,
  Paper,
  ListItemIcon,
  ListItemText,
  Divider,
  makeStyles,
  Menu,
  Link,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import EmailIcon from '@material-ui/icons/Email';
import { bindTrigger, bindMenu, InjectedProps } from 'material-ui-popup-state';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { useNavigate } from 'react-router';
import { Progress } from '@backstage/core-components';

export type EntityPeekCardProps = {
  entityRefs: CompoundEntityRef[];
};

const useStyles = makeStyles(() => ({
  paper: { width: 320, maxWidth: '100%' },
}));

const UserGroupMenuItems = ({
  entity,
  popupState,
}: {
  entity: UserEntity | GroupEntity;
  popupState: InjectedProps;
}) => {
  return (
    <>
      {entity.spec.profile?.email && (
        <MenuItem onClick={popupState.close}>
          <Link href={`mailto: ${entity.spec.profile.email}`}>
            <ListItemIcon>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              Send Email to {entity.spec.profile?.displayName}
            </ListItemText>
          </Link>
        </MenuItem>
      )}
    </>
  );
};

const EntityMenu = ({
  popupState,
  entityRefs,
}: {
  popupState: InjectedProps;
  entityRefs: CompoundEntityRef[];
}) => {
  const catalogApi = useApi(catalogApiRef);
  const navigate = useNavigate();

  const { value: entities, loading } = useAsync(async (): Promise<
    (Entity | undefined)[] | undefined
  > => {
    if (popupState.isOpen) {
      return Promise.all(
        entityRefs.map(async entityRef => {
          return await catalogApi.getEntityByRef(entityRef);
        }),
      );
    }
    return undefined;
  }, [popupState.isOpen]);

  const onDetailsClick = useCallback(
    (entity: Entity) => {
      popupState.close();
      navigate(
        `/catalog/${entity.metadata.namespace}/${entity.kind.toLocaleLowerCase(
          'en-US',
        )}/${entity.metadata.name}`,
      );
    },
    [navigate, popupState],
  );

  if (loading) {
    return <Progress />;
  }

  return (
    <Menu {...bindMenu(popupState)}>
      {entities?.map(entity => {
        if (entity && (isUserEntity(entity) || isGroupEntity(entity))) {
          return <UserGroupMenuItems entity={entity} popupState={popupState} />;
        }
        return <></>;
      })}
      <Divider />
      {entities?.map(entity => {
        if (entity) {
          return (
            <MenuItem onClick={() => onDetailsClick(entity)}>
              <ListItemIcon>
                <KeyboardArrowDownIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Details</ListItemText>
            </MenuItem>
          );
        }
        return <></>;
      })}
    </Menu>
  );
};

export const EntityPeekCard = ({ entityRefs }: EntityPeekCardProps) => {
  const classes = useStyles();
  const popupState = usePopupState({
    variant: 'popper',
    popupId: 'demoMenu',
    disableAutoFocus: true,
  });

  return (
    <div>
      <Button {...bindTrigger(popupState)} endIcon={<KeyboardArrowDownIcon />}>
        {entityRefs.map(entityRef => entityRef.name).join(',')}
      </Button>
      <Paper className={classes.paper}>
        <EntityMenu popupState={popupState} entityRefs={entityRefs} />
      </Paper>
    </div>
  );
};
