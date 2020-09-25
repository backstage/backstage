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
import { Popover, PopoverActions } from '@material-ui/core';
import { SignInAvatar } from './SignInAvatar';
import { SettingsDialog } from './SettingsDialog';
import { SidebarItem, SidebarContext } from '@backstage/core';
import { useUserProfile } from './useUserProfileInfo';

export type ProviderSettings = JSX.Element;

type Props = {
  /**
   * Available auth providers. Providers will be rendered as children
   * of a MUI List.
   *
   * If undefined, providers that are configured in app-config.yaml
   * will be displayed instead.
   */
  providerSettings?: ProviderSettings;
};

export const UserSettings = ({ providerSettings }: Props) => {
  const { isOpen: sidebarOpen } = useContext(SidebarContext);
  const { displayName } = useUserProfile();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | undefined>(
    undefined,
  );
  const popoverActionRef = React.useRef<PopoverActions | null>(null);

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
        action={popoverActionRef}
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
        <SettingsDialog
          popoverActionRef={popoverActionRef}
          providerSettings={providerSettings}
        />
      </Popover>
    </>
  );
};
