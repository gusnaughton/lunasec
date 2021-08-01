/**
 * When adding a new API request, start by adding it here.
 * Ideally, the Typescript should fail to compile when you do.
 * The next step is to add Request/Response types and then "map" them to each other.
 */
import { GrantType } from '../types';

export enum TokenizerRequest {
  getMetadata = 'getMetadata',
  setMetadata = 'setMetadata',
  setToken = 'setToken',
  getToken = 'getToken',
}

export type ValidTokenizerApiRequestTypes =
  | keyof typeof TokenizerRequest
  | keyof TokenizerRequestResponseMessageMap
  | keyof TokenizerRequestMessageMap;

/// Generic Base Types ///
export interface BaseTokenizerRequest {}

export interface TokenizerApiResponse<T> {
  success: boolean;
  msg?: string;
  result?: T;
}

/// API Request Schemas ///
export interface SetGrantRequest extends BaseTokenizerRequest {
  sessionId: string;
  tokenId: string;
  grantType: GrantType;
}

export interface VerifyGrantRequest extends BaseTokenizerRequest {
  sessionId: string;
  tokenId: string;
  grantType: GrantType;
}

export interface GetMetadataRequest extends BaseTokenizerRequest {
  /**
   * Needs to be a UUID.
   */
  tokenId: string;
}

export interface SetMetadataRequest extends BaseTokenizerRequest {
  /**
   * Needs to be a UUID.
   */
  tokenId: string;
  metadata: any;
}

export interface GetTokenRequest extends BaseTokenizerRequest {
  /**
   * Needs to be a UUID.
   */
  tokenId: string;
}

export interface SetTokenRequest extends BaseTokenizerRequest {
  metadata: Record<string, any>;
}

/// API Response Schemas ///
export interface SetGrantResponse {
  success: boolean;
  data: {};
}

export interface VerifyGrantResponse {
  success: boolean;
  data: {
    valid: boolean;
  };
}

export interface GetMetadataResponse {
  success: boolean;
  data: {
    metadata: any;
  };
}

export interface SetMetadataResponse {
  success: boolean;
}

export interface GetTokenResponse {
  success: boolean;
  data: {
    downloadUrl: string;
    headers: Record<string, string>;
  };
}

export interface SetTokenResponse {
  success: boolean;
  data: {
    tokenId: string;
    uploadUrl: string;
    headers: Record<string, string>;
  };
}

/// Request Type Lookup ///
export type TokenizerRequestLookup = {
  [key in keyof typeof TokenizerRequest]: BaseTokenizerRequest;
};

export interface TokenizerRequestMessageMap extends TokenizerRequestLookup {
  setGrant: SetGrantRequest;
  verifyGrant: VerifyGrantRequest;
  getMetadata: GetMetadataRequest;
  setMetadata: SetMetadataRequest;
  getToken: GetTokenRequest;
  setToken: SetTokenRequest;
}

/// Response Type Lookup ///
export type TokenizerResponseLookup = {
  [key in keyof typeof TokenizerRequest]: TokenizerRequestResponseMessageMap[key];
};

export interface TokenizerRequestResponseMessageMap extends TokenizerResponseLookup {
  setGrant: SetGrantResponse;
  verifyGrant: VerifyGrantResponse;
  getMetadata: GetMetadataResponse;
  setMetadata: SetMetadataResponse;
  getToken: GetTokenResponse;
  setToken: SetTokenResponse;
}