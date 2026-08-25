# @backstage/plugin-notifications-backend-module-email

Adds support for sending Backstage notifications as emails to users.

Supports sending emails using `SMTP`, `SES`, `azure`, `sendmail`, or `stream` (for debugging purposes).

## Customizing email content

The email content can be customized with the `notificationsEmailTemplateExtensionPoint`. When you create
this extension, you can set the custom `NotificationTemplateRenderer` to the module. To modify the contents,
override the `getSubject`, `getHtml` and `getText` methods.

```ts
import { notificationsEmailTemplateExtensionPoint } from '@backstage/plugin-notifications-backend-module-email';
import { Notification } from '@backstage/plugin-notifications-common';

export const notificationsModuleEmailDecorator = createBackendModule({
  pluginId: 'notifications',
  moduleId: 'email.templates',
  register(reg) {
    reg.registerInit({
      deps: {
        emailTemplates: notificationsEmailTemplateExtensionPoint,
      },
      async init({ emailTemplates }) {
        emailTemplates.setTemplateRenderer({
          async getSubject(notification) {
            return `New notification from ${notification.source}`;
          },
          async getText(notification) {
            return notification.content;
          },
          async getHtml(notification) {
            return `<p>${notification.content}</p>`;
          },
        });
      },
    });
  },
});
```

## Example configuration:

```yaml
notifications:
  processors:
    email:
      # Transport config, see options at `config.d.ts`
      transportConfig:
        transport: 'smtp'
        hostname: 'my-smtp-server'
        port: 587
        secure: false
        username: 'my-username'
        password: 'my-password'

      # AWS SES
      # transportConfig:
      #   transport: 'ses'
      #   accessKeyId: 'my-access-key
      #   region: 'us-west-2'

      # Azure Communication Service
      # transportConfig:
      #   transport: 'azure'
      #   endpoint: 'https://my-endpoint.communication.azure.com'
      #   accessKey: 'my-access-key'      Optional: if not provided, Managed Identity will be used

      # sendmail
      # transportConfig:
      #   transport: 'sendmail'
      #   path: '/usr/sbin/sendmail'
      #   newline: 'unix'

      # The email sender address
      sender: 'sender@mycompany.com'
      replyTo: 'no-reply@mycompany.com'
      # Who to send email for broadcast notifications
      broadcastConfig:
        receiver: 'users'
      # Optional SES config
      # sesConfig:
      #   fromArn: 'arn:aws:ses:us-west-2:123456789012:identity/example.com'
      #   configurationSetName: 'custom-config'
      # How many emails to send concurrently, defaults to 2
      concurrencyLimit: 10
      # How much to throttle between emails, defaults to 100ms
      throttleInterval:
        seconds: 60
      # Cache configuration for email addresses
      # This is to prevent unnecessary calls to the catalog
      cache:
        ttl:
          days: 1
      # Notification filter which this processor will handle
      filter:
        # Minimum severity of the notification to send email
        minSeverity: high
        # Maximum severity of the notification to send email
        maxSeverity: critical
        # Topics that are excluded from sending email
        excludedTopics:
          - scaffolder
      # Optional list of allowed email domains (exact match, case-insensitive)
      allowedEmailDomains:
        - mycompany.com
        - subsidiary.com
      # Addresses always allowed (case-insensitive; even outside allowedEmailDomains)
      allowlistEmailAddresses:
        - contractor@gmail.com
        - john.doe@backstage.io
      # List of denied email addresses (case-insensitive)
      denylistEmailAddresses:
        - jane.doe@backstage.io
```

Recipient addresses from the catalog and from `receiverEmails` are validated before
send. Addresses that are not a single well-formed email are skipped (with a
warning in the logs); delivery continues for remaining valid recipients.

When `allowedEmailDomains` is set, addresses whose domain is not listed are
skipped unless the full address is present in `allowlistEmailAddresses`.
Matching for allowlist and denylist addresses is case-insensitive.
`denylistEmailAddresses` is applied last and can block an allowlisted address.

## Securing recipient addresses

Notification emails are resolved from user profile data in the catalog. That data
may come from upstream identity providers (for example LDAP, GitHub, or Azure) or
from manually registered entity YAML. If someone can influence those sources,
they may be able to place crafted addresses on user entities and cause
notifications to be delivered outside your organization.

For production deployments, configure `allowedEmailDomains` and, where needed,
`allowlistEmailAddresses` / `denylistEmailAddresses` so delivery is limited to
trusted domains and explicit exceptions. Format validation alone is not a
substitute for this policy.

See `config.d.ts` for more options for configuration.
