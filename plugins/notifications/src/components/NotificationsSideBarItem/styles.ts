/*
 * Copyright 2025 The Backstage Authors
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
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  countBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    borderRadius: '10px',
    padding: '1px 4px',
    fontSize: '0.6rem',
    fontWeight: 'bold',
    minWidth: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    zIndex: 1,
  },
  iconWrapper: {
    position: 'relative',
    display: 'inline-flex',
  },
}));
