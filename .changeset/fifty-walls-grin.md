---
'@backstage/plugin-catalog-backend': minor
---

Add a default catalog value for BitBucketDiscoveryProcessor. This allows to have a target like so: https://bitbucket.mycompany.com/projects/backstage/repos/service-*
which will be expanded to https://bitbucket.mycompany.com/projects/backstage/repos/service-a/catalog-info.yaml given that repository 'service-a' exists.

## Migration

If you are using a custom [Bitbucket parser](https://backstage.io/docs/integrations/bitbucket/discovery#custom-repository-processing) and your `bitbucket-discovery` target (e.g. in your app-config.yaml) omits the catalog path in any of the following ways:

- https://bitbucket.mycompany.com/projects/backstage/repos/service-*
- https://bitbucket.mycompany.com/projects/backstage/repos/*
- https://bitbucket.mycompany.com/projects/backstage/repos/*/

then you will be affected by this change.
The 'target' input to your parser before this commit would be '/', and after this commit it will be '/catalog-info.yaml', and as such needs to be handled to maintain the same functionality.
