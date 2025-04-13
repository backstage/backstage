---
'@backstage/cli': patch
---

Update the `to do` plugin template to stop using the deprecated catalog alpha service reference.
If you start seeing the `should create TODO item with catalog information` test failing, you have two options to fix this:
Update the test to mock the legacy alpha catalog service, or migrate the `TODO` plugin backend to use the new catalog service reference.
We recommend the second option, see [this](https://github.com/backstage/backstage/pull/29450/files/267115d0436009443ca68ac84e7dcc646c9c938d#diff-47e01aeb12dd55fab9e697f810be21a8d08d39c37df1b078f6d0894f9bad5a1b) pull request for an example of how to do the migration.
