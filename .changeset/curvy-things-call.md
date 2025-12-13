---
'@backstage/plugin-notifications-backend-module-email': patch
---

SES config for the notification email processor now supports utilizing an ARN for the SES identity when sending an email after the SES SDK V2 update.

The `sesConfig.fromArn` will set the `fromEmailAddressIdentityArn` option for the SES `SendEmailCommand`. The `sesConfig.sourceArn` field is removed since no equivalent option is available in the send email command options. Setting `sesConfig.sourceArn` will have no effect and log a warning. Example changes:

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
        fromArn: "arn:aws:ses:us-west-2:123456789012:identity/example.com"
```
