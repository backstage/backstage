#Requires -Version 7.0
<#
.SYNOPSIS
    Update system-scores local scores from sharepoint.

.EXAMPLE
    Sync-Sharepoint.ps1 -action download -systemScoreFolder '../../sample-data' -listId '12345678-1234-aaaa-bbbb-1234567890aa' -siteURL 'https://yourOffice365Account.sharepoint.com/teams/some-site' -interactive

.PARAMETER action
    What do you want to do? Download data from Sharepoint or upload to it?

.PARAMETER systemScoreFolder
    A path to a folder where do you have saved your data for scoring

.PARAMETER listId
    GUID for the list with answers

.PARAMETER siteURL
    Site url, e.g. https://yourOffice365Account.sharepoint.com/teams/some-site

.PARAMETER systemName
    OPTIONAL: If you want to download/upload all systems omit this parameter or give it a '*' value.
    Otherwise please specify full name of the system you want to upload/download. In that case all.json won't be updated.

.PARAMETER interactive
    Shall we ask for login? Usefull for local debugging.
#>
[CmdLetBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("download", "upload")]
    $action,

    [Parameter(Mandatory = $true)]
    [string]
    $systemScoreFolder,

    [Parameter(Mandatory = $true)]
    [string]
    $listId,

    [Parameter(Mandatory = $true)]
    [string]
    $siteURL,

    [string]
    $systemName = '*',

    [switch]
    $interactive
)
$ErrorActionPreference = 'Stop';
$ProgressPreference = 'SilentlyContinue';

Write-Host "Loading functions..." -ForegroundColor DarkGray;
Get-ChildItem -Path "$PSScriptRoot/functions" | ForEach-Object { . $_.FullName }

Write-Host "Installing prerequisites..." -ForegroundColor DarkGray;
Install-Module -Name PnP.PowerShell -RequiredVersion 1.9.0 -Repository PSGallery -Scope CurrentUser -Force;

Connect-Sharepoint -siteURL $siteURL -interactive $interactive;

Write-Host "Loading template..." -ForegroundColor DarkGray;
$template = Get-Content -Path "$systemScoreFolder/@template.json" | ConvertFrom-Json;

Write-Host "Loading sharepoint list items..." -ForegroundColor DarkGray;
$spListItems = Get-PnPListItem -List $listId;
$spFields = Get-PnPField -List $listId;

#prepare empty definitions per item in sharepoint
$spListItems | ForEach-Object { 
    $systemEntityName = $_.FieldValues.Title;
    $sytemLocalPath = "$systemScoreFolder/$systemEntityName.json";
    if (Test-Path -Path $sytemLocalPath) { return; }
    [ordered]@{
        systemEntityName = $systemEntityName;
        areaScores       = @();
    } | ConvertTo-Json | Set-Content -Path $sytemLocalPath;
}

