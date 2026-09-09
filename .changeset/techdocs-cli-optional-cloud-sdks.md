---
'@techdocs/cli': patch
---

Declare cloud storage SDKs used by `techdocs-cli publish` (AWS S3, Google Cloud Storage,
Azure Blob Storage, OpenStack Swift) as optional dependencies. They are still installed by default, but
installations that only need a subset of providers can now use `--omit=optional` and install just
the packages they need.
