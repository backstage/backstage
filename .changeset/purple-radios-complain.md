---
'@backstage/plugin-jenkins': patch
---

Improve loading speed of the CI/CD page.
Only request the necessary fields from Jenkins to keep the request size low.
In addition everything is loaded in a single request, instead of requesting
each job and build individually. As this (and also the previous behavior) can
lead to a big amount of data, this limits the amount of jobs to 50.
For each job, only the latest build is loaded. Loading the full build history
of a job can lead to excessive load on the Jenkins instance.
