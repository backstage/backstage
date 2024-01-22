/*
 * Copyright 2023 The Backstage Authors
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

import { RuleTester } from 'eslint';
import rule from '../rules/no-top-level-material-ui-4-imports';

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
  },
});

ruleTester.run('path-imports-rule', rule, {
  valid: [
    {
      code: `import Typography from '@material-ui/core/Typography';`,
    },
    {
      code: `import Box from '@material-ui/core/Box'`,
    },
    {
      code: `import { styled, withStyles } from '@material-ui/core/styles';`,
    },
    {
      code: `import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';`,
    },
    {
      code: `import { StyleRules } from '@material-ui/core/styles/withStyles';`,
    },
    {
      code: `import { CreateCSSProperties, StyledComponentProps } from '@material-ui/core/styles/withStyles';`,
    },
  ],
  invalid: [
    {
      code: `import { Box, Typography } from '@material-ui/core';`,
      errors: [{ messageId: 'topLevelImport' }],
      output: `import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';`,
    },
    {
      code: `import { Box } from '@material-ui/core';`,
      errors: [{ messageId: 'topLevelImport' }],
      output: `import Box from '@material-ui/core/Box';`,
    },
    {
      code: `import {
                  Box,
                  DialogActions,
                  DialogContent,
                  DialogTitle,
                  Grid,
                  makeStyles,
                } from '@material-ui/core';`,
      errors: [{ messageId: 'topLevelImport' }],
      output: `import Box from '@material-ui/core/Box';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';`,
    },
    {
      code: `import { Box, Button, makeStyles } from '@material-ui/core';`,
      errors: [{ messageId: 'topLevelImport' }],
      output: `import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';`,
    },
    {
      code: `import { Paper, Typography, styled, withStyles } from '@material-ui/core';`,
      errors: [{ messageId: 'topLevelImport' }],
      output: `import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { styled, withStyles } from '@material-ui/core/styles';`,
    },
    {
      code: `import { styled } from '@material-ui/core';`,
      errors: [{ messageId: 'topLevelImport' }],
      output: `import { styled } from '@material-ui/core/styles';`,
    },
    {
      code: `import { SvgIcon, SvgIconProps } from '@material-ui/core';`,
      errors: [{ messageId: 'topLevelImport' }],
      output: `import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';`,
    },
    {
      code: `import { TabProps } from '@material-ui/core';`,
      errors: [{ messageId: 'topLevelImport' }],
      output: `import { TabProps } from '@material-ui/core/Tab';`,
    },
  ],
});
