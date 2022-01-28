<#
.DESCRIPTION
Cleanes up orphaned entities for the provided Backstage URL, defaults to the local backend
#>
param(
    [string]$backstageUrl = "http://localhost:7007"
)

$orphanApiUrl = "$backstageUrl/api/catalog/entities?filter=metadata.annotations.backstage.io/orphan=true"
$orphanDeleteApiUrl = "$backstageUrl/api/catalog/entities/by-uid"

$orphans = Invoke-RestMethod -Method Get -Uri $orphanApiUrl

Write-Host ""
Write-Host "Found $($orphans.length) orphaned entities"
Write-Host ""

foreach($orphan in $orphans){
    Write-Host "Deleting orphan $($orphan.metadata.name) of kind $($orphan.kind)"
    
    Invoke-RestMethod -Method Delete -Uri "$orphanDeleteApiUrl/$($orphan.metadata.uid)"
}
