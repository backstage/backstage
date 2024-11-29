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
import { makeStyles, createStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';

export type OpenedDropdownClassKey = 'icon';

const useStyles = makeStyles(
  theme =>
    createStyles({
      icon: {
        position: 'absolute',
        right: theme.spacing(0.5),
        pointerEvents: 'none',
        color: '#616161',
      },
    }),
  { name: 'BackstageOpenedDropdown' },
);

const OpenedDropdown = () => {
  const classes = useStyles();
  return (
    <SvgIcon
      className={classes.icon}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 16L18 14.5L11.9297 8.42969L5.85938 14.5L7.35938 16L11.9297 11.4297L16.5 16Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default OpenedDropdown;
