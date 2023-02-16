# admin tool

## Local dev

```bash
# Checkout the branch
cd backstage
git fetch
git checkout goa/cli-admin-command

# Create a new app
cd ..
npx @backstage/create-app
cd new-backstage-app

# Run the modded cli in the new app
../github/backstage/packages/cli/bin/backstage-cli admin
? Do you want to set up Authentication for this project? (Y/n)
...

# Try the app with the new changes
yarn dev
```
