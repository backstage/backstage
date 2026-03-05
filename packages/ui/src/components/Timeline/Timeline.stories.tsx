/*
 * Copyright 2026 The Backstage Authors
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

import preview from '../../../../../.storybook/preview';
import { Timeline, TimelineItem } from './Timeline';

const meta = preview.meta({
  title: 'Components/Timeline',
  component: Timeline,
});

export default meta;

export const Basic = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        title="Project created"
        description="The project repository was initialized"
        timestamp="Jan 15, 2024"
      />
      <TimelineItem
        title="First commit"
        description="Added initial project structure and configuration"
        timestamp="Jan 16, 2024"
      />
      <TimelineItem
        title="Feature branch merged"
        description="Merged authentication feature into main branch"
        timestamp="Jan 20, 2024"
      />
      <TimelineItem
        title="Released v1.0.0"
        description="First stable release with core features"
        timestamp="Feb 1, 2024"
        isLast
      />
    </Timeline>
  ),
});

export const WithIcons = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        title="Issue opened"
        description="Bug report: Login page not responsive on mobile"
        timestamp="2 hours ago"
        icon="🐛"
      />
      <TimelineItem
        title="Comment added"
        description="Developer assigned to investigate the issue"
        timestamp="1 hour ago"
        icon="💬"
      />
      <TimelineItem
        title="Pull request created"
        description="Fix mobile responsiveness for login page"
        timestamp="30 minutes ago"
        icon="🔧"
      />
      <TimelineItem
        title="Merged"
        description="Changes merged and deployed to production"
        timestamp="Just now"
        icon="✅"
        isLast
      />
    </Timeline>
  ),
});

export const SimplifiedTimeline = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        title="Order placed"
        timestamp="March 1, 2024 at 10:30 AM"
      />
      <TimelineItem
        title="Payment confirmed"
        timestamp="March 1, 2024 at 10:31 AM"
      />
      <TimelineItem
        title="Order shipped"
        timestamp="March 2, 2024 at 2:15 PM"
      />
      <TimelineItem
        title="Out for delivery"
        timestamp="March 4, 2024 at 8:00 AM"
      />
      <TimelineItem
        title="Delivered"
        timestamp="March 4, 2024 at 3:45 PM"
        isLast
      />
    </Timeline>
  ),
});

export const WithoutTimestamps = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        title="Design phase"
        description="Create mockups and user flow diagrams"
      />
      <TimelineItem
        title="Development"
        description="Implement features and write tests"
      />
      <TimelineItem title="Testing" description="QA testing and bug fixes" />
      <TimelineItem
        title="Deployment"
        description="Deploy to production environment"
        isLast
      />
    </Timeline>
  ),
});

export const SingleItem = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        title="Account created"
        description="Welcome to Backstage! Your account was successfully created."
        timestamp="Today at 9:00 AM"
        icon="🎉"
        isLast
      />
    </Timeline>
  ),
});

export const DetailedEvents = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        title="Deployment started"
        description="Starting deployment to production environment. Build #1234 initiated by john.doe@example.com"
        timestamp="2024-03-04 14:30:00 UTC"
        icon="🚀"
      />
      <TimelineItem
        title="Tests passed"
        description="All 247 tests passed successfully. Code coverage: 94.2%"
        timestamp="2024-03-04 14:32:15 UTC"
        icon="✅"
      />
      <TimelineItem
        title="Docker image built"
        description="Container image built and pushed to registry: app:v1.2.3"
        timestamp="2024-03-04 14:35:42 UTC"
        icon="🐳"
      />
      <TimelineItem
        title="Kubernetes deployment updated"
        description="Rolling update completed. 5 pods running with new version"
        timestamp="2024-03-04 14:38:20 UTC"
        icon="☸️"
      />
      <TimelineItem
        title="Deployment successful"
        description="Application is live and serving traffic. Health checks passing."
        timestamp="2024-03-04 14:40:00 UTC"
        icon="🎉"
        isLast
      />
    </Timeline>
  ),
});
