//https://www.youtube.com/watch?v=OZh5RmCztrU

//https://auth.omniatestcloud.net/signin?state=%7B%22adminConsentSessionId%22%3Anull%2C%22mobileLogin%22%3Afalse%2C%22supportPostRedirect%22%3Atrue%2C%22isMFAModeRetry%22%3Afalse%2C%22tenantId%22%3A%2233f48033-13b3-4a37-b92c-a27720f02d16%22%2C%22azureTenantId%22%3A%2238c12a6e-bfee-41c5-8e3c-b1f44e2c04d4%22%2C%22redirectUrl%22%3A%22https%3A%2F%2Fomniapreprod.omniatestcloud.net%2F_%2Flua-pub-1%22%7D
//https://login.microsoftonline.com/38c12a6e-bfee-41c5-8e3c-b1f44e2c04d4/oauth2/v2.0/authorize?state=%7B%22adminConsentSessionId%22%3Anull%2C%22mobileLogin%22%3Afalse%2C%22supportPostRedirect%22%3Atrue%2C%22isMFAModeRetry%22%3Afalse%2C%22tenantId%22%3A%2233f48033-13b3-4a37-b92c-a27720f02d16%22%2C%22azureTenantId%22%3A%2238c12a6e-bfee-41c5-8e3c-b1f44e2c04d4%22%2C%22redirectUrl%22%3A%22https%3A%2F%2Fomniapreprod.omniatestcloud.net%2F_%2Flua-pub-1%22%7D&client_id=fd12625a-48db-4ce4-a8d7-f9eb11c67651&redirect_uri=https%3A%2F%2Fauth.omniatestcloud.net%2Fapi%2Fsecurity%2Ftokenkey&scope=openid%20offline_access&response_type=code%20id_token&response_mode=form_post&nonce=b1335654-eae4-4937-9361-b9d5f36b945a&sso_reload=true
/// <reference types="cypress" />
// import { method } from "cypress/types/bluebird";
import authSettings from "./authsettings.json";
//Ghi chu choi
import { decode, JwtPayload } from 'jsonwebtoken';

const {
  authority,
  clientId,
  clientSecret,
  apiScopes,
  username,
  password
} = authSettings;
const environment = '';
//login.windows.net
 // "apiScopes":["api://omniapreprod.omniatestcloud.net/20a28e8b-48b3-44c4-8d6b-1e41d84d5ce6/user_impersonation"],
const buildAccountEntity = (
  homeAccountId,
  realm,
  localAccountId,
  username,
  name
) => {
  return {
    authorityType: "MSSTS",
    // This could be filled in but it involves a bit of custom base64 encoding
    // and would make this sample more complicated.
    // This value does not seem to get used, so we can leave it out.
    //clientInfo: "",
    homeAccountId,
    environment,
    realm,
    localAccountId,
    username,
    name,
  };
};
const buildIdTokenEntity = (homeAccountId, idToken, realm) => {
  return {
    credentialType: "IdToken",
    homeAccountId,
    environment,
    clientId,
    secret: idToken,
    realm,
  };
};
const buildAccessTokenEntity = (
  homeAccountId,
  accessToken,
  expiresIn,
  extExpiresIn,
  realm,
  scopes
) => {
  const now = Math.floor(Date.now() / 1000);
  return {
    homeAccountId,
    credentialType: "AccessToken",
    secret: accessToken,
    cachedAt: now.toString(),
    expiresOn: (now + expiresIn).toString(),
    extendedExpiresOn: (now + extExpiresIn).toString(),
    environment,
    clientId,
    realm,
    target: scopes.map((s) => s.toLowerCase()).join(" "),
    
    // Scopes _must_ be lowercase or the token won't be found
    tokenType: 'bearer',
  };
};

const injectTokens = (tokenResponse) => {
  const idToken = decode(tokenResponse.id_token);
  const localAccountId = idToken.oid || idToken.sid;
  const realm = idToken.tid;
  const homeAccountId = `${localAccountId}.${realm}`;
  const username = idToken.preferred_username;
  const name = idToken.name;

  const accountKey = `${homeAccountId}-${environment}-${realm}`;
  const accountEntity = buildAccountEntity(
    homeAccountId,
    realm,
    localAccountId,
    username,
    name
  );

  const idTokenKey = `${homeAccountId}-${environment}-idtoken-${clientId}-${realm}-`;
  const idTokenEntity = buildIdTokenEntity(
    homeAccountId,
    tokenResponse.id_token,
    realm
  );

  const accessTokenKey = `${homeAccountId}-${environment}-accesstoken-${clientId}-${realm}-${apiScopes.join(
    " "
  )}`;
  const accessTokenEntity = buildAccessTokenEntity(
    homeAccountId,
    tokenResponse.access_token,
    tokenResponse.expires_in,
    tokenResponse.ext_expires_in,
    realm,
    apiScopes
  );

  localStorage.setItem(accountKey, JSON.stringify(accountEntity));
  localStorage.setItem(idTokenKey, JSON.stringify(idTokenEntity));
  localStorage.setItem(accessTokenKey, JSON.stringify(accessTokenEntity));
};

export const login = (cachedTokenResponse) => {
  let tokenResponse = null;
  let chainable = cy.visit("/");

  if (!cachedTokenResponse) {
    chainable = chainable.request({
      url: authority + "/oauth2/v2.0/token",
      method: "POST",
      body: {
        grant_type: "password",
        client_id: clientId,
        client_secret: clientSecret,
        username: username,
        password: password,
        scope: ["openid profile"].concat(apiScopes).join(" "),
        
      },
      form: true,
    
    });
  } else {
    chainable = chainable.then(() => {
      return {
        body: cachedTokenResponse,
      };
    });
  }

  chainable
    .then((response) => {
      injectTokens(response.body);
      tokenResponse = response.body;
    })
    .reload()
    .then(() => {
      return tokenResponse;
    });

  return chainable;
};