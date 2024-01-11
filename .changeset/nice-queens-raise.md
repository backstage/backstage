---
'@backstage/plugin-kubernetes-backend': patch
---

Kubernetes cluster type 'gke' is not respecting backend auth, so we just add a line of code for this solution wich is const { pathname: filepath } = new URL(location);

With this the logic is taking all URL path and now the condition mets the match including a wildcard "\*" and then method .search() is call and reads whatever provider it is such github, GCs or AWS.
