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
import React, { useState } from 'react';
import { ValidateEntityResponse } from '@backstage/catalog-client';
import { useApp } from '@backstage/core-plugin-api';
import {
  Collapse,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
} from '@material-ui/core';
import { humanizeEntityRef } from '@backstage/plugin-catalog-react';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MarkdownContent } from '@backstage/core-components';
import { ValidationOutputOk } from '../../types';
import SvgIcon from '@material-ui/core/SvgIcon';

const useStyles = makeStyles(theme => ({
  validationOk: {
    color: theme.palette.success.main,
  },
  validationNotOk: {
    color: theme.palette.error.main,
  },
  errorContainer: {
    color: theme.palette.error.main,
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
}));

type EntityResultProps = {
  isFirstError?: boolean;
  item: ValidationOutputOk;
};

export const EntityResult = ({
  isFirstError = false,
  item,
}: EntityResultProps) => {
  const classes = useStyles();
  const app = useApp();
  const [expanded, setExpanded] = useState(isFirstError);

  const Icon = app.getSystemIcon(
    `kind:${item.entity.kind.toLocaleLowerCase('en-US')}`,
  ) as typeof SvgIcon;

  const fetchErrorMessages = (response: ValidateEntityResponse) => {
    if (!response.valid) {
      return response.errors.map(err => err.message).join('\n\n');
    }
    return '';
  };

  return (
    <>
      <ListItem key={humanizeEntityRef(item.entity)}>
        <ListItemIcon>
          {Icon && (
            <Icon
              className={
                item.response.valid
                  ? classes.validationOk
                  : classes.validationNotOk
              }
            />
          )}
        </ListItemIcon>
        <ListItemText
          primary={humanizeEntityRef(item.entity)}
          onClick={() => setExpanded(!expanded)}
        />
        {!item.response.valid && (
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      {!item.response.valid && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper className={classes.errorContainer}>
            <MarkdownContent content={fetchErrorMessages(item.response)} />
          </Paper>
        </Collapse>
      )}
    </>
  );
};
