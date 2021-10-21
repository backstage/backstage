# [Backstage](https://backstage.io)

## Install and run the app locally

Things you'll need to install:

- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- [Docker](https://www.docker.com/get-started)
- [Node](https://nodejs.org/en/download/) (version 12 or 14)

Things you'll need to add:

- Full access to the Department of Veterans Affairs Organization (for access, navigate to https://vaww.oit.va.gov/services/github/#23gethelp and fill out the form (requires an existing GitHub account and you'll have to be on the VA network to access the link.)
- If you have access, clone the BIH branch code. ```git clone https://github.com/department-of-veterans-affairs/bih.git```
- [Github Personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)(You'll need this value later for your `GITHUB_TOKEN`) 
- [Github Oauth App](https://backstage.io/docs/auth/github/provider) Follow the directions under the heading `Create an OAuth App on GitHub`(You'll need these values later for your   `AUTH_GITHUB_CLIENT_ID` and `AUTH_GITHUB_CLIENT_SECRET`)

Things you'll need to change:

- If you have cloned the BIH repo change the file name of `example.env` to `.env`
- In the .env file add in the values for:
  `GITHUB_TOKEN`,
  `AUTH_GITHUB_CLIENT_ID`,
  `AUTH_GITHUB_CLIENT_SECRET`
- In the file "app-config.yaml" replace: 
```yml
techdocs:
  builder: 'external'
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: ${AWS_BUCKET_NAME}
      region: ${AWS_BUCKET_REGION}
      credentials:
        accessKeyId: ${AWS_ACCESS_KEY_ID}
        secretAccessKey: ${AWS_ACCESS_KEY_SECRET}
```
With this: 
```yml
techdocs:
  builder: 'local'
  publisher:
    type: 'local'
  generator:
    techdocs: local
```
---

From one terminal instance:

run:

```sh
yarn docker-local
```

Once you observe 'Listening on :7000' in the log you can see the app by navigating to http://localhost:7000

## Adding Techdocs to your repository

Things you'll need:
  
  - [Techdocs-cli](https://github.com/backstage/techdocs-cli)
  - [S3 credentials](https://docs.aws.amazon.com/AmazonS3/latest/userguide/AuthUsingAcctOrUserCredentials.html)
  
Things to do:
  - In your repo add a mkdocs.yml file similar to the one below.

```yml
site_name: 'My Repo docs name'

nav:
  - Home: index.md

plugins:
  - techdocs-core
```
   Techdocs Todo
  - Credentials are currently setup with a jenkins pipeline, the credentialing process is still in progress * 10/21
  
  - Once you have techdocs-cli installed
  run the techdocs:

```sh
yarn cli
```
  - Then push your docs to s3
 
```sh
techdocs-cli publish --publisher-type <awsS3|googleGcs|azureBlobStorage> --storage-name <bucket/container name> --entity <namespace/kind/name>
```
  - From the published tech docs add the the backstage.io/techdocs-ref value to the catalog-info.yaml file of your repo: 

 ```yml
   annotations:
    backstage.io/techdocs-ref: url:s3://my-s3-name/default/api/name-of-techdoc/
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
