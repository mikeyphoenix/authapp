import { Injectable } from '@angular/core';
import {JwtHelper} from "angular2-jwt";

@Injectable()
export class User {

  private membershipId: string;
  private displayName: string;
  private firstAccess: Date;
  private statusText: string;

  constructor(_membershipId : string, _displayName : string, _firstAccess: Date, _statusText: string) {
    this.membershipId = _membershipId;
    this.displayName = _displayName;
    this.firstAccess = _firstAccess;
    this.statusText = _statusText;
  }

  public static getNewInstance() : User {
    return new User(null, null, null, null);
  }

  public static parseUserFromJSONObject(jsonObject): User {
    const user: User =  User.getNewInstance();

    if (jsonObject) {
      user.setMembershipId(jsonObject.membershipId);
      user.setDisplayName(jsonObject.displayName);
      user.setFirstAccess(jsonObject.firstAccess);
      user.setStatusText(jsonObject.statusText);
    }

    return user;
  }

  public getMembershipId(): string {
    return this.membershipId;
  }

  public setMembershipId(_membershipId: string) {
    this.membershipId = _membershipId;
  }

  public getDisplayName(): string {
    return this.displayName;
  }

  public setDisplayName(_displayName: string) {
    this.displayName = _displayName;
  }

  public getFirstAccess(): Date {
    return this.firstAccess;
  }

  public setFirstAccess(_firstAccess: Date) {
    this.firstAccess = _firstAccess;
  }

  public getStatusText(): string {
    return this.statusText;
  }

  public setStatusText(_statusText: string) {
    this.statusText = _statusText;
  }

}
