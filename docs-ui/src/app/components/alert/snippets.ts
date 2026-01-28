export const alertUsageSnippet = `import { Alert } from '@backstage/ui';

<Alert status="info" title="This is an informational message" />`;

export const defaultSnippet = `<Alert status="info" icon={true} title="This is an alert message" />`;

export const statusVariantsSnippet = `<Flex direction="column" gap="4">
  <Alert
    status="info"
    icon={true}
    title="This is an informational alert with helpful information."
  />
  <Alert
    status="success"
    icon={true}
    title="Your changes have been saved successfully."
  />
  <Alert
    status="warning"
    icon={true}
    title="This action may have unintended consequences."
  />
  <Alert
    status="danger"
    icon={true}
    title="An error occurred while processing your request."
  />
</Flex>`;

export const withDescriptionSnippet = `<Flex direction="column" gap="4">
  <Alert
    status="info"
    icon={true}
    title="New Feature Available"
    description="We've added support for custom table columns. Check the documentation to learn more."
  />
  <Alert
    status="success"
    icon={true}
    title="Deployment Successful"
    description="Your application has been deployed to production. All health checks passed."
  />
  <Alert
    status="warning"
    icon={true}
    title="Pending Review"
    description="Please review the following items before proceeding with the deployment."
  />
  <Alert
    status="danger"
    icon={true}
    title="Authentication Failed"
    description="Unable to verify your credentials. Please check your username and password and try again."
  />
</Flex>`;

export const withActionsSnippet = `<Flex direction="column" gap="4">
  <Alert
    status="info"
    icon={true}
    title="This alert has a dismiss action on the right."
    customActions={
      <Button size="small" variant="tertiary">
        Dismiss
      </Button>
    }
  />
  <Alert
    status="success"
    icon={true}
    title="Your changes have been saved. Would you like to continue?"
    customActions={
      <ButtonIcon
        size="small"
        variant="tertiary"
        icon={<RiCloseLine />}
        aria-label="Close"
      />
    }
  />
</Flex>`;

export const withActionsAndDescriptionsSnippet = `<Alert
  status="warning"
  icon={true}
  title="Update Available"
  description="A new version of the application is ready to install. This will require a brief restart."
  customActions={
    <>
      <Button size="small" variant="tertiary">
        Later
      </Button>
      <Button size="small" variant="primary">
        Update Now
      </Button>
    </>
  }
/>`;

export const loadingStatesSnippet = `<Flex direction="column" gap="4">
  <Alert status="info" icon={true} loading title="Processing your request..." />
  <Alert status="success" icon={true} loading title="Saving changes..." />
  <Alert
    status="info"
    icon={true}
    loading
    title="Processing your request"
    description="This may take a few moments. Please do not close this window."
  />
</Flex>`;

export const withoutIconsSnippet = `<Flex direction="column" gap="4">
  <Alert
    status="info"
    icon={false}
    title="This is an informational alert without an icon."
  />
  <Alert
    status="success"
    icon={false}
    title="Your changes have been saved successfully."
  />
</Flex>`;

export const customIconSnippet = `import { RiCloudLine } from '@remixicon/react';

<Alert
  status="info"
  icon={<RiCloudLine />}
  title="This alert uses a custom cloud icon instead of the default info icon."
/>`;
