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
import { useApi } from '@backstage/core-plugin-api';
import { searchApiRef, useSearch } from '@backstage/plugin-search-react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import AllIcon from '@material-ui/icons/FontDownload';
import useAsync from 'react-use/esm/useAsync';

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.primary,
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
  showCounts?: boolean;
};

export const SearchTypeAccordion = (props: SearchTypeAccordionProps) => {
  const classes = useStyles();
  const { filters, setPageCursor, setTypes, term, types } = useSearch();
  const searchApi = useApi(searchApiRef);
  const [expanded, setExpanded] = useState(true);
  const { defaultValue, name, showCounts, types: givenTypes } = props;

  const toggleExpanded = () => setExpanded(prevState => !prevState);
  const handleClick = (type: string) => {
    return () => {
      setTypes(type !== '' ? [type] : []);
      setPageCursor(undefined);
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

  const { value: resultCounts } = useAsync(async () => {
    if (!showCounts) {
      return {};
    }

    const counts = await Promise.all(
      definedTypes
        .map(t => t.value)
        .map(async type => {
          const { numberOfResults } = await searchApi.query({
            term,
            types: type ? [type] : [],
            filters:
              types.includes(type) || (!types.length && !type) ? filters : {},
            pageLimit: 0,
          });

          return [
            type,
            numberOfResults !== undefined
              ? `${
                  numberOfResults >= 10000 ? `>10000` : numberOfResults
                } results`
              : ' -- ',
          ];
        }),
    );

    return Object.fromEntries(counts);
  }, [filters, showCounts, term, types]);

  return (
    <Box>
      <Typography variant="body2" component="h3">
        {name}
      </Typography>
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
                  <ListItemText
                    primary={type.name}
                    secondary={resultCounts && resultCounts[type.value]}
                  />
                </ListItem>
              </Fragment>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
