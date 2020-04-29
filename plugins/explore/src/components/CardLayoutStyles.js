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

import { makeStyles } from '@material-ui/core/styles';

// Shared MUI styles for a grid-based Card layout
export const cardLayoutStyles = theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 296px)',
    gridGap: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardActions: {
    flexGrow: '1',
    alignItems: 'flex-end',
  },
});

export const useCardLayoutStyles = makeStyles(cardLayoutStyles);
