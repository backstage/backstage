---
'@backstage/cli': patch
---

Allow using custom manifest location in the yarn plugin and version bump.

The Backstage yarn plugin and version bump allows two new environment variables to configure custom manifest location:

- `BACKSTAGE_MANIFEST_BASE_URL`: The base URL for fetching the Backstage version
  manifest. Defaults to `https://versions.backstage.io/v1/releases/VERSION/manifest.json`.
  Useful for running the plugin in environment without direct access to the internet,
  for example by using a mirror of the versions API or a proxy.
  Note that the environment variable is just the host name, and the path is appended by
  the plugin. If you are using the yarn plugin, bump version command will also try
  to fetch the new version of the yarn plugin from the same base URL (defaults to
  `https://versions.backstage.io/v1/releases/RELEASE/yarn-plugin`)
- `BACKSTAGE_MANIFEST_FILE`: Path to a local manifest file. If set, the plugin
  will not attempt to fetch the manifest from the network. Useful for running
  the plugin in environment without internet access and without mirror of the
  versions API.
