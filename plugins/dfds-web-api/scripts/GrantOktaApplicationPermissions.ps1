$token = "abcdef123456"
$url = "https://services.customer-iam.dfds.cloud/dev/customeriam-selfservice/api/v1/AuthorizationServer/CloudEngineering.Selfservice/permisions"
$header = @{"Authorization"=$token}

$GrantBackstagePermissionBody = @"
{
    "applicationId": "TODO",
    "scopes": [
        "CloudEngineering.Selfservice.Read",
	    "CloudEngineering.Selfservice.Write"
    ],
	"grantTypes": [
		"ClientCredentials"
	]
}
"@

$request = Invoke-RestMethod -Uri $url -Headers $header -Body $GrantBackstagePermissionBody -ContentType "application/json" -Method Post

Write-Host $request

$GrantKubernetesPermissionBody = @"
{
    "applicationId": "TODO",
    "scopes": [
        "CloudEngineering.Selfservice.Read",
	    "CloudEngineering.Selfservice.Write"
    ],
	"grantTypes": [
		"ClientCredentials"
	]
}
"@

$request = Invoke-RestMethod -Uri $url -Headers $header -Body $GrantKubernetesPermissionBody -ContentType "application/json" -Method Post

Write-Host $request