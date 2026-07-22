/*
 * Copyright 2026 The Backstage Authors
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
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
} from '@material-ui/core';

export const CloseButton = styled(props => (
  <IconButton aria-label="close" {...props} />
))(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.text.primary,
}));

export const StyledSpan = styled('span')({
  textDecoration: 'underline',
  fontWeight: 'bold',
});

export const StyledDialogContent = styled(DialogContent)({
  paddingBottom: 24,
});

export const StyledDialogTitle = styled(DialogTitle)({
  '&>h2': {
    fontSize: 32,
  },
});
