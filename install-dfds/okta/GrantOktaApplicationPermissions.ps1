$token = "abcdef123456"
$url = "https://services.customer-iam.dfds.cloud/dev/customeriam-selfservice/api/v1/AuthorizationServer/Core.Selfservice/permisions"
$header = @{"Authorization"=$token}

$GrantBackstagePermissionBody = @"
{
    "applicationId": "0oaofm6dvWx9aFfFb0x6",
    "scopes": [
        "Core.Selfservice.Read",
	    "Core.Selfservice.Write"
    ],
	"grantTypes": [
		"ClientCredentials"
	]
}
"@

$request = Invoke-RestMethod -Uri $url -Headers $header -Body $GrantBackstagePermissionBody -ContentType "application/json" -Method Post

Write-Host $request

{
    "policyId": "00poflvo2FufpMaOl0x6",
    "clientId": "0oaofm6dvWx9aFfFb0x6",
    "grantTypes": [
      "ClientCredentials"
    ],
    "scopes": [
      "Core.Selfservice.Read",
      "Core.Selfservice.Write"
    ],
    "groups": []
  }