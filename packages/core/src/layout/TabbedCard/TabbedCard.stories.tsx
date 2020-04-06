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
import React from 'react';
import { TabbedCard, CardTab } from '.';

export default {
  title: 'Tabbed Card',
  component: TabbedCard,
};

export const Default = () => {
  return (
    <TabbedCard title="Default Test Header">
      <CardTab label="Option 1">some content 1</CardTab>
      <CardTab label="Option 2">some content 2</CardTab>
      <CardTab label="Option 3">some content 3</CardTab>
      <CardTab label="Option 4">some content 4</CardTab>
    </TabbedCard>
  );
};

const linkInfo = { title: 'Go to XYZ Location', link: '#' };

export const WithFooterLink = () => {
  return (
    <TabbedCard title="Footer Link Test Header" deepLink={linkInfo}>
      <CardTab label="Option 1">some content 1</CardTab>
      <CardTab label="Option 2">some content 2</CardTab>
      <CardTab label="Option 3">some content 3</CardTab>
      <CardTab label="Option 4">some content 4</CardTab>
    </TabbedCard>
  );
};
