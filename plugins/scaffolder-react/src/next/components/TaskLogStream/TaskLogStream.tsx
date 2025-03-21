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
import React from 'react';
import { LogViewer } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});

/**
 * The text of the event stream
 *
 * @alpha
 */
export const TaskLogStream = (props: { logs: { [k: string]: string[] } }) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <LogViewer
        text={Object.values(props.logs)
          .map(l => l.join('\n'))
          .filter(Boolean)
          .join('\n')}
      />
    </div>
  );
};
