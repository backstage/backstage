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
  RELATION_MEMBER_OF,
  UserEntity,
} from '@backstage/catalog-model';
import {
  Avatar,
  InfoCard,
  InfoCardVariants,
  Link,
} from '@backstage/core-components';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import BaseButton from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import {
  EntityRefLinks,
  getEntityRelations,
  useEntity,
} from '@backstage/plugin-catalog-react';

import Alert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import { LinksGroup } from '../../Meta';
import PersonIcon from '@material-ui/icons/Person';

import { useCallback, useState } from 'react';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { orgTranslationRef } from '../../../../translation';

/** @public */
export type UserProfileCardClassKey =
  | 'closeButton'
  | 'moreButton'
  | 'dialogPaper';

const useStyles = makeStyles(
  theme =>
    createStyles({
      closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
      moreButton: {
        display: 'contents',
        color: theme.palette.primary.main,
      },
      dialogPaper: {
        minHeight: 400,
      },
    }),
  { name: 'PluginOrgUserProfileCard' },
);

const CardTitle = (props: { title?: string }) =>
  props.title ? (
    <Box display="flex" alignItems="center">
      <PersonIcon fontSize="inherit" />
      <Box ml={1}>{props.title}</Box>
    </Box>
  ) : null;

/** @public */
export const UserProfileCard = (props: {
  variant?: InfoCardVariants;
  showLinks?: boolean;
  maxRelations?: number;
  hideIcons?: boolean;
}) => {
  const { maxRelations, hideIcons } = props;

  const classes = useStyles();
  const { entity: user } = useEntity<UserEntity>();
  const [isAllGroupsDialogOpen, setIsAllGroupsDialogOpen] = useState(false);
  const { t } = useTranslationRef(orgTranslationRef);

  const toggleAllGroupsDialog = useCallback(
    () =>
      setIsAllGroupsDialogOpen(
        prevIsViewAllGroupsDialogOpen => !prevIsViewAllGroupsDialogOpen,
      ),
    [],
  );

  if (!user) {
    return <Alert severity="error">{t('userProfileCard.userNotFound')}</Alert>;
  }

  const entityMetadataEditUrl =
    user.metadata.annotations?.[ANNOTATION_EDIT_URL];

  const {
    metadata: { name: metaName, description, links },
    spec: { profile },
  } = user;
  const displayName = profile?.displayName ?? metaName;
  const emailHref = profile?.email ? `mailto:${profile.email}` : undefined;
  const memberOfRelations = getEntityRelations(user, RELATION_MEMBER_OF, {
    kind: 'Group',
  });

  return (
    <InfoCard
      title={<CardTitle title={displayName} />}
      subheader={description}
      variant={props.variant}
      action={
        <>
          {entityMetadataEditUrl && (
            <IconButton
              aria-label={t('userProfileCard.editIconButtonTitle')}
              title={t('userProfileCard.editIconButtonTitle')}
              component={Link}
              to={entityMetadataEditUrl}
            >
              <EditIcon />
            </IconButton>
          )}
        </>
      }
    >
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} sm={2} xl={1}>
          <Avatar displayName={displayName} picture={profile?.picture} />
        </Grid>

        <Grid item md={10} xl={11}>
          <List>
            {profile?.email && (
              <ListItem>
                <ListItemIcon>
                  <Tooltip title={t('userProfileCard.listItemTitle.email')}>
                    <EmailIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText>
                  <Link to={emailHref ?? ''}>{profile.email}</Link>
                </ListItemText>
              </ListItem>
            )}

            {maxRelations === undefined || maxRelations > 0 ? (
              <ListItem>
                <ListItemIcon>
                  <Tooltip title={t('userProfileCard.listItemTitle.memberOf')}>
                    <GroupIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText>
                  <EntityRefLinks
                    entityRefs={memberOfRelations.slice(0, maxRelations)}
                    defaultKind="Group"
                    hideIcons={hideIcons}
                  />
                  {maxRelations && memberOfRelations.length > maxRelations ? (
                    <>
                      ,
                      <BaseButton
                        className={classes.moreButton}
                        onClick={toggleAllGroupsDialog}
                        disableRipple
                      >
                        {t('userProfileCard.moreGroupButtonTitle', {
                          number: String(
                            memberOfRelations.length - maxRelations,
                          ),
                        })}
                      </BaseButton>
                    </>
                  ) : null}
                </ListItemText>
              </ListItem>
            ) : null}
            {props?.showLinks && <LinksGroup links={links} />}
          </List>
        </Grid>
      </Grid>

      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={isAllGroupsDialogOpen}
        onClose={toggleAllGroupsDialog}
        scroll="paper"
        aria-labelledby="view-all-groups-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="view-all-groups-dialog-title">
          {t('userProfileCard.allGroupDialog.title', {
            name: user.metadata.name,
          })}
          <IconButton
            className={classes.closeButton}
            aria-label={t('userProfileCard.allGroupDialog.closeButtonTitle')}
            onClick={toggleAllGroupsDialog}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <EntityRefLinks entityRefs={memberOfRelations} defaultKind="Group" />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleAllGroupsDialog}>
            {t('userProfileCard.allGroupDialog.closeButtonTitle')}
          </Button>
        </DialogActions>
      </Dialog>
    </InfoCard>
  );
};
