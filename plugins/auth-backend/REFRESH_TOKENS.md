# Long-lasting Sessions (Refresh Tokens)

This feature adds support for long-lasting refresh tokens that can be issued by the auth-backend. These tokens are designed for use cases where clients need to authenticate once and maintain access for extended periods, such as CLI tools and MCP (Model Context Protocol) servers.

## Overview

The refresh token system provides:

- **Long-lived credentials**: Tokens that can last for days or weeks (configurable)
- **Secure token exchange**: Refresh tokens can be exchanged for short-lived access tokens
- **Revocation support**: Individual tokens or all user tokens can be revoked
- **Automatic cleanup**: Expired sessions are automatically cleaned up
- **Audit trail**: Track when tokens are created, used, and revoked

## Configuration

Enable refresh tokens in your `app-config.yaml`:

```yaml
auth:
  refreshTokens:
    # Enable the refresh token feature
    enabled: true
    
    # Default expiration time for new refresh tokens
    # Can be overridden when issuing tokens
    defaultExpiration: "30 days"
    
    # Maximum allowed expiration time
    # Prevents issuing tokens with excessive lifetimes
    maxExpiration: "90 days"
    
    # How often to cleanup expired sessions
    cleanupInterval: "1 hour"
```

Duration values can be specified in multiple formats:
- String format: `"30 days"`, `"2 weeks"`, `"24 hours"`
- Object format: `{ days: 30 }`, `{ weeks: 2 }`, `{ hours: 24 }`
- ISO 8601 format: `"P30D"`, `"P2W"`, `"PT24H"`

## API Endpoints

When enabled, the auth-backend exposes the following endpoints:

### Issue Refresh Token

```http
POST /api/auth/refresh-tokens
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "expirationSeconds": 604800  // Optional: 7 days in seconds
}
```

Response:
```json
{
  "refreshToken": "bsr_abc123...",
  "expiresAt": "2024-02-15T10:30:00.000Z",
  "sessionId": "session-uuid"
}
```

### Exchange Refresh Token

```http
POST /api/auth/refresh-tokens/exchange
Content-Type: application/json

{
  "refreshToken": "bsr_abc123..."
}
```

Response:
```json
{
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9...",
  "tokenType": "bearer",
  "expiresIn": 3600
}
```

### List User Sessions

```http
GET /api/auth/refresh-tokens
Authorization: Bearer <access-token>
```

Response:
```json
{
  "sessions": [
    {
      "sessionId": "session-uuid",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "expiresAt": "2024-02-15T10:30:00.000Z",
      "lastUsedAt": "2024-01-20T15:45:00.000Z"
    }
  ]
}
```

### Revoke Refresh Token

```http
DELETE /api/auth/refresh-tokens/{token}
```

### Revoke All User Tokens

```http
DELETE /api/auth/refresh-tokens
Authorization: Bearer <access-token>
```

Response:
```json
{
  "revokedCount": 3
}
```

## Usage Examples

### CLI Tool Authentication

1. **Initial authentication**: User authenticates through web browser
2. **Issue refresh token**: CLI tool requests a long-lived refresh token
3. **Store securely**: CLI tool stores the refresh token securely
4. **Use when needed**: CLI tool exchanges refresh token for access token as needed

```bash
# Example CLI flow
backstage auth login --device-flow
# Opens browser for authentication, stores refresh token

backstage catalog list
# Uses stored refresh token to get access token, then calls API
```

### MCP Server Authentication

```typescript
class BackstageMCPServer {
  private refreshToken?: string;
  
  async authenticate() {
    // Exchange refresh token for access token
    const response = await fetch('/api/auth/refresh-tokens/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });
    
    const { accessToken } = await response.json();
    this.accessToken = accessToken;
  }
  
  async callBackstageAPI() {
    await this.authenticate(); // Get fresh access token
    
    // Use access token for API calls
    const response = await fetch('/api/catalog/entities', {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    
    return response.json();
  }
}
```

## Security Considerations

- **Token Storage**: Refresh tokens should be stored securely (e.g., encrypted files, secure credential stores)
- **Token Rotation**: Consider implementing refresh token rotation for enhanced security
- **Scope Limitations**: Refresh tokens inherit the same permissions as the original user session
- **Monitoring**: Monitor refresh token usage for suspicious activity
- **Revocation**: Implement token revocation in security incident response procedures

## Database Schema

The feature adds a `refresh_sessions` table with the following structure:

- `session_id`: Unique identifier for the session
- `user_entity_ref`: User associated with the session
- `token_hash`: SHA-256 hash of the refresh token
- `session_data`: JSON blob containing claims and metadata
- `created_at`: When the session was created
- `expires_at`: When the session expires
- `last_used_at`: When the token was last used
- `revoked`: Whether the session has been revoked

## Migration

The feature is backward compatible and can be enabled without affecting existing authentication flows. When disabled, the endpoints return 404 and no database changes are made.

To enable on an existing deployment:

1. Update configuration to enable refresh tokens
2. Restart the auth-backend service
3. Database migrations will run automatically
4. Refresh token endpoints become available

## Troubleshooting

### Common Issues

**Refresh token exchange fails with 401**
- Check if the refresh token has expired
- Verify the token hasn't been revoked
- Ensure the token format is correct (starts with `bsr_`)

**Cannot issue refresh tokens**
- Verify `auth.refreshTokens.enabled` is set to `true`
- Check that user is properly authenticated when requesting tokens
- Review auth-backend logs for detailed error messages

**Database migration fails**
- Ensure database user has appropriate permissions
- Check for conflicting table names
- Review migration logs for specific errors

### Debugging

Enable debug logging for refresh token operations:

```yaml
backend:
  logger:
    level: debug
    # Or target specific components
    meta:
      service: auth-backend
      component: refresh-token-service
```

Check refresh token service metrics and logs for:
- Token issuance rates
- Exchange success/failure rates  
- Cleanup operation results
- Revocation events