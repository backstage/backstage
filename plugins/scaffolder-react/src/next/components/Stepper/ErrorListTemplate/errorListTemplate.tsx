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
import { ErrorListProps, RJSFValidationError } from '@rjsf/utils';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import startCase from 'lodash/startCase';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    list: {
      width: '100%',
    },
    text: {
      textWrap: 'wrap',
    },
  }),
);

/**
 * Shows a list of errors found in the form
 *
 * @public
 */
export const ErrorListTemplate = ({ errors, schema }: ErrorListProps) => {
  const classes = useStyles();

  function formatErrorMessage(error: RJSFValidationError) {
    if (error.property && error.message) {
      const propertyName = error.property.startsWith('.')
        ? error.property.substring(1)
        : error.property;
      if (schema.properties && propertyName in schema.properties) {
        const property = schema.properties[propertyName];

        if (typeof property === 'object' && 'title' in property) {
          return `'${property.title}' ${error.message}`;
        }
      }
      // fall back to property name
      return `'${startCase(propertyName)}' ${error.message}`;
    }
    // fall back if property does not exist
    return error.stack;
  }

  return (
    <Paper>
      <List dense className={classes.list}>
        {errors.map((error, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <ErrorIcon color="error" />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.text }}
              primary={formatErrorMessage(error)}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
