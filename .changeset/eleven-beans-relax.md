---
'@backstage/release-manifests': patch
---

This expands the configurability of `release-manifests` to pave the road for more configuration options in the `cli`.

Specifically it allows the specification of mirrored, proxied, or air-gapped hosts when upgrading across releases when
working in restricted or heavily governed development environments (common in large enterprises and government
entities).
