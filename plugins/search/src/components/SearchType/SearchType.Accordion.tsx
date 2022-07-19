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

import React, { cloneElement, Fragment, useEffect, useState } from 'react';
import { useSearch } from '@backstage/plugin-search-react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AllIcon from '@material-ui/icons/FontDownload';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: 'rgba(0, 0, 0, .11)',
  },
  cardContent: {
    paddingTop: theme.spacing(1),
  },
  icon: {
    color: theme.palette.common.black,
  },
  list: {
    width: '100%',
  },
  listItemIcon: {
    width: '24px',
    height: '24px',
  },
  accordion: {
    backgroundColor: theme.palette.background.paper,
  },
  accordionSummary: {
    minHeight: 'auto',
    '&.Mui-expanded': {
      minHeight: 'auto',
    },
  },
  accordionSummaryContent: {
    margin: theme.spacing(2, 0),
    '&.Mui-expanded': {
      margin: theme.spacing(2, 0),
    },
  },
  accordionDetails: {
    padding: theme.spacing(0, 0, 1),
  },
}));

/**
 * @public
 */
export type SearchTypeAccordionProps = {
  name: string;
  types: Array<{
    value: string;
    name: string;
    icon: JSX.Element;
  }>;
  defaultValue?: string;
};

export const SearchTypeAccordion = (props: SearchTypeAccordionProps) => {
  const classes = useStyles();
  const { setPageCursor, setTypes, types } = useSearch();
  const [expanded, setExpanded] = useState(true);
  const { defaultValue, name, types: givenTypes } = props;

  const toggleExpanded = () => setExpanded(prevState => !prevState);
  const handleClick = (type: string) => {
    return () => {
      setTypes(type !== '' ? [type] : []);
      setPageCursor(undefined);
      setExpanded(false);
    };
  };

  // Handle any provided defaultValue
  useEffect(() => {
    if (defaultValue) {
      setTypes([defaultValue]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const definedTypes = [
    {
      value: '',
      name: 'All',
      icon: <AllIcon />,
    },
    ...givenTypes,
  ];
  const selected = types[0] || '';

  return (
    <Card className={classes.card}>
      <CardHeader title={name} titleTypographyProps={{ variant: 'overline' }} />
      <CardContent className={classes.cardContent}>
        <Accordion
          className={classes.accordion}
          expanded={expanded}
          onChange={toggleExpanded}
        >
          <AccordionSummary
            classes={{
              root: classes.accordionSummary,
              content: classes.accordionSummaryContent,
            }}
            expandIcon={<ExpandMoreIcon className={classes.icon} />}
            IconButtonProps={{ size: 'small' }}
          >
            {expanded
              ? 'Collapse'
              : definedTypes.filter(t => t.value === selected)[0]!.name}
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.accordionDetails }}>
            <List
              className={classes.list}
              component="nav"
              aria-label="filter by type"
              disablePadding
              dense
            >
              {definedTypes.map(type => (
                <Fragment key={type.value}>
                  <Divider />
                  <ListItem
                    selected={
                      types[0] === type.value ||
                      (types.length === 0 && type.value === '')
                    }
                    onClick={handleClick(type.value)}
                    button
                  >
                    <ListItemIcon>
                      {cloneElement(type.icon, {
                        className: classes.listItemIcon,
                      })}
                    </ListItemIcon>
                    <ListItemText primary={type.name} />
                  </ListItem>
                </Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};
