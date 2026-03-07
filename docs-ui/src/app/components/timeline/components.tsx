'use client';

import { Timeline, TimelineItem } from '@backstage/ui';

export function Basic() {
  return (
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
      />
    </Timeline>
  );
}

export function WithIcons() {
  return (
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
      />
    </Timeline>
  );
}

export function WithoutTimestamps() {
  return (
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
      />
    </Timeline>
  );
}

export function DetailedEvents() {
  return (
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
        title="Deployment successful"
        description="Application is live and serving traffic. Health checks passing."
        timestamp="2024-03-04 14:38:20 UTC"
        icon="🎉"
      />
    </Timeline>
  );
}
