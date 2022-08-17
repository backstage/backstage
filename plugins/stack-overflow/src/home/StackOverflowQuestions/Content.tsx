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

import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
} from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import useAsync from 'react-use/lib/useAsync';
import qs from 'qs';
import React from 'react';
import {
  StackOverflowQuestion,
  StackOverflowQuestionsContentProps,
} from '../../types';

/**
 * A component to display a list of stack overflow questions on the homepage.
 *
 * @public
 */

export const Content = (props: StackOverflowQuestionsContentProps) => {
  const { requestParams } = props;
  const configApi = useApi(configApiRef);
  const baseUrl =
    configApi.getOptionalString('stackoverflow.baseUrl') ||
    'https://api.stackexchange.com/2.2';

  const { value, loading, error } = useAsync(async (): Promise<
    StackOverflowQuestion[]
  > => {
    const params = qs.stringify(requestParams, { addQueryPrefix: true });
    const response = await fetch(`${baseUrl}/questions${params}`);
    const data = await response.json();
    return data.items;
  }, []);

  if (loading) {
    return <p>loading...</p>;
  }

  if (error || !value || !value.length) {
    return <p>could not load questions</p>;
  }

  const getSecondaryText = (answer_count: Number) =>
    answer_count > 1 ? `${answer_count} answers` : `${answer_count} answer`;

  return (
    <List>
      {value.map(question => (
        <Link to={question.link}>
          <ListItem key={question.link}>
            {props.icon && <ListItemIcon>{props.icon}</ListItemIcon>}
            <ListItemText
              primary={question.title}
              secondary={getSecondaryText(question.answer_count)}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="external-link">
                <OpenInNewIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </Link>
      ))}
    </List>
  );
};
