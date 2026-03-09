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
  title: 'Backstage UI/Timeline',
  component: Timeline,
});

export default meta;

export const Basic = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        heading="Project created"
        description="The project repository was initialized"
        timestamp="Jan 15, 2024"
      />
      <TimelineItem
        heading="First commit"
        description="Added initial project structure and configuration"
        timestamp="Jan 16, 2024"
      />
      <TimelineItem
        heading="Feature branch merged"
        description="Merged authentication feature into main branch"
        timestamp="Jan 20, 2024"
      />
      <TimelineItem
        heading="Released v1.0.0"
        description="First stable release with core features"
        timestamp="Feb 1, 2024"
      />
    </Timeline>
  ),
});

export const WithIcons = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        heading="Issue opened"
        description="Bug report: Login page not responsive on mobile"
        timestamp="2 hours ago"
        icon="🐛"
      />
      <TimelineItem
        heading="Comment added"
        description="Developer assigned to investigate the issue"
        timestamp="1 hour ago"
        icon="💬"
      />
      <TimelineItem
        heading="Pull request created"
        description="Fix mobile responsiveness for login page"
        timestamp="30 minutes ago"
        icon="🔧"
      />
      <TimelineItem
        heading="Merged"
        description="Changes merged and deployed to production"
        timestamp="Just now"
        icon="✅"
      />
    </Timeline>
  ),
});

export const SimplifiedTimeline = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        heading="Order placed"
        timestamp="March 1, 2024 at 10:30 AM"
      />
      <TimelineItem
        heading="Payment confirmed"
        timestamp="March 1, 2024 at 10:31 AM"
      />
      <TimelineItem
        heading="Order shipped"
        timestamp="March 2, 2024 at 2:15 PM"
      />
      <TimelineItem
        heading="Out for delivery"
        timestamp="March 4, 2024 at 8:00 AM"
      />
      <TimelineItem heading="Delivered" timestamp="March 4, 2024 at 3:45 PM" />
    </Timeline>
  ),
});

export const WithoutTimestamps = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        heading="Design phase"
        description="Create mockups and user flow diagrams"
      />
      <TimelineItem
        heading="Development"
        description="Implement features and write tests"
      />
      <TimelineItem heading="Testing" description="QA testing and bug fixes" />
      <TimelineItem
        heading="Deployment"
        description="Deploy to production environment"
      />
    </Timeline>
  ),
});

export const SingleItem = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        heading="Account created"
        description="Welcome to Backstage! Your account was successfully created."
        timestamp="Today at 9:00 AM"
        icon="🎉"
      />
    </Timeline>
  ),
});

export const DetailedEvents = meta.story({
  render: () => (
    <Timeline>
      <TimelineItem
        heading="Deployment started"
        description="Starting deployment to production environment. Build #1234 initiated by john.doe@example.com"
        timestamp="2024-03-04 14:30:00 UTC"
        icon="🚀"
      />
      <TimelineItem
        heading="Tests passed"
        description="All 247 tests passed successfully. Code coverage: 94.2%"
        timestamp="2024-03-04 14:32:15 UTC"
        icon="✅"
      />
      <TimelineItem
        heading="Docker image built"
        description="Container image built and pushed to registry: app:v1.2.3"
        timestamp="2024-03-04 14:35:42 UTC"
        icon="🐳"
      />
      <TimelineItem
        heading="Kubernetes deployment updated"
        description="Rolling update completed. 5 pods running with new version"
        timestamp="2024-03-04 14:38:20 UTC"
        icon="☸️"
      />
      <TimelineItem
        heading="Deployment successful"
        description="Application is live and serving traffic. Health checks passing."
        timestamp="2024-03-04 14:40:00 UTC"
        icon="🎉"
      />
    </Timeline>
  ),
});
