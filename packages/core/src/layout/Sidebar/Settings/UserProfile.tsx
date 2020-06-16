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

import React, { FC, useState, useRef, useEffect } from 'react';
import { makeStyles, Avatar, Divider } from '@material-ui/core';
import {
  ProfileInfo,
  useApi,
  googleAuthApiRef,
  Subscription,
  SessionState,
} from '@backstage/core-api';
import { SidebarItem } from '../Items';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles({
  avatar: {
    width: 24,
    height: 24,
  },
});

export const UserProfile: FC<{ open: boolean; setOpen: Function }> = ({
  open,
  setOpen,
}) => {
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

    let subscription: Subscription;
    const observeSession = () => {
      subscription = googleAuth
        .sessionState$()
        .subscribe(async (sessionState: SessionState) => {
          if (sessionState === SessionState.SignedIn) {
            await fetchProfile();
          } else {
            setProfile(undefined);
          }
        });
    };

    fetchProfile();
    observeSession();
    return () => {
      subscription.unsubscribe();
    };
  }, [googleAuth]);

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
      >
        {open ? <ExpandLess /> : <ExpandMore />}
      </SidebarItem>
    </>
  );
};
