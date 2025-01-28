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
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import { ChangeEvent, useCallback } from 'react';

export type Props = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

/** @public */
export type SwitchFilterClassKey = 'root';

const useStyles = makeStyles(
  {
    root: {
      width: '100%',
      maxWidth: 300,
    },
  },
  { name: 'PluginCatalogGraphSwitchFilter' },
);

export const SwitchFilter = ({ label, value, onChange }: Props) => {
  const classes = useStyles();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.checked);
    },
    [onChange],
  );

  return (
    <Box pb={1} pt={1}>
      <FormControlLabel
        control={
          <Switch
            checked={value}
            onChange={handleChange}
            name={label}
            color="primary"
          />
        }
        label={label}
        className={classes.root}
      />
    </Box>
  );
};
