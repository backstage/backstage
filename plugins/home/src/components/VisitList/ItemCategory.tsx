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

import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import { Visit } from '../../api/VisitsApi';
import { useVisitDisplay } from './Context';

const useStyles = makeStyles(theme => ({
  chip: {
    color: theme.palette.common.white,
    fontWeight: 'bold',
    margin: 0,
  },
}));

export const ItemCategory = ({ visit }: { visit: Visit }) => {
  const classes = useStyles();
  const { getChipColor, getLabel } = useVisitDisplay();

  return (
    <Chip
      size="small"
      className={classes.chip}
      label={getLabel(visit)}
      style={{ background: getChipColor(visit) }}
    />
  );
};
