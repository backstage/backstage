$token = "abcdef123456"
$url = "https://services.customer-iam.dfds.cloud/dev/customeriam-selfservice/api/v1/AuthorizationServer"
$header = @{"Authorization"=$token}

$AuthorizationServerBody = @"
{
    "name": "CloudEngineering.Selfservice",
    "scopes": [
        "CloudEngineering.Selfservice.Read",
	    "CloudEngineering.Selfservice.Write"
    ],
    "createSwaggerApp": false,
    "authorizationServerAdmins": [TODO]
}
"@

$request = Invoke-RestMethod -Uri $url -Headers $header -Body $AuthorizationServerBody -ContentType "application/json" -Method Post

Write-Host $request