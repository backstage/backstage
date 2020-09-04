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

import { identityApiRef, useApi } from '@backstage/core-api';
import Collapse from '@material-ui/core/Collapse';
import SignOutIcon from '@material-ui/icons/MeetingRoom';
import React, { useContext, useEffect } from 'react';
import { SidebarContext } from './config';
import { SidebarItem } from './Items';
import { UserProfile as SidebarUserProfile } from './Settings';

type SidebarUserSettingsProps = { providerSettings?: React.ReactNode };

export function SidebarUserSettings({
  providerSettings,
}: SidebarUserSettingsProps) {
  const { isOpen: sidebarOpen } = useContext(SidebarContext);
  const [open, setOpen] = React.useState(false);
  const identityApi = useApi(identityApiRef);

  // Close the provider list when sidebar collapse
  useEffect(() => {
    if (!sidebarOpen && open) setOpen(false);
  }, [open, sidebarOpen]);

  // FIXME: Change this and remove the session storage stuff
  const handleLogout = () => {
    identityApi.logout();
    window.sessionStorage.clear();
  };

  return (
    <>
      <SidebarUserProfile open={open} setOpen={setOpen} />
      <Collapse in={open} timeout="auto">
        {providerSettings}

        <SidebarItem
          icon={SignOutIcon}
          text="Sign Out"
          onClick={handleLogout}
        />
      </Collapse>
    </>
  );
}
