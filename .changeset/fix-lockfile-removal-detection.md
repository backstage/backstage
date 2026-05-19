---
'@backstage/cli-node': patch
---

Fixed a bug in `PackageGraph.listChangedPackages` where removed dependencies were not detected during lockfile analysis. The dependency graph from the previous lockfile was not being merged, causing transitive dependency removals to be missed.
