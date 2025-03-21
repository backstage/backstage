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

import { makeStyles } from '@material-ui/core/styles';
import {
  DocExplorer,
  EditorContextProvider,
  ExplorerContextProvider,
  SchemaContextProvider,
} from '@graphiql/react';
import 'graphiql/graphiql.css';
import { buildSchema } from 'graphql';
import React from 'react';

const useStyles = makeStyles({
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
      '.graphiql-sidebar': {
        width: '100%',
      },
    },
  },
});

type Props = {
  definition: string;
};

export const GraphQlDefinition = ({ definition }: Props) => {
  const classes = useStyles();
  const schema = buildSchema(definition);

  return (
    <div className={classes.root}>
      <div className={classes.graphiQlWrapper}>
        <EditorContextProvider>
          <SchemaContextProvider
            schema={schema}
            fetcher={() => Promise.resolve(null) as any}
          >
            <div className="graphiql-container">
              <div className="graphiql-sidebar">
                <div className="graphiql-sidebar-section">
                  <ExplorerContextProvider>
                    <DocExplorer />
                  </ExplorerContextProvider>
                </div>
              </div>
            </div>
          </SchemaContextProvider>
        </EditorContextProvider>
      </div>
    </div>
  );
};
