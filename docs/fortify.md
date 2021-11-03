# Fortify Static Code Analyzer 

## Download software
- [Foritfy SCA 20.1.0 for Linxux](https://dvagov.sharepoint.com/sites/OISSwAServiceRequests/Shared%20Documents/Fortify%20Software/21.1.0/Fortify_SCA_and_Apps_21.1.0_Linux.tar.gz)
-  [Fortify SCA 20.1.0 for MAC](https://dvagov.sharepoint.com/sites/OISSwAServiceRequests/Shared%20Documents/Fortify%20Software/21.1.0/Fortify_SCA_and_Apps_21.1.0_Mac.tar.gz)
-  [Fortify SCA 20.1.0 for Windows](https://dvagov.sharepoint.com/sites/OISSwAServiceRequests/Shared%20Documents/Fortify%20Software/21.1.0/Fortify_SCA_and_Apps_21.1.0_Windows.zip)

## Download license
- [fortify 21.1.0 license](https://dvagov.sharepoint.com/sites/OISSwAServiceRequests/Shared%20Documents/Fortify%20Software/fortify.license)

### Download OIS Software Assurance rulepack
- [Fortify Rulepack](https://dvagov.sharepoint.com/sites/OISSwAServiceRequests/Shared%20Documents/Fortify%20Rulepacks/rules_2021.3.0.zip)

## Installation
- Extract downloaded contents onto your local system
- Run system specific installation script to install fortify software.
- When prompted ensure you pass the full path of your fortify license file location
- Place the rules extracted from rulespack and insert them into the rules config location for fortify that can be found here:
  - `C:\Fortify\Fortify_SCA_and_Apps_21.1.0\Core\config\rules`

# Running fortify scanner via cli
> You can add the Fortify bin folder to your system path to use binaries included with the application anywhere in the filesystem.

- Open terminal and change to your systesm's installation location for fortify application 
  - ex: `C:\Fortify\Fortify_SCA_and_Apps_21.1.0\bin\`
- From here you can run the `sourceanalyzer` binary

## Build (translation) stage
- `sourceanalyzer -b MyChosenBuildID /path/to/dir/to/build`
```
-b   Specifies the build ID.  The build ID is used
     to track which files are compiled and linked
     as part of a build, to later scan those files.
     This option may be specified more than once to
     include multiple build IDs in the same scan.
```
## Scan (analyze the files specified in the build stage)
- `sourceanalyzer -b MyChosenBuildID -scan -f /path/to/output.fpr`

```
-f  The file to which analysis results are written.  
    Default is stdout. File name should end in .fpr

-scan   Causes Fortify SCA to perform analysis against a model.  
        The model must be specified with "-b".
```

## Analyze the results via auditworkbench 
### Via Cli
Auditworkbench is used to anaylze the output of your scan. You can call auditworkbench from the cli and pass it the scan results artificat.
- `autditworkbench /path/to/output.fpr`

### Windows GUI
Alternatively you can open file explorer and double click on `output.fpr` which will open auditworkbench.

# [Foritfy Visual Studio Code Plugin](https://marketplace.visualstudio.com/items?itemName=fortifyvsts.fortify-extension-for-vs-code)

## Installation 
- Install plugin from VS Code marketplace

## Setup scan
- Clone the [BIH app from github](https://github.com/department-of-veterans-affairs/bih) onto your laptop and open in Visual Studio Code. 

- Click the Fortify icon on the left hand side panel, select `Static Code Analyzer` from the three options presented and fill out the following fields:

Static Code Analyzer executable path: 
- ex: `C:\Foritfy\Fortify_SCA_and_Apps_21.1.0\bin\sourceanalyzer`

Build ID:
- ex: `bih-app-001`

Scan results location (FPR):
- ex: `C:\Users\Somebody\Documents\output.fpr`

Log Location: 
- ex: `C:\Users\Somebody\Documents\sca.log`

## (Optional) Add translation options checkbox
- you can add translation options such as directory to be scanned 

## (Optional) Add scan options checkbox
- add optional scan options

## (Optional) Update security content
- where or not to search the web for updates

## Scan
- Click `SCAN` button. Be advised that scanning will take a while. 

# Helful links and videos

- [OIS Fortify Usage Microsoft Teams Channel](https://teams.microsoft.com/l/channel/19%3a207c23e32a404e0dae955e57cc5a0c73%40thread.skype/Technical%2520Notes%2520(Fortify%2520Usage)?groupId=3c2ed08f-9317-46fc-9d9a-5d7b71d1816f&tenantId=e95f1b23-abaf-45ee-821d-b7ab251ab3bf)

- [Fortify SCA User Guide](https://www.microfocus.com/documentation/fortify-static-code-analyzer-and-tools/2110/SCA_Guide_21.1.0.pdf)

- [Auditworkbench User Guide](https://www.microfocus.com/documentation/fortify-static-code-analyzer-and-tools/1920/AWB_Guide_19.2.0.pdf)

- [Fortify Youtube Tutorial](https://www.youtube.com/channel/UCUDKcm1wIfE6EWk_SyK0D4w)