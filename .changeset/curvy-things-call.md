---
'@backstage/plugin-notifications-backend-module-email': patch
---

SES config for the notification email processor now supports sending an ARN for the SES identity to use when sending an email after the SES SDK V2 update.

The `sesConfig.fromArn` field is marked as deprecated in favor of `sesConfig.fromEmailAddressIdentityArn` to match the option name passed during the send email command. Currently both `sesConfig.fromArn` and `sesConfig.fromEmailAddressIdentityArn` will set the `fromEmailAddressIdentityArn` option. The `sesConfig.sourceArn` field is removed since no equivalent option is available in the send email command options. Example using `sesConfig.fromEmailAddressIdentityArn`:

```diff
notifications:
  processors:
    email:
      transportConfig:
        transport: "ses"
        region: "us-west-2"
      sender: "sender@mycompany.com"
      replyTo: "no-reply@mycompany.com"
      sesConfig:
-       sourceArn: "arn:aws:ses:us-west-2:123456789012:identity/example.com"
-       fromArn: "arn:aws:ses:us-west-2:123456789012:identity/example.com"
+       fromEmailAddressIdentityArn: "arn:aws:ses:us-west-2:123456789012:identity/example.com"
```
