<#
.SYNOPSIS
    Given a guid for the list and url to the sharepoint it will prepare (add or update) the fields for the list accoriding to the @template.json from scoring data

.PARAMETER systemScoreFolder
    A path to a folder where do you have saved your data for scoring

.PARAMETER listId
    GUID for the list with answers

.PARAMETER siteURL
    Site url, e.g. https://yourOffice365Account.sharepoint.com/teams/some-site

.PARAMETER clearFirst
    Should we remove all existing fields first? Use with care: it will remove the data from the list too!
    Prompt will be shown for each field unless -force is specified too.

.PARAMETER force
    If specified the fields will be removed without a prompt

.PARAMETER interactive
    Shall we ask for login? Usefull for local debugging.

#>
[CmdLetBinding()]
param (
    [Parameter(Mandatory = $true)]
    [string]
    $systemScoreFolder,

    [Parameter(Mandatory = $true)]
    [string]
    $listId,

    [Parameter(Mandatory = $true)]
    [string]
    $siteURL,

    [switch]
    $clearFirst,

    [switch]
    $force,

    [switch]
    $interactive
)
$ErrorActionPreference = 'Stop';

Write-Host "Loading functions..." -ForegroundColor DarkGray;
Get-ChildItem -Path "$PSScriptRoot/functions" | ForEach-Object { . $_.FullName }

Connect-Sharepoint -siteURL $siteURL -interactive $interactive;

$scoringTemplate = Get-Content "$systemScoreFolder/@template.json" | ConvertFrom-Json

$groupNames = $scoringTemplate.areaScores | Select-Object -ExpandProperty title;
if ($clearFirst) {
    Write-Host "Removing all fields in groups: [$($groupNames -join ',')] ..." -ForegroundColor Yellow;
    Get-PnPField -List $listId | ForEach-Object { 
        if ($groupNames -contains $_.Group) {
            Write-Host "Removing $($_.InternalName) ..." -ForegroundColor Red;
            Remove-PnPField -List $listId -Identity $_.InternalName -Force:$force;
        }
    } 
}

Write-Host "Getting existing fields in groups: [$($groupNames -join ',')] ..." -ForegroundColor DarkGray;
$existingFields = Get-PnPField -List $listId | Where-Object { $groupNames -contains $_.Group }
[string[]]$ViewFields = @(
    'LinkTitle',
    'SystemTier',
    'SystemDataConfidentiality',
    'SystemDataSensitivity',
    'scoringReviewer',
    'scoringReviewDate'
);
$fieldNr = 0;
$formDefinition = @{
    sections = @(
        @{
            displayname = 'Identification';
            fields      = @(
                'SystemName',
                'SystemTier',
                'SystemDataConfidentiality',
                'SystemDataSensitivity',
                'scoringReviewer',
                'scoringReviewDate'
            );
        }
    );
}

