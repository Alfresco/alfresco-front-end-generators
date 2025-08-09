# Authentication
Authentication related properties can be set in `app.config.json` file. First of all let's analyze your ADF application use case to choose the right providers.

## Contents

-   [Providers](#providers)
-   [Authentication type](#authentication-type)
-   [OAuth2 configuration](#oauth2-configuration)
    - [Required params](#required-parameters)
    - [Optional params](#optional-parameters)
- [Examples](#examples)
    - [Keycloak](#keycloak-configuration)
    - [Auth0](#auth0-configuration)
    - [Amazon Cognito](#cognito-configuration)
    - [Cognito redirects handling](#handling-redirects-with-amazon-cognito)
- [How to restrict the access to certain resources for unauthorized users?](#how-to-restrict-the-access-to-certain-resources-for-unauthorized-users)
    - [OOTB supported auth guards](#ootb-supported-auth-guards)

## Providers
Depending on your authentication needs ADF allows you to choose `providers` property value from 3 different values:

* `ECM` - used to provide authentication in Alfresco Content Services, requires `ecmHost` property to bet set, by default generator sets it to `{protocol}//{hostname}{:port}`
* `BPM` - used to provide authentication for Alfresco Process Services, requires `bpmHost` property to bet set, by default generator sets it to `{protocol}//{hostname}{:port}`
* `ALL` - combines both of them, should be used when your application requires authentication in both ACS and APS, requires both `ecmHost` and `bpmHost` properties to be set

## Authentication type
In this case again depending on your use case you need to choose the value for `authType` property. Possible values are:

* `BASIC`
* `OAUTH`

## OAuth2 Configuration
OAuth2 is a protocol that allows the application to authorize operations without exposing user credentials. The configuration includes several parameters essential for setting up OAuth2 authentication.

### Required Parameters

    
  * `host` - base URL of the authorization server
  * `clientId` - ID assigned to the application by the authorization server
  * `scope` - scope of the access request
    
### Optional Parameters
    
  * `oidc` - defines the use of OpenID Connect during the implicit flow
  * `issuer` - issuer's URI.
  * `silentLogin` - enables silent authentication.
  * `secret` - application's secret, used for secure authentication.
  * `redirectUri` -wWhere to redirect after a successful login.
  * `postLogoutRedirectUri` - where to redirect after logging out. 
  * `refreshTokenTimeout`, `silentRefreshRedirectUri`, `silentRefreshTimeout` - control refresh token behavior. 
  * `publicUrls` - URLs that do not require authentication.
  * `dummyClientSecret` - a workaround for auth servers requiring a client secret for the password flow.
  * `skipIssuerCheck` - whether to skip issuer validation in the discovery document.
  * `strictDiscoveryDocumentValidation` - ensures all URLs in the discovery document start with the issuer's URL.
  * `implicitFlow`, `codeFlow` - configures the flow for authentication.
  * `logoutUrl` - URL for logging out.
  * `logoutParameters` - specifies parameters to be included in the logout request as an array of strings, such as ["client_id", "returnTo", "response_type"]. This allows for dynamic configuration of logout parameters tailored to specific IdP requirements.
  * `audience` - identifies the recipients of the token.


## Examples
### Keycloak Configuration
```json 
{
    "authType": "OAUTH",
    "oauth2": {
    "host": "{protocol}//{hostname}{:port}/auth/realms/alfresco",
    "clientId": "alfresco",
    "scope": "openid profile email",
    "implicitFlow": false,
    "codeFlow": true,
    "silentLogin": true,
    "publicUrls": [],
    "redirectSilentIframeUri": "{protocol}//{hostname}{:port}/assets/silent-refresh.html",
    "redirectUri": "/",
    "redirectUriLogout": "/",
    "skipIssuerCheck": true,
    "strictDiscoveryDocumentValidation": false
    }
}
```

### Auth0 Configuration
```json 
{
  "authType": "OAUTH",
  "oauth2": {
    "host": "https://your-idp.auth0.com",
    "clientId": "",
    "secret": "",
    "scope": "openid profile email offline_access",
    "implicitFlow": false,
    "codeFlow": true,
    "silentLogin": true,
    "publicUrls": [],
    "redirectSilentIframeUri": "{protocol}//{hostname}{:port}/assets/silent-refresh.html",
    "redirectUri": "/",
    "redirectUriLogout": "/",
    "logoutUrl": "https://your-idp.auth0.com/v2/logout",
    "logoutParameters": ["client_id", "returnTo"],
    "audience": "http://localhost:3000",
    "skipIssuerCheck": true,
    "strictDiscoveryDocumentValidation": false
  }
}
```
### Cognito Configuration
```json
{
    "oauth2": {
        "host": "https://cognito-idp.your-idp-url",
        "clientId": "",
        "secret": "",
        "scope": "openid profile email",
        "implicitFlow": false,
        "codeFlow": true,
        "silentLogin": true,
        "publicUrls": [],
        "redirectSilentIframeUri": "{protocol}//{hostname}{:port}/assets/silent-refresh.html",
        "redirectUri": "http://your-env-name/view/authentication-confirmation/",
        "redirectUriLogout": "/",
        "logoutParameters": ["client_id", "redirect_uri", "response_type"],
        "logoutUrl": "https://your-idp-url/oauth2/logout",
        "skipIssuerCheck": true,
        "strictDiscoveryDocumentValidation": false
    }
}
```

### Handling Redirects with Amazon Cognito
When integrating with Amazon Cognito, special handling is required to ensure that the application can properly process authentication confirmation redirects, particularly when using hash-based routing in Angular applications. Due to Cognito's restrictions on redirect URLs, which do not allow fragments (#), you may encounter issues when the redirect URI points directly to a route within a single-page application (SPA) that relies on hash-based navigation.

To address this, include the following script tag within the <head> section of your index.html file. This script checks the current URL path for a specific pattern (view/authentication-confirmation) and modifies the URL to include a hash (#) if it's missing, ensuring the application correctly handles the redirect after Cognito authentication:

```html
<script>
    (function() {
        if (window.location.pathname.includes('view/authentication-confirmation') && !window.location.pathname.includes('#')) {
            window.location.replace('/#' + window.location.pathname + window.location.search);
        }
    })();
</script>
```

## How to restrict the access to certain resources for unauthorized users?
To protect certain routes/resources in your application you can use Angular's [auth guards](https://angular.dev/guide/routing/route-guards) concept. Depending on your application authentication setup ADF offers some of the guards that you can use without any modifications.

### OOTB supported auth guards
To check if user is logged in you can use `AuthGuard`, this guard accepts authenticated users with either APS or ACS as valid and is thus suitable for menu pages and other content that doesn't make use of APS or ACS specific features. It is typically used with the
`canActivate` guard check in the route definition:

```ts
export const APP_ROUTES: Routes = [
    ...
    {
        path: 'examplepath',
        component: ExampleComponent,
        canActivate: [ AuthGuard ]      // <- Requires authentication for this route.
    },
    ...
]
```

If the user now clicks on a link or button that follows this route, they will be prompted to log in before proceeding.

For routes containing the content that requires authentication in ACS or APS specifically you can use guards dedicated for them:
* `AuthGuardEcm` for ACS authentication
* `AuthGuardBpm` for APS authentication

