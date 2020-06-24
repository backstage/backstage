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

import React, { FC, useRef } from 'react';
import { makeStyles, Avatar, Divider } from '@material-ui/core';
import { useApi, identityApiRef } from '@backstage/core-api';
import { SidebarItem } from '../Items';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

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
  const ref = useRef<Element>(); // for scrolling down when collapse item opens
  const classes = useStyles();
  const profile = useApi(identityApiRef).getProfile();

  const handleClick = () => {
    setOpen(!open);
    setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const displayName = profile.displayName ?? profile.email;
  const SignInAvatar = () => (
    <Avatar src={profile.picture} className={classes.avatar}>
      {displayName[0]}
    </Avatar>
  );

  return (
    <>
      <Divider innerRef={ref} />
      <SidebarItem text={displayName} onClick={handleClick} icon={SignInAvatar}>
        {open ? <ExpandMore /> : <ExpandLess />}
      </SidebarItem>
    </>
  );
};
