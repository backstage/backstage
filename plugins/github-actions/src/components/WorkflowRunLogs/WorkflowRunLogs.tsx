/*
 * Copyright 2020 Spotify AB
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

import { 
    LinearProgress,
    ExpansionPanel,
    Typography,
    makeStyles,
    Theme,
    ExpansionPanelSummary,
} from '@material-ui/core';

import React, {Suspense} from 'react';
import { useEntityCompoundName } from '@backstage/plugin-catalog';
import { useDownloadWorkflowRunLogs } from './useDownloadWorkflowRunLogs';
import LinePart from 'react-lazylog/build/LinePart';
import { useProjectName } from '../useProjectName';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const LazyLog = React.lazy(() => import('react-lazylog/build/LazyLog'));

const useStyles = makeStyles<Theme>(() => ({
    button: {
      order: -1,
      marginRight: 0,
      marginLeft: '-20px',
    },
  }));

const DisplayLog = (jobLogs: any) =>{
    return(
        <Suspense fallback={<LinearProgress />}>
            <div style={{ height: '50vh', width: '100%' }}>
                <LazyLog 
                text={jobLogs.jobLogs ?? "No Values Found"} 
                extraLines={1} 
                caseInsensitive
                enableSearch
                formatPart={(line) => {
                    if(line.toLocaleLowerCase().includes("error") 
                    || line.toLocaleLowerCase().includes("failed")
                    || line.toLocaleLowerCase().includes("failure"))
                    {
                        return <LinePart style={{color: 'red'}} part={{text: line}}/>
                    }
                    return line;
                }}
                />
            </div>
        </Suspense>
    )
}

/**
 * A component for Run Logs visualization.
 */
export const WorkflowRunLogs = ({runId}:{runId: string}) => {
  const classes = useStyles();
  let entityCompoundName = useEntityCompoundName();
  if (!entityCompoundName.name) {
    // TODO(shmidt-i): remove when is fully integrated
    // into the entity view
    entityCompoundName = {
      kind: 'Component',
      name: 'backstage',
      namespace: 'default',
    };
  }
  const projectName = useProjectName(entityCompoundName);

  const [owner, repo] = projectName.value ? projectName.value.split('/') : [];
  const jobLogs = useDownloadWorkflowRunLogs(repo, owner, runId);
  
  return (
    <ExpansionPanel
    TransitionProps={{ unmountOnExit: true }}
    >
        <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${name}-content`}
        id={`panel-${name}-header`}
        IconButtonProps={{
            className: classes.button,
        }}
        >
            <Typography variant="button">
            {jobLogs.value === null ? "No Logs to Display" : "Job Log"}
            </Typography>
        </ExpansionPanelSummary>
        {jobLogs.value && <DisplayLog jobLogs={jobLogs.value || undefined}/>}
    </ExpansionPanel>
  );
};
