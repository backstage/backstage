# Upgrade Backstage App

## Overview

The script upgrades the version of Backstage created via the create-app plugin. It lets you resolve conflicts iteratively with your own merge [tool](https://www.git-scm.com/docs/git-mergetool).

## Requirements

You will need to have the following tools in your shell environment:

- git
- curl
- jq

## Usage

Here's how to use the script:

1. download the script
2. copy it in the root of your app
3. bootstrap a git repository (you may already have done so):

```bash
git init
git add .
git commit -m "initial commit"
```

4. run `sh upgrade-backstage-app.sh [optional-backstage-version]`
5. resolve any conflicts iteratively
