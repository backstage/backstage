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
import { useOutlet } from 'react-router-dom';
import React from 'react';
import { DefaultSettingsPage } from '../DefaultSettingsPage';
import { useElementFilter } from '@backstage/core-plugin-api';
import {
  SettingsLayoutProps,
  SettingsLayoutRouteProps,
} from '../SettingsLayout';
import {
  LAYOUT_DATA_KEY,
  LAYOUT_ROUTE_DATA_KEY,
} from '../SettingsLayout/SettingsLayout';

/** @public */
export const SettingsPage = (props: { providerSettings?: JSX.Element }) => {
  const { providerSettings } = props;
  const outlet = useOutlet();
  const layout = useElementFilter(outlet, elements =>
    elements
      .selectByComponentData({
        key: LAYOUT_DATA_KEY,
      })
      .getElements<SettingsLayoutProps>(),
  );
  const tabs = useElementFilter(outlet, elements =>
    elements
      .selectByComponentData({
        key: LAYOUT_ROUTE_DATA_KEY,
      })
      .getElements<SettingsLayoutRouteProps>(),
  );

  return (
    <>
      {(layout.length !== 0 && layout) || (
        <DefaultSettingsPage tabs={tabs} providerSettings={providerSettings} />
      )}
    </>
  );
};
