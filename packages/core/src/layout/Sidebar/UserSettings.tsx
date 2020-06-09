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

import React, { useState, useContext, useEffect, useRef, FC } from 'react';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Star from '@material-ui/icons/Star';
import { SidebarContext } from './config';
import { SidebarItem } from './Items';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Divider from '@material-ui/core/Divider';
import {
  useApi,
  googleAuthApiRef,
  githubAuthApiRef,
  ProfileInfo,
  OAuthApi,
  OpenIdConnectApi,
  ProfileInfoApi,
  ApiRef,
  ObservableSession,
} from '@backstage/core-api';
import { Avatar, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import PowerButton from '@material-ui/icons/PowerSettingsNew';

type Provider = {
  title: string;
  icon: any;
};

type OAuthProviderSidebarProps = {
  title: string;
  icon: any;
  apiRef: ApiRef<OAuthApi & ObservableSession>;
};

type OIDCProviderSidebarProps = {
  title: string;
  icon: any;
  apiRef: ApiRef<OpenIdConnectApi & ObservableSession>;
};

const OAuthProviderSidebarComponent: FC<OAuthProviderSidebarProps> = ({
  title,
  icon,
  apiRef,
}) => {
  const api = useApi(apiRef);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await api.getAccessToken('', { optional: true });
      setSignedIn(!!session);
    };

    const observeSession = () => {
      api.session$().subscribe((signedInState: boolean) => {
        if (signedIn !== signedInState) {
          setSignedIn(signedInState);
        }
      });
    };

    checkSession();
    observeSession();
  }, []);

  return (
    <ProviderSidebarItemComponent
      title={title}
      icon={icon}
      signedIn={signedIn}
      api={api}
      signInHandler={api.getAccessToken}
    />
  );
};

const OIDCProviderSidebarComponent: FC<OIDCProviderSidebarProps> = ({
  title,
  icon,
  apiRef,
}) => {
  const api = useApi(apiRef);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await api.getIdToken({ optional: true });
      setSignedIn(!!session);
    };

    const observeSession = () => {
      api.session$().subscribe((signedInState: boolean) => {
        if (signedIn !== signedInState) {
          setSignedIn(signedInState);
        }
      });
    };

    checkSession();
    observeSession();
  }, []);

  return (
    <ProviderSidebarItemComponent
      title={title}
      icon={icon}
      signedIn={signedIn}
      api={api}
      signInHandler={api.getIdToken}
    />
  );
};

const ProviderSidebarItemComponent: FC<{
  title: string;
  icon: any;
  signedIn: boolean;
  api: OAuthApi | OpenIdConnectApi;
  signInHandler: Function;
}> = ({ title, icon, signedIn, api, signInHandler }) => {
  return (
    <SidebarItem
      key={title}
      text={title}
      icon={icon ?? StarBorder}
      disableSelected
    >
      <IconButton onClick={() => (signedIn ? api.logout() : signInHandler())}>
        <Tooltip
          placement="top"
          arrow
          title={signedIn ? `Sign out from ${title}` : `Sign in to ${title}`}
        >
          <PowerButton color={signedIn ? 'secondary' : 'primary'} />
        </Tooltip>
      </IconButton>
    </SidebarItem>
  );
};

const useStyles = makeStyles({
  avatar: {
    width: 24,
    height: 24,
  },
});

export const SidebarUserProfile: FC<{ setOpen: Function }> = ({ setOpen }) => {
  const [profile, setProfile] = useState<ProfileInfo>();
  const ref = useRef<Element>(); // for scrolling down when collapse item opens
  const googleAuth = useApi(googleAuthApiRef);
  const classes = useStyles();

  const handleClick = () => {
    setOpen(!open);
    setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      await googleAuth
        .getProfile({ optional: true })
        .then((userProfile?: ProfileInfo) => {
          setProfile(userProfile);
        });
    };

    const observeSession = () => {
      googleAuth.session$().subscribe(() => {
        fetchProfile();
      });
    };

    fetchProfile();
    observeSession();
  }, [open]);

  // Handle main auth info that is shown on the collapsible SidebarItem
  let avatar;
  let displayName = 'Guest';
  if (profile) {
    const email = profile.email;
    const name = profile.name;
    const imageUrl = profile.picture;
    const emailTrimmed = email.split('@')[0];
    const displayEmail =
      emailTrimmed.charAt(0).toUpperCase() + emailTrimmed.slice(1);
    displayName = name ?? displayEmail;
    avatar = imageUrl
      ? () => (
          <Avatar alt={displayName} src={imageUrl} className={classes.avatar} />
        )
      : () => <Avatar alt={displayName} className={classes.avatar} />;
  }

  return (
    <>
      <Divider innerRef={ref} />
      <SidebarItem
        text={displayName}
        onClick={handleClick}
        icon={avatar || AccountCircleIcon}
        disableSelected
      >
        {open ? <ExpandLess /> : <ExpandMore />}
      </SidebarItem>
    </>
  );
};

export function SidebarUserSettings() {
  const { isOpen: sidebarOpen } = useContext(SidebarContext);
  const [open, setOpen] = React.useState(false);

  // Close the provider list when sidebar collapse
  useEffect(() => {
    if (!sidebarOpen && open) setOpen(false);
  }, [open, sidebarOpen]);

  return (
    <>
      <SidebarUserProfile setOpen={setOpen} />
      <Collapse in={open} timeout="auto" unmountOnExit>
        <OIDCProviderSidebarComponent
          title="Google"
          apiRef={googleAuthApiRef}
          icon={Star}
        />
        <OAuthProviderSidebarComponent
          title="Github"
          apiRef={githubAuthApiRef}
          icon={Star}
        />
      </Collapse>
    </>
  );
}
