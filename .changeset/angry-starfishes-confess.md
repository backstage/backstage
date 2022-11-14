---
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
---

Handle Bitbucket Cloud `repo:push` events at the `BitbucketCloudEntityProvider`
by subscribing to the topic `bitbucketCloud.repo:push.`

Implements `EventSubscriber` to receive events for the topic `bitbucketCloud.repo:push`.

On `repo:push`, the affected repository will be refreshed.
This includes adding new Location entities, refreshing existing ones,
and removing obsolete ones.

To support this, a new annotation `bitbucket.org/repo-url` was added
to Location entities.

A full refresh will require 1 API call to Bitbucket Cloud to discover all catalog files.
When we handle one `repo:push` event, we also need 1 API call in order to know
which catalog files exist.
This may lead to more discovery-related API calls (code search).
The main cause for hitting the rate limits are Locations refresh-related operations.

A reduction of total API calls to reduce the rate limit issues can only be achieved in
combination with

1. reducing the full refresh frequency (e.g., to monthly)
2. reducing the frequency of general Location refresh operations by the processing loop

For (2.), it is not possible to reduce the frequency only for Bitbucket Cloud-related
Locations though.

Further optimizations might be required to resolve the rate limit issue.

**Installation and Migration**

Please find more information at
https://backstage.io/docs/integrations/bitbucketCloud/discovery,
in particular the section about "_Installation with Events Support_".

In case of the new backend-plugin-api _(alpha)_ the module will take care of
registering itself at both.
