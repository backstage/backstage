$token = "abcdef123456"
$url = "https://services.customer-iam.dfds.cloud/dev/customeriam-selfservice/api/v1/AuthorizationServer"
$header = @{"Authorization"=$token}

$AuthorizationServerBody = @"
{
    "name": "Core.Selfservice3",
    "scopes": [
        "Core.Selfservice.Read",
	    "Core.Selfservice.Write"
    ],
    "createSwaggerApp": false,
    "authorizationServerAdmins": []
}
"@

$request = Invoke-RestMethod -Uri $url -Headers $header -Body $AuthorizationServerBody -ContentType "application/json" -Method Post

Write-Host $request

{
    "id": "ausofi70gN6YUe1Wc0x6",
    "metadataUrl": "https://dev-accounts.dfds.com/oauth2/ausofi70gN6YUe1Wc0x6/.well-known/oauth-authorization-server",
    "audiences": [
      "api://Core.Selfservice3"
    ]
  }