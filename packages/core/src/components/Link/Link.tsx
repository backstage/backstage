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

import React, { ComponentProps } from 'react';
import { Link as MaterialLink } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

type Props = ComponentProps<typeof MaterialLink> &
  ComponentProps<typeof RouterLink> & { component?: React.FC<any> };

/**
 * Thin wrapper on top of material-ui's Link component
 * Makes the Link to utilise react-router
 */
export const Link = React.forwardRef<any, Props>((props, ref) => (
  <MaterialLink ref={ref} component={RouterLink} {...props} />
));
