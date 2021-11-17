/*
 * Copyright 2021 The Backstage Authors
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
import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { SearchModal } from '../SearchModal';
import { SidebarItem } from '@backstage/core-components';

export const SidebarSearchModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleModal = (): void => setOpen(prevState => !prevState);

  return (
    <>
      <SidebarItem
        className="search-icon"
        icon={SearchIcon}
        text="Search"
        onClick={toggleModal}
      />
      <SearchModal open={open} toggleModal={toggleModal} />
    </>
  );
};
