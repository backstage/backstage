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
import React, { useContext, useState } from 'react';

import {
  Checkbox,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Link } from '@backstage/core-components';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import { OnboardingContext } from '../context/OnboardingContext';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  arrow: {
    marginLeft: 'auto',
  },
  listDesc: {
    paddingLeft: theme.spacing(9),
  },
}));

type CheckListItemProps = {
  id: string;
  isDone: boolean;
  title: string;
  url?: string;
  description: string;
};

export const CheckListItem: React.FC<CheckListItemProps> = ({
  id,
  isDone,
  title,
  url,
  description,
}) => {
  const classes = useStyles();
  const { updateDataList } = useContext(OnboardingContext);

  const onCheck = () => {
    updateDataList(id, !!!isDone);
  };

  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <List key={id} component="div" disablePadding>
      <ListItem
        button
        key={id}
        role={undefined}
        dense
        onClick={() => setExpanded(!expanded)}
      >
        <ListItemIcon
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onCheck();
          }}
        >
          <Checkbox
            edge="start"
            checked={!!isDone}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <Typography>{url ? <Link to={url}>{title}</Link> : title}</Typography>
        <IconButton size="small" className={classes.arrow}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
      <Collapse in={expanded as any} timeout="auto" unmountOnExit>
        {expanded && (
          <List component="div" disablePadding>
            <ListItem className={classes.listDesc}>
              <ListItemText primary={description} />
            </ListItem>
          </List>
        )}
      </Collapse>
    </List>
  );
};
