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

import { Widget } from './types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import AddIcon from '@material-ui/icons/Add';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

interface AddWidgetDialogProps {
  widgets: Widget[];
  handleAdd: (widget: Widget) => void;
}

const getTitle = (widget: Widget) => {
  return widget.title || widget.name;
};

export const AddWidgetDialog = (props: AddWidgetDialogProps) => {
  const { widgets, handleAdd } = props;
  return (
    <>
      <DialogTitle>Add new widget to dashboard</DialogTitle>
      <DialogContent>
        <List dense>
          {widgets.map(widget => {
            return (
              <ListItem
                key={widget.name}
                button
                onClick={() => handleAdd(widget)}
              >
                <ListItemAvatar>
                  <AddIcon />
                </ListItemAvatar>
                <ListItemText
                  secondary={
                    widget.description && (
                      <Typography
                        component="span"
                        variant="caption"
                        color="textPrimary"
                      >
                        {widget.description}
                      </Typography>
                    )
                  }
                  primary={
                    <Typography variant="body1" color="textPrimary">
                      {getTitle(widget)}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </>
  );
};
