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
import {
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  Typography,
  AccordionDetails,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles((theme: BackstageTheme) =>
  createStyles({
    heading: {
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      color: theme.palette.text.secondary,
    },
  }),
);

interface AccordionProps {
  id: string;
  heading: string;
  secondaryHeading?: string | number;
  disabled?: boolean;
  unmountOnExit?: boolean;
}

export const Accordion = (props: PropsWithChildren<AccordionProps>) => {
  const classes = useStyles();

  return (
    <MuiAccordion
      disabled={props.disabled}
      TransitionProps={{ unmountOnExit: props.unmountOnExit ?? false }}
    >
      <MuiAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${props.id}-content`}
        id={`${props.id}-header`}
      >
        <Typography className={classes.heading}>{props.heading}</Typography>
        <Typography className={classes.secondaryHeading}>
          {props.secondaryHeading}
        </Typography>
      </MuiAccordionSummary>
      <AccordionDetails>{props.children}</AccordionDetails>
    </MuiAccordion>
  );
};
