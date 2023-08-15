/*
 * Copyright 2020 The Backstage Authors
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

import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core/styles';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';
import { buildSchema } from 'graphql';
import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';

const useStyles = makeStyles<BackstageTheme>(() => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  graphiQlWrapper: {
    flex: 1,
    '@global': {
      '.graphiql-container': {
        boxSizing: 'initial',
        height: '100%',
        minHeight: '600px',
        flex: '1 1 auto',
      },
    },
  },
  hints: {
    marginTop: '10px',
    backgroundColor: '#fcf7ed',
    width: '100%',
    padding: '5px',
  },
}));

type Props = {
  definition: string;
};

export const GraphQlDefinition = ({ definition }: Props) => {
  const classes = useStyles();
  const { entity } = useEntity();
  const schema = buildSchema(definition);

  const url = entity.metadata.annotations?.['backstage.io/api-graphql-url'];

  return (
    <div className={classes.root}>
      <div className={classes.graphiQlWrapper}>
        <GraphiQL
          fetcher={
            url
              ? async (params: any, options: any = {}) => {
                  const body = JSON.stringify(params);
                  const headers = {
                    'Content-Type': 'application/json',
                    ...options.headers,
                  };

                  const res = await fetch(url!, {
                    method: 'POST',
                    headers,
                    body,
                  });
                  return res.json();
                }
              : () => Promise.resolve(null) as any
          }
          schema={schema}
          docExplorerOpen
          defaultSecondaryEditorOpen={false}
          headerEditorEnabled
        />
        {url ? (
          <div />
        ) : (
          <div className={classes.hints}>
            <strong>Note</strong>: Please specify "backstage.io/api-graphql-url"
            in your entity's annotation to try this API.
          </div>
        )}
      </div>
    </div>
  );
};
