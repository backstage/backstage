/*
 * Copyright 2021 The Backstage Authors
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
import { InfoCard } from '@backstage/core-components';
import { makeStyles, styled } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
  },
  cancelButton: {
    marginRight: theme.spacing(1),
  },
  retryButton: {
    marginRight: theme.spacing(1),
  },
  logsVisibilityButton: {
    marginRight: theme.spacing(1),
  },
}));

export const StyledInfoCard = styled(props => <InfoCard {...props} />)({
  position: 'relative',
  '& [class*=MuiPaper]': {
    borderRadius: 0,
    boxShadow: 'none',
  },
});

export const Positioner = styled('div')({
  position: 'absolute',
  right: 30,
  top: 20,
});

export const TaskLogStreamContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',

  '& > div > div': {
    minHeight: 200,
  },

  '& [class*=MuiLinearProgress]': {
    display: 'none',
  },
}));
