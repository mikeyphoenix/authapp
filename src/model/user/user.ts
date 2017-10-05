import { Injectable } from '@angular/core';
import {JwtHelper} from "angular2-jwt";

@Injectable()
export class User {

  private membershipId: string;
  private displayName: string;
  private firstAccess: Date;
  private statusText: string;

  constructor() {

  }


}
