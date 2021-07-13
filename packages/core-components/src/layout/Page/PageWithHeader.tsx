/*
 * Copyright 2020 The Backstage Authors
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

import { Header, Page } from '../../';
import { Props as HeaderProps } from '../../layout/Header/Header';

export interface IProps extends HeaderProps {
  themeId: string;
}

export const PageWithHeader = ({
  themeId,
  children,
  ...props
}: React.PropsWithChildren<IProps>) => (
  <Page themeId={themeId}>
    <Header {...props} />
    {children}
  </Page>
);
