/*
 * Copyright 2025 The Backstage Authors
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
import { useEffect, useMemo } from 'react';
import {
  Content,
  ContentHeader,
  Header,
  Page,
} from '@backstage/core-components';
import { TasksContent } from '../TasksContent';

/**
 * TasksPage - Main page component for task management
 * Supports highlighting and scrolling to specific tasks via URL parameters.
 */
export const TasksPage = () => {
  // Extract highlighted task ID from URL parameters
  const highlightedTaskId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '');
    return params.get('taskId') || (hash ? hash : null);
  }, []);

  // Scroll to highlighted task when component mounts
  useEffect(() => {
    if (highlightedTaskId) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const element = document.getElementById(`task-${highlightedTaskId}`);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [highlightedTaskId]);

  return (
    <Page themeId="tool">
      <Header title="Tasks" subtitle="Manage and trigger tasks" />
      <Content>
        <ContentHeader title="Available Tasks" />
        <TasksContent highlightedTaskId={highlightedTaskId} />
      </Content>
    </Page>
  );
};
