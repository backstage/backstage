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

import React, {
  ChangeEvent,
  MouseEvent,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  withStyles,
  makeStyles,
  useTheme,
  Box,
  MenuItem,
  ListItemText,
  Slider,
  IconButton,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { BackstageTheme } from '@backstage/theme';
import { useShadowRootElements } from '@backstage/plugin-techdocs-react';

const boxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const StyledSlider = withStyles(theme => ({
  root: {
    height: 2,
    padding: '15px 0',
  },
  thumb: {
    height: 18,
    width: 18,
    backgroundColor: theme.palette.common.white,
    boxShadow: boxShadow,
    marginTop: -9,
    marginLeft: -9,
    '&:focus, &:hover, &$active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: boxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    top: '100%',
    left: '50%',
    transform: 'scale(1) translate(-50%, -5px) !important',
    '& *': {
      color: theme.palette.common.black,
      fontSize: theme.typography.caption.fontSize,
      background: 'transparent',
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
  },
  mark: {
    height: 10,
    width: 1,
    marginTop: -4,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
}))(Slider);

const settings = {
  key: 'techdocs.addons.settings.textsize',
  defaultValue: 100,
};

const marks = [
  {
    value: 90,
  },
  {
    value: 100,
  },
  {
    value: 115,
  },
  {
    value: 130,
  },
  {
    value: 150,
  },
];

const useStyles = makeStyles((theme: BackstageTheme) => ({
  container: {
    color: theme.palette.textSubtle,
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    minWidth: 200,
  },
  menuItem: {
    '&:hover': {
      background: 'transparent',
    },
  },
  decreaseButton: {
    marginRight: theme.spacing(1),
  },
  increaseButton: {
    marginLeft: theme.spacing(1),
  },
}));

export const TextSizeAddon = () => {
  const classes = useStyles();
  const theme = useTheme<BackstageTheme>();

  const [body] = useShadowRootElements(['body']);

  const [value, setValue] = useState<number>(() => {
    const initialValue = localStorage?.getItem(settings.key);
    return initialValue ? parseInt(initialValue, 10) : settings.defaultValue;
  });

  const values = useMemo(() => marks.map(mark => mark.value), []);
  const index = useMemo(() => values.indexOf(value), [values, value]);
  const min = useMemo(() => values[0], [values]);
  const max = useMemo(() => values[values.length - 1], [values]);

  const getValueText = useCallback(() => `${value}%`, [value]);

  const handleChangeCommitted = useCallback(
    (_event: ChangeEvent<{}>, newValue: number | number[]) => {
      if (!Array.isArray(newValue)) {
        setValue(newValue);
        localStorage?.setItem(settings.key, String(newValue));
      }
    },
    [setValue],
  );

  const handleDecreaseClick = useCallback(
    (event: MouseEvent) => {
      handleChangeCommitted(event, values[index - 1]);
    },
    [index, values, handleChangeCommitted],
  );

  const handleIncreaseClick = useCallback(
    (event: MouseEvent) => {
      handleChangeCommitted(event, values[index + 1]);
    },
    [index, values, handleChangeCommitted],
  );

  useEffect(() => {
    if (!body) return;
    const htmlFontSize =
      (
        theme.typography as BackstageTheme['typography'] & {
          htmlFontSize?: number;
        }
      )?.htmlFontSize ?? 16;
    body.style.setProperty(
      '--md-typeset-font-size',
      `${htmlFontSize * (value / 100)}px`,
    );
  }, [body, value, theme]);

  return (
    <MenuItem className={classes.menuItem} button disableRipple>
      <ListItemText
        primary={
          <Typography variant="subtitle2" color="textPrimary">
            Text size
          </Typography>
        }
        secondary={
          <Box className={classes.container}>
            <IconButton
              className={classes.decreaseButton}
              size="small"
              edge="start"
              disabled={value === min}
              onClick={handleDecreaseClick}
              aria-label="Decrease text size"
            >
              <RemoveIcon />
            </IconButton>
            <StyledSlider
              value={value}
              aria-labelledby="text-size-slider"
              getAriaValueText={getValueText}
              valueLabelDisplay="on"
              valueLabelFormat={getValueText}
              marks={marks}
              step={null}
              min={min}
              max={max}
              onChangeCommitted={handleChangeCommitted}
            />
            <IconButton
              className={classes.increaseButton}
              size="small"
              edge="end"
              disabled={value === max}
              onClick={handleIncreaseClick}
              aria-label="Increase text size"
            >
              <AddIcon />
            </IconButton>
          </Box>
        }
        disableTypography
      />
    </MenuItem>
  );
};
