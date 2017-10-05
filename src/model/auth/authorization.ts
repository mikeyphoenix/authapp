import { Injectable } from '@angular/core';


@Injectable()
export class Authorization {
  private accessToken: string;
  private accessTokenExpiry: Date;
  private refreshToken: string;
  private refreshTokenExpiry: Date;
  private memberId: string;

  constructor(/*_accessToken: string , accessTokenExpiry: Date, refreshToken: string, refreshTokenExpiry: Date, memberId: string */) {
    /* this.accessToken = _accessToken;
    this.accessTokenExpiry = accessTokenExpiry;
    this.refreshToken = refreshToken;
    this.refreshTokenExpiry = refreshTokenExpiry;
    this.memberId = memberId; */
  }

  public static getNewInstance() : Authorization {
    // return new Authorization(null, null, null, null, null);
    return new Authorization();
  }

  public static parseFromJSONObject(jsonObject) : Authorization {
    const model = this.getNewInstance();
    if (jsonObject) {

    }

    return model;
  }

  getAccessToken(): string{
    return this.accessToken;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getAccessTokenExpiry(): Date{
    return this.accessTokenExpiry;
  }

  setAccessTokenExpiry(accessTokenExpiry: Date) {
    this.accessTokenExpiry = accessTokenExpiry;
  }

  getRefreshToken(): string{
    return this.refreshToken;
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  getRefreshTokenExpiry(): Date{
    return this.refreshTokenExpiry;
  }

  setRefreshTokenExpiry(refreshTokenExpiry: Date) {
    this.refreshTokenExpiry = refreshTokenExpiry;
  }

  getMemberId(): string{
    return this.memberId;
  }

  setMemberId(memberId: string) {
    this.memberId = memberId;
  }
}
