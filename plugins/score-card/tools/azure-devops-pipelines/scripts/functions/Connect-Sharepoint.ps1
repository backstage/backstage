<#
.SYNOPSIS
    Connects to Sharepoint on $siteURL. Use with -interactive on local workstation

.PARAMETER siteURL
    Site url, e.g. https://yourOffice365Account.sharepoint.com/teams/some-site

.PARAMETER interactive
    Shall we ask for login? Usefull for local debugging.

#>
function Connect-Sharepoint (
    [Parameter(Mandatory = $true)]
    [string]
    $siteURL,

    [bool]
    $interactive
) {
    Write-Host "Connecting to sharepoint..." -ForegroundColor DarkGray;
    if ($null -eq (Get-Command -Name 'Connect-PnPOnline' -ErrorAction SilentlyContinue)) {
        throw "Please install prerequisities: [Install-Module -Name PnP.PowerShell -RequiredVersion 1.9.0]. ## prerequisity, see also https://pnp.github.io/powershell/cmdlets/Connect-PnPOnline.html#interactive-login-for-multi-factor-authentication";        
    }

    if ($interactive) {
        try {
            Write-Host "Connecting to $siteURL (interactivelly)..." -ForegroundColor DarkGray;
            Connect-PnPOnline -CurrentCredentials -Url $SiteURL | Out-Null;
        }
        catch {
            Write-Host "Connecting to $siteURL (with device login)..." -ForegroundColor DarkGray;
            Connect-PnPOnline -Url $SiteURL -DeviceLogin #interactive did not worked
        }
    }
    else {
        Write-Host "Connecting to $siteURL (with service principal $env:servicePrincipalId)..." -ForegroundColor DarkGray;
        Connect-PnPOnline -Url $siteURL -ClientId $env:servicePrincipalId -ClientSecret $env:servicePrincipalKey -WarningAction Ignore;
        # connecting via AccessToken is not supported for SPO, see https://github.com/pnp/PnP-PowerShell/pull/2657
        # Write-Host "Obtaining oAuth token..." -ForegroundColor DarkGray;
        # $oAuthToken = Get-AzureToken;
        # Write-Host "Connecting to $siteURL via ($oAuthToken)..." -ForegroundColor DarkGray;
        # Connect-PnPOnline -Url $siteURL -AccessToken $oAuthToken;
    }
    Write-Host "Connected!" -ForegroundColor DarkGray;
}