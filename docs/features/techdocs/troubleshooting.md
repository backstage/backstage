---
id: troubleshooting
title: Troubleshooting TechDocs
sidebar_label: Troubleshooting
description: Troubleshooting for TechDocs
---

- TechDocs will fail to clone your docs if you have a git config which overrides
  the `https` protocol with `ssh` or something else. Make sure to remove your
  git config locally when you try TechDocs.
