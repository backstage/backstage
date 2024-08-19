---
'@backstage/plugin-auth-backend-module-aws-alb-provider': patch
---

Added a `signer` configuration option to validate against the token claims. We strongly recommend that you set this value (typically on the format `arn:aws:elasticloadbalancing:us-east-2:123456789012:loadbalancer/app/my-load-balancer/1234567890123456`) to ensure that the auth provider can safely check the authenticity of any incoming tokens.

Example:

```diff
 auth:
   providers:
     awsalb:
       # this is the URL of the IdP you configured
       issuer: 'https://example.okta.com/oauth2/default'
       # this is the ARN of your ALB instance
+      signer: 'arn:aws:elasticloadbalancing:us-east-2:123456789012:loadbalancer/app/my-load-balancer/1234567890123456'
       # this is the region where your ALB instance resides
       region: 'us-west-2'
       signIn:
         resolvers:
           # typically you would pick one of these
           - resolver: emailMatchingUserEntityProfileEmail
           - resolver: emailLocalPartMatchingUserEntityName
```
