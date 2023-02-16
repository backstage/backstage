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
import useAsync from 'react-use/lib/useAsync';
import { Link, Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
  List,
  ListItemText,
  Collapse,
  ListItem,
  ListItemSecondaryAction,
  ListItemIcon,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import { Action, Pack, stackstormApiRef } from '../../api';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  actions: {
    borderBottom: `2px solid ${theme.palette.divider}`,
  },
  nested: {
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(4),
  },
  icon: {
    minWidth: '34px',
  },
}));

type ActionItemsProps = {
  pack: Pack;
};

export const ActionItems = ({ pack }: ActionItemsProps) => {
  const classes = useStyles();
  const st2 = useApi(stackstormApiRef);

  const { value, loading, error } = useAsync(async (): Promise<Action[]> => {
    const data = await st2.getActions(pack.ref);
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <List component="div" disablePadding className={classes.actions}>
      {(value || []).map(a => {
        return (
          <ListItem
            key={a.ref}
            component={Link}
            to={st2.getActionUrl(a.ref)}
            className={classes.nested}
            underline="none"
            color="inherit"
            button
          >
            <ListItemText primary={a.name} secondary={a.description} />
            <ListItemSecondaryAction>{a.runner_type}</ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};

type PackListItemProps = {
  pack: Pack;
  opened: boolean;
  onClick: (ref: string) => any;
};

export const PackListItem = ({ pack, opened, onClick }: PackListItemProps) => {
  const classes = useStyles();

  return (
    <>
      <ListItem button onClick={() => onClick(pack.ref)}>
        <ListItemIcon className={classes.icon}>
          {opened ? <ExpandLess /> : <ExpandMore />}
        </ListItemIcon>
        <ListItemText primary={pack.ref} secondary={pack.description} />
        <ListItemSecondaryAction>
          version: {pack.version}
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={opened} timeout="auto" unmountOnExit>
        <ActionItems pack={pack} />
      </Collapse>
    </>
  );
};

export const ActionsList = () => {
  const st2 = useApi(stackstormApiRef);

  const classes = useStyles();
  const [expanded, setExpanded] = useState<string[]>([]);

  const onClick = (ref: string) => {
    setExpanded(refs =>
      refs.includes(ref) ? refs.filter(r => r !== ref) : refs.concat(ref),
    );
  };

  const { value, loading, error } = useAsync(async (): Promise<Pack[]> => {
    const data = await st2.getPacks();
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      {(value || []).map(p => {
        return (
          <PackListItem
            key={p.ref}
            pack={p}
            opened={expanded.includes(p.ref)}
            onClick={onClick}
          />
        );
      })}
    </List>
  );
};
