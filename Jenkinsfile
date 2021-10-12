yarnGitflowPipeline {

    imageName = 'bih/bih-backend'

    //which docker registry will the resultant image be pushed to, in this case drawn for an ENV variable
    //dockerRegistry = "https://container-registry.dev8.bip.va.gov"

    //which user/password key will the used to push the resultant image, in this case drawn for an ENV variable
    //credentials = "docker-registry"

    /*************************************************************************
    * Docker Build Configuration
    *************************************************************************/

    //arguemnts to pass to docker build command
    docker_build_args = "-f packages/backend/Dockerfile"

    /*************************************************************************
    * Docker Build Image Tag Configuration
    *************************************************************************/
    //Note: The resulting image is always tagged with the branch name.

    //this map is used to tag the resulting image with this pattern branchToDeployEnvMap[env.BRANCH_NAME]['lower']
    //will be in the form of [env.BRANCH_NAME]['lower'] env value-commitHash pattern and this is not used in the cases of pull request images
    //in this example if the master branch has a build it will be tagged with sbx-commitHash
    //branchToDeployEnvMap = [
    //       'master': ['lower':['sbx']],
    //]

    //whether or not to use the ENV "BRANCH_NAME" in order to tag the image in absense of a valid branchToDeployEnvMap
    //will be in the form of branchName-commitHash pattern and this is not used in the cases of pull request images
    //useBranchNameTag = true/false

    /*************************************************************************
    * Build Configuration variables
    *************************************************************************/

    //command to run npm install
    install_script = "install"

    //tests run in the jenkins pipeline
    test_script = "test:all"

    //command to run npm build
    build_script = "build"

    //number of builds to keep in jenkins
    buildsToKeep = "30"

    // skip accessibility tests
    skipAccessibilityTests = true

    /*************************************************************************
    * Not yet implemented Configuration variables (These items can be requested and implementation effort can then begin)
    *************************************************************************/

    //which node image to use in the pipeline
    node_image = "node:lts"

    //whether or not to include node modules in the stash from build stage to the deploy stage
    stash_node_modules = true

    //directory of artifacts which should be archived and attached to this build
    build_artifacts = "dist/**"

    //what version is your application on - this can be an additional tag to your docker image
    version = "0.0.1"

    //Testing and skipping section
    // skipTests = false
    // skipPrismaCloud = false
    // safePrismaCloudScan = true
    // skipSelenium = true
    // skip508Tests = true

}