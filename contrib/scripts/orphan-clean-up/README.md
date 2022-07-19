# Orphan Clean Up

## Overview

The Orphan Clean Up script is a basic PowerShell script to delete orphaned entities in the catalog. This script also assumes that you do not have authentication setup for your Backstage API endpoints.

_Warning:_ There is a risk of entities being orphaned (and being deleted by this script) in case of the location having problems and returning a 404 status code. This might lead to accidental deletion of entities until the processing loop has recreated the entity.

## Requirements

This script is PowerShell based so therefore needs to be ran in a PowerShell session. If you are not able to use PowerShell the script should give you a clear idea as to how to create it with another scripting language like Bash.

## Usage

Here's how to use the script:

1. Download the script
2. Now start a PowerShell session
3. Next navigate to the location you downloaded the script
4. Then run this command replacing `https:\\backstage.my-company.com` with the URL of your Backstage instance: `.\OrphanCleanUp.ps1 https:\\backstage.my-company.com`
5. The script will output the number of orphaned entities it finds and then the name for each one it deletes
