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

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { ReactNode } from 'react';

export type SubvalueCellClassKey = 'value' | 'subvalue';

const useSubvalueCellStyles = makeStyles(
  theme => ({
    value: {
      marginBottom: theme.spacing(0.75),
    },
    subvalue: {
      color: theme.palette.textSubtle,
      fontWeight: 'normal',
    },
  }),
  { name: 'BackstageSubvalueCell' },
);

type SubvalueCellProps = {
  value: ReactNode;
  subvalue: ReactNode;
};

export function SubvalueCell(props: SubvalueCellProps) {
  const { value, subvalue } = props;
  const classes = useSubvalueCellStyles();

  return (
    <>
      <Box className={classes.value}>{value}</Box>
      <Box className={classes.subvalue}>{subvalue}</Box>
    </>
  );
}
