q---
'@backstage/plugin-jenkins-backend': minor

---

**BREAKING**: Both `createRouter` and `DefaultJenkinsInfoProvider.fromConfig` now require the `discovery` service to be forwarded from the plugin environment. This is part of the migration to support new auth services.

The `JenkinsInfoProvider` interface has been updated to receive `credentials` of the type `BackstageCredentials` rather than a token.
