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

import React, { useEffect, useContext } from 'react';
import { Popover } from '@material-ui/core';
import { SignInAvatar } from './SignInAvatar';
import { SettingsDialog } from './SettingsDialog';
import { SidebarItem } from '../Items';
import { useUserProfile } from './useUserProfileInfo';
import { SidebarContext } from '../config';

type Props = {
  providerSettings?: React.ReactNode;
};

export const SidebarUserSettings = ({ providerSettings }: Props) => {
  const { isOpen: sidebarOpen } = useContext(SidebarContext);
  const { displayName } = useUserProfile();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | undefined>(
    undefined,
  );

  const handleOpen = (event?: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event?.currentTarget ?? undefined);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
    setOpen(false);
  };

  useEffect(() => {
    if (!sidebarOpen && open) setOpen(false);
  }, [open, sidebarOpen]);

  const SidebarAvatar = () => <SignInAvatar />;

  return (
    <>
      <SidebarItem
        text={displayName}
        onClick={handleOpen}
        icon={SidebarAvatar}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <SettingsDialog providerSettings={providerSettings} />
      </Popover>
    </>
  );
};
