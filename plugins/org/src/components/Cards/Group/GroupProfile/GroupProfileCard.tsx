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

import {
  ANNOTATION_EDIT_URL,
  ANNOTATION_LOCATION,
  GroupEntity,
  RELATION_CHILD_OF,
  RELATION_PARENT_OF,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  Avatar,
  InfoCard,
  InfoCardVariants,
  Link,
} from '@backstage/core-components';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import {
  EntityRefLinks,
  catalogApiRef,
  getEntityRelations,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { useCallback } from 'react';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

import AccountTreeIcon from '@material-ui/icons/AccountTree';
import Alert from '@material-ui/lab/Alert';
import CachedIcon from '@material-ui/icons/Cached';
import EditIcon from '@material-ui/icons/Edit';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { LinksGroup } from '../../Meta';
import { useEntityPermission } from '@backstage/plugin-catalog-react/alpha';
import { catalogEntityRefreshPermission } from '@backstage/plugin-catalog-common/alpha';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { orgTranslationRef } from '../../../../translation';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
  list: {
    padding: 0,
    marginLeft: theme.spacing(0.5),
  },
}));

const CardTitle = (props: { title: string }) => (
  <Box display="flex" alignItems="center">
    <GroupIcon fontSize="inherit" />
    <Box ml={1}>{props.title}</Box>
  </Box>
);

/** @public */
export const GroupProfileCard = (props: {
  variant?: InfoCardVariants;
  showLinks?: boolean;
}) => {
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const { entity: group } = useEntity<GroupEntity>();
  const { allowed: canRefresh } = useEntityPermission(
    catalogEntityRefreshPermission,
  );
  const { t } = useTranslationRef(orgTranslationRef);
  const classes = useStyles();

  const refreshEntity = useCallback(async () => {
    await catalogApi.refreshEntity(stringifyEntityRef(group));
    alertApi.post({
      message: 'Refresh scheduled',
      severity: 'info',
      display: 'transient',
    });
  }, [catalogApi, alertApi, group]);

  if (!group) {
    return (
      <Alert severity="error">{t('groupProfileCard.groupNotFound')}</Alert>
    );
  }

  const {
    metadata: { name, description, title, annotations, links },
    spec: { profile },
  } = group;

  const childRelations = getEntityRelations(group, RELATION_PARENT_OF, {
    kind: 'Group',
  });
  const parentRelations = getEntityRelations(group, RELATION_CHILD_OF, {
    kind: 'group',
  });

  const entityLocation = annotations?.[ANNOTATION_LOCATION];
  const allowRefresh =
    entityLocation?.startsWith('url:') || entityLocation?.startsWith('file:');

  const entityMetadataEditUrl =
    group.metadata.annotations?.[ANNOTATION_EDIT_URL];

  const displayName = profile?.displayName ?? title ?? name;
  const emailHref = profile?.email ? `mailto:${profile.email}` : '#';
  const infoCardAction = entityMetadataEditUrl ? (
    <IconButton
      aria-label={t('groupProfileCard.editIconButtonTitle')}
      title={t('groupProfileCard.editIconButtonTitle')}
      component={Link}
      to={entityMetadataEditUrl}
    >
      <EditIcon />
    </IconButton>
  ) : (
    <IconButton
      aria-label={t('groupProfileCard.editIconButtonTitle')}
      disabled
      title={t('groupProfileCard.editIconButtonTitle')}
    >
      <EditIcon />
    </IconButton>
  );

  return (
    <InfoCard
      title={<CardTitle title={displayName} />}
      subheader={description}
      variant={props.variant}
      action={
        <>
          {allowRefresh && canRefresh && (
            <IconButton
              aria-label={t('groupProfileCard.refreshIconButtonAriaLabel')}
              title={t('groupProfileCard.refreshIconButtonTitle')}
              onClick={refreshEntity}
            >
              <CachedIcon />
            </IconButton>
          )}
          {infoCardAction}
        </>
      }
    >
      <Box className={classes.container}>
        <Avatar displayName={displayName} picture={profile?.picture} />
        <List className={classes.list}>
          <ListItem>
            <ListItemIcon>
              <Tooltip title={t('groupProfileCard.listItemTitle.entityRef')}>
                <PermIdentityIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={stringifyEntityRef(group)}
              secondary={t('groupProfileCard.listItemTitle.entityRef')}
            />
          </ListItem>
          {profile?.email && (
            <ListItem>
              <ListItemIcon>
                <Tooltip title={t('groupProfileCard.listItemTitle.email')}>
                  <EmailIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText
                primary={<Link to={emailHref}>{profile.email}</Link>}
                secondary={t('groupProfileCard.listItemTitle.email')}
              />
            </ListItem>
          )}
          <ListItem>
            <ListItemIcon>
              <Tooltip title={t('groupProfileCard.listItemTitle.parentGroup')}>
                <AccountTreeIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={
                parentRelations.length ? (
                  <EntityRefLinks
                    entityRefs={parentRelations}
                    defaultKind="Group"
                  />
                ) : (
                  'N/A'
                )
              }
              secondary={t('groupProfileCard.listItemTitle.parentGroup')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Tooltip title={t('groupProfileCard.listItemTitle.childGroups')}>
                <GroupIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={
                childRelations.length ? (
                  <EntityRefLinks
                    entityRefs={childRelations}
                    defaultKind="Group"
                  />
                ) : (
                  'N/A'
                )
              }
              secondary={t('groupProfileCard.listItemTitle.childGroups')}
            />
          </ListItem>
          {props?.showLinks && <LinksGroup links={links} />}
        </List>
      </Box>
    </InfoCard>
  );
};
