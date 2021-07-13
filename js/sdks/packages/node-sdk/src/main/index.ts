import { LunaSecAuthentication } from '../authentication';
import { SecretConfig, SessionIdProvider } from '../authentication/types';
import { LunaSecExpressAuthPlugin } from '../express-auth-plugin';
import { LunaSecGrantService } from '../grant-service';
import { setGrantServiceForDirective, TokenDirective } from '../graphql';

// Attempt to keep this configuration organized and named in a way that is easy for the API user to understand
export interface LunaSecConfig {
  secureFrameURL: string;
  auth: {
    secrets: SecretConfig;
    payloadClaims?: string[]; // Note that not setting this allows unfiltered claims to be set, do we want that?
    sessionIdProvider: SessionIdProvider; // A callback used situations where we have the req object and would like to know the sessionId
  };
}

// This is the main class that customers will create to use LunaSec on their node server
// When created, it exposes the other customer-facing classes like the grant service and express plugin.
// It also works as a dependency injector, for example: passing auth into those plugins' constructors so that they are able to make authentication JWTs to talk to the server.
export class LunaSec {
  public auth: LunaSecAuthentication;
  public grants: LunaSecGrantService;
  public expressPlugin: LunaSecExpressAuthPlugin;
  public tokenDirective: typeof TokenDirective; // Graphql initializes this class, not us

  constructor(config: LunaSecConfig) {
    this.auth = new LunaSecAuthentication(config.auth.secrets);
    // This express plugin is created here if users optionally wish to access it and register it onto their app
    this.expressPlugin = new LunaSecExpressAuthPlugin({
      auth: this.auth,
      sessionIdProvider: config.auth.sessionIdProvider,
      payloadClaims: config.auth.payloadClaims,
      secureFrameURL: config.secureFrameURL,
    });
    this.grants = new LunaSecGrantService(this.auth);
    setGrantServiceForDirective(this.grants);
    this.tokenDirective = TokenDirective;
  }
}