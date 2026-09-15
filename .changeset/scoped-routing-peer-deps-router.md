---
'@backstage/repo-tools': patch
---

The peer dependency check no longer manages `react-router-dom`. It previously aligned every package in the workspace on a single React Router version, both as a peer dependency range and as the version installed for local development. Packages now declare the React Router version they depend on themselves, so a package that ships against a different major version is no longer reported or rewritten. Every other dependency the check manages is unchanged.
