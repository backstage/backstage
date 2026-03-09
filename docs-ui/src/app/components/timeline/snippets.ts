export const timelineUsageSnippet = `import { Timeline, TimelineItem } from '@backstage/ui';

function MyComponent() {
  return (
    <Timeline>
      <TimelineItem
        heading="Event title"
        description="Event description"
        timestamp="Jan 1, 2024"
      />
      <TimelineItem
        heading="Another event"
        description="More details"
        timestamp="Jan 2, 2024"
      />
    </Timeline>
  );
}`;

export const basicSnippet = `<Timeline>
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
</Timeline>`;

export const withIconsSnippet = `<Timeline>
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
</Timeline>`;

export const withoutTimestampsSnippet = `<Timeline>
  <TimelineItem
    heading="Design phase"
    description="Create mockups and user flow diagrams"
  />
  <TimelineItem
    heading="Development"
    description="Implement features and write tests"
  />
  <TimelineItem
    heading="Testing"
    description="QA testing and bug fixes"
  />
  <TimelineItem
    heading="Deployment"
    description="Deploy to production environment"
  />
</Timeline>`;

export const detailedEventsSnippet = `<Timeline>
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
    heading="Deployment successful"
    description="Application is live and serving traffic. Health checks passing."
    timestamp="2024-03-04 14:38:20 UTC"
    icon="🎉"
  />
</Timeline>`;
