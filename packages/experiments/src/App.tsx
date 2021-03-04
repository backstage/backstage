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
import { hot } from 'react-hot-loader/root';
import { Context } from './context'; // importing core-api
import { ConsumerA } from './consumer-a';
import { ConsumerB } from './consumer-b';

const App = () => (
  <div>
    <h1>Hello World</h1>
    <Context.Provider value={{ a: 'bar' }}>
      <ConsumerA />
      <ConsumerB />
    </Context.Provider>
  </div>
);

export default hot(App);
