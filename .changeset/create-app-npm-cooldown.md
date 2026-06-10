---
'@backstage/create-app': patch
---

Newly scaffolded apps now use Yarn 4.13.0 (up from 4.4.1) and enable Yarn's `npmMinimalAgeGate: 3d` setting, which refuses to install npm packages published less than three days ago as a defense against supply-chain attacks. Backstage's own packages are exempted via `npmPreapprovedPackages: ['@backstage/*']` so newly released Backstage versions remain installable without delay.

Existing apps are unaffected. To opt in, add the `npmMinimalAgeGate` and `npmPreapprovedPackages` settings to your own `.yarnrc.yml` and upgrade Yarn to 4.13 or later.
