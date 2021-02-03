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
import { OverflowTooltip } from './OverflowTooltip';

const text =
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';

export const Default = () => <OverflowTooltip title={text} text={text} />;

export const MultiLine = () => (
  <OverflowTooltip title={text} text={text} line={2} />
);
