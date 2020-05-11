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
import React, { FC } from 'react';
import { Provider, useDispatch } from 'react-redux';

import store, { Dispatch } from '../../state/store';

const RehydrateSettings = () => {
  const dispatch: Dispatch = useDispatch();

  React.useEffect(() => {
    dispatch.settings.rehydrate();
  }, []);
  return null;
};

export const Store: FC = ({ children }) => {
  return (
    <Provider store={store}>
      <div>
        <RehydrateSettings />
        {children}
      </div>
    </Provider>
  );
};

export const withStore = (Component: React.ComponentType<any>) => () => (
  <Store>
    <Component />
  </Store>
);
