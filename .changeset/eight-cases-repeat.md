---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Sped up `publish:gitlab:merge-request` and `gitlab:repo:push` by drastically reducing the number
of GitLab API requests they make.

Under the default `commitAction: 'auto'`, both actions previously downloaded the contents of every
file already present on the target branch in order to work out which ones had actually changed.
That information is available from the repository listing they already fetch, so the comparison is
now done locally and those per-file requests are gone. The listing itself is also fetched in larger
pages.

For a merge request against a repository of a few hundred files this cuts the number of requests
from roughly 300 to under ten, taking a step that took 5-15 seconds against a self-hosted GitLab
down to about 3 seconds. Which files are created, updated or skipped is unchanged, including for
repositories using git sha256 object format.
