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

import {
  useTheme as useV4Theme,
  makeStyles as makeV4Styles,
} from '@material-ui/core/styles';
import { useTheme as useV5Theme } from '@mui/material/styles';
import { makeStyles as makeV5Styles } from '@mui/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { UnifiedThemeProvider } from './UnifiedThemeProvider';
import { themes } from './themes';

describe('UnifiedThemeProvider', () => {
  it('provides a themes for v4 and v5 directly', () => {
    function MyV4Component() {
      const theme = useV4Theme();
      return <span>v4-grey: {theme.palette.grey[500]}</span>;
    }
    function MyV5Component() {
      const theme = useV5Theme();
      return <span>v5-grey: {theme.palette.grey[500]}</span>;
    }

    render(
      <UnifiedThemeProvider theme={themes.light}>
        <MyV4Component />
        <MyV5Component />
      </UnifiedThemeProvider>,
    );

    expect(screen.getByText('v4-grey: #9e9e9e')).toBeInTheDocument();
    expect(screen.getByText('v5-grey: #9e9e9e')).toBeInTheDocument();
  });

  it('provides a themes for v4 and v5 through makeStyles', () => {
    const useV4Styles = makeV4Styles(theme => ({
      root: {
        color: theme.palette.grey[500],
      },
    }));
    const useV5Styles = makeV5Styles(theme => ({
      root: {
        color: theme.palette.grey[500],
      },
    }));

    function MyV4Component() {
      const classes = useV4Styles();
      return <span className={classes.root}>v4</span>;
    }
    function MyV5Component() {
      const classes = useV5Styles();
      return <span className={classes.root}>v5</span>;
    }

    render(
      <UnifiedThemeProvider theme={themes.light}>
        <MyV4Component />
        <MyV5Component />
      </UnifiedThemeProvider>,
    );

    expect(window.getComputedStyle(screen.getByText('v4')).color).toBe(
      'rgb(158, 158, 158)',
    );
    expect(window.getComputedStyle(screen.getByText('v5')).color).toBe(
      'rgb(158, 158, 158)',
    );
  });
});
