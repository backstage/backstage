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

import { makeStyles, Theme } from '@material-ui/core/styles';

/** @public */
export type QuickStartCardClassKey = 'link' | 'contentActionContainer';

export const useStyles = makeStyles(
  (theme: Theme) => ({
    link: {
      display: 'inline-flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: `${theme.palette.link}!important`,
      '&:hover': {
        background: 'transparent!important',
      },
    },
    linkText: {
      marginBottom: theme.spacing(1.5),
    },
    contentActionContainer: {
      marginTop: theme.spacing(1.5),
      marginBottom: theme.spacing(1.5),
    },
    cardTitleIcon: {
      verticalAlign: 'bottom',
      marginLeft: '-4px',
    },
    videoContainer: {
      borderRadius: '10px',
      width: '100%',
      height: 'auto',
      background: '#000000',
    },
    imageSize: { width: '100%', height: '100%' },
    contentModal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      height: 'auto',
    },
  }),
  { name: 'HomeQuickStartCard' },
);