$allServices = @();
Write-Host "Updating $systemScoreFolder/$systemName.json ..." -ForegroundColor DarkGray;
Get-ChildItem -Path $systemScoreFolder -Include "$systemName.json" -Exclude all.json, '@template.json' -Recurse | ForEach-Object {
    $systemScore = Get-Content -Path $_.FullName | ConvertFrom-Json -Depth 20;
    $systemEntityName = $systemScore.systemEntityName;
    Write-Host "Updating $systemEntityName...";
    $newSystemScore = [ordered]@{
        systemEntityName          = $systemEntityName;
        systemTier                = $systemScore.systemTier;
        SystemDataConfidentiality = $systemScore.SystemDataConfidentiality;
        SystemDataSensitivity     = $systemScore.SystemDataSensitivity;
        generatedDateTimeUtc      = $systemScore.generatedDateTimeUtc;
        scoringReviewer           = $systemScore.scoringReviewer;
        scoringReviewDate         = $systemScore.scoringReviewDate;
        scorePercent              = $systemScore.scorePercent;
        scoreSuccess              = $systemScore.scoreSuccess;
        areaScores                = @();
    }
  
    $spItem = $spListItems | Where-Object { $_.FieldValues.Title -eq $systemEntityName };
    if ($null -ne $spItem) {
        if ($action -eq 'download') {
            Write-Host "Sharepoint item found, values will be refreshed from server..." -ForegroundColor DarkGray;
            Read-FromSharepoint -hashTable $newSystemScore -itemName 'systemTier' -spItem $spItem;
            Read-FromSharepoint -hashTable $newSystemScore -itemName 'SystemDataConfidentiality' -spItem $spItem;
            Read-FromSharepoint -hashTable $newSystemScore -itemName 'SystemDataSensitivity' -spItem $spItem;
            Read-FromSharepoint -hashTable $newSystemScore -itemName 'scoringReviewer' -spItem $spItem;
            Read-FromSharepoint -hashTable $newSystemScore -itemName 'scoringReviewDate' -spItem $spItem;
            $newSystemScore.generatedDateTimeUtc = $spItem.FieldValues.SMLastModifiedDate;
        }
        elseif ($action -eq 'upload') {
            Write-Host "Sharepoint item found, values will be uploaded to server..." -ForegroundColor DarkGray;
            Set-PnPListItem -List $listId -Identity $spItem.Id -Values @{
                SystemTier                = $systemScore.systemTier;
                SystemDataConfidentiality = $systemScore.SystemDataConfidentiality;
                SystemDataSensitivity     = $systemScore.SystemDataSensitivity;
                scoringReviewer           = $systemScore.scoringReviewer;
                scoringReviewDate         = $systemScore.scoringReviewDate;
            } | Out-Null;
        }
        else { throw 'not supported' }
    }
    foreach ($templatearea in $template.areaScores) {
        $area = $systemScore.areaScores | Where-Object -Property id -EQ -Value $templatearea.id;
        $newArea = [ordered]@{
            id           = $templatearea.id;
            title        = $templatearea.title;
            scorePercent = $area.scorePercent;
            scoreSuccess = $area.scoreSuccess;
            scoreEntries = @();
        }
        foreach ($templateScoreEntry in $templatearea.scoreEntries) {
            $scoreEntry = $area.scoreEntries | Where-Object -Property id -EQ -Value $templateScoreEntry.id;
            $newscoreEntry = [ordered]@{
                id           = $templateScoreEntry.id;
                title        = $templateScoreEntry.title;
                isOptional   = $scoreEntry.isOptional;
                scorePercent = $scoreEntry.scorePercent;
                scoreSuccess = $scoreEntry.scoreSuccess;
                scoreHints   = $scoreEntry.scoreHints;
                details      = $scoreEntry.details;
            }
            if ($null -eq $newscoreEntry.isOptional) { $newscoreEntry.Remove('isOptional'); }
            if ($null -ne $spItem) {
                if ($action -eq 'download') {
                    Read-FromSharepoint -hashTable $newscoreEntry -itemName 'scorePercent' -spItem $spItem -spFieldMatch "\($($templateScoreEntry.id)\)" -convertByTemplate $templateScoreEntry;
                    Read-FromSharepoint -hashTable $newscoreEntry -itemName 'scoreHints' -spItem $spItem -spFieldMatch "\($($templateScoreEntry.id)\)";
                    Read-FromSharepoint -hashTable $newscoreEntry -itemName 'details' -spItem $spItem -spFieldMatch "\(R\:$($templateScoreEntry.id)\)";
                }
                elseif ($action -eq 'upload') {
                    #TBD: do it once per item
                    #TBD: also support values
                    $spField = $spFields | Where-Object -Property Title -Match -Value "\(R\:$($templateScoreEntry.id)\)";
                    $spFieldName = $spField.InternalName;
                    Write-Host "Updating $spFieldName..." -ForegroundColor DarkGray;
                    Set-PnPListItem -List $listId -Identity $spItem.Id -Values @{
                        $spFieldName = $scoreEntry.details;
                    } | Out-Null;
                }
                else { throw 'not supported' }
            }        
            $newscoreEntry.scoreSuccess = Get-Success -scorePercent $newscoreEntry.scorePercent;
            $newArea.scoreEntries += $newscoreEntry;
        }
        $areaScorePercent = 0;
        $areaScoreSuccess = "unknown";
        $measures = $newArea.scoreEntries |
        Where-Object -Property scoreSuccess -NE -Value 'unknown' |
        Where-Object -Property isOptional -NE -Value $true |
        Measure-Object -Property { $_.scorePercent } -Maximum -Average;
        if ($measures.Count -gt 0) {
            $areaScorePercent = [int][math]::Round($measures.Average);
            $areaScoreSuccess = Get-Success -scorePercent $areaScorePercent;
        }
        $newArea.scorePercent = $areaScorePercent;
        $newArea.scoreSuccess = $areaScoreSuccess;
        $newSystemScore.areaScores += $newArea;
    }
    $systemScoreScorePercent = 0;
    $systemScoreScoreSuccess = "unknown";
    $measures = $newSystemScore.areaScores |
    Where-Object -Property scoreSuccess -NE -Value 'unknown' |
    Measure-Object -Property { $_.scorePercent } -Maximum -Average;
    if ($measures.Count -gt 0) {
        $systemScoreScorePercent = [int][math]::Round($measures.Average);
        $systemScoreScoreSuccess = Get-Success -scorePercent $systemScoreScorePercent;
    }
    $newSystemScore.scorePercent = $systemScoreScorePercent;
    $newSystemScore.scoreSuccess = $systemScoreScoreSuccess;

    $newSystemScore | ConvertTo-Json -Depth 20 | Set-Content -Path $_.FullName -Encoding utf8NoBOM;
    $allServices += $newSystemScore;
}
if ($systemName -eq '*') {
    $allJsonPath = Join-Path -Path $systemScoreFolder -ChildPath 'all.json';
    $allServices | ConvertTo-Json -Depth 20 | Set-Content -Path $allJsonPath -Encoding utf8NoBOM;    
}
