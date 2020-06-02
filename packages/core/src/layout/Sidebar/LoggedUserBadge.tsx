/*
 * Copyright 2020 Spotify AB
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

import React, { FC, useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { sidebarConfig } from './config';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  List,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { useSetState } from 'react-use';
import { Skeleton } from '@material-ui/lab';
import { useApi, googleAuthApiRef, ProfileInfo } from '@backstage/core';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles<Theme>(theme => {
  const { drawerWidthOpen, userBadgeDiameter } = sidebarConfig;
  return {
    root: {
      width: drawerWidthOpen,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 18,
      paddingTop: 14,
      paddingBottom: 14,
      color: '#b5b5b5',
    },
    avatar: {
      width: userBadgeDiameter,
      height: userBadgeDiameter,
      marginRight: 8,
    },
    purple: {
      color: theme.palette.getContrastText(blueGrey[500]),
      backgroundColor: blueGrey[500],
    },
    listItemText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  };
});

const SessionListItem: FC<{
  classes: any;
  loading: boolean;
  title: string;
  icon: any;
  user: any;
  onSignIn: Function;
  onSignOut: Function;
}> = ({
  classes,
  loading,
  title,
  icon,
  user,
  onSignIn,
  onSignOut,
  ...props
}) => {
  if (loading) {
    return (
      <ListItem {...props}>
        <ListItemIcon style={{ marginRight: 0 }}>
          <Skeleton variant="circle" width={40} height={40} />
        </ListItemIcon>
        <ListItemText
          className={classes.listItemText}
          primary={<Skeleton component="span" width={120} />}
          secondary={<Skeleton component="span" width={60} />}
        />
        <ListItemSecondaryAction>
          <IconButton>
            <Skeleton variant="circle" width={24} height={24} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  if (!user) {
    return (
      <ListItem {...props}>
        <ListItemIcon style={{ marginRight: 0 }}>{icon}</ListItemIcon>
        <ListItemText
          className={classes.listItemText}
          primary="Sign In"
          secondary={title}
        />
        <ListItemSecondaryAction>
          <Tooltip
            title={`Sign in with ${title}`}
            placement="bottom-end"
            PopperProps={{ style: { width: 120 } }}
          >
            <IconButton onClick={() => onSignIn()}>
              <ControlPointIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  const { id, avatarUrl, avatarAlt } = user;

  return (
    <ListItem {...props}>
      <ListItemAvatar>
        <Avatar src={avatarUrl} alt={avatarAlt}>
          {avatarAlt && avatarAlt[0].toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        className={classes.listItemText}
        primary={id}
        secondary={title}
      />
      <ListItemSecondaryAction style={{ marginLeft: '30px' }}>
        <Tooltip
          title={`Sign out from ${title}`}
          placement="bottom-end"
          PopperProps={{ style: { width: 120 } }}
        >
          <IconButton onClick={() => onSignOut()}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const useGoogleLoginState = (open: boolean) => {
  const googleAuth = useApi(googleAuthApiRef);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileInfo>();

  useEffect(() => {
    if (!open) {
      return;
    }

    let didCancel = false;

    googleAuth.getProfile().then(profile => {
      if (didCancel) {
        return;
      }

      setProfile(profile);
      setLoading(false);
    });

    return () => {
      didCancel = true;
    };
  }, [open]);

  if (loading) {
    return { loading: true };
  }
  return { loading: false, isLoggedIn: !!profile, profile };
};

type Props = {
  email: string;
  imageUrl?: string;
  name?: string;
  collapsedMode?: boolean;
};

export const LoggedUserBadge: FC<Props> = ({
  imageUrl,
  name,
  email,
  collapsedMode = false,
}) => {
  const [state, setState] = useSetState({
    open: false,
    anchorEl: null,
  });
  const googleAuth = useApi(googleAuthApiRef);
  const googleLogin = useGoogleLoginState(state.open);

  const handleOpen = (event: {
    preventDefault: () => void;
    currentTarget: any;
  }) => {
    // This prevents ghost click.
    event.preventDefault();
    setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  const handleClose = () => {
    setState({
      open: false,
    });
  };

  const handleGoogleSignIn = () => {
    googleAuth.getIdToken();
    handleClose();
  };

  const handleGoogleSignOut = () => {
    googleAuth.logout();
  };

  const classes = useStyles();
  const avatarFallback = email.charAt(0).toUpperCase() + email.slice(1);
  const emailTrimmed = email.split('@')[0];
  const displayEmail =
    emailTrimmed.charAt(0).toUpperCase() + emailTrimmed.slice(1);
  const displayName = name ?? displayEmail;

  return (
    <>
      <List dense>
        <ListItem className={classes.root} onClick={handleOpen}>
          <ListItemAvatar>
            {imageUrl ? (
              <Avatar alt={name} src={imageUrl} className={classes.avatar} />
            ) : (
              <Avatar
                alt={name}
                className={`${classes.avatar} ${classes.purple}`}
              >
                {avatarFallback[0]}
              </Avatar>
            )}
          </ListItemAvatar>
          {!collapsedMode && (
            <ListItemText
              primary={displayName}
              className={classes.listItemText}
            />
          )}
        </ListItem>
      </List>
      <Popover
        transitionDuration={0}
        open={state.open}
        anchorEl={state.anchorEl}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        onClose={handleClose}
      >
        <List dense>
          <SessionListItem
            classes={classes}
            loading={googleLogin.loading}
            title="Google"
            icon={AccountCircleIcon}
            user={
              googleLogin.isLoggedIn && {
                id: googleLogin.profile?.email,
                avatarUrl: googleLogin.profile?.picture ?? '',
                avatarAlt:
                  googleLogin.profile?.picture ?? googleLogin.profile?.email,
              }
            }
            onSignIn={handleGoogleSignIn}
            onSignOut={handleGoogleSignOut}
          />
        </List>
      </Popover>
    </>
  );
};
