# @backstage/release-manifests

This package provides a mapping between a Backstage release and the packages included in that release.

Release manifests also include `requirements` copied from the root `package.json` `engines` field at publish time, for example `{ "node": "22 || 24" }`. Older manifests may not have this field.
