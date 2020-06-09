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

import React, { useState, useContext, useEffect, useRef } from 'react';
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
} from '@backstage/core-api';
import { Avatar, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import PowerButton from '@material-ui/icons/PowerSettingsNew';

type AppAuthProviders = Provider[];

type Provider = {
  title: string;
  api: any;
  identity?: boolean;
  isSignedIn: boolean;
  icon: any;
};

const useProviders = () => {
  const googleAuth = useApi(googleAuthApiRef);
  const githubAuth = useApi(githubAuthApiRef);
  // TODO(soapraj): List all the providers supported by the app
  const [providers, setProviders] = useState<AppAuthProviders>([
    {
      title: 'Google',
      api: googleAuth,
      identity: true,
      isSignedIn: false,
      icon: Star,
    },
    {
      title: 'Github',
      api: githubAuth,
      isSignedIn: false,
      icon: StarBorder,
    },
  ]);

  // On page load we check the status of sign-in/sign-out for all the providers
  // by making a optional getIdToken or getAccessToken request.
  const setIsSignedIn = async () => {
    const signInChecks = await Promise.all(
      providers.map(provider => {
        return provider.identity
          ? provider.api.getIdToken({ optional: true })
          : provider.api.getAccessToken('', { optional: true });
      }),
    );

    signInChecks.map((result, i) => {
      providers[i].isSignedIn = !!result;
    });

    setProviders(providers);
  };

  // Any sign-in/sign-out activity on any provider is observed here
  const observeProviderState = () => {
    providers.map((provider, index) => {
      provider.api.session$().subscribe((signedInState: boolean) => {
        const mutatedProvider = providers[index];
        mutatedProvider.isSignedIn = signedInState;
        providers[index] = mutatedProvider;
        setProviders(providers.slice());
      });
    });
  };

  useEffect(() => {
    setIsSignedIn();
    observeProviderState();
  }, [setIsSignedIn, observeProviderState]);

  return providers;
};

const useStyles = makeStyles({
  avatar: {
    width: 24,
    height: 24,
  },
});

export function SidebarUserSettings() {
  const { isOpen: sidebarOpen } = useContext(SidebarContext);
  const [open, setOpen] = React.useState(false);
  const ref = useRef<Element>(); // for scrolling down when collapse item opens
  const providers = useProviders();
  const [profile, setProfile] = useState<ProfileInfo>();
  const classes = useStyles();

  useEffect(() => {
    const identityProvider = providers.find(
      (provider: Provider) => provider.identity,
    );
    if (identityProvider?.isSignedIn) {
      identityProvider?.api
        .getProfile({ optional: true })
        .then((userProfile: ProfileInfo) => {
          setProfile(userProfile);
        });
    } else {
      setProfile(undefined);
    }
  }, [providers, open]);

  const handleClick = () => {
    setOpen(!open);
    setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  // Close the provider list when sidebar collapse
  useEffect(() => {
    if (!sidebarOpen && open) setOpen(false);
  }, [open, sidebarOpen]);

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
      <Collapse in={open} timeout="auto" unmountOnExit>
        {providers.map((provider: Provider) => (
          <SidebarItem
            key={provider.title}
            text={provider.title}
            icon={provider.icon ?? StarBorder}
            disableSelected
          >
            <IconButton
              onClick={() =>
                provider.isSignedIn
                  ? provider.api.logout()
                  : provider.api.getAccessToken()
              }
            >
              <Tooltip
                placement="top"
                arrow
                title={
                  provider.isSignedIn
                    ? `Sign out from ${provider.title}`
                    : `Sign in to ${provider.title}`
                }
              >
                <PowerButton
                  color={provider.isSignedIn ? 'secondary' : 'primary'}
                />
              </Tooltip>
            </IconButton>
          </SidebarItem>
        ))}
      </Collapse>
    </>
  );
}
