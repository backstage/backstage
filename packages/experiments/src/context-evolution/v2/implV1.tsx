/*
 * Copyright 2021 Spotify AB
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
import React, { PropsWithChildren } from 'react';
import { AppContextV1 } from './v1';

function Header({ children }: PropsWithChildren<{}>) {
  return <header>{children}</header>;
}

function Footer({ children }: PropsWithChildren<{}>) {
  return <footer>{children}</footer>;
}

function Alert() {
  return <i className="alert"></i>;
}

function Warning() {
  return <i className="warning"></i>;
}

const appContextV1 = new AppContextV1({
  plugins: [{ name: 'jira' }, { name: 'costInsights' }],
  components: { Header, Footer },
  icons: { Alert, Warning },
});

appContextV1.getPlugins();
