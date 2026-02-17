'use client';

import { Alert } from '../../../../../packages/ui/src/components/Alert/Alert';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';
import { ButtonIcon } from '../../../../../packages/ui/src/components/ButtonIcon/ButtonIcon';
import { RiCloseLine, RiCloudLine } from '@remixicon/react';

export const Default = () => {
  return <Alert status="info" icon={true} title="This is an alert message" />;
};

export const StatusVariants = () => {
  return (
    <Flex direction="column" gap="4">
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
    </Flex>
  );
};

export const WithDescription = () => {
  return (
    <Flex direction="column" gap="4">
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
    </Flex>
  );
};

export const WithActions = () => {
  return (
    <Flex direction="column" gap="4">
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
    </Flex>
  );
};

export const WithActionsAndDescriptions = () => {
  return (
    <Alert
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
    />
  );
};

export const LoadingStates = () => {
  return (
    <Flex direction="column" gap="4">
      <Alert
        status="info"
        icon={true}
        loading
        title="Processing your request..."
      />
      <Alert status="success" icon={true} loading title="Saving changes..." />
      <Alert
        status="info"
        icon={true}
        loading
        title="Processing your request"
        description="This may take a few moments. Please do not close this window."
      />
    </Flex>
  );
};

export const WithoutIcons = () => {
  return (
    <Flex direction="column" gap="4">
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
    </Flex>
  );
};

export const CustomIcon = () => {
  return (
    <Alert
      status="info"
      icon={<RiCloudLine />}
      title="This alert uses a custom cloud icon instead of the default info icon."
    />
  );
};