foreach ($scoreArea in $scoringTemplate.areaScores) {
    Write-Host "Processing area [$($scoreArea.id): $($scoreArea.title)] ..." -ForegroundColor Cyan;
    foreach ($scoreEntry in $scoreArea.scoreEntries) {
        $fieldNr ++;
        $fieldScoreName = "$($scoreEntry.title)_$($scoreEntry.id)" -replace ' ', '_';
        $fieldScoreTitle = "$($scoreEntry.title) ($($scoreEntry.id))"
        $fieldScoreType = 'Number';
        if ($null -ne $scoreEntry.scoreChoices) {
            $fieldScoreType = 'Choice';
        }
        if ($null -ne $scoreEntry.scoreChecks) {
            $fieldScoreType = 'MultiChoice';
        }
        Write-Host "Processing score entry [$fieldScoreTitle] ..." -ForegroundColor Magenta;
        $fieldScore = $existingFields | Where-Object -Property Title -Match -Value "\($($scoreEntry.id)\)";
        if ($null -eq $fieldScore) {
            Write-Host "List field for score not found, creating ..." -ForegroundColor DarkGray;
            $fieldScore = Add-PnPField -List $listId -DisplayName $fieldScoreTitle -InternalName $fieldScoreName -Type $fieldScoreType -AddToDefaultView -Group $scoreArea.title;
        }
        if ($fieldScore.TypeAsString -ne $fieldScoreType) {
            Write-Host "Type change detected. Updating the type first...";
            Set-PnPField -List $listId -Identity $fieldScore.InternalName -Values @{TypeAsString = $fieldScoreType } -UpdateExistingLists | Out-null;
        }
        $Required = $null -ne $scoreEntry.isOptional -and !$scoreEntry.isOptional; ##make everything optional but where isOptional is false
        $fieldScoreProps = @{
            Title       = $fieldScoreTitle;
            Description = "$($scoreEntry.howToScore)";
            Group       = $scoreArea.title;
            Required    = $Required;
        }
        if ('Number' -ne $fieldScoreType) {
            [string[]] $choices = @();
            foreach ($scoreChoice in $scoreEntry.scoreChoices) {
                $scoreChoiceInfo = $scoreChoice.PSObject.Properties | Select-Object -First 1;
                $choices += "$($scoreChoiceInfo.Name): $($scoreChoiceInfo.Value) %"
            }
            foreach ($scoreChoice in $scoreEntry.scoreChecks) {
                $scoreChoiceInfo = $scoreChoice.PSObject.Properties | Select-Object -First 1;
                $choices += "$($scoreChoiceInfo.Name)"
            }
            $fieldScoreProps.Add('Choices', $choices);
        }
        else {
            $fieldScoreProps.Add('ShowAsPercentage', $true);
        }
        Set-PnPField -List $listId -Identity $fieldScore.InternalName -Values $fieldScoreProps -UpdateExistingLists | Out-null;
        $ViewFields += $fieldScore.InternalName;

        $fieldReasonName = "$($scoreEntry.title)_r$($scoreEntry.id)";
        $fieldReasonTitle = "$($scoreEntry.title):Reason (R:$($scoreEntry.id))";
        $fieldReason = $existingFields | Where-Object -Property Title -Match -Value "\(R\:$($scoreEntry.id)\)";
        if ($null -eq $fieldReason) {
            Write-Host "List field for score reasoning not found, creating ..." -ForegroundColor DarkGray;
            $fieldReason = Add-PnPField -List $listId -DisplayName $fieldReasonTitle -InternalName $fieldReasonName -Type Note -Group $scoreArea.title;
        }
        
        $fieldReasonProps = @{
            Title         = $fieldReasonTitle;
            Description   = "Write in details why you gave such score. You may use markdown (e.g for links to documentation etc). See https://dev.azure.com/organization/project/_wiki/wikis/project.wiki/$($scoreEntry.id) for details.";
            Group         = $scoreArea.title;
            NumberOfLines = 4;
            RichText      = $false;
            Required      = $Required;
        }
        Set-PnPField -List $listId -Identity $fieldReason.InternalName -Values $fieldReasonProps -UpdateExistingLists | Out-null;

        $formDefinition.sections += @{
            displayname = "$($scoreArea.title) / $($scoreEntry.title)";
            fields      = @($fieldScore.InternalName, $fieldReason.InternalName);
        }
    }
}
Write-Host "Configuring default view ..." -ForegroundColor DarkGray;
$existingView = Get-PnPView -List $list.Id | Where-Object -Property DefaultView -EQ -Value $true
Set-PnPView -List $list.Id -Identity $existingView.Id -Fields $ViewFields | Out-Null;

Write-Host "Everything finished ..." -ForegroundColor Green;
Write-Host "Dont forget to configure the form:" -ForegroundColor Yellow;
$formDefinition.sections += @{
    displayname = "(not used, check!)";
    fields      = @();
}
Write-Host ($formDefinition | ConvertTo-Json -Depth 15) -ForegroundColor Yellow;
