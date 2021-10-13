# [Backstage](https://backstage.io)

## Install and run the app locally

Things you'll need to install:

- ![Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- ![Docker](https://www.docker.com/get-started)

Things you'll need to add:

- Full access to the Department of Veterans Affairs Organization (for access, navigate to https://vaww.oit.va.gov/services/github/#23gethelp and fill out the form (requires an existing GitHub account and you'll have to be on the VA network to access the link.)
- If you have access, pull the BIH branch code. `https://github.com/department-of-veterans-affairs/bih.git`
- ![Github Personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- ![Github Oauth App](https://backstage.io/docs/auth/github/provider) Follow the directions under the heading `Create an OAuth App on GitHub`

Things you'll need to change:

- If you have pulled the BIH code change the file name of example.env to .env
- In the .env file add in the values for:
  `GITHUB_TOKEN`
  `AUTH_GITHUB_CLIENT_ID`
  `AUTH_GITHUB_CLIENT_SECRET`

---

from one terminal instance:

run:

```sh
yarn docker-local
```

from the other run:

```sh
yarn start
```

## Documentation

- [Main documentation](https://backstage.io/docs)
- [Service Catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview)
- [Architecture](https://backstage.io/docs/overview/architecture-overview) ([Decisions](https://backstage.io/docs/architecture-decisions/adrs-overview))
- [Designing for Backstage](https://backstage.io/docs/dls/design)
- [Storybook - UI components](https://backstage.io/storybook)

## BIH Style Guide

![updatedColors](https://user-images.githubusercontent.com/12993587/125858910-7961a44a-3ce8-4854-a1a3-fbc4809bb396.png)

- #112e51 background for all headers and content banners.
- #293e40 background for the left Nav, this color can be found in the VA's Service Now.
- #FFFFFF most widely used font color, some dropdowns and headers.
- #fac922 Used as the border-top for the content element, this border-top is only triggered on the home page 'catalog' as a way to signify the homepage and to reflect the same functionality as the VA homepage. There is a hard coded check in the content element that checks for 'catalog' in the url, if the user is not currently on the homepage, it sets the border to `border:none;`.
- #2E77D0 used for buttons and other call to action clickable items.

---

- Font-family: 'Source Sans Pro,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif'.
- Padding: headers and banners - 24px, components - 8px.
- Margin: 0px;
- All alert, info, warning and success colors are the standard set with Material UI. (backstage standard)

---

- All Logos can be found at the VA design page [VA design Logos](https://design.va.gov/design/logos).
- The current VA logo used for backstage (which isnt found in the design page),

![va-color-logo](https://user-images.githubusercontent.com/12993587/125843344-a41587e3-2d0d-49bc-ab51-a0cffbe8ed0b.png)

Material UI theming can be found in `packages/app/src/theme.tsx`

