/*
 * Copyright 2022 The Backstage Authors
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

import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { Sticky } from '../Sticky';
import { useProvider } from '../Context';
import { Toc } from '../Toc';

import { SidebarNav } from './SidebarNav';

export const Sidebar = () => {
  const { metadata } = useProvider();
  const items = metadata?.nav;
  const title = metadata?.site_name;

  const [show, setShow] = useState(false);

  if (!items) return null;

  return show ? (
    <>
      <IconButton
        edge="end"
        size="small"
        aria-label="go back"
        onClick={() => setShow(false)}
      >
        <ArrowBackIcon />
      </IconButton>
      <Toc />
    </>
  ) : (
    <Sticky>
      <SidebarNav title={title} items={items} onShow={() => setShow(true)} />
    </Sticky>
  );
};
