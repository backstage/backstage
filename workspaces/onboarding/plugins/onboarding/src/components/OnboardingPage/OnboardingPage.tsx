/*
 * Copyright 2026 Estehsan Tariq
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

import { useCallback, useEffect, useMemo, useState, ChangeEvent } from 'react';
import {
  Page,
  Header,
  Content,
  ResponseErrorPanel,
  Progress,
} from '@backstage/core-components';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { onboardingApiRef } from '../../api/OnboardingApi';
import {
  OnboardingProgress,
  OnboardingTemplate,
  TaskStatus,
} from '../../types';
import { ProgressBar } from '../ProgressBar';
import { TaskList } from '../TaskList';
import { TeamView } from '../TeamView/TeamView';
import { TemplatesView } from '../TemplatesView/TemplatesView';
import { useAutomatedTask } from '../../hooks/useAutomatedTask';

const useStyles = makeStyles({
  tabPanel: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

/** @public */
export function OnboardingPage() {
  const classes = useStyles();
  const [tab, setTab] = useState('tasks');
  const onboardingApi = useApi(onboardingApiRef);
  const identityApi = useApi(identityApiRef);

  const [progress, setProgress] = useState<OnboardingProgress | undefined>();
  const [templates, setTemplates] = useState<OnboardingTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [userId, setUserId] = useState<string>('');

  const reloadProgress = useCallback(async () => {
    if (!userId) return;
    try {
      const updated = await onboardingApi
        .getProgress(userId)
        .catch(() => undefined);
      setProgress(updated);
    } catch {
      // ignore
    }
  }, [onboardingApi, userId]);

  const { triggerAutomatedTask } = useAutomatedTask({
    userId,
    onProgressUpdate: reloadProgress,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const identity = await identityApi.getBackstageIdentity();
        const userEntityRef = identity.userEntityRef;
        setUserId(userEntityRef);

        const [progressData, templateData] = await Promise.all([
          onboardingApi.getProgress(userEntityRef).catch(() => undefined),
          onboardingApi.getTemplates().catch(() => []),
        ]);

        if (!cancelled) {
          setProgress(progressData);
          setTemplates(templateData);
          setError(undefined);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [identityApi, onboardingApi]);

  const currentTemplate = useMemo(
    () => templates.find(t => t.metadata.name === progress?.templateName),
    [templates, progress?.templateName],
  );

  const handleToggle = useCallback(
    async (taskId: string) => {
      if (!progress || !currentTemplate) return;

      const taskProgress = progress.tasks.find(t => t.taskId === taskId);
      const allTasks = currentTemplate.spec.phases.flatMap(p => p.tasks);
      const taskDef = allTasks.find(t => t.id === taskId);

      // If it's an automated task that hasn't been started, trigger via scaffolder
      if (
        taskDef?.type === 'automated' &&
        taskDef.automationRef &&
        taskProgress?.status !== 'done' &&
        taskProgress?.status !== 'in-progress'
      ) {
        await triggerAutomatedTask(taskId, taskDef.automationRef);
        return;
      }

      const newStatus: TaskStatus =
        taskProgress?.status === 'done' ? 'pending' : 'done';

      try {
        const updated = await onboardingApi.updateTaskStatus(
          userId,
          taskId,
          newStatus,
        );
        setProgress(updated);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      }
    },
    [onboardingApi, progress, userId, currentTemplate, triggerAutomatedTask],
  );

  const handleTabChange = useCallback(
    (_event: ChangeEvent<{}>, newValue: string) => {
      setTab(newValue);
    },
    [],
  );

  if (loading) {
    return (
      <Page themeId="tool">
        <Header
          title="Developer Onboarding"
          subtitle="Your onboarding checklist"
        />
        <Content>
          <Progress />
        </Content>
      </Page>
    );
  }

  if (error) {
    return (
      <Page themeId="tool">
        <Header
          title="Developer Onboarding"
          subtitle="Your onboarding checklist"
        />
        <Content>
          <ResponseErrorPanel error={error} />
        </Content>
      </Page>
    );
  }

  const completedCount =
    progress?.tasks.filter(t => t.status === 'done').length ?? 0;
  const totalCount = progress?.tasks.length ?? 0;

  return (
    <Page themeId="tool">
      <Header
        title="Developer Onboarding"
        subtitle="Your onboarding checklist"
      />
      <Content>
        <TabContext value={tab}>
          <TabList onChange={handleTabChange} indicatorColor="primary">
            <Tab label="My Tasks" value="tasks" />
            <Tab label="Team View" value="team" />
            <Tab label="Templates" value="templates" />
          </TabList>

          <TabPanel value="tasks" className={classes.tabPanel}>
            {progress && currentTemplate ? (
              <>
                <ProgressBar completed={completedCount} total={totalCount} />
                <TaskList
                  phases={currentTemplate.spec.phases}
                  progress={progress}
                  onToggle={handleToggle}
                />
              </>
            ) : (
              <div>
                No onboarding checklist assigned yet. Ask your manager to assign
                a template from the Templates tab.
              </div>
            )}
          </TabPanel>

          <TabPanel value="team" className={classes.tabPanel}>
            <TeamView onboardingApi={onboardingApi} />
          </TabPanel>

          <TabPanel value="templates" className={classes.tabPanel}>
            <TemplatesView
              templates={templates}
              onboardingApi={onboardingApi}
            />
          </TabPanel>
        </TabContext>
      </Content>
    </Page>
  );
}
