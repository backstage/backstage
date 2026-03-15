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
import {
  Alert,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Container,
  Flex,
  FullPage,
  Text,
  VisuallyHidden,
} from '@backstage/ui';
import {
  RiAppsLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
} from '@remixicon/react';
import { useConsentSession } from './useConsentSession';
import {
  configApiRef,
  useApi,
  useParams,
} from '@backstage/frontend-plugin-api';
import styles from './ConsentPage.module.css';

const ConsentPageLayout = ({ children }: { children: React.ReactNode }) => (
  <FullPage>
    <VisuallyHidden>
      <h1>Authorization</h1>
    </VisuallyHidden>
    <Container py="8">{children}</Container>
  </FullPage>
);

export const ConsentPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { state, handleAction } = useConsentSession({ sessionId });
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptionalString('app.title') ?? 'Backstage';

  if (!sessionId) {
    return (
      <ConsentPageLayout>
        <Alert
          status="info"
          icon
          title="Invalid Request"
          description="The consent request ID is missing or invalid."
        />
      </ConsentPageLayout>
    );
  }

  if (state.status === 'loading') {
    return (
      <ConsentPageLayout>
        <Alert loading title="Loading authorization request..." />
      </ConsentPageLayout>
    );
  }

  if (state.status === 'error') {
    return (
      <ConsentPageLayout>
        <Alert
          status="danger"
          icon
          title="Authorization Error"
          description={state.error}
        />
      </ConsentPageLayout>
    );
  }

  if (state.status === 'completed') {
    return (
      <ConsentPageLayout>
        <Card className={styles.card}>
          <CardBody>
            <Flex
              direction="column"
              align="center"
              gap="2"
              style={{ textAlign: 'center' }}
            >
              {state.action === 'approve' ? (
                <RiCheckboxCircleLine
                  size={64}
                  className={styles.completedIconSuccess}
                />
              ) : (
                <RiCloseCircleLine
                  size={64}
                  className={styles.completedIconDanger}
                />
              )}
              <Text as="h2" variant="title-small">
                {state.action === 'approve'
                  ? 'Authorization Approved'
                  : 'Authorization Denied'}
              </Text>
              <Text variant="body-medium" color="secondary">
                {state.action === 'approve'
                  ? `You have successfully authorized the application to access your ${appTitle} account.`
                  : `You have denied the application access to your ${appTitle} account.`}
              </Text>
              <Text variant="body-small" color="secondary">
                Redirecting to the application...
              </Text>
            </Flex>
          </CardBody>
        </Card>
      </ConsentPageLayout>
    );
  }

  const session = state.session;
  const isSubmitting = state.status === 'submitting';
  const appName = session.clientName ?? session.clientId;

  return (
    <ConsentPageLayout>
      <Card className={styles.card}>
        <CardBody>
          <Flex direction="column" gap="4">
            <Box className={styles.appHeader}>
              <RiAppsLine size={40} className={styles.appIcon} />
              <Flex direction="column" gap="0.5">
                <Text as="span" variant="title-small" weight="bold">
                  {appName}
                </Text>
                <Text variant="body-small" color="secondary">
                  wants to access your {appTitle} account
                </Text>
              </Flex>
            </Box>

            <hr className={styles.divider} />

            <Alert
              status="warning"
              icon
              title="Security Notice"
              description={
                <>
                  By authorizing this application, you are granting it access to
                  your {appTitle} account. The application will receive an
                  access token that allows it to act on your behalf.
                  <div className={styles.callbackUrl}>
                    {session.redirectUri}
                  </div>
                </>
              }
            />

            <Text variant="body-small" color="secondary">
              Make sure you trust this application and recognize the callback
              URL above. Only authorize applications you trust.
            </Text>
          </Flex>
        </CardBody>

        <CardFooter>
          <Flex justify="between" gap="4">
            <Button
              variant="secondary"
              isDisabled={isSubmitting}
              onPress={() => handleAction('reject')}
              iconStart={<RiCloseCircleLine />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              isDisabled={isSubmitting}
              onPress={() => handleAction('approve')}
              iconStart={<RiCheckboxCircleLine />}
            >
              {isSubmitting ? 'Authorizing...' : 'Authorize'}
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    </ConsentPageLayout>
  );
};
